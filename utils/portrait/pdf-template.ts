/**
 * PDF HTML Template — Generates a polished HTML document for PDF export.
 *
 * Styled after the Tender design system: warm rose palette, Playfair Display
 * headings, Josefin Sans body text, SVG data visualizations.
 *
 * Used by `services/pdf-export.ts` with `expo-print` on native
 * and `window.open()` + `print()` on web.
 */

import type { IndividualPortrait } from '@/types/portrait';

/* ── helpers ────────────────────────────────────────────── */

function esc(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function scoreColor(score: number): string {
  if (score >= 70) return '#C4616E';
  if (score >= 45) return '#D4A843';
  return '#7294D4';
}

function scoreBar(label: string, value: number, color?: string): string {
  const c = color || scoreColor(value);
  const v = Math.round(Math.max(0, Math.min(100, value)));
  return `
    <div class="score-row">
      <span class="score-label">${esc(label)}</span>
      <div class="score-track">
        <div class="score-fill" style="width:${v}%;background:${c}"></div>
      </div>
      <span class="score-value" style="color:${c}">${v}</span>
    </div>`;
}

function areBarSVG(label: string, score: number, sublabel: string, color: string): string {
  const barW = 200;
  const fillW = (score / 100) * barW;
  return `
    <div class="are-row">
      <div class="are-label">${esc(label)}</div>
      <div class="are-score" style="color:${color}">${Math.round(score)}</div>
      <svg viewBox="0 0 ${barW} 28" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="10" width="${barW}" height="4" rx="2" fill="#E0D3CE"/>
        <rect x="0" y="10" width="${fillW}" height="4" rx="2" fill="${color}" opacity="0.4"/>
        <circle cx="${fillW}" cy="12" r="6" fill="${color}" stroke="white" stroke-width="1.5"/>
      </svg>
      <div class="are-sublabel">${esc(sublabel)}</div>
    </div>`;
}

function bulletList(items: string[]): string {
  if (!items || !items.length) return '<p class="muted">None identified</p>';
  return `<ul class="clean-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

function positionLabel(pos: string): string {
  if (pos === 'pursuer') return 'Pursuer';
  if (pos === 'withdrawer') return 'Withdrawer';
  if (pos === 'mixed') return 'Mixed / Switching';
  if (pos === 'flexible') return 'Flexible';
  return pos;
}

function overallRingSVG(score: number, label: string): string {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const gap = circ - fill;
  const offset = circ * 0.25; // start at top
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="#E0D3CE" stroke-width="3"/>
    <circle cx="50" cy="50" r="${r}" fill="none" stroke="#C4616E" stroke-width="3" stroke-dasharray="${fill.toFixed(1)} ${gap.toFixed(1)}" stroke-dashoffset="${offset.toFixed(1)}" stroke-linecap="round"/>
    <text x="50" y="48" text-anchor="middle" font-family="Playfair Display, Lora, Georgia, serif" font-size="16" font-weight="600" fill="#C4616E">${Math.round(score)}</text>
    <text x="50" y="62" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="7" fill="#9B8E91">${esc(label)}</text>
  </svg>`;
}

/* ── SVG generators ────────────────────────────────────── */

function generateRadarSVG(scores: {
  attachmentSecurity: number;
  emotionalIntelligence: number;
  differentiation: number;
  conflictFlexibility: number;
  valuesCongruence: number;
  regulationScore: number;
  relationalAwareness: number;
}): string {
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 40;
  const dims: [string, number][] = [
    ['Security', scores.attachmentSecurity],
    ['EQ', scores.emotionalIntelligence],
    ['Differentiation', scores.differentiation],
    ['Conflict', scores.conflictFlexibility],
    ['Values', scores.valuesCongruence],
    ['Regulation', scores.regulationScore],
    ['Awareness', scores.relationalAwareness],
  ];
  const n = dims.length;
  const step = (2 * Math.PI) / n;

  // Grid rings
  let grid = '';
  for (const level of [0.33, 0.66, 1.0]) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + i * step;
      pts.push(`${(center + radius * level * Math.cos(a)).toFixed(1)},${(center + radius * level * Math.sin(a)).toFixed(1)}`);
    }
    grid += `<polygon points="${pts.join(' ')}" fill="none" stroke="#E0D3CE" stroke-width="0.5" stroke-dasharray="2,2"/>`;
  }

  // Axis lines
  let axes = '';
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * step;
    axes += `<line x1="${center}" y1="${center}" x2="${(center + radius * Math.cos(a)).toFixed(1)}" y2="${(center + radius * Math.sin(a)).toFixed(1)}" stroke="#E0D3CE" stroke-width="0.5"/>`;
  }

  // Average range band (50-70)
  const avgLow: string[] = [], avgHigh: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * step;
    avgLow.push(`${(center + radius * 0.5 * Math.cos(a)).toFixed(1)},${(center + radius * 0.5 * Math.sin(a)).toFixed(1)}`);
    avgHigh.push(`${(center + radius * 0.7 * Math.cos(a)).toFixed(1)},${(center + radius * 0.7 * Math.sin(a)).toFixed(1)}`);
  }

  // Data polygon
  const dataPts = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * step;
    const r = radius * (dims[i][1] / 100);
    dataPts.push(`${(center + r * Math.cos(a)).toFixed(1)},${(center + r * Math.sin(a)).toFixed(1)}`);
  }

  // Labels + score dots
  let labels = '';
  for (let i = 0; i < n; i++) {
    const [label, score] = dims[i];
    const a = -Math.PI / 2 + i * step;
    const lx = center + (radius + 28) * Math.cos(a);
    const ly = center + (radius + 28) * Math.sin(a);
    const anchor = Math.cos(a) > 0.3 ? 'start' : Math.cos(a) < -0.3 ? 'end' : 'middle';
    labels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="central" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="10" fill="#6B5B5E" letter-spacing="0.5">${label}</text>`;
    // Score badge on data point
    const br = radius * (score / 100);
    const bx = center + br * Math.cos(a);
    const by = center + br * Math.sin(a);
    labels += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="12" fill="#C4616E" opacity="0.9"/>`;
    labels += `<text x="${bx.toFixed(1)}" y="${(by + 1).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="9" font-weight="600" fill="white">${Math.round(score)}</text>`;
  }

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${grid}${axes}
    <polygon points="${avgHigh.join(' ')}" fill="#E0D3CE" opacity="0.2"/>
    <polygon points="${avgLow.join(' ')}" fill="#FDF6F0"/>
    <polygon points="${dataPts.join(' ')}" fill="#C4616E" fill-opacity="0.15" stroke="#C4616E" stroke-width="2"/>
    ${labels}
  </svg>`;
}

function generateWindowSVG(widthScore: number): string {
  const barW = 360;
  const totalH = 80;
  const windowH = 24;
  const zoneY = (totalH - windowH) / 2;
  const pct = widthScore / 100;
  const windowW = barW * pct;
  const windowX = (barW - windowW) / 2;
  const dotX = windowX + windowW * 0.55;

  return `<svg viewBox="0 0 ${barW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#C4616E" stop-opacity="0.3"/><stop offset="100%" stop-color="#C4616E" stop-opacity="0.05"/></linearGradient>
      <linearGradient id="lG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#7294D4" stop-opacity="0.05"/><stop offset="100%" stop-color="#7294D4" stop-opacity="0.3"/></linearGradient>
    </defs>
    <rect x="0" y="0" width="${barW}" height="${zoneY}" rx="4" fill="url(#hG)"/>
    <rect x="0" y="${zoneY}" width="${barW}" height="${windowH}" fill="#F4D5D0" opacity="0.3"/>
    <rect x="${windowX.toFixed(1)}" y="${zoneY}" width="${windowW.toFixed(1)}" height="${windowH}" fill="#6B9080" opacity="0.25" rx="4"/>
    <line x1="${windowX.toFixed(1)}" y1="${zoneY}" x2="${windowX.toFixed(1)}" y2="${zoneY + windowH}" stroke="#6B9080" stroke-width="1.5" stroke-dasharray="3,2"/>
    <line x1="${(windowX + windowW).toFixed(1)}" y1="${zoneY}" x2="${(windowX + windowW).toFixed(1)}" y2="${zoneY + windowH}" stroke="#6B9080" stroke-width="1.5" stroke-dasharray="3,2"/>
    <rect x="0" y="${zoneY + windowH}" width="${barW}" height="${zoneY}" rx="4" fill="url(#lG)"/>
    <circle cx="${dotX.toFixed(1)}" cy="${zoneY + windowH / 2}" r="6" fill="#C4616E" stroke="white" stroke-width="1.5"/>
    <text x="${barW - 4}" y="12" text-anchor="end" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#C4616E" opacity="0.6">Activation</text>
    <text x="${barW - 4}" y="${zoneY + windowH / 2 + 3}" text-anchor="end" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#6B9080">Window</text>
    <text x="${barW - 4}" y="${totalH - 4}" text-anchor="end" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#7294D4" opacity="0.6">Shutdown</text>
  </svg>`;
}

function generateCycleSVG(position: string): string {
  const pos = positionLabel(position);
  const partnerPos = position === 'pursuer' ? 'Withdrawer' : position === 'withdrawer' ? 'Pursuer' : 'Partner';
  const topLabel = position === 'pursuer' ? 'You pursue \u2192' : position === 'withdrawer' ? '\u2190 Partner pursues' : 'Escalation \u2192';
  const bottomLabel = position === 'pursuer' ? '\u2190 Partner withdraws' : position === 'withdrawer' ? 'You withdraw \u2192' : '\u2190 Distance';

  return `<svg viewBox="0 0 340 140" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="70" r="40" fill="#C4616E" opacity="0.12" stroke="#C4616E" stroke-width="1.5"/>
    <text x="60" y="62" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#9B8E91" letter-spacing="0.5">YOU</text>
    <text x="60" y="78" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="13" font-weight="600" fill="#C4616E">${pos}</text>
    <circle cx="280" cy="70" r="40" fill="#7294D4" opacity="0.12" stroke="#7294D4" stroke-width="1.5"/>
    <text x="280" y="62" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#9B8E91" letter-spacing="0.5">PARTNER</text>
    <text x="280" y="78" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="13" font-weight="600" fill="#7294D4">${partnerPos}</text>
    <path d="M 105 55 Q 170 20 235 55" fill="none" stroke="#C4616E" stroke-width="1.5" marker-end="url(#aR)"/>
    <text x="170" y="32" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#C4616E">${topLabel}</text>
    <path d="M 235 85 Q 170 120 105 85" fill="none" stroke="#7294D4" stroke-width="1.5" marker-end="url(#aL)"/>
    <text x="170" y="118" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#7294D4">${bottomLabel}</text>
    <text x="170" y="72" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="18" fill="#9B8E91">\u21BB</text>
    <defs>
      <marker id="aR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#C4616E"/></marker>
      <marker id="aL" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6" fill="#7294D4"/></marker>
    </defs>
  </svg>`;
}

/* ── main template ──────────────────────────────────────── */

export function generatePortraitHTML(portrait: IndividualPortrait, userName?: string): string {
  const cs = portrait.compositeScores;
  const fl = portrait.fourLens;
  const nc = portrait.negativeCycle;
  const ap = portrait.anchorPoints;
  const pg = portrait.partnerGuide;
  const patterns = portrait.patterns || [];
  const date = new Date(portrait.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const name = userName || 'Your';

  const radarSVG = generateRadarSVG(cs);
  const windowSVG = generateWindowSVG(cs.windowWidth);
  const cycleSVG = generateCycleSVG(nc.position);

  // A.R.E. overall
  const areOverall = Math.round((cs.accessibility + cs.responsiveness + cs.engagement) / 3);
  const areLabel = areOverall >= 70 ? 'Securely Connected' : areOverall >= 50 ? 'Developing' : 'Growing';

  // Window label
  const windowLabel = cs.windowWidth >= 70 ? 'Wide' : cs.windowWidth >= 50 ? 'Moderate' : cs.windowWidth >= 35 ? 'Moderate-Narrow' : 'Narrow';

  // Overall score
  const overall = Math.round(
    (cs.attachmentSecurity + cs.emotionalIntelligence + cs.differentiation +
     cs.conflictFlexibility + cs.valuesCongruence + cs.regulationScore + cs.relationalAwareness) / 7
  );
  const overallLabel = overall >= 70 ? 'Strong' : overall >= 50 ? 'Developing' : 'Growing';

  // A.R.E. bar SVGs
  const accLabel = cs.accessibility >= 70 ? 'Emotionally available' : cs.accessibility >= 50 ? 'Sometimes guarded' : 'Often guarded';
  const resLabel = cs.responsiveness >= 70 ? 'Attuned to partner' : cs.responsiveness >= 50 ? 'Responsive when aware' : 'Developing attunement';
  const engLabel = cs.engagement >= 70 ? 'Deeply invested' : cs.engagement >= 50 ? 'Present but variable' : 'Growing investment';

  // Detected patterns
  const patternsHTML = patterns.length > 0
    ? patterns.map((p) => `
      <div class="pattern-card">
        <div class="pattern-header">
          <span class="pattern-confidence">${esc(p.confidence)} Confidence</span>
          <span class="pattern-category">${esc(p.category.replace(/-/g, ' '))}</span>
        </div>
        <h4 class="pattern-title">${esc(p.description.split('.')[0])}</h4>
        <p class="pattern-desc">${esc(p.interpretation)}</p>
      </div>`).join('')
    : '';

  // Growth edges
  const edgesHTML = portrait.growthEdges.map((edge, i) => `
    <div class="growth-edge-card">
      <div class="growth-edge-number">${i + 1}</div>
      <div class="growth-edge-content">
        <p class="section-label">GROWTH EDGE ${i + 1}</p>
        <h3 class="growth-edge-title">${esc(edge.title)}</h3>
        <p>${esc(edge.description)}</p>
        <div class="insight-callout">${esc(edge.rationale)}</div>
        ${edge.practices && edge.practices.length > 0 ? `
          <p class="guidance-header">Practices</p>
          <ul class="guidance-list">${edge.practices.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>`).join('');

  // Anchors — handle both old (string) and new (structured) format
  const activated = typeof ap.whenActivated === 'string'
    ? `<p>${esc(ap.whenActivated as any)}</p>`
    : `<div class="mantra">${esc(ap.whenActivated.primary)}</div>
       <p class="anchor-subheader">REMEMBER</p>${bulletList(ap.whenActivated.whatToRemember)}
       <p class="anchor-subheader">DO</p>${bulletList(ap.whenActivated.whatToDo)}
       <p class="anchor-subheader">DON'T</p>${bulletList(ap.whenActivated.whatNotToDo)}`;

  const shutdown = typeof ap.whenShutdown === 'string'
    ? `<p>${esc(ap.whenShutdown as any)}</p>`
    : `<div class="mantra">${esc(ap.whenShutdown.primary)}</div>
       <p class="anchor-subheader">REMEMBER</p>${bulletList(ap.whenShutdown.whatToRemember)}
       <p class="anchor-subheader">DO</p>${bulletList(ap.whenShutdown.whatToDo)}
       <p class="anchor-subheader">DON'T</p>${bulletList(ap.whenShutdown.whatNotToDo)}`;

  const patternInterrupts = Array.isArray(ap.patternInterrupt)
    ? bulletList(ap.patternInterrupt)
    : `<p>${esc(ap.patternInterrupt as any)}</p>`;

  const repairSection = typeof ap.repair === 'string'
    ? `<p>${esc(ap.repair as any)}</p>`
    : `<p class="anchor-subheader">SIGNS YOU'RE READY</p>${bulletList(ap.repair.signsYoureReady)}
       <p class="anchor-subheader">REPAIR STARTERS</p>${bulletList(ap.repair.repairStarters)}`;

  const compassionSection = typeof ap.selfCompassion === 'string'
    ? `<p>${esc(ap.selfCompassion as any)}</p>`
    : `${bulletList(ap.selfCompassion.reminders)}
       <div class="insight-callout">${esc(ap.selfCompassion.personalizedMessage)}</div>`;

  // Partner guide — state-specific
  const partnerActivated = pg.whenActivated
    ? `<div class="partner-section">
         <h4>When I'm Activated</h4>
         <p class="anchor-subheader">WHAT HELPS</p>${bulletList(pg.whenActivated.whatHelps)}
         <div class="say-box">
           <p class="anchor-subheader" style="margin-top:0">WHAT TO SAY</p>
           ${pg.whenActivated.whatToSay.map((s) => `<p>"${esc(s)}"</p>`).join('')}
         </div>
       </div>`
    : '';
  const partnerShutdown = pg.whenShutdown
    ? `<div class="partner-section">
         <h4>When I'm Shut Down</h4>
         <p class="anchor-subheader">WHAT HELPS</p>${bulletList(pg.whenShutdown.whatHelps)}
         <div class="say-box">
           <p class="anchor-subheader" style="margin-top:0">WHAT TO SAY</p>
           ${pg.whenShutdown.whatToSay.map((s) => `<p>"${esc(s)}"</p>`).join('')}
         </div>
       </div>`
    : '';

  // Values gaps
  const valuesGapsHTML = fl.values.significantGaps.length > 0
    ? fl.values.significantGaps.map((g) => {
        const gapColor = g.gap >= 3 ? '#C4616E' : g.gap >= 2 ? '#D4A843' : '#6B9080';
        const status = g.gap >= 3 ? 'Growth Edge' : g.gap >= 2 ? 'Aligned' : 'Integrated';
        const statusClass = g.gap >= 3 ? 'growth-edge' : g.gap >= 2 ? 'aligned' : 'integrated';
        const impPct = (g.importance / 10) * 100;
        const livePct = ((g.importance - g.gap) / 10) * 100;
        return `
          <div class="value-row">
            <span class="value-name">${esc(g.value)}</span>
            <div class="value-bar-track">
              <div class="value-bar-importance" style="width:${impPct}%"></div>
              <div class="value-bar-living" style="width:${livePct}%"></div>
            </div>
            <span class="value-gap">
              <span class="gap-number" style="color:${gapColor}">${g.gap.toFixed(1)}</span>
              <span class="gap-status ${statusClass}">${status}</span>
            </span>
          </div>`;
      }).join('')
    : '';

  // Big Five reframes (if available)
  const bigFiveHTML = portrait.bigFiveReframes && portrait.bigFiveReframes.length > 0
    ? `<div class="card card-muted">
         <div class="card-title">Personality Insights</div>
         ${bulletList(portrait.bigFiveReframes)}
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Your Portrait \u2014 ${esc(name)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500&display=swap');

/* ── RESET & BASE ─────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --rose: #C4616E;
  --rose-light: #F4D5D0;
  --rose-dark: #8B3A4A;
  --blue: #7294D4;
  --blue-light: #C6CDF7;
  --gold: #D4A843;
  --gold-light: #F1BB7B;
  --sage: #6B9080;
  --sage-light: #DAE5DE;
  --terracotta: #D8A499;
  --teal: #6BA3A0;
  --bg: #FDF6F0;
  --bg-alt: #FAF0E6;
  --surface: #FFFFFF;
  --surface-elevated: #FFF8F2;
  --text: #2D2226;
  --text-secondary: #6B5B5E;
  --text-muted: #9B8E91;
  --border: #E0D3CE;
  --border-light: #F0E6E0;
}

@page {
  size: letter;
  margin: 0.85in 0.85in;
  @bottom-center {
    content: "Tender: The Science of Relationships";
    font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
    font-size: 7.5pt;
    color: #9B8E91;
    letter-spacing: 1.5px;
  }
  @bottom-right {
    content: counter(page);
    font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
    font-size: 7.5pt;
    color: #9B8E91;
  }
}

@page :first {
  margin: 0.5in 0.85in;
  @bottom-center { content: none; }
  @bottom-right { content: none; }
}

body {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  color: var(--text);
  line-height: 1.7;
  background: var(--bg);
  font-size: 10pt;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  /* On-screen margins for the HTML preview */
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0 0.75in;
}
@media print {
  body { padding: 0; max-width: none; margin: 0; }
}

/* ── COVER PAGE ──────────────────────── */
.cover {
  page-break-after: always;
  text-align: center;
  padding: 3in 1in 2in;
  background: var(--bg);
}
.cover-line { width: 60px; height: 2px; background: var(--rose); margin: 24px auto; }
.cover-label {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 9pt; letter-spacing: 4px;
  text-transform: uppercase; color: var(--rose); margin-bottom: 8px;
}
.cover h1 {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-weight: 400; font-size: 36pt; color: var(--text);
  margin-bottom: 4px; letter-spacing: 0.5px;
}
.cover-subtitle {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 14pt; color: var(--text-secondary); margin-top: 6px;
}
.cover-date {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-size: 10pt; color: var(--text-muted); margin-top: 32px; letter-spacing: 1px;
}
.cover-footer {
  margin-top: auto;
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 8pt; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted);
}

/* ── SECTIONS ────────────────────────── */
.section { margin-bottom: 40px; page-break-inside: avoid; }
.section-divider { width: 100%; height: 2px; background: var(--rose); margin: 40px 0 28px; }
.section-title {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-weight: 700; font-size: 18pt; color: var(--text);
  letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
}
.section-label {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 8pt; letter-spacing: 3px; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 4px;
}

h3 {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-weight: 500; font-size: 14pt; color: var(--text); margin-bottom: 8px;
  letter-spacing: 0.3px;
}
h4 {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-weight: 500; font-size: 11pt; color: var(--text); margin-bottom: 4px;
}
p { margin-bottom: 8px; line-height: 1.7; }

/* ── CARDS ────────────────────────────── */
.card {
  background: var(--surface);
  border-radius: 10px; padding: 24px 28px; margin-bottom: 20px;
  border: 1px solid var(--border-light);
  page-break-inside: avoid;
}
.card-accent { border-left: 3px solid var(--rose); }
.card-rose { border-left: 3px solid var(--rose); }
.card-blue { border-left: 3px solid var(--blue); }
.card-sage { border-left: 3px solid var(--sage); }
.card-gold { border-left: 3px solid var(--gold); }
.card-muted { background: var(--bg-alt); border: none; }
.card-title {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif; font-weight: 500;
  font-size: 12pt; color: var(--text); margin-bottom: 8px;
}
.muted { color: var(--text-muted); font-style: italic; }

/* ── SCORE BARS ──────────────────────── */
.score-row {
  display: flex; align-items: center; margin-bottom: 8px; page-break-inside: avoid;
}
.score-label {
  width: 170px; font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-size: 10pt; font-weight: 500; color: var(--text);
}
.score-track {
  flex: 1; height: 8px; background: var(--border-light);
  border-radius: 4px; overflow: hidden; margin: 0 10px;
}
.score-fill { height: 100%; border-radius: 4px; }
.score-value {
  width: 32px; text-align: right;
  font-family: 'Playfair Display', Lora, Georgia, serif; font-size: 12pt; font-weight: 600;
}

/* ── OVERALL SCORE RING ──────────────── */
.overall-ring { text-align: center; margin: 20px auto; }
.overall-ring svg { width: 100px; display: block; margin: 0 auto; }

/* ── A.R.E. SECTION ──────────────────── */
.are-row { margin-bottom: 14px; page-break-inside: avoid; }
.are-row svg { width: 200px; }
.are-label {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-weight: 500; font-size: 11pt; display: inline;
}
.are-score {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-weight: 600; font-size: 14pt; color: var(--rose); float: right;
}
.are-sublabel {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 9pt; color: var(--text-muted); margin-top: 2px;
}

/* ── RADAR ────────────────────────────── */
.radar-container { text-align: center; margin: 20px auto; }
.radar-container svg { width: 300px; max-width: 100%; display: block; margin: 0 auto; }

/* ── WINDOW OF TOLERANCE ─────────────── */
.window-container { text-align: center; margin: 20px auto; display: flex; flex-direction: column; align-items: center; }
.window-container svg { width: 85%; max-width: 380px; display: block; margin: 0 auto; }
.window-stats { display: flex; gap: 20px; justify-content: center; margin-top: 10px; }
.window-stat { text-align: center; }
.window-stat-label { font-size: 8pt; letter-spacing: 1px; text-transform: uppercase; color: var(--text-muted); display: block; }
.window-stat-value { font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif; font-weight: 500; font-size: 11pt; color: var(--text); }

/* ── CYCLE DIAGRAM ───────────────────── */
.cycle-container { text-align: center; margin: 16px auto; }
.cycle-container svg { width: 320px; max-width: 100%; display: block; margin: 0 auto; }

/* ── TWO-COL ─────────────────────────── */
.two-col { display: flex; gap: 16px; page-break-inside: avoid; }
.two-col > div { flex: 1; }

/* ── INSIGHT CALLOUT ─────────────────── */
.insight-callout {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 10.5pt; color: var(--text-secondary);
  border-left: 3px solid var(--rose);
  padding: 14px 20px; margin: 14px 0;
  background: var(--bg-alt); border-radius: 0 6px 6px 0; line-height: 1.75;
}

/* ── PATTERNS ────────────────────────── */
.pattern-card {
  background: var(--surface); border-radius: 8px;
  padding: 14px 18px; margin-bottom: 10px;
  border: 1px solid var(--border-light);
  page-break-inside: avoid;
}
.pattern-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
.pattern-confidence {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 8pt; font-weight: 500; color: var(--sage); letter-spacing: 0.5px;
}
.pattern-category {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 8pt; color: var(--text-muted); letter-spacing: 0.5px;
}
.pattern-title {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-weight: 500; font-size: 10.5pt; color: var(--text); margin-bottom: 4px;
}
.pattern-desc {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 9.5pt; color: var(--text-secondary);
  line-height: 1.55; margin: 0;
}

/* ── VALUES ──────────────────────────── */
.value-row {
  display: grid; grid-template-columns: 140px 1fr 80px;
  align-items: center; gap: 8px; padding: 8px 0;
  border-bottom: 1px solid var(--border-light); page-break-inside: avoid;
}
.value-name {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-weight: 500; font-size: 10pt;
}
.value-bar-track {
  height: 6px; background: var(--border-light); border-radius: 3px;
  position: relative; overflow: hidden;
}
.value-bar-importance {
  position: absolute; top: 0; left: 0; height: 100%;
  background: var(--rose-light); border-radius: 3px;
}
.value-bar-living {
  position: absolute; top: 0; left: 0; height: 100%;
  background: var(--rose); border-radius: 3px;
}
.value-gap { text-align: right; font-size: 9pt; }
.gap-number { font-family: 'Playfair Display', Lora, Georgia, serif; font-weight: 600; font-size: 12pt; }
.gap-status { display: block; font-size: 8pt; letter-spacing: 0.3px; }
.gap-status.growth-edge { color: var(--rose); font-weight: 500; }
.gap-status.aligned { color: var(--gold); }
.gap-status.integrated { color: var(--sage); }

/* ── GROWTH EDGES ────────────────────── */
.growth-edge-card {
  display: flex; gap: 16px; margin-bottom: 20px; page-break-inside: avoid;
}
.growth-edge-number {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-weight: 700; font-size: 24pt; color: var(--rose-light);
  min-width: 36px; text-align: center; padding-top: 4px;
}
.growth-edge-content { flex: 1; }
.growth-edge-title {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-weight: 600; font-size: 13pt; color: var(--text); margin-bottom: 6px;
}
.guidance-header {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-weight: 600; font-size: 10pt; margin: 10px 0 4px; letter-spacing: 0.5px;
}
.guidance-list { padding-left: 16px; font-size: 9.5pt; line-height: 1.7; }
.guidance-list li { margin-bottom: 3px; }

/* ── ANCHORS ─────────────────────────── */
.anchor-section { margin-bottom: 28px; page-break-inside: avoid; }
.anchor-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.anchor-icon {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12pt; flex-shrink: 0;
}
.anchor-icon.activated { background: var(--rose-light); color: var(--rose); }
.anchor-icon.shutdown { background: var(--blue-light); color: var(--blue); }
.anchor-icon.interrupt { background: var(--bg-alt); color: var(--gold); }
.anchor-icon.repair { background: var(--sage-light); color: var(--sage); }
.anchor-icon.compassion { background: var(--rose-light); color: var(--rose-dark); }
.mantra {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 12pt; color: var(--text);
  margin: 8px 0 12px; line-height: 1.6;
}
.anchor-subheader {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 8pt; letter-spacing: 2px; text-transform: uppercase;
  color: var(--text-muted); margin: 10px 0 4px;
}

/* ── PARTNER GUIDE ───────────────────── */
.partner-section { page-break-inside: avoid; margin-bottom: 16px; }
.partner-intro {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 10pt; line-height: 1.7;
  background: var(--bg-alt); padding: 16px 20px;
  border-radius: 8px; margin-bottom: 14px;
}
.partner-core-need {
  background: var(--surface); border-left: 3px solid var(--rose);
  padding: 12px 18px; border-radius: 0 8px 8px 0; margin-bottom: 14px;
}
.partner-core-need p {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; color: var(--text-secondary); margin: 0;
}
.what-columns { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 12px; }
.say-box {
  background: var(--surface); border: 1px solid var(--border-light);
  border-radius: 8px; padding: 12px 16px; margin: 8px 0;
}
.say-box p {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 10pt; color: var(--text-secondary);
  margin: 4px 0; line-height: 1.6;
}

/* ── BULLET-FREE LISTS ───────────────── */
.clean-list { list-style: none; padding: 0; }
.clean-list li {
  position: relative; padding-left: 14px;
  margin-bottom: 4px; font-size: 9.5pt; line-height: 1.6;
}
.clean-list li::before {
  content: '\u00B7'; position: absolute; left: 0;
  color: var(--text-muted); font-size: 14pt; line-height: 1; top: 2px;
}

/* ── CLOSING ─────────────────────────── */
.closing {
  text-align: center; padding: 40px 20px; page-break-before: always;
}
.closing-text {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 13pt; color: var(--text-secondary);
  line-height: 1.8; max-width: 400px; margin: 0 auto 24px;
}
.closing-logo {
  font-family: 'Jost', Poppins, 'Liberation Sans', sans-serif;
  font-weight: 600; font-size: 14pt; color: var(--rose);
  letter-spacing: 3px; text-transform: uppercase;
}
.closing-tagline {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 9pt; color: var(--text-muted); letter-spacing: 1px; margin-top: 4px;
}

/* ── TRIGGER TAGS ────────────────────── */
.trigger-list { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }
.trigger-tag {
  background: var(--rose-light); color: var(--rose-dark);
  font-size: 8.5pt; padding: 3px 10px; border-radius: 20px;
}

/* ── PRINT HELPERS ───────────────────── */
.page-break { page-break-before: always; }
.avoid-break { page-break-inside: avoid; }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <p class="cover-label">Your Relational Portrait</p>
  <div class="cover-line"></div>
  <h1>${esc(name)}</h1>
  <p class="cover-subtitle">A map of your patterns, strengths, and growing edges</p>
  <p class="cover-date">${esc(date)}</p>
  <div class="cover-line"></div>
  <p class="cover-footer">Tender \u00B7 The Science of Relationships</p>
</div>

<!-- RELATIONAL PROFILE -->
<div class="section">
  <div class="section-divider"></div>
  <p class="section-label">YOUR RELATIONAL PROFILE</p>
  <div class="section-title">The Shape of You</div>
  <p style="font-style: italic; color: var(--text-muted); font-size: 9.5pt;">7 dimensions that define how you relate</p>
  <div class="radar-container">${radarSVG}</div>
  <p style="text-align:center;font-size:9pt;color:var(--text-muted);margin-top:8px">
    Shaded area shows typical range (50\u201370). Scores outside this range are distinctly high or low.
  </p>
</div>

<!-- SCORES -->
<div class="page-break"></div>
<div class="section">
  <div class="section-divider"></div>
  <div class="section-title">Scores</div>

  <div class="overall-ring">
    ${overallRingSVG(overall, 'OVERALL')}
    <p style="font-family:'Playfair Display',Lora,Georgia,serif;font-size:12pt;color:var(--rose);margin-top:4px">${esc(overallLabel)}</p>
  </div>

  <!-- A.R.E. -->
  <div class="card">
    <p class="section-label">A.R.E. \u2014 ATTACHMENT QUALITY</p>
    <p style="font-size:9pt;color:var(--text-muted);margin-bottom:12px">Based on Emotionally Focused Therapy: Are you emotionally reachable, do you tune in to your partner's needs, and are you invested in the connection?</p>
    ${areBarSVG('Accessible', cs.accessibility, accLabel, '#C4616E')}
    ${areBarSVG('Responsive', cs.responsiveness, resLabel, '#D4A843')}
    ${areBarSVG('Engaged', cs.engagement, engLabel, '#6B9080')}
  </div>
</div>

<!-- WINDOW OF TOLERANCE -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">NERVOUS SYSTEM</p>
  <div class="section-title">Window of Tolerance</div>
  <div class="window-container">${windowSVG}</div>
  <div class="window-stats">
    <div class="window-stat"><span class="window-stat-label">Width</span><span class="window-stat-value">${windowLabel} (${Math.round(cs.windowWidth)})</span></div>
    <div class="window-stat"><span class="window-stat-label">Regulation</span><span class="window-stat-value">${Math.round(cs.regulationScore)}</span></div>
  </div>
  <p style="margin-top:12px">${esc(fl.regulation.narrative)}</p>
  ${fl.regulation.floodingMarkers && fl.regulation.floodingMarkers.length > 0 ? `
  <div class="trigger-list">
    ${fl.regulation.floodingMarkers.map((t) => `<span class="trigger-tag">${esc(t)}</span>`).join('')}
  </div>` : ''}
</div>

<!-- ATTACHMENT -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">ATTACHMENT LENS</p>
  <div class="section-title">How You Attach</div>
  <div class="insight-callout">${esc(fl.attachment.narrative)}</div>
  <div class="two-col">
    <div class="card card-rose">
      <div class="card-title">Protective Strategy</div>
      <p>${esc(fl.attachment.protectiveStrategy)}</p>
    </div>
    <div class="card card-accent">
      <div class="card-title">Triggers</div>
      <div class="trigger-list">
        ${fl.attachment.triggers.map((t) => `<span class="trigger-tag">${esc(t)}</span>`).join('')}
      </div>
    </div>
  </div>
  ${fl.attachment.emotionalStructure ? `
  <div class="card card-muted">
    <div class="card-title">Emotional Structure</div>
    <p><strong>Primary emotion:</strong> ${esc(fl.attachment.emotionalStructure.primary)}</p>
    <p><strong>What shows:</strong> ${esc(fl.attachment.emotionalStructure.secondary)}</p>
    <p style="font-family:'Playfair Display',Lora,Georgia,serif;font-style:italic;color:var(--rose);font-size:11pt;margin-top:8px">"${esc(fl.attachment.emotionalStructure.longing)}"</p>
  </div>` : ''}
</div>

<!-- PARTS LENS -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">INTERNAL FAMILY SYSTEMS</p>
  <div class="section-title">Your Inner Parts</div>
  <p>${esc(fl.parts.narrative)}</p>
  <div class="two-col">
    <div class="card card-gold">
      <div class="card-title">Manager Parts</div>
      ${bulletList(fl.parts.managerParts)}
    </div>
    <div class="card card-rose">
      <div class="card-title">Firefighter Parts</div>
      ${bulletList(fl.parts.firefighterParts)}
    </div>
  </div>
  <div class="card card-muted">
    <div class="card-title">Polarities</div>
    ${bulletList(fl.parts.polarities)}
  </div>
</div>

<!-- REGULATION -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">REGULATION LENS</p>
  <div class="section-title">How You Regulate</div>
  <div class="two-col">
    <div class="card card-rose">
      <div class="card-title">Activation Patterns</div>
      ${bulletList(fl.regulation.activationPatterns)}
    </div>
    <div class="card card-blue">
      <div class="card-title">Shutdown Patterns</div>
      ${bulletList(fl.regulation.shutdownPatterns)}
    </div>
  </div>
  ${fl.regulation.regulationToolkit ? `
  <div class="card card-sage">
    <div class="card-title">Your Regulation Toolkit</div>
    <p class="anchor-subheader">STRENGTHS</p>
    ${bulletList(fl.regulation.regulationToolkit.strengths)}
    <p class="anchor-subheader">BUILDING BLOCKS</p>
    ${bulletList(fl.regulation.regulationToolkit.buildingBlocks)}
  </div>` : ''}
</div>

<!-- VALUES -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">VALUES LENS</p>
  <div class="section-title">What Matters Most</div>
  <p>${esc(fl.values.narrative)}</p>
  <div class="card">
    <div class="card-title">Core Values</div>
    ${bulletList(fl.values.coreValues)}
  </div>
  ${valuesGapsHTML ? `
  <div class="card">
    <div class="card-title">Values Alignment</div>
    <div style="display:flex;gap:12px;margin-bottom:8px;font-size:8pt;color:var(--text-muted)">
      <span><span style="display:inline-block;width:8px;height:4px;background:var(--rose-light);border-radius:2px;margin-right:4px"></span>Importance</span>
      <span><span style="display:inline-block;width:8px;height:4px;background:var(--rose);border-radius:2px;margin-right:4px"></span>Living It</span>
    </div>
    ${valuesGapsHTML}
  </div>` : ''}
</div>

${fl.fieldAwareness ? `
<!-- FIELD AWARENESS -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">FIELD AWARENESS</p>
  <div class="section-title">Relational Field</div>
  <p>${esc(fl.fieldAwareness.narrative)}</p>
  ${scoreBar('Field Sensitivity', Math.round((fl.fieldAwareness.fieldSensitivity / 5) * 100), '#6B9080')}
  ${scoreBar('Boundary Clarity', Math.round((fl.fieldAwareness.boundaryClarity / 6) * 100), '#7294D4')}
  ${scoreBar('Pattern Awareness', Math.round((fl.fieldAwareness.patternAwareness / 7) * 100), '#D4A843')}
</div>` : ''}

${bigFiveHTML ? `
<!-- PERSONALITY -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">PERSONALITY LENS</p>
  <div class="section-title">Who You Are in Relationship</div>
  ${bigFiveHTML}
</div>` : ''}

<!-- NEGATIVE CYCLE -->
<div class="page-break"></div>
<div class="section">
  <div class="section-divider"></div>
  <p class="section-label">NEGATIVE CYCLE</p>
  <div class="section-title">Your Dance Under Stress</div>
  <div class="cycle-container">${cycleSVG}</div>
  <p>${esc(nc.description)}</p>
  <div class="two-col">
    <div class="card card-rose">
      <div class="card-title">Primary Triggers</div>
      <div class="trigger-list">
        ${nc.primaryTriggers.map((t) => `<span class="trigger-tag">${esc(t)}</span>`).join('')}
      </div>
    </div>
    <div class="card card-accent">
      <div class="card-title">Typical Moves</div>
      ${bulletList(nc.typicalMoves)}
    </div>
  </div>
  <div class="card card-sage">
    <div class="card-title">De-Escalators</div>
    ${bulletList(nc.deEscalators)}
  </div>
</div>

${patternsHTML ? `
<!-- DETECTED PATTERNS -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">PATTERN DETECTION</p>
  <div class="section-title">What the Data Reveals</div>
  ${patternsHTML}
</div>` : ''}

<!-- GROWTH EDGES -->
<div class="page-break"></div>
<div class="section">
  <div class="section-divider"></div>
  <p class="section-label">YOUR GROWTH PATH</p>
  <div class="section-title">Growth Edges</div>
  ${edgesHTML}
</div>

<!-- ANCHOR POINTS -->
<div class="section-divider"></div>
<div class="section">
  <p class="section-label">YOUR ANCHORS</p>
  <div class="section-title">When You Need Grounding</div>

  <div class="anchor-section">
    <div class="anchor-header">
      <div class="anchor-icon activated">\u26A1</div>
      <h3>When Activated</h3>
    </div>
    ${activated}
  </div>

  <div class="anchor-section">
    <div class="anchor-header">
      <div class="anchor-icon shutdown">\u2744</div>
      <h3>When Shut Down</h3>
    </div>
    ${shutdown}
  </div>

  <div class="anchor-section">
    <div class="anchor-header">
      <div class="anchor-icon interrupt">\u23F8</div>
      <h3>Pattern Interrupts</h3>
    </div>
    ${patternInterrupts}
  </div>

  <div class="anchor-section">
    <div class="anchor-header">
      <div class="anchor-icon repair">\u2764</div>
      <h3>Repair</h3>
    </div>
    ${repairSection}
  </div>

  <div class="anchor-section">
    <div class="anchor-header">
      <div class="anchor-icon compassion">\u2728</div>
      <h3>Self-Compassion</h3>
    </div>
    ${compassionSection}
  </div>
</div>

<!-- PARTNER GUIDE -->
<div class="page-break"></div>
<div class="section">
  <div class="section-divider"></div>
  <p class="section-label">FOR YOUR PARTNER</p>
  <div class="section-title">Partner Guide</div>

  <div class="partner-intro">${esc(pg.whatToKnow)}</div>

  ${pg.deepestLonging ? `
  <div class="partner-core-need">
    <h4>What I Most Need You to Know</h4>
    <p>"${esc(pg.deepestLonging)}"</p>
  </div>` : ''}

  <div class="card">
    <div class="card-title">When I'm Struggling, I Need\u2026</div>
    ${bulletList(pg.whenStrugglingINeed)}
  </div>

  ${partnerActivated}
  ${partnerShutdown}

  ${pg.whatToSay && pg.whatToSay.length > 0 ? `
  <div class="say-box">
    <h4>Key Phrases</h4>
    ${pg.whatToSay.map((s) => `<p>"${esc(s)}"</p>`).join('')}
  </div>` : ''}

  <div class="what-columns">
    <div class="what-column helps">
      <h4>WHAT HELPS</h4>
      ${bulletList(pg.whatHelps)}
    </div>
    <div class="what-column doesnt">
      <h4>WHAT DOESN'T HELP</h4>
      ${bulletList(pg.whatDoesntHelp)}
    </div>
  </div>
</div>

<!-- CLOSING -->
<div class="closing">
  <div class="cover-line"></div>
  <p class="closing-text">This portrait is a starting point, not a verdict. Return to it when you're stuck, share it with your partner when you're ready, and use it as a guide for the work ahead.</p>
  <p class="closing-logo">Tender</p>
  <p class="closing-tagline">The Science of Relationships</p>
</div>

</body>
</html>`;
}
