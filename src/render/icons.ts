/**
 * Original line drawings for GIMDC 2027 (no third-party icon sets).
 * All drawings use `currentColor`, so they follow the surrounding text colour.
 */
import type { TrackIcon } from '../../content/tracks.ts';
import type { Status } from '../../content/types.ts';

const svg = (body: string, size = 48, extra = '') =>
  `<svg class="glyph" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${body}</svg>`;

const TRACK_GLYPHS: Record<TrackIcon, string> = {
  // Overlapping fields of knowledge
  disciplinary:
    '<circle cx="19" cy="19" r="10"/><circle cx="29" cy="19" r="10"/><circle cx="24" cy="28" r="10"/><circle cx="24" cy="22" r="1.6" fill="currentColor" stroke="none"/>',
  // Connected digital nodes
  technological:
    '<rect x="14" y="14" width="20" height="20" rx="3"/><circle cx="24" cy="24" r="3.5"/><path d="M24 6v8M24 34v8M6 24h8M34 24h8"/><circle cx="24" cy="6" r="1.8" fill="currentColor" stroke="none"/><circle cx="42" cy="24" r="1.8" fill="currentColor" stroke="none"/><circle cx="24" cy="42" r="1.8" fill="currentColor" stroke="none"/><circle cx="6" cy="24" r="1.8" fill="currentColor" stroke="none"/>',
  // An open organizational boundary with a node moving beyond it
  organizational:
    '<path d="M30 10H10v28h28V24" /><path d="M38 16v-6h-4" stroke-dasharray="2 3"/><circle cx="20" cy="28" r="3"/><circle cx="40" cy="8" r="3"/><path d="M22.3 25.8 37.8 10.2"/>',
  // Ecosystem: hub and partners
  market:
    '<circle cx="24" cy="24" r="5"/><circle cx="24" cy="8" r="3"/><circle cx="39" cy="19" r="3"/><circle cx="33" cy="38" r="3"/><circle cx="15" cy="38" r="3"/><circle cx="9" cy="19" r="3"/><path d="M24 11v8M36.2 20l-7.4 2.6M31.4 35.4l-4.4-6.6M16.6 35.4l4.4-6.6M11.8 20l7.4 2.6"/><path d="M24 8 39 19 33 38H15L9 19Z" stroke-dasharray="1.5 3.5" stroke-width="1.1"/>',
  // Circular value loop
  'economic-social':
    '<path d="M38 22a14 14 0 0 0-25.5-7"/><path d="M10 26a14 14 0 0 0 25.5 7"/><path d="M12 8.5v6.8h6.8"/><path d="M36 39.5v-6.8h-6.8"/><path d="M24 30c0-5 3-8 8-8-.5 5-3 8-8 8Zm0 0c0-4-2.5-6.5-6.5-6.5.4 4 2.5 6.5 6.5 6.5Z"/>',
  // Globe with crossing route
  geographical:
    '<circle cx="24" cy="24" r="16"/><ellipse cx="24" cy="24" rx="7" ry="16"/><path d="M8 24h32M10.5 16h27M10.5 32h27"/><path d="M4 34c10-2 30-16 40-22" stroke-dasharray="2 3"/><circle cx="44" cy="12" r="2" fill="currentColor" stroke="none"/>',
  // Mixed methods: grid and lens
  methodological:
    '<rect x="7" y="7" width="22" height="22" rx="2"/><path d="M7 18h22M18 7v22"/><circle cx="30" cy="30" r="10"/><path d="M37.2 37.2 43 43"/>',
};

export function trackGlyph(icon: TrackIcon, size = 48): string {
  return svg(TRACK_GLYPHS[icon], size);
}

/** Small UI icons (24px grid). */
const ui = (body: string, size = 20, cls = 'ui-icon') =>
  `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  arrowRight: (s = 18) => ui('<path d="M5 12h14M13 6l6 6-6 6"/>', s),
  arrowLeft: (s = 18) => ui('<path d="M19 12H5M11 6l-6 6 6 6"/>', s),
  external: (s = 16) => ui('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>', s),
  calendar: (s = 20) => ui('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', s),
  pin: (s = 20) => ui('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>', s),
  layers: (s = 20) => ui('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>', s),
  lock: (s = 18) => ui('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', s),
  mail: (s = 20) => ui('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>', s),
  globe: (s = 20) => ui('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', s),
  menu: (s = 22) => ui('<path d="M4 7h16M4 12h16M4 17h16"/>', s, 'ui-icon icon-menu'),
  close: (s = 22) => ui('<path d="M6 6l12 12M18 6 6 18"/>', s, 'ui-icon icon-close'),
  chevron: (s = 20) => ui('<path d="m6 9 6 6 6-6"/>', s, 'ui-icon chevron'),
  info: (s = 18) => ui('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>', s),
  shield: (s = 18) => ui('<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>', s),
};

/** Icon shown inside each status badge, so status never relies on colour alone. */
export function statusIcon(status: Status): string {
  switch (status) {
    case 'confirmed':
      return ui('<path d="m5 12 4.5 4.5L19 7"/>', 14, 'status-icon');
    case 'open':
      return ui('<circle cx="12" cy="12" r="5" fill="currentColor" stroke="none"/>', 14, 'status-icon');
    case 'closed':
      return ui('<path d="M7 7l10 10M17 7 7 17"/>', 14, 'status-icon');
    case 'coming-soon':
      return ui('<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>', 14, 'status-icon');
    case 'to-be-announced':
      return ui('<path d="M4 10v4h3l5 4V6L7 10H4Z"/><path d="M16 9.5a4 4 0 0 1 0 5"/>', 14, 'status-icon');
    case 'awaiting-approval':
      return ui('<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9"/>', 14, 'status-icon');
    case 'draft':
      return ui('<path d="M4 20h4l10-10-4-4L4 16v4Z"/>', 14, 'status-icon');
    case 'proposed':
    default:
      return ui('<circle cx="12" cy="12" r="8" stroke-dasharray="3 3"/>', 14, 'status-icon');
  }
}

/** Original GIMDC 2027 conference mark: a boundary ring crossed by a line of connected nodes. */
export function conferenceMark(size = 40): string {
  return `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
    <circle cx="20" cy="20" r="12.5" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".55"/>
    <circle cx="20" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".8"/>
    <path d="M6 31 20 20 35 7" fill="none" stroke="var(--mark-accent, #C8643F)" stroke-width="2" stroke-linecap="round"/>
    <circle cx="20" cy="20" r="2.6" fill="var(--mark-accent, #C8643F)"/>
    <circle cx="35" cy="7" r="2.6" fill="var(--mark-accent, #C8643F)"/>
    <circle cx="6" cy="31" r="1.8" fill="currentColor"/>
  </svg>`;
}

/* ------------------------------------------------------------------ */
/*  Hero artwork: seven boundary contours crossed by a research network */
/* ------------------------------------------------------------------ */

function contourPath(cx: number, cy: number, r: number, k: number): string {
  const pts: string[] = [];
  const N = 96;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2;
    const rr = r * (1 + 0.055 * Math.sin(3 * t + k * 0.9) + 0.03 * Math.sin(5 * t - k * 0.7) + 0.015 * Math.cos(7 * t + k));
    const x = cx + rr * Math.cos(t);
    const y = cy + rr * 0.86 * Math.sin(t);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join('') + 'Z';
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const t = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(t), cy + r * 0.86 * Math.sin(t)];
}

export function heroArt(): string {
  const cx = 470;
  const cy = 300;
  const rings = Array.from({ length: 7 }, (_, i) => ({ r: 46 + i * 40, k: i + 1 }));

  const ringPaths = rings
    .map(
      ({ r, k }, i) =>
        `<path d="${contourPath(cx, cy, r, k)}" fill="none" stroke="currentColor" stroke-width="${i === 6 ? 1.4 : 1}" opacity="${(0.62 - i * 0.06).toFixed(2)}"/>`,
    )
    .join('');

  // Research nodes scattered across the boundaries (deterministic).
  const nodeSpec: Array<[number, number]> = [
    [20, 210], [70, 190], [130, 238], [180, 172], [250, 222], [300, 150], [340, 268],
    [55, 118], [110, 88], [160, 128], [205, 70], [270, 104], [325, 66], [15, 52],
    [95, 300], [150, 330], [215, 296], [280, 320], [355, 300], [240, 360],
  ];
  const nodes = nodeSpec.map(([deg, r]) => polar(cx, cy, r, deg));

  const edges: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [7, 8], [8, 9], [9, 10],
    [10, 11], [11, 12], [12, 13], [13, 7], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19],
    [1, 8], [3, 10], [5, 12], [2, 15], [4, 17], [9, 3], [16, 4], [19, 6], [11, 5], [14, 2],
  ];
  const edgeLines = edges
    .map(([a, b]) => {
      const [x1, y1] = nodes[a]!;
      const [x2, y2] = nodes[b]!;
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    })
    .join('');

  const nodeDots = nodes
    .map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 4 === 0 ? 3.6 : 2.4}"/>`)
    .join('');

  // A highlighted path from the centre outward, crossing all seven boundaries.
  const path = [polar(cx, cy, 0, 0), polar(cx, cy, 70, 330), polar(cx, cy, 150, 352), polar(cx, cy, 230, 322), polar(cx, cy, 320, 342), polar(cx, cy, 410, 318)];
  const d = path.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  const pathDots = path
    .slice(0, -1)
    .map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i === 0 ? 6 : 4.2}"/>`)
    .join('');
  const [ex, ey] = path[path.length - 1]!;

  return `<svg class="hero-art" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <g class="hero-rings">${ringPaths}</g>
    <g class="hero-edges" stroke="currentColor" stroke-width=".8" opacity=".38">${edgeLines}</g>
    <g class="hero-nodes" fill="currentColor" opacity=".7">${nodeDots}</g>
    <g class="hero-path">
      <path d="${d}" fill="none" stroke="var(--accent-bright)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="hero-path-line"/>
      <g fill="var(--accent-bright)">${pathDots}</g>
      <circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="5" fill="none" stroke="var(--accent-bright)" stroke-width="2"/>
    </g>
  </svg>`;
}
