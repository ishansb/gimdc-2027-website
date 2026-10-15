"""
Browser QA checks for the built GIMDC site (optional; requires Python Playwright).

    npm run build && npm run preview          # in one terminal
    python3 scripts/qa_check.py http://localhost:4173/            # in another

Checks: horizontal overflow at several widths, text contrast (WCAG AA),
heading order, image alt text, accessible names, duplicate ids, keyboard
menu behaviour, FAQ keyboard toggling, disabled payment button, external
network requests, and reduced-motion handling.
"""
import asyncio
import sys
from urllib.parse import urlparse

from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/"
PAGES = ["", "tracks/disciplinary/", "tracks/methodological/", "does-not-exist/"]
WIDTHS = [320, 375, 768, 1024, 1366, 1920]

CONTRAST_JS = r"""
() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(Number); return {r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1}; };
  const lum = ({r,g,b}) => { const f = v => { v/=255; return v<=0.03928? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const blend = (top, bottom) => ({ r: top.r*top.a + bottom.r*(1-top.a), g: top.g*top.a + bottom.g*(1-top.a), b: top.b*top.a + bottom.b*(1-top.a), a: 1 });
  const bgOf = el => {
    const layers = [];
    for (let n = el; n; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url')) {
        // gradient: approximate with its darkest/first colour stop
        const m = cs.backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-f]{3,6}/i);
        if (m && m[0].startsWith('rgb')) { const c = parse(m[0]); if (c && c.a > 0.5) { layers.push({...c, a:1}); break; } }
      }
      const c = parse(cs.backgroundColor);
      if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; }
    }
    let base = {r:255,g:255,b:255,a:1};
    for (let i = layers.length - 1; i >= 0; i--) base = blend(layers[i], base);
    return base;
  };
  const fails = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode; if (!t.textContent.trim()) continue;
    const el = t.parentElement; if (seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.sr-only,[hidden],svg')) continue;
    const r = el.getBoundingClientRect(); if (r.width === 0 || r.height === 0) continue;
    if (el.closest('button:disabled')) continue; // WCAG exempts disabled controls
    let fg = parse(cs.color); if (!fg) continue;
    const bg = bgOf(el); fg = blend(fg, bg);
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const size = parseFloat(cs.fontSize), weight = parseInt(cs.fontWeight, 10);
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    if (ratio < need) fails.push(`${ratio.toFixed(2)} < ${need}: "${t.textContent.trim().slice(0,50)}" (${el.tagName.toLowerCase()}.${el.className})`);
  }
  return fails;
}
"""

STRUCTURE_JS = r"""
() => {
  const issues = [];
  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
  if (hs.filter(h => h === 1).length !== 1) issues.push(`expected exactly one h1, found ${hs.filter(h => h === 1).length}`);
  for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i-1] + 1) issues.push(`heading level jumps from h${hs[i-1]} to h${hs[i]}`);
  document.querySelectorAll('img').forEach(img => { if (!img.hasAttribute('alt')) issues.push(`img without alt: ${img.src}`); });
  document.querySelectorAll('a,button').forEach(el => {
    const name = (el.getAttribute('aria-label') || el.textContent || '').trim();
    if (!name) issues.push(`${el.tagName} without accessible name`);
  });
  const ids = {}; document.querySelectorAll('[id]').forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1; });
  Object.entries(ids).filter(([, n]) => n > 1).forEach(([id]) => issues.push(`duplicate id ${id}`));
  if (!document.documentElement.lang) issues.push('missing lang');
  if (!document.querySelector('main')) issues.push('missing main landmark');
  document.querySelectorAll('a[target=_blank]').forEach(a => { if (!/noopener/.test(a.rel)) issues.push(`target=_blank without noopener: ${a.href}`); });
  document.querySelectorAll('a[href]').forEach(a => { if (a.getAttribute('href') === '#') issues.push('dead # link'); });
  if (document.querySelector('form,input,textarea,select')) issues.push('page contains a form control');
  return issues;
}
"""


async def main() -> int:
    problems = 0
    origin = urlparse(BASE).netloc
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        for w in WIDTHS:
            page = await browser.new_page(viewport={"width": w, "height": 900})
            for path in PAGES:
                await page.goto(BASE + path)
                sw = await page.evaluate("document.documentElement.scrollWidth")
                ok = sw <= w
                problems += 0 if ok else 1
                print(f"[{'PASS' if ok else 'FAIL'}] overflow {w}px {path or 'home'}: scrollWidth={sw}")
            await page.close()

        page = await browser.new_page(viewport={"width": 1366, "height": 900})
        external = []
        page.on("request", lambda r: external.append(r.url) if urlparse(r.url).netloc != origin else None)
        for path in PAGES:
            await page.goto(BASE + path, wait_until="networkidle")
            fails = await page.evaluate(CONTRAST_JS)
            issues = await page.evaluate(STRUCTURE_JS)
            problems += len(fails) + len(issues)
            print(f"[{'PASS' if not fails else 'FAIL'}] contrast {path or 'home'}: {len(fails)} failures")
            for f in fails[:10]:
                print("       ", f)
            print(f"[{'PASS' if not issues else 'FAIL'}] structure {path or 'home'}: {issues or 'ok'}")
        ok = not external
        problems += 0 if ok else 1
        print(f"[{'PASS' if ok else 'FAIL'}] no third-party requests: {external or 'none'}")

        # Keyboard + interactions on the home page (mobile width so the menu toggle is used)
        m = await browser.new_page(viewport={"width": 390, "height": 844})
        await m.goto(BASE)
        await m.keyboard.press("Tab")
        first = await m.evaluate("document.activeElement.textContent.trim()")
        print(f"[{'PASS' if 'Skip' in first else 'FAIL'}] first Tab stop is skip link: {first!r}")
        problems += 0 if "Skip" in first else 1
        await m.click(".menu-toggle")
        expanded = await m.get_attribute(".menu-toggle", "aria-expanded")
        visible = await m.is_visible("#site-menu")
        await m.keyboard.press("Escape")
        collapsed = await m.get_attribute(".menu-toggle", "aria-expanded")
        focus_back = await m.evaluate("document.activeElement.classList.contains('menu-toggle')")
        ok = expanded == "true" and visible and collapsed == "false" and focus_back
        problems += 0 if ok else 1
        print(f"[{'PASS' if ok else 'FAIL'}] mobile menu opens, Escape closes, focus returns")

        await m.focus(".faq summary")
        await m.keyboard.press("Enter")
        opened = await m.evaluate("document.querySelector('.faq').open")
        await m.keyboard.press("Enter")
        closed = not await m.evaluate("document.querySelector('.faq').open")
        ok = opened and closed
        problems += 0 if ok else 1
        print(f"[{'PASS' if ok else 'FAIL'}] FAQ toggles with keyboard (Enter)")

        outline = await m.evaluate("getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth")
        ok = "none" not in outline
        problems += 0 if ok else 1
        print(f"[{'PASS' if ok else 'FAIL'}] visible focus indicator: {outline}")

        disabled = await m.evaluate("[...document.querySelectorAll('#registration button')].every(b => b.disabled)")
        problems += 0 if disabled else 1
        print(f"[{'PASS' if disabled else 'FAIL'}] payment button is disabled")

        rm = await browser.new_page(reduced_motion="reduce")
        await rm.goto(BASE)
        dur = await rm.evaluate("getComputedStyle(document.querySelector('.hero-path-line')).animationName")
        ok = dur == "none"
        problems += 0 if ok else 1
        print(f"[{'PASS' if ok else 'FAIL'}] reduced motion disables hero animation (animation-name={dur})")

        nojs = await browser.new_context(java_script_enabled=False, viewport={"width": 390, "height": 844})
        nj = await nojs.new_page()
        await nj.goto(BASE)
        menu_visible = await nj.is_visible("#site-menu a")
        problems += 0 if menu_visible else 1
        print(f"[{'PASS' if menu_visible else 'FAIL'}] navigation available without JavaScript")

        await browser.close()
    print(f"\n{'ALL CHECKS PASSED' if problems == 0 else f'{problems} problem(s) found'}")
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
