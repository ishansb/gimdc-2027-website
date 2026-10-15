// @ts-check
/**
 * GIMDC 2027 — progressive enhancement only.
 * The site works fully without JavaScript; this file adds:
 *  1. an accessible menu toggle (Escape to close, closes after choosing a link)
 *  2. highlighting of the current section in the header navigation
 * No cookies, storage, analytics or network requests.
 */
(function () {
  'use strict';

  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('site-menu');

  function setOpen(open, returnFocus) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    var label = toggle.querySelector('.menu-toggle-label');
    if (label) label.textContent = open ? 'Close' : 'Menu';
    if (open) {
      var first = menu.querySelector('a');
      if (first instanceof HTMLElement) first.focus();
    } else if (returnFocus && toggle instanceof HTMLElement) {
      toggle.focus();
    }
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true', false);
    });
    menu.addEventListener('click', function (e) {
      var t = e.target;
      if (t instanceof Element && t.closest('a')) setOpen(false, false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false, true);
    });
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (toggle.getAttribute('aria-expanded') === 'true' && t instanceof Node && !menu.contains(t) && !toggle.contains(t)) setOpen(false, false);
    });
  }

  // Current-section highlighting (home page only).
  if (!document.body.classList.contains('is-home') || !('IntersectionObserver' in window)) return;
  var links = Array.prototype.slice.call(document.querySelectorAll('.primary-nav a[data-nav]'));
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('data-nav')] = a; });
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]')).filter(function (s) { return byId[s.id]; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      var a = byId[entry.target.id];
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  sections.forEach(function (s) { observer.observe(s); });
})();
