/**
 * Couple Portrait PDF HTML Template -- Generates a polished HTML document for PDF export.
 *
 * Styled after the Tender design system: warm rose palette, Playfair Display
 * headings, Josefin Sans body text, SVG data visualizations.
 *
 * Used by `services/pdf-export.ts` with `expo-print` on native
 * and `window.open()` + `print()` on web.
 */

import { generateIntegration, toIntegrationScores, getAvailableDomains } from '@/utils/integration-engine';
import type { IntegrationResult, LensType } from '@/utils/integration-engine';
import { routeAttachmentDynamic, routeConflictDynamic, routeValuesDynamic, interpolateCouple } from '@/utils/integration-engine/narratives/tier3-couple-dynamics';

import type {
  DeepCouplePortrait,
  CombinedCycle,
  AttachmentDynamic,
  RadarOverlap,
  CoupleGrowthEdge,
  CoupleNarrative,
  CoupleAnchorSet,
  RelationalFieldLayer,
  FrictionZone,
  ValuesTension,
  DyadicDiscrepancy,
  ExitPoint,
  ConvergencePoint,
  ComplementaryPair,
} from '@/types/couples';

/* ── helpers ────────────────────────────────────────────── */

function possessive(name: string): string {
  return name === 'You' ? 'Your' : `${name}'s`;
}

function verbAgree(name: string, singular: string, plural: string): string {
  return name === 'You' ? `You ${plural}` : `${name} ${singular}`;
}

function isProvisionalScore(score: number | undefined): boolean {
  return score === undefined || score === 0;
}

function provisionalNote(score: number | undefined): string {
  return isProvisionalScore(score) ? ' <em class="muted">(provisional)</em>' : '';
}

function esc(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

function scoreColor(score: number): string {
  if (score >= 70) return '#C4616E';
  if (score >= 45) return '#D4A843';
  return '#7294D4';
}

function bulletList(items: string[]): string {
  if (!items || !items.length) return '<p class="muted">None identified</p>';
  return `<ul class="clean-list">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

/* ── SVG generators ────────────────────────────────────── */

function generateFieldBarSVG(score: number, label: string, color: string): string {
  const barW = 280;
  const totalH = 36;
  const s = Math.max(0, Math.min(100, score));
  const fillW = (s / 100) * barW;
  return `<svg viewBox="0 0 ${barW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="14" width="${barW}" height="8" rx="4" fill="#E0D3CE"/>
    <rect x="0" y="14" width="${fillW}" height="8" rx="4" fill="${color}" opacity="0.6"/>
    <circle cx="${fillW}" cy="18" r="7" fill="${color}" stroke="white" stroke-width="1.5"/>
    <text x="${fillW}" y="21" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="8" font-weight="600" fill="white">${Math.round(s)}</text>
    <text x="0" y="10" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="9" fill="#6B5B5E" letter-spacing="0.5">${esc(label)}</text>
  </svg>`;
}

function generateDualRadarSVG(overlaps: RadarOverlap[], nameA: string, nameB: string): string {
  if (!overlaps || overlaps.length === 0) return '';
  const size = 340;
  const center = size / 2;
  const radius = size / 2 - 50;
  const n = overlaps.length;
  const step = (2 * Math.PI) / n;

  // Grid rings
  let grid = '';
  for (const level of [0.33, 0.66, 1.0]) {
    const pts: string[] = [];
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

  // Partner A polygon (rose)
  const ptsA: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * step;
    const r = radius * (overlaps[i].partnerAScore / 100);
    ptsA.push(`${(center + r * Math.cos(a)).toFixed(1)},${(center + r * Math.sin(a)).toFixed(1)}`);
  }

  // Partner B polygon (blue)
  const ptsB: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * step;
    const r = radius * (overlaps[i].partnerBScore / 100);
    ptsB.push(`${(center + r * Math.cos(a)).toFixed(1)},${(center + r * Math.sin(a)).toFixed(1)}`);
  }

  // Labels
  let labels = '';
  for (let i = 0; i < n; i++) {
    const ol = overlaps[i];
    const a = -Math.PI / 2 + i * step;
    const lx = center + (radius + 32) * Math.cos(a);
    const ly = center + (radius + 32) * Math.sin(a);
    const anchor = Math.cos(a) > 0.3 ? 'start' : Math.cos(a) < -0.3 ? 'end' : 'middle';
    labels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="central" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="9" fill="#6B5B5E" letter-spacing="0.3">${esc(ol.dimensionLabel)}</text>`;

    // Score dots for A
    const rA = radius * (ol.partnerAScore / 100);
    const bxA = center + rA * Math.cos(a);
    const byA = center + rA * Math.sin(a);
    labels += `<circle cx="${bxA.toFixed(1)}" cy="${byA.toFixed(1)}" r="4" fill="#C4616E"/>`;

    // Score dots for B
    const rB = radius * (ol.partnerBScore / 100);
    const bxB = center + rB * Math.cos(a);
    const byB = center + rB * Math.sin(a);
    labels += `<circle cx="${bxB.toFixed(1)}" cy="${byB.toFixed(1)}" r="4" fill="#7294D4"/>`;
  }

  // Legend
  const legendY = size - 10;
  const legend = `
    <circle cx="${center - 60}" cy="${legendY}" r="5" fill="#C4616E" opacity="0.7"/>
    <text x="${center - 50}" y="${legendY + 4}" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="9" fill="#6B5B5E">${esc(nameA)}</text>
    <circle cx="${center + 20}" cy="${legendY}" r="5" fill="#7294D4" opacity="0.7"/>
    <text x="${center + 30}" y="${legendY + 4}" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="9" fill="#6B5B5E">${esc(nameB)}</text>
  `;

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    ${grid}${axes}
    <polygon points="${ptsA.join(' ')}" fill="#C4616E" fill-opacity="0.12" stroke="#C4616E" stroke-width="1.5"/>
    <polygon points="${ptsB.join(' ')}" fill="#7294D4" fill-opacity="0.12" stroke="#7294D4" stroke-width="1.5"/>
    ${labels}
    ${legend}
  </svg>`;
}

function generateCombinedCycleSVG(cycle: CombinedCycle, nameA: string, nameB: string): string {
  const dynamicLabel = cycle.dynamic.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const posA = cycle.partnerAPosition;
  const posB = cycle.partnerBPosition;

  // Top arc label
  let topLabel = '';
  let bottomLabel = '';
  if (cycle.dynamic === 'pursue-withdraw') {
    topLabel = posA.toLowerCase().includes('pursu') ? `${nameA} pursues \u2192` : `${nameB} pursues \u2192`;
    bottomLabel = posA.toLowerCase().includes('withdraw') ? `\u2190 ${nameA} withdraws` : `\u2190 ${nameB} withdraws`;
  } else if (cycle.dynamic === 'mutual-pursuit') {
    topLabel = `${nameA} pursues \u2192`;
    bottomLabel = `\u2190 ${nameB} pursues`;
  } else if (cycle.dynamic === 'mutual-withdrawal') {
    topLabel = `${nameA} distances \u2192`;
    bottomLabel = `\u2190 ${nameB} distances`;
  } else {
    topLabel = `${nameA} moves \u2192`;
    bottomLabel = `\u2190 ${nameB} moves`;
  }

  return `<svg viewBox="0 0 380 160" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ccAR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#C4616E"/></marker>
      <marker id="ccAL" markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto"><path d="M6,0 L0,3 L6,6" fill="#7294D4"/></marker>
    </defs>
    <circle cx="70" cy="80" r="45" fill="#C4616E" opacity="0.1" stroke="#C4616E" stroke-width="1.5"/>
    <text x="70" y="68" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="7.5" fill="#9B8E91" letter-spacing="1">${esc(nameA.toUpperCase())}</text>
    <text x="70" y="86" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="11" font-weight="600" fill="#C4616E">${esc(posA)}</text>
    <circle cx="310" cy="80" r="45" fill="#7294D4" opacity="0.1" stroke="#7294D4" stroke-width="1.5"/>
    <text x="310" y="68" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="7.5" fill="#9B8E91" letter-spacing="1">${esc(nameB.toUpperCase())}</text>
    <text x="310" y="86" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="11" font-weight="600" fill="#7294D4">${esc(posB)}</text>
    <path d="M 120 60 Q 190 20 260 60" fill="none" stroke="#C4616E" stroke-width="1.5" marker-end="url(#ccAR)"/>
    <text x="190" y="30" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#C4616E">${esc(topLabel)}</text>
    <path d="M 260 100 Q 190 140 120 100" fill="none" stroke="#7294D4" stroke-width="1.5" marker-end="url(#ccAL)"/>
    <text x="190" y="138" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#7294D4">${esc(bottomLabel)}</text>
    <text x="190" y="82" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="18" fill="#9B8E91">\u21BB</text>
  </svg>`;
}

function generateAttachmentPlotSVG(dynamic: AttachmentDynamic, nameA: string, nameB: string): string {
  const size = 300;
  const pad = 50;
  const plotSize = size - pad * 2;

  // Map 0-100 scores to plot coordinates
  const axA = pad + (dynamic.partnerAAnxiety / 100) * plotSize;
  const ayA = pad + plotSize - (dynamic.partnerAAvoidance / 100) * plotSize;
  const axB = pad + (dynamic.partnerBAnxiety / 100) * plotSize;
  const ayB = pad + plotSize - (dynamic.partnerBAvoidance / 100) * plotSize;

  const midX = size / 2;
  const midY = size / 2;

  return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Background quadrants -->
    <rect x="${pad}" y="${pad}" width="${plotSize / 2}" height="${plotSize / 2}" fill="#6B9080" opacity="0.06"/>
    <rect x="${midX}" y="${pad}" width="${plotSize / 2}" height="${plotSize / 2}" fill="#D4A843" opacity="0.06"/>
    <rect x="${pad}" y="${midY}" width="${plotSize / 2}" height="${plotSize / 2}" fill="#7294D4" opacity="0.06"/>
    <rect x="${midX}" y="${midY}" width="${plotSize / 2}" height="${plotSize / 2}" fill="#C4616E" opacity="0.06"/>

    <!-- Axes -->
    <line x1="${pad}" y1="${midY}" x2="${pad + plotSize}" y2="${midY}" stroke="#E0D3CE" stroke-width="1"/>
    <line x1="${midX}" y1="${pad}" x2="${midX}" y2="${pad + plotSize}" stroke="#E0D3CE" stroke-width="1"/>

    <!-- Axis labels -->
    <text x="${midX}" y="${pad + plotSize + 16}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="9" fill="#6B5B5E" letter-spacing="0.5">ANXIETY \u2192</text>
    <text x="${pad - 8}" y="${midY}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="9" fill="#6B5B5E" letter-spacing="0.5" transform="rotate(-90 ${pad - 8} ${midY})">AVOIDANCE \u2192</text>

    <!-- Quadrant labels -->
    <text x="${pad + plotSize / 4}" y="${pad + 14}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="7.5" fill="#6B9080" letter-spacing="0.5">SECURE</text>
    <text x="${midX + plotSize / 4}" y="${pad + 14}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="7.5" fill="#D4A843" letter-spacing="0.5">PREOCCUPIED</text>
    <text x="${pad + plotSize / 4}" y="${pad + plotSize - 6}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="7.5" fill="#7294D4" letter-spacing="0.5">DISMISSIVE</text>
    <text x="${midX + plotSize / 4}" y="${pad + plotSize - 6}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="7.5" fill="#C4616E" letter-spacing="0.5">FEARFUL</text>

    <!-- Connection line -->
    <line x1="${axA}" y1="${ayA}" x2="${axB}" y2="${ayB}" stroke="#9B8E91" stroke-width="1" stroke-dasharray="4,3"/>

    <!-- Partner A dot -->
    <circle cx="${axA}" cy="${ayA}" r="10" fill="#C4616E" opacity="0.85"/>
    <text x="${axA}" y="${ayA + 3.5}" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="8" font-weight="600" fill="white">A</text>
    <text x="${axA}" y="${ayA - 16}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#C4616E">${esc(nameA)}</text>

    <!-- Partner B dot -->
    <circle cx="${axB}" cy="${ayB}" r="10" fill="#7294D4" opacity="0.85"/>
    <text x="${axB}" y="${ayB + 3.5}" text-anchor="middle" font-family="Jost, Poppins, Liberation Sans, sans-serif" font-size="8" font-weight="600" fill="white">B</text>
    <text x="${axB}" y="${ayB - 16}" text-anchor="middle" font-family="Josefin Sans, Poppins, Liberation Sans, sans-serif" font-size="8" fill="#7294D4">${esc(nameB)}</text>
  </svg>`;
}

/* ── main template ──────────────────────────────────────── */

export function generateCouplePortraitHTML(
  portrait: DeepCouplePortrait,
  partnerAName?: string,
  partnerBName?: string,
  rawScores?: { partner1: Record<string, any>; partner2: Record<string, any> },
): string {
  const nameA = partnerAName || portrait.partnerAName || 'Partner A';
  const nameB = partnerBName || portrait.partnerBName || 'Partner B';
  const date = new Date(portrait.generatedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const field = portrait.relationalField;
  const cycle = portrait.patternInterlock.combinedCycle;
  const attachment = portrait.patternInterlock.attachmentDynamic;
  const conv = portrait.convergenceDivergence;
  const edges = portrait.coupleGrowthEdges;
  const dyadic = portrait.dyadicInsights;
  const narr = portrait.narrative;
  const anchors = portrait.coupleAnchors;

  /* ── Section: Relational Field ── */

  const fieldHTML = `
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">THE RELATIONAL FIELD</p>
      <div class="section-title">The Space Between You</div>
      <p style="font-style:italic;color:var(--text-secondary);font-size:10pt;margin-bottom:16px">${esc(field.qualitativeLabel)}</p>

      <div class="card">
        ${isProvisionalScore(field.resonance) && isProvisionalScore(field.direction) && isProvisionalScore(field.vitality)
          ? '<p class="muted" style="font-size:9pt;margin-bottom:8px">Field data is still being collected. Scores below are provisional and will update as you complete the Space Between assessment.</p>'
          : ''}
        <div style="margin-bottom:12px">
          ${generateFieldBarSVG(field.resonance, 'Resonance' + (isProvisionalScore(field.resonance) ? ' (provisional)' : ''), '#C4616E')}
        </div>
        <div style="margin-bottom:12px">
          ${generateFieldBarSVG(field.direction, 'Direction' + (isProvisionalScore(field.direction) ? ' (provisional)' : ''), '#D4A843')}
        </div>
        <div style="margin-bottom:4px">
          ${generateFieldBarSVG(field.vitality, 'Vitality' + (isProvisionalScore(field.vitality) ? ' (provisional)' : ''), '#6B9080')}
        </div>
      </div>

      <div class="insight-callout">${esc(field.fieldNarrative)}</div>

      ${field.bottleneck ? `
      <div class="card card-gold">
        <div class="card-title">Current Bottleneck</div>
        <p class="section-label">${esc(field.bottleneckLabel)}</p>
        <p>${esc(field.bottleneck)}</p>
      </div>` : ''}

      ${field.movement ? `
      <div class="card card-sage">
        <div class="card-title">Movement</div>
        <p>${esc(field.movement)}</p>
      </div>` : ''}
    </div>`;

  /* ── Section: Your Dance (Combined Cycle) ── */

  const cycleSVG = generateCombinedCycleSVG(cycle, nameA, nameB);

  const triggerCascadeHTML = cycle.triggerCascade && cycle.triggerCascade.length > 0
    ? cycle.triggerCascade.map((t, i) => `
      <div class="card" style="margin-bottom:10px;page-break-inside:avoid">
        <p class="section-label">STAGE ${i + 1}: ${esc(t.stage.toUpperCase().replace(/_/g, ' '))}</p>
        <div class="two-col" style="margin-top:6px">
          <div>
            <p style="font-size:9pt;color:var(--rose);font-weight:500;margin-bottom:2px">${esc(nameA)}</p>
            <p style="font-size:9.5pt;margin-bottom:2px"><strong>Does:</strong> ${esc(t.partnerA.action)}</p>
            <p style="font-size:9.5pt;font-style:italic;color:var(--text-secondary)">Feels: ${esc(t.partnerA.internal)}</p>
          </div>
          <div>
            <p style="font-size:9pt;color:var(--blue);font-weight:500;margin-bottom:2px">${esc(nameB)}</p>
            <p style="font-size:9.5pt;margin-bottom:2px"><strong>Does:</strong> ${esc(t.partnerB.action)}</p>
            <p style="font-size:9.5pt;font-style:italic;color:var(--text-secondary)">Feels: ${esc(t.partnerB.internal)}</p>
          </div>
        </div>
        ${t.fieldState ? `<p style="font-size:8.5pt;color:var(--text-muted);margin-top:6px;margin-bottom:0">Field: ${esc(t.fieldState)}</p>` : ''}
      </div>`).join('')
    : '';

  const exitPointsHTML = cycle.exitPoints && cycle.exitPoints.length > 0
    ? cycle.exitPoints.map((ep) => `
      <div class="card card-sage" style="margin-bottom:10px;page-break-inside:avoid">
        <p class="section-label">EXIT POINT ${ep.number} \u2014 ${esc(ep.stage.toUpperCase())}</p>
        <div class="two-col" style="margin-top:6px">
          <div>
            <p style="font-size:9pt;color:var(--rose);font-weight:500">${esc(nameA)}</p>
            <p style="font-size:9.5pt">${esc(ep.forPartnerA)}</p>
          </div>
          <div>
            <p style="font-size:9pt;color:var(--blue);font-weight:500">${esc(nameB)}</p>
            <p style="font-size:9.5pt">${esc(ep.forPartnerB)}</p>
          </div>
        </div>
        <p style="font-size:9.5pt;margin-top:6px"><strong>Together:</strong> ${esc(ep.forBoth)}</p>
        ${ep.modality ? `<p style="font-size:8.5pt;color:var(--text-muted);margin-bottom:0">Modality: ${esc(ep.modality)}</p>` : ''}
      </div>`).join('')
    : '';

  const repairPathwayHTML = cycle.repairPathway && cycle.repairPathway.length > 0
    ? `<div class="card">
        <div class="card-title">Repair Pathway</div>
        <ol style="padding-left:20px;font-size:9.5pt;line-height:1.7">
          ${cycle.repairPathway.map((r) => {
            const whoLabel = r.who === 'both' ? 'Both' : r.who === 'partnerA' ? nameA : nameB;
            return `<li style="margin-bottom:4px"><span style="color:var(--text-muted);font-size:8pt">[${esc(whoLabel)}]</span> ${esc(r.action)}</li>`;
          }).join('')}
        </ol>
      </div>`
    : '';

  const danceHTML = `
    <div class="page-break"></div>
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">PATTERN INTERLOCK</p>
      <div class="section-title">Your Dance</div>
      <div class="cycle-container">${cycleSVG}</div>
      <div class="insight-callout">${esc(cycle.interlockDescription)}</div>

      ${triggerCascadeHTML ? `
      <p class="section-label" style="margin-top:20px">TRIGGER CASCADE</p>
      ${triggerCascadeHTML}` : ''}

      ${exitPointsHTML ? `
      <p class="section-label" style="margin-top:20px">EXIT POINTS</p>
      ${exitPointsHTML}` : ''}

      ${repairPathwayHTML}

      ${cycle.strengthInThisDynamic ? `
      <div class="insight-callout" style="border-left-color:var(--sage)">
        <p class="section-label" style="margin-bottom:4px">STRENGTH IN THIS DYNAMIC</p>
        ${esc(cycle.strengthInThisDynamic)}
      </div>` : ''}
    </div>`;

  /* ── Section: Attachment Dynamic ── */

  const attachmentSVG = generateAttachmentPlotSVG(attachment, nameA, nameB);

  const attachmentHTML = `
    <div class="page-break"></div>
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">ATTACHMENT DYNAMIC</p>
      <div class="section-title">${esc(attachment.dynamicLabel)}</div>
      <div class="insight-callout">${esc(attachment.narrative)}</div>

      <div style="text-align:center;margin:16px auto">
        <div style="display:inline-block;width:300px">${attachmentSVG}</div>
      </div>

      <div class="two-col">
        <div class="card card-rose">
          <div class="card-title">${esc(nameA)}</div>
          <p><strong>Quadrant:</strong> ${esc(attachment.partnerAQuadrant)}</p>
          <p style="font-size:9pt;color:var(--text-muted)">Anxiety: ${Math.round(attachment.partnerAAnxiety)} / Avoidance: ${Math.round(attachment.partnerAAvoidance)}</p>
        </div>
        <div class="card card-blue">
          <div class="card-title">${esc(nameB)}</div>
          <p><strong>Quadrant:</strong> ${esc(attachment.partnerBQuadrant)}</p>
          <p style="font-size:9pt;color:var(--text-muted)">Anxiety: ${Math.round(attachment.partnerBAnxiety)} / Avoidance: ${Math.round(attachment.partnerBAvoidance)}</p>
        </div>
      </div>

      ${attachment.growthDirection ? `
      <div class="card card-sage">
        <div class="card-title">Growth Direction</div>
        <p>${esc(attachment.growthDirection)}</p>
      </div>` : ''}

      ${attachment.whatThisMeansForRepair ? `
      <div class="card card-gold">
        <div class="card-title">What This Means for Repair</div>
        <p>${esc(attachment.whatThisMeansForRepair)}</p>
      </div>` : ''}
    </div>`;

  /* ── Section: Convergence & Divergence ── */

  const radarSVG = generateDualRadarSVG(conv.radarOverlap, nameA, nameB);

  const sharedStrengthsHTML = conv.sharedStrengths && conv.sharedStrengths.length > 0
    ? conv.sharedStrengths.map((s) => `
      <div class="card card-sage" style="margin-bottom:10px;page-break-inside:avoid">
        <div class="card-title">${esc(s.dimensionLabel)}</div>
        <p style="font-size:9pt;color:var(--text-muted);margin-bottom:4px">${esc(nameA)}: ${Math.round(s.scoreA)} / ${esc(nameB)}: ${Math.round(s.scoreB)}</p>
        <p>${esc(s.narrative)}</p>
        ${s.practiceToDeepen ? `<p style="font-size:9.5pt;color:var(--sage);margin-bottom:0"><strong>Practice:</strong> ${esc(s.practiceToDeepen)}</p>` : ''}
      </div>`).join('')
    : '';

  const complementaryHTML = conv.complementaryGifts && conv.complementaryGifts.length > 0
    ? conv.complementaryGifts.map((c) => {
        // Cross-check stronger partner against radar overlap scores
        let strongerName = c.strongerPartner === 'A' ? nameA : nameB;
        const radarMatch = conv.radarOverlap?.find(r => r.dimensionLabel === c.dimensionLabel);
        if (radarMatch) {
          // Use actual scores to determine who is stronger
          strongerName = radarMatch.partnerAScore >= radarMatch.partnerBScore ? nameA : nameB;
        }
        const scoreA = radarMatch ? Math.round(radarMatch.partnerAScore) : '';
        const scoreB = radarMatch ? Math.round(radarMatch.partnerBScore) : '';
        const scoreDisplay = radarMatch ? ` (${esc(nameA)}: ${scoreA} / ${esc(nameB)}: ${scoreB})` : '';
        return `
      <div class="card card-gold" style="margin-bottom:10px;page-break-inside:avoid">
        <div class="card-title">${esc(c.dimensionLabel)}</div>
        <p style="font-size:9pt;color:var(--text-muted);margin-bottom:4px">Stronger: ${esc(strongerName)} (gap: ${Math.round(c.gap)})${scoreDisplay}</p>
        <p><strong>Gift:</strong> ${esc(c.giftNarrative)}</p>
        <p><strong>Risk:</strong> ${esc(c.riskNarrative)}</p>
        ${c.growthOpportunity ? `<p style="font-size:9.5pt;color:var(--gold);margin-bottom:0"><strong>Growth:</strong> ${esc(c.growthOpportunity)}</p>` : ''}
      </div>`;
      }).join('')
    : '';

  const frictionHTML = conv.frictionZones && conv.frictionZones.length > 0
    ? conv.frictionZones.map((f) => `
      <div class="card card-rose" style="margin-bottom:10px;page-break-inside:avoid">
        <div class="card-title">${esc(f.area)}</div>
        <div class="two-col" style="margin-bottom:8px">
          <div>
            <p style="font-size:9pt;color:var(--rose);font-weight:500">${possessive(esc(nameA))} pull</p>
            <p style="font-size:9.5pt">${esc(f.partnerAPull)}</p>
          </div>
          <div>
            <p style="font-size:9pt;color:var(--blue);font-weight:500">${possessive(esc(nameB))} pull</p>
            <p style="font-size:9.5pt">${esc(f.partnerBPull)}</p>
          </div>
        </div>
        <p><strong>What happens:</strong> ${esc(f.whatHappens)}</p>
        <p style="font-style:italic;color:var(--text-secondary)">Underneath: ${esc(f.underneathIt)}</p>
        ${f.practiceForBoth ? `<p style="font-size:9.5pt;color:var(--sage);margin-bottom:0"><strong>Practice:</strong> ${esc(f.practiceForBoth)}</p>` : ''}
      </div>`).join('')
    : '';

  const valuesTensionsHTML = conv.valuesTensions && conv.valuesTensions.length > 0
    ? conv.valuesTensions.map((v) => `
      <div class="card" style="margin-bottom:10px;page-break-inside:avoid">
        <div class="card-title">${esc(v.valueA)} <span style="color:var(--text-muted);font-weight:300">\u2194</span> ${esc(v.valueB)}</div>
        <p>${esc(v.description)}</p>
        ${v.integrationPractice ? `<p style="font-size:9.5pt;color:var(--sage);margin-bottom:0"><strong>Integration:</strong> ${esc(v.integrationPractice)}</p>` : ''}
      </div>`).join('')
    : '';

  // Radar overlap dimension insights (gap interpretation per dimension)
  const radarInsightsHTML = conv.radarOverlap && conv.radarOverlap.length > 0
    ? conv.radarOverlap.map((ol) => {
        const gapColor = ol.gapInterpretation === 'aligned' ? 'var(--sage)' :
          ol.gapInterpretation === 'complementary' ? 'var(--gold)' :
          ol.gapInterpretation === 'tension' ? 'var(--rose)' : 'var(--rose)';
        const gapLabel = ol.gapInterpretation === 'aligned' ? 'Aligned' :
          ol.gapInterpretation === 'complementary' ? 'Complementary' :
          ol.gapInterpretation === 'tension' ? 'Tension' : 'Significant Gap';
        return `
        <div class="score-gap-row" style="break-inside:avoid;page-break-inside:avoid;margin-bottom:14px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">
            <span style="font-family:'Jost',Poppins,'Liberation Sans',sans-serif;font-weight:500;font-size:10pt">${esc(ol.dimensionLabel)}</span>
            <span style="font-size:8pt;color:${gapColor};letter-spacing:0.5px;text-transform:uppercase">${esc(gapLabel)}</span>
          </div>
          <div style="display:flex;gap:10px;align-items:center;margin-bottom:6px">
            <span style="font-size:9pt;color:var(--rose)">${esc(nameA)}: <strong>${Math.round(ol.partnerAScore)}</strong></span>
            <span style="flex:1;height:1px;background:var(--border-light)"></span>
            <span style="font-size:9pt;color:var(--blue)">${esc(nameB)}: <strong>${Math.round(ol.partnerBScore)}</strong></span>
          </div>
          ${ol.insight ? `<p style="font-size:9pt;color:var(--text-secondary);font-style:italic;margin:0">${esc(ol.insight)}</p>` : ''}
        </div>`;
      }).join('')
    : '';

  const convergenceHTML = `
    <div class="page-break"></div>
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">CONVERGENCE &amp; DIVERGENCE</p>
      <div class="section-title">Together</div>

      ${radarSVG ? `
      <div class="radar-container">${radarSVG}</div>
      <p style="text-align:center;font-size:9pt;color:var(--text-muted);margin-top:4px;margin-bottom:16px">
        <span style="color:#C4616E">\u25CF</span> ${esc(nameA)} &nbsp; <span style="color:#7294D4">\u25CF</span> ${esc(nameB)}
      </p>` : ''}

      ${radarInsightsHTML ? `
      <div class="card card-muted" style="break-inside:avoid;page-break-inside:avoid">
        <div class="card-title">Dimension by Dimension</div>
        ${radarInsightsHTML}
      </div>` : ''}

      ${sharedStrengthsHTML ? `
      <p class="section-label" style="margin-top:20px">SHARED STRENGTHS</p>
      ${sharedStrengthsHTML}` : ''}

      ${complementaryHTML ? `
      <p class="section-label" style="margin-top:20px">COMPLEMENTARY GIFTS</p>
      ${complementaryHTML}` : ''}

      ${frictionHTML ? `
      <p class="section-label" style="margin-top:20px">FRICTION ZONES</p>
      ${frictionHTML}` : ''}

      ${valuesTensionsHTML ? `
      <p class="section-label" style="margin-top:20px">VALUES TENSIONS</p>
      ${valuesTensionsHTML}` : ''}
    </div>`;

  /* ── Section: Dyadic Insights ── */

  const satisfactionHTML = dyadic.satisfaction
    ? `<div class="card card-rose" style="page-break-inside:avoid">
        <div class="card-title">Relationship Satisfaction</div>
        ${scoreBar('RDAS Score', dyadic.satisfaction.total, '#C4616E')}
        <p style="margin-top:8px">${esc(dyadic.satisfaction.narrative)}</p>
      </div>`
    : '';

  const closenessHTML = dyadic.closeness
    ? `<div class="card card-blue" style="page-break-inside:avoid">
        <div class="card-title">Closeness</div>
        ${scoreBar('CSI-16 Score', dyadic.closeness.total, '#7294D4')}
        <p style="margin-top:8px">${esc(dyadic.closeness.narrative)}</p>
      </div>`
    : '';

  const copingHTML = dyadic.coping
    ? `<div class="card card-sage" style="page-break-inside:avoid">
        <div class="card-title">Dyadic Coping</div>
        <p>${esc(dyadic.coping.narrative)}</p>
      </div>`
    : '';

  const discrepancyHTML = dyadic.discrepancies && dyadic.discrepancies.length > 0
    ? dyadic.discrepancies.map((d) => {
        const typeColor = d.type === 'blind_spot' ? 'var(--rose)' :
          d.type === 'hidden_strength' ? 'var(--sage)' :
          d.type === 'perception_gap' ? 'var(--gold)' : 'var(--blue)';
        const typeLabel = d.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        return `
      <div class="card" style="border-left:3px solid ${typeColor};margin-bottom:10px;page-break-inside:avoid">
        <p class="section-label" style="color:${typeColor}">${esc(typeLabel)}</p>
        <div class="card-title">${esc(d.title)}</div>
        <p>${esc(d.description)}</p>
        <p><strong>What it means:</strong> ${esc(d.whatItMeans)}</p>
        <p style="font-style:italic;color:var(--text-secondary);margin-bottom:0">${esc(d.explorationQuestion)}</p>
      </div>`;
      }).join('')
    : '';

  const dyadicHTML = (satisfactionHTML || closenessHTML || copingHTML || discrepancyHTML) ? `
    <div class="page-break"></div>
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">DYADIC INSIGHTS</p>
      <div class="section-title">What the Assessments Reveal</div>
      ${satisfactionHTML}
      ${closenessHTML}
      ${copingHTML}
      ${discrepancyHTML ? `
      <p class="section-label" style="margin-top:20px">DISCREPANCIES &amp; DISCOVERIES</p>
      ${discrepancyHTML}` : ''}
    </div>` : '';

  /* ── Section: Growth Edges ── */

  const edgesHTML = edges && edges.length > 0
    ? edges.map((edge, i) => {
        const confidenceColor = edge.confidenceLevel === 'Strong' ? 'var(--sage)' :
          edge.confidenceLevel === 'Supported' ? 'var(--gold)' : 'var(--text-muted)';
        return `
      <div class="growth-edge-card">
        <div class="growth-edge-number">${i + 1}</div>
        <div class="growth-edge-content">
          <p class="section-label">GROWTH EDGE ${i + 1} <span style="color:${confidenceColor};margin-left:8px">${esc(edge.confidenceLevel)}</span></p>
          <h3 class="growth-edge-title">${esc(edge.title)}</h3>
          <p>${esc(edge.whatItIs)}</p>
          <div class="insight-callout">${esc(edge.whyItMatters)}</div>

          <div class="two-col" style="margin-top:8px">
            <div>
              <p class="guidance-header">What It Protects</p>
              <p style="font-size:9.5pt">${esc(edge.whatItProtects)}</p>
            </div>
            <div>
              <p class="guidance-header">What It Costs</p>
              <p style="font-size:9.5pt">${esc(edge.whatItCosts)}</p>
            </div>
          </div>

          <div class="card card-muted" style="margin-top:10px">
            <p class="guidance-header" style="margin-top:0">The Invitation</p>
            <p style="font-size:9.5pt">${esc(edge.theInvitation)}</p>
          </div>

          <div class="two-col" style="margin-top:8px">
            <div class="card card-rose" style="margin-bottom:0">
              <p style="font-size:9pt;color:var(--rose);font-weight:500;margin-bottom:2px">${possessive(esc(nameA))} Part</p>
              <p style="font-size:9.5pt;margin-bottom:0">${esc(edge.partnerAPart)}</p>
            </div>
            <div class="card card-blue" style="margin-bottom:0">
              <p style="font-size:9pt;color:var(--blue);font-weight:500;margin-bottom:2px">${possessive(esc(nameB))} Part</p>
              <p style="font-size:9.5pt;margin-bottom:0">${esc(edge.partnerBPart)}</p>
            </div>
          </div>

          ${edge.practiceForBoth ? `
          <div class="card card-sage" style="margin-top:10px;margin-bottom:0">
            <p class="guidance-header" style="margin-top:0">Practice for Both</p>
            <p style="font-size:9.5pt;margin-bottom:0">${esc(edge.practiceForBoth)}</p>
          </div>` : ''}

          ${edge.relatedDyadicData ? `
          <p style="font-size:8.5pt;color:var(--text-muted);margin-top:6px;margin-bottom:0">Data source: ${esc(edge.relatedDyadicData)}</p>` : ''}
        </div>
      </div>`;
      }).join('')
    : '';

  const growthEdgesHTML = edgesHTML ? `
    <div class="page-break"></div>
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">YOUR GROWTH PATH</p>
      <div class="section-title">Couple Growth Edges</div>
      ${edgesHTML}
    </div>` : '';

  /* ── Section: Your Story (Narrative) ── */

  const narrativeHTML = `
    <div class="page-break"></div>
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">YOUR STORY</p>
      <div class="section-title">A Portrait in Words</div>

      ${narr.opening ? `
      <div class="narrative-opening" style="break-inside:avoid;page-break-inside:avoid">
        <p style="font-family:'Playfair Display',Lora,Georgia,serif;font-style:italic;font-size:11.5pt;color:var(--text-secondary);line-height:1.9;margin-bottom:0">${esc(narr.opening)}</p>
      </div>` : ''}

      ${narr.theField ? `
      <div class="card card-muted" style="break-inside:avoid;page-break-inside:avoid;margin-top:16px">
        <p class="section-label" style="margin-bottom:6px">THE FIELD</p>
        <p style="margin-bottom:0">${esc(narr.theField)}</p>
      </div>` : ''}

      ${narr.theDance ? `
      <div class="card" style="break-inside:avoid;page-break-inside:avoid">
        <p class="section-label" style="margin-bottom:6px">THE DANCE</p>
        <p style="margin-bottom:0">${esc(narr.theDance)}</p>
      </div>` : ''}

      ${narr.whatYouBring ? `
      <div class="card card-rose" style="break-inside:avoid;page-break-inside:avoid">
        <p class="section-label" style="margin-bottom:6px">WHAT YOU BRING</p>
        <p style="margin-bottom:0">${esc(narr.whatYouBring)}</p>
      </div>` : ''}

      ${narr.whereYouMeet ? `
      <div class="card card-sage" style="break-inside:avoid;page-break-inside:avoid">
        <p class="section-label" style="margin-bottom:6px">WHERE YOU MEET</p>
        <p style="margin-bottom:0">${esc(narr.whereYouMeet)}</p>
      </div>` : ''}

      ${narr.whereYouDiverge ? `
      <div class="card card-gold" style="break-inside:avoid;page-break-inside:avoid">
        <p class="section-label" style="margin-bottom:6px">WHERE YOU DIVERGE</p>
        <p style="margin-bottom:0">${esc(narr.whereYouDiverge)}</p>
      </div>` : ''}

      ${narr.theEdge ? `
      <div class="card card-blue" style="break-inside:avoid;page-break-inside:avoid">
        <p class="section-label" style="margin-bottom:6px">THE EDGE</p>
        <p style="margin-bottom:0">${esc(narr.theEdge)}</p>
      </div>` : ''}

      ${narr.closing ? `
      <div class="insight-callout" style="margin-top:20px;break-inside:avoid;page-break-inside:avoid">${esc(narr.closing)}</div>` : ''}
    </div>`;

  /* ── Section: Couple Anchors ── */

  const anchorItems = (items: { text: string; context?: string }[]) => {
    if (!items || items.length === 0) return '<p class="muted">None identified</p>';
    return `<ul class="clean-list">${items.map((item) =>
      `<li>${esc(item.text)}${item.context ? `<br/><span style="font-size:8.5pt;color:var(--text-muted)">${esc(item.context)}</span>` : ''}</li>`
    ).join('')}</ul>`;
  };

  const anchorsHTML = `
    <div class="page-break"></div>
    <div class="section">
      <div class="section-divider"></div>
      <p class="section-label">YOUR ANCHORS</p>
      <div class="section-title">When You Need Grounding</div>

      <div class="anchor-section">
        <div class="anchor-header">
          <div class="anchor-icon activated">\u21BB</div>
          <h3>When in the Cycle</h3>
        </div>
        ${anchorItems(anchors.whenInTheCycle)}
      </div>

      <div class="anchor-section">
        <div class="anchor-header">
          <div class="anchor-icon activated">\u2606</div>
          <h3>For ${esc(nameA)}</h3>
        </div>
        ${anchorItems(anchors.forPartnerA)}
      </div>

      <div class="anchor-section">
        <div class="anchor-header">
          <div class="anchor-icon shutdown">\u2606</div>
          <h3>For ${esc(nameB)}</h3>
        </div>
        ${anchorItems(anchors.forPartnerB)}
      </div>

      <div class="anchor-section">
        <div class="anchor-header">
          <div class="anchor-icon repair">&hearts;</div>
          <h3>Shared Truths</h3>
        </div>
        ${anchorItems(anchors.sharedTruths)}
      </div>

      ${anchors.repairStarters && anchors.repairStarters.length > 0 ? `
      <div class="anchor-section">
        <div class="anchor-header">
          <div class="anchor-icon interrupt">\u2192</div>
          <h3>Repair Starters</h3>
        </div>
        <div class="say-box">
          ${anchors.repairStarters.map((s) => `<p>"${esc(s)}"</p>`).join('')}
        </div>
      </div>` : ''}
    </div>`;

  // ── Cross-Domain Integration Patterns (per partner + couple dynamics) ──
  const coupleIntegrationHTML = (() => {
    if (!rawScores) return '';
    try {
      const lensLabels: Record<string, string> = {
        therapeutic: '◇ Therapeutic',
        soulful: '◆ Soulful',
        practical: '▸ Practical',
        developmental: '○ Developmental',
        relational: '❦ Relational',
        simple: '· Simple',
      };

      const renderIntegrationPattern = (r: IntegrationResult): string => {
        const lensesHTML = r.lenses ? (['therapeutic', 'soulful', 'practical', 'developmental', 'relational', 'simple'] as LensType[]).map((lens) => {
          const text = r.lenses![lens];
          if (!text) return '';
          return `
            <div style="margin-bottom:8px;padding:8px 10px;background:#FDFBF9;border-left:3px solid var(--rose-light);break-inside:avoid;page-break-inside:avoid">
              <p style="font-family:'Josefin Sans',sans-serif;font-size:7.5pt;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);margin:0 0 3px 0">${lensLabels[lens] || lens}</p>
              <p style="font-size:9pt;line-height:1.5;color:var(--text);margin:0">${esc(text)}</p>
            </div>`;
        }).join('') : '';

        const practiceHTML = r.matchedPractice ? `
          <div class="card card-sage" style="margin-top:6px;break-inside:avoid">
            <div class="card-title">Practice: ${esc(r.matchedPractice.name)}</div>
            <p style="font-size:9pt;line-height:1.4">${esc(r.matchedPractice.instruction)}</p>
            <p style="font-size:8pt;font-style:italic;color:var(--text-muted);margin-top:3px">${esc(r.matchedPractice.whyThisOne)}</p>
            <p style="font-size:7.5pt;color:var(--sage);margin-top:3px">Frequency: ${esc(r.matchedPractice.frequency)}</p>
          </div>` : '';

        return `
          <div style="margin-bottom:20px;break-inside:avoid-page">
            <div style="border-bottom:1px solid var(--border);padding-bottom:4px;margin-bottom:10px">
              <p style="font-family:'Playfair Display',Georgia,serif;font-size:13pt;color:var(--primary);margin:0">${esc(r.title)}</p>
              <p style="font-size:8.5pt;color:var(--text-muted);margin:2px 0 0">${esc(r.subtitle)}</p>
            </div>
            ${r.invitation ? `<div style="text-align:center;margin:8px 0;padding:10px;background:linear-gradient(135deg,#FAF5F0,#F5EDE8);border-radius:8px"><p style="font-family:'Playfair Display',Georgia,serif;font-size:11pt;font-style:italic;color:var(--rose);margin:0">"${esc(r.invitation)}"</p></div>` : ''}
            ${lensesHTML}
            ${practiceHTML}
          </div>`;
      };

      const sections: string[] = [];

      // Individual integration patterns for each partner
      const partnerScores = [
        { name: nameA, scores: rawScores.partner1 },
        { name: nameB, scores: rawScores.partner2 },
      ];

      for (const partner of partnerScores) {
        if (!partner.scores) continue;
        const intScores = toIntegrationScores(partner.scores);
        const available = getAvailableDomains(intScores);
        if (available.length < 2) continue;

        const results: IntegrationResult[] = [];
        for (let i = 0; i < available.length; i++) {
          for (let j = i + 1; j < available.length; j++) {
            const r = generateIntegration([available[i], available[j]], intScores);
            if (r && r.lenses) results.push(r);
          }
        }

        if (results.length > 0) {
          const top = results
            .sort((a, b) => {
              const conf = { high: 3, emerging: 2, low: 1 };
              return (conf[b.confidence] || 1) - (conf[a.confidence] || 1);
            })
            .slice(0, 3);

          sections.push(`
            <div style="margin-bottom:20px">
              <p style="font-family:'Josefin Sans',sans-serif;font-size:9pt;letter-spacing:2px;text-transform:uppercase;color:var(--rose);margin-bottom:12px">${possessive(esc(partner.name))} Patterns</p>
              ${top.map(renderIntegrationPattern).join('')}
            </div>`);
        }
      }

      // Tier 3 couple dynamics
      const aPartnerScores = {
        ecrr: rawScores.partner1?.['ecr-r']?.scores,
        dutch: rawScores.partner1?.['dutch']?.scores,
        values: rawScores.partner1?.['values']?.scores,
        dsir: rawScores.partner1?.['dsi-r']?.scores,
      };
      const bPartnerScores = {
        ecrr: rawScores.partner2?.['ecr-r']?.scores,
        dutch: rawScores.partner2?.['dutch']?.scores,
        values: rawScores.partner2?.['values']?.scores,
        dsir: rawScores.partner2?.['dsi-r']?.scores,
      };

      const dynamics = [
        routeAttachmentDynamic(aPartnerScores, bPartnerScores),
        routeConflictDynamic(aPartnerScores, bPartnerScores),
        routeValuesDynamic(aPartnerScores, bPartnerScores),
      ].filter(Boolean);

      if (dynamics.length > 0) {
        const dynamicsHTML = dynamics.map((d) => {
          if (!d) return '';
          const entry = d.entry;
          const aName = d.swap ? nameB : nameA;
          const bName = d.swap ? nameA : nameB;

          const lensesHTML = (['therapeutic', 'soulful', 'practical', 'simple'] as const).map((lens) => {
            const text = interpolateCouple(entry.lenses[lens], aName, bName, d.extras);
            return `
              <div style="margin-bottom:8px;padding:8px 10px;background:#FDFBF9;border-left:3px solid var(--rose-light);break-inside:avoid;page-break-inside:avoid">
                <p style="font-family:'Josefin Sans',sans-serif;font-size:7.5pt;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);margin:0 0 3px 0">${lensLabels[lens] || lens}</p>
                <p style="font-size:9pt;line-height:1.5;color:var(--text);margin:0">${esc(text)}</p>
              </div>`;
          }).join('');

          const practiceDesc = interpolateCouple(entry.couplePractice.description, aName, bName, d.extras);
          const practiceHTML = `
            <div class="card card-sage" style="margin-top:6px;break-inside:avoid">
              <div class="card-title">Couple Practice: ${esc(entry.couplePractice.name)}</div>
              <p style="font-size:9pt;line-height:1.4">${esc(practiceDesc)}</p>
              <p style="font-size:7.5pt;color:var(--sage);margin-top:3px">Frequency: ${esc(entry.couplePractice.frequency)}</p>
              ${entry.couplePractice.partnerATask ? `<p style="font-size:8.5pt;margin-top:4px"><strong>${esc(aName)}:</strong> ${esc(interpolateCouple(entry.couplePractice.partnerATask, aName, bName))}</p>` : ''}
              ${entry.couplePractice.partnerBTask ? `<p style="font-size:8.5pt;margin-top:2px"><strong>${esc(bName)}:</strong> ${esc(interpolateCouple(entry.couplePractice.partnerBTask, aName, bName))}</p>` : ''}
            </div>`;

          return `
            <div style="margin-bottom:20px;break-inside:avoid-page">
              <div style="border-bottom:1px solid var(--border);padding-bottom:4px;margin-bottom:10px">
                <p style="font-family:'Playfair Display',Georgia,serif;font-size:13pt;color:var(--primary);margin:0">${esc(entry.dynamicName)}</p>
              </div>
              ${entry.coupleInvitation ? `<div style="text-align:center;margin:8px 0;padding:10px;background:linear-gradient(135deg,#FAF5F0,#F5EDE8);border-radius:8px"><p style="font-family:'Playfair Display',Georgia,serif;font-size:11pt;font-style:italic;color:var(--rose);margin:0">"${esc(interpolateCouple(entry.coupleInvitation, aName, bName))}"</p></div>` : ''}
              ${lensesHTML}
              ${practiceHTML}
            </div>`;
        }).join('');

        sections.push(`
          <div style="margin-bottom:20px">
            <p style="font-family:'Josefin Sans',sans-serif;font-size:9pt;letter-spacing:2px;text-transform:uppercase;color:var(--rose);margin-bottom:12px">Your Couple Dynamics</p>
            ${dynamicsHTML}
          </div>`);
      }

      return sections.join('');
    } catch (err) {
      console.warn('[CouplePDF] Integration pattern generation failed:', err);
      return '';
    }
  })();

  /* ── Assemble full HTML ── */

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Your Couple Portrait \u2014 ${esc(nameA)} &amp; ${esc(nameB)}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500&display=swap');

/* ── RESET & BASE ─────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── PRINT FLOW — prevent cut words, orphaned lines, split sections ── */
p, li, blockquote, .insight-callout {
  orphans: 3;
  widows: 3;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;
}
h1, h2, h3, h4, .section-title, .section-label, .card-title {
  page-break-after: avoid;
  break-after: avoid;
}
.card, .anchor-section, .growth-edge-card, .score-row, .two-col, .say-box {
  break-inside: avoid;
  page-break-inside: avoid;
}
.section-divider {
  page-break-after: avoid;
  break-after: avoid;
  margin-bottom: 28px;
}
img, svg { max-width: 100%; }

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
  margin: 0.95in 1in;
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
  margin: 0.5in 1in;
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
  overflow-wrap: break-word;
  word-wrap: break-word;
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
.section { margin-bottom: 40px; }
.section-divider { width: 100%; height: 2px; background: var(--rose); margin: 40px 0 28px; page-break-after: avoid; break-after: avoid; }
.section-title {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-weight: 700; font-size: 18pt; color: var(--text);
  letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px;
  page-break-after: avoid; break-after: avoid;
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
  page-break-inside: avoid; break-inside: avoid;
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
  page-break-after: avoid; break-after: avoid;
}
.muted { color: var(--text-muted); font-style: italic; }

/* ── SCORE BARS ──────────────────────── */
.score-row {
  display: flex; align-items: center; margin-bottom: 8px; page-break-inside: avoid; break-inside: avoid;
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

/* ── RADAR ────────────────────────────── */
.radar-container { text-align: center; margin: 20px auto; }
.radar-container svg { width: 340px; max-width: 100%; display: block; margin: 0 auto; }

/* ── CYCLE DIAGRAM ───────────────────── */
.cycle-container { text-align: center; margin: 16px auto; }
.cycle-container svg { width: 380px; max-width: 100%; display: block; margin: 0 auto; }

/* ── TWO-COL ─────────────────────────── */
.two-col { display: flex; gap: 16px; }
.two-col > div { flex: 1; page-break-inside: avoid; break-inside: avoid; }

/* ── INSIGHT CALLOUT ─────────────────── */
.insight-callout {
  font-family: 'Playfair Display', Lora, Georgia, serif;
  font-style: italic; font-size: 10.5pt; color: var(--text-secondary);
  border-left: 3px solid var(--rose);
  padding: 14px 20px; margin: 14px 0;
  background: var(--bg-alt); border-radius: 0 6px 6px 0; line-height: 1.75;
}

/* ── GROWTH EDGES ────────────────────── */
.growth-edge-card {
  display: flex; gap: 16px; margin-bottom: 20px; page-break-inside: avoid; break-inside: avoid;
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
.anchor-section { margin-bottom: 28px; page-break-inside: avoid; break-inside: avoid; }
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
.anchor-subheader {
  font-family: 'Josefin Sans', Poppins, 'Liberation Sans', sans-serif;
  font-size: 8pt; letter-spacing: 2px; text-transform: uppercase;
  color: var(--text-muted); margin: 10px 0 4px;
}

/* ── SAY BOX ────────────────────────── */
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
  content: '\\00B7'; position: absolute; left: 0;
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

/* ── FIELD BAR ───────────────────────── */
.field-bar-container { margin-bottom: 12px; }
.field-bar-container svg { width: 100%; max-width: 280px; display: block; }

/* ── PRINT HELPERS ───────────────────── */
.page-break { page-break-before: always; break-before: page; }
.avoid-break { page-break-inside: avoid; break-inside: avoid; }

/* ── PRINT-SPECIFIC OVERRIDES ────────── */
@media print {
  .card, .anchor-section, .growth-edge-card {
    overflow: hidden;
  }
  .radar-container, .cycle-container, .field-bar-container {
    page-break-inside: avoid; break-inside: avoid;
  }
  .two-col {
    page-break-inside: auto; break-inside: auto;
  }
  .two-col > div {
    page-break-inside: avoid; break-inside: avoid;
  }
}
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <p class="cover-label">Your Couple Portrait</p>
  <div class="cover-line"></div>
  <h1>${esc(nameA)} &amp; ${esc(nameB)}</h1>
  <p class="cover-subtitle">The space between you -- mapped with care</p>
  <p class="cover-date">${esc(date)}</p>
  <div class="cover-line"></div>
  <p class="cover-footer">Tender \u00B7 The Science of Relationships</p>
</div>

<!-- RELATIONSHIP OVERVIEW -->
<div class="section">
  <div class="section-divider"></div>
  <p class="section-label">YOUR RELATIONSHIP IN 60 SECONDS</p>
  <div class="section-title">Overview</div>
  <div class="insight-callout" style="font-size:11pt;line-height:1.9">
    ${esc((() => {
      const parts: string[] = [];
      const dynamic = cycle.dynamic.replace(/-/g, ' ');
      parts.push(`Your relational dance is a ${dynamic} pattern \u2014 ${verbAgree(nameA, 'tends', 'tend')} to ${cycle.partnerAPosition}, while ${verbAgree(nameB, 'tends', 'tend')} to ${cycle.partnerBPosition}.`);
      parts.push(`In the attachment landscape, you\u2019re a ${attachment.dynamicLabel} pairing.`);
      if (conv.sharedStrengths.length > 0) {
        const top = conv.sharedStrengths.slice(0, 2).map(s => s.dimensionLabel).join(' and ');
        parts.push(`Your shared strengths include ${top}.`);
      }
      if (edges.length > 0) {
        parts.push(`Your top growth edge: ${edges[0].title}.`);
      }
      if (field?.vitality > 0) {
        const vLabel = field.qualitativeLabel || Math.round(field.vitality) + '%';
        parts.push(`Field vitality: ${vLabel}.`);
      }
      return parts.join(' ');
    })())}
  </div>

  ${conv.sharedStrengths.length > 0 ? `
  <div class="two-col" style="margin-top:16px">
    <div class="card card-sage">
      <div class="card-title">Shared Strengths</div>
      <p>${conv.sharedStrengths.slice(0, 3).map(s => esc(s.dimensionLabel)).join(', ')}</p>
    </div>
    ${conv.frictionZones.length > 0 ? `
    <div class="card card-rose">
      <div class="card-title">Friction Zones</div>
      <p>${conv.frictionZones.slice(0, 3).map(f => esc(f.area)).join(', ')}</p>
    </div>` : ''}
  </div>` : ''}

  ${narr.opening ? `<p style="font-family:'Playfair Display',Lora,Georgia,serif;font-style:italic;font-size:10.5pt;color:var(--text-secondary);line-height:1.8;margin-top:16px">${esc(narr.opening)}</p>` : ''}
</div>

<!-- RELATIONAL FIELD -->
${fieldHTML}

<!-- YOUR DANCE -->
${danceHTML}

<!-- ATTACHMENT DYNAMIC -->
${attachmentHTML}

<!-- CONVERGENCE & DIVERGENCE -->
${convergenceHTML}

<!-- DYADIC INSIGHTS -->
${dyadicHTML}

${coupleIntegrationHTML ? `
<!-- CROSS-DOMAIN PATTERNS — 6-LENS INTEGRATION ENGINE -->
<div class="page-break"></div>
<div class="section">
  <div class="section-divider"></div>
  <p class="section-label">CROSS-DOMAIN PATTERNS</p>
  <div class="section-title">What Emerges When Domains Meet</div>
  <p style="font-style:italic;color:var(--text-muted);font-size:9.5pt;margin-bottom:16px">Tender reads across all seven assessment domains to find the patterns that only emerge at the intersection — unique combinations visible only when the full picture is held together. Each pattern is seen through multiple lenses: therapeutic, soulful, practical, and more.</p>
  ${coupleIntegrationHTML}
</div>` : ''}

<!-- COUPLE GROWTH EDGES -->
${growthEdgesHTML}

<!-- YOUR STORY -->
${narrativeHTML}

<!-- COUPLE ANCHORS -->
${anchorsHTML}

<!-- CLOSING -->
<div class="closing">
  <div class="cover-line"></div>
  <p class="closing-text">This portrait is a map of the space between you -- not a verdict, but an invitation. Return to it when you feel stuck, read it aloud to each other when you are ready, and let it guide the work you do together.</p>
  <p class="closing-logo">Tender</p>
  <p class="closing-tagline">The Science of Relationships</p>
</div>

</body>
</html>`;
}
