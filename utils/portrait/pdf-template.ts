/**
 * PDF HTML Template — Generates a styled HTML document for printing / PDF export.
 *
 * Used by `services/pdf-export.ts` with `expo-print` on native
 * and `window.print()` on web.
 */

import type { IndividualPortrait, CompositeScores } from '@/types/portrait';

/* ── helpers ────────────────────────────────────────────── */

function scoreColor(score: number): string {
  if (score >= 70) return '#C4616E'; // primary
  if (score >= 45) return '#D8A499'; // accent
  return '#7294D4'; // secondary
}

function scoreBar(label: string, value: number): string {
  return `
    <div class="score-row">
      <span class="score-label">${label}</span>
      <div class="score-track">
        <div class="score-fill" style="width:${value}%;background:${scoreColor(value)}"></div>
      </div>
      <span class="score-value">${value}</span>
    </div>`;
}

function bulletList(items: string[]): string {
  if (!items.length) return '<p class="muted">None identified</p>';
  return `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── main template ──────────────────────────────────────── */

export function generatePortraitHTML(portrait: IndividualPortrait): string {
  const cs = portrait.compositeScores;
  const fl = portrait.fourLens;
  const nc = portrait.negativeCycle;
  const ap = portrait.anchorPoints;
  const pg = portrait.partnerGuide;
  const date = new Date(portrait.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Tender — Relational Portrait</title>
  <style>
    @page { margin: 0.6in 0.75in; }
    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #2C2C2C;
      line-height: 1.55;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }

    /* header */
    .header {
      text-align: center;
      border-bottom: 2px solid #C4616E;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 22pt;
      margin: 0 0 2px;
      color: #C4616E;
      letter-spacing: 1px;
    }
    .header .subtitle {
      font-size: 10pt;
      color: #888;
      margin: 0 0 4px;
    }
    .header .date {
      font-size: 9pt;
      color: #AAA;
    }

    /* sections */
    .section {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #C4616E;
      margin: 0 0 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #E5E5E5;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .section p, .section li { font-size: 10.5pt; }

    /* score bars */
    .score-row {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }
    .score-label {
      width: 160px;
      font-size: 10pt;
      font-weight: 500;
    }
    .score-track {
      flex: 1;
      height: 10px;
      background: #EDEDED;
      border-radius: 5px;
      overflow: hidden;
      margin: 0 8px;
    }
    .score-fill {
      height: 100%;
      border-radius: 5px;
      transition: width 0.3s;
    }
    .score-value {
      width: 30px;
      text-align: right;
      font-size: 10pt;
      font-weight: 600;
    }

    /* list */
    ul {
      margin: 4px 0 8px 18px;
      padding: 0;
    }
    li { margin-bottom: 3px; }

    /* cards */
    .card {
      background: #FAFAF8;
      border: 1px solid #E8E8E4;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
    }
    .card-title {
      font-weight: 700;
      font-size: 10.5pt;
      color: #5B6B8A;
      margin-bottom: 4px;
    }

    .muted { color: #999; font-style: italic; }

    /* two-col */
    .two-col {
      display: flex;
      gap: 16px;
    }
    .two-col > div { flex: 1; }

    /* footer */
    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 8pt;
      color: #BBB;
      border-top: 1px solid #E5E5E5;
      padding-top: 8px;
    }
  </style>
</head>
<body>

<!-- ─── Header ─────────────────────────────────────────── -->
<div class="header">
  <h1>Tender</h1>
  <p class="subtitle">The Science of Relationships — Relational Portrait</p>
  <p class="date">Generated ${escapeHtml(date)}</p>
</div>

<!-- ─── Composite Scores ───────────────────────────────── -->
<div class="section">
  <div class="section-title">Composite Scores</div>
  ${scoreBar('Emotional Regulation', cs.regulationScore)}
  ${scoreBar('Window of Tolerance', cs.windowWidth)}
  ${scoreBar('Accessibility', cs.accessibility)}
  ${scoreBar('Responsiveness', cs.responsiveness)}
  ${scoreBar('Engagement', cs.engagement)}
  ${scoreBar('Self-Leadership', cs.selfLeadership)}
  ${scoreBar('Values Congruence', cs.valuesCongruence)}
</div>

<!-- ─── Attachment Lens ────────────────────────────────── -->
<div class="section">
  <div class="section-title">Attachment Lens</div>
  <p>${escapeHtml(fl.attachment.narrative)}</p>
  <div class="card">
    <div class="card-title">Protective Strategy</div>
    <p>${escapeHtml(fl.attachment.protectiveStrategy)}</p>
  </div>
  <div class="card">
    <div class="card-title">Triggers</div>
    ${bulletList(fl.attachment.triggers)}
  </div>
</div>

<!-- ─── Parts Lens ─────────────────────────────────────── -->
<div class="section">
  <div class="section-title">Parts Lens (IFS)</div>
  <p>${escapeHtml(fl.parts.narrative)}</p>
  <div class="two-col">
    <div class="card">
      <div class="card-title">Manager Parts</div>
      ${bulletList(fl.parts.managerParts)}
    </div>
    <div class="card">
      <div class="card-title">Firefighter Parts</div>
      ${bulletList(fl.parts.firefighterParts)}
    </div>
  </div>
  <div class="card">
    <div class="card-title">Polarities</div>
    ${bulletList(fl.parts.polarities)}
  </div>
</div>

<!-- ─── Regulation Lens ────────────────────────────────── -->
<div class="section">
  <div class="section-title">Regulation Lens</div>
  <p>${escapeHtml(fl.regulation.narrative)}</p>
  <div class="two-col">
    <div class="card">
      <div class="card-title">Activation Patterns</div>
      ${bulletList(fl.regulation.activationPatterns)}
    </div>
    <div class="card">
      <div class="card-title">Shutdown Patterns</div>
      ${bulletList(fl.regulation.shutdownPatterns)}
    </div>
  </div>
</div>

<!-- ─── Values Lens ────────────────────────────────────── -->
<div class="section">
  <div class="section-title">Values Lens</div>
  <p>${escapeHtml(fl.values.narrative)}</p>
  <div class="card">
    <div class="card-title">Core Values</div>
    ${bulletList(fl.values.coreValues)}
  </div>
  ${fl.values.significantGaps.length > 0 ? `
  <div class="card">
    <div class="card-title">Significant Gaps</div>
    <ul>${fl.values.significantGaps.map(
      (g) => `<li><strong>${escapeHtml(g.value)}</strong> — gap of ${g.gap} (importance ${g.importance}/5)</li>`
    ).join('')}</ul>
  </div>` : ''}
</div>

${fl.fieldAwareness ? `
<!-- ─── Field Awareness Lens ───────────────────────────── -->
<div class="section">
  <div class="section-title">Field Awareness Lens</div>
  <p>${escapeHtml(fl.fieldAwareness.narrative)}</p>
  ${scoreBar('Field Sensitivity', Math.round((fl.fieldAwareness.fieldSensitivity / 7) * 100))}
  ${scoreBar('Boundary Clarity', Math.round((fl.fieldAwareness.boundaryClarity / 7) * 100))}
  ${scoreBar('Pattern Awareness', Math.round((fl.fieldAwareness.patternAwareness / 7) * 100))}
</div>` : ''}

<!-- ─── Negative Cycle ─────────────────────────────────── -->
<div class="section">
  <div class="section-title">Your Negative Cycle</div>
  <p><strong>Position:</strong> ${escapeHtml(nc.position)}</p>
  <p>${escapeHtml(nc.description)}</p>
  <div class="two-col">
    <div class="card">
      <div class="card-title">Primary Triggers</div>
      ${bulletList(nc.primaryTriggers)}
    </div>
    <div class="card">
      <div class="card-title">Typical Moves</div>
      ${bulletList(nc.typicalMoves)}
    </div>
  </div>
  <div class="card">
    <div class="card-title">De-Escalators</div>
    ${bulletList(nc.deEscalators)}
  </div>
</div>

<!-- ─── Growth Edges ───────────────────────────────────── -->
<div class="section">
  <div class="section-title">Growth Edges</div>
  ${portrait.growthEdges.map((edge) => `
  <div class="card">
    <div class="card-title">${escapeHtml(edge.title)}</div>
    <p>${escapeHtml(edge.description)}</p>
    <p class="muted">${escapeHtml(edge.rationale)}</p>
  </div>`).join('')}
</div>

<!-- ─── Anchor Points ──────────────────────────────────── -->
<div class="section">
  <div class="section-title">Anchor Points</div>
  <div class="card">
    <div class="card-title">When Activated</div>
    <p>${escapeHtml(ap.whenActivated)}</p>
  </div>
  <div class="card">
    <div class="card-title">When Shut Down</div>
    <p>${escapeHtml(ap.whenShutdown)}</p>
  </div>
  <div class="card">
    <div class="card-title">Pattern Interrupt</div>
    <p>${escapeHtml(ap.patternInterrupt)}</p>
  </div>
  <div class="card">
    <div class="card-title">Repair</div>
    <p>${escapeHtml(ap.repair)}</p>
  </div>
  <div class="card">
    <div class="card-title">Self-Compassion</div>
    <p>${escapeHtml(ap.selfCompassion)}</p>
  </div>
</div>

<!-- ─── Partner Guide ──────────────────────────────────── -->
<div class="section">
  <div class="section-title">Partner Guide</div>
  <p>${escapeHtml(pg.whatToKnow)}</p>
  <div class="card">
    <div class="card-title">When I'm Struggling, I Need…</div>
    ${bulletList(pg.whenStrugglingINeed)}
  </div>
  <div class="two-col">
    <div class="card">
      <div class="card-title">What Helps</div>
      ${bulletList(pg.whatHelps)}
    </div>
    <div class="card">
      <div class="card-title">What Doesn't Help</div>
      ${bulletList(pg.whatDoesntHelp)}
    </div>
  </div>
</div>

<!-- ─── Footer ─────────────────────────────────────────── -->
<div class="footer">
  Generated by <strong>Tender: The Science of Relationships</strong> &middot; For use in therapeutic settings &middot; Not a clinical diagnosis
</div>

</body>
</html>`;
}
