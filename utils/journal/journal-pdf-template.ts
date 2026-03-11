/**
 * Journal PDF Template — Print-Ready HTML
 *
 * Generates a styled HTML document for journal entries,
 * matching the Wes Anderson / Tender aesthetic:
 *   - Warm parchment background
 *   - Jost headings, Josefin Sans body, Playfair Display accents
 *   - Organized by date with entry-type badges
 *
 * Consumed by pdf-export.ts → generateJournalPDF().
 */

import type { JournalEntry, JournalStats, DailyReflection } from '@/services/journal';

// ─── Helpers ──────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Map entry type to display label + color. */
function entryMeta(type: string): { label: string; color: string; bg: string } {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    checkin:        { label: 'Check-In',       color: '#6B7B9B', bg: '#E8ECF2' },
    exercise:       { label: 'Exercise',       color: '#4A6FA8', bg: '#E0E8F5' },
    practice:       { label: 'Practice',       color: '#6B9080', bg: '#E3EFE5' },
    chat:           { label: 'Sage Session',   color: '#5B6B8A', bg: '#E3E8F0' },
    assessment:     { label: 'Assessment',     color: '#D4A843', bg: '#FDF3E0' },
    xp:             { label: 'XP Earned',      color: '#D8A499', bg: '#FAEAE3' },
    minigame:       { label: 'Mini-Game',      color: '#8B6914', bg: '#FFF8E7' },
    step_milestone: { label: 'Milestone',      color: '#6B9080', bg: '#DFF0E0' },
    card_game:      { label: 'Card Game',      color: '#A84D59', bg: '#F4D5D0' },
    reflection:     { label: 'Reflection',     color: '#6B5B5E', bg: '#F0E6E0' },
    weare_checkin:  { label: 'Weekly Pulse',   color: '#4A6FA8', bg: '#C6CDF7' },
    course_lesson:  { label: 'Course',         color: '#6B5B8A', bg: '#E8E0F0' },
  };
  return map[type] ?? { label: type, color: '#6B5B5E', bg: '#F0E6E0' };
}

// ─── Group by Date ───────────────────────────────────

interface DateGroup {
  date: string;       // YYYY-MM-DD
  displayDate: string; // "Monday, March 10, 2026"
  entries: JournalEntry[];
  reflection?: DailyReflection;
}

function groupByDate(
  entries: JournalEntry[],
  reflections: DailyReflection[],
): DateGroup[] {
  const map = new Map<string, DateGroup>();

  for (const entry of entries) {
    const date = entry.timestamp.slice(0, 10);
    if (!map.has(date)) {
      const d = new Date(date + 'T12:00:00');
      map.set(date, {
        date,
        displayDate: d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        entries: [],
      });
    }
    map.get(date)!.entries.push(entry);
  }

  // Attach reflections
  for (const r of reflections) {
    const date = r.reflectionDate;
    if (map.has(date)) {
      map.get(date)!.reflection = r;
    } else {
      const d = new Date(date + 'T12:00:00');
      map.set(date, {
        date,
        displayDate: d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        entries: [],
        reflection: r,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date));
}

// ─── Entry HTML ─────────────────────────────────────

function renderEntry(entry: JournalEntry): string {
  const meta = entryMeta(entry.type);
  const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  let detail = '';
  if (entry.subtitle) {
    detail = `<p class="entry-subtitle">${esc(entry.subtitle)}</p>`;
  }

  // Add type-specific details
  if (entry.type === 'checkin' && entry.data.mood) {
    detail += `<p class="entry-detail">Mood: ${esc(String(entry.data.mood))}/10</p>`;
  }
  if (entry.type === 'exercise' && entry.data.duration) {
    detail += `<p class="entry-detail">Duration: ${entry.data.duration} min</p>`;
  }
  if (entry.type === 'assessment' && entry.data.assessmentType) {
    detail += `<p class="entry-detail">Type: ${esc(entry.data.assessmentType)}</p>`;
  }
  if (entry.type === 'xp' && entry.data.amount) {
    detail += `<p class="entry-detail">+${entry.data.amount} XP</p>`;
  }

  return `
    <div class="entry">
      <div class="entry-header">
        <span class="badge" style="background:${meta.bg};color:${meta.color};">${meta.label}</span>
        <span class="entry-time">${time}</span>
      </div>
      <p class="entry-title">${esc(entry.title)}</p>
      ${detail}
    </div>
  `;
}

// ─── Reflection HTML ────────────────────────────────

function renderReflection(r: DailyReflection): string {
  let html = '<div class="reflection">';
  html += '<h4 class="reflection-heading">Daily Reflection</h4>';

  if (r.questionResponses && r.questionResponses.length > 0) {
    for (const qr of r.questionResponses) {
      html += `
        <div class="reflection-qa">
          <p class="reflection-q">${esc(String(qr.question || ''))}</p>
          <p class="reflection-a">${esc(String(qr.answer || ''))}</p>
        </div>
      `;
    }
  }

  if (r.freeText) {
    html += `<p class="reflection-free">${esc(r.freeText)}</p>`;
  }

  if (r.dayTags && r.dayTags.length > 0) {
    html += '<div class="tag-row">';
    for (const tag of r.dayTags) {
      html += `<span class="tag">${esc(tag)}</span>`;
    }
    html += '</div>';
  }

  html += '</div>';
  return html;
}

// ─── Main Template ──────────────────────────────────

export interface JournalExportOptions {
  userName?: string;
  stats?: JournalStats;
  dateRange?: { from: string; to: string };
}

export function generateJournalHTML(
  entries: JournalEntry[],
  reflections: DailyReflection[],
  options: JournalExportOptions = {},
): string {
  const { userName, stats, dateRange } = options;
  const groups = groupByDate(entries, reflections);

  const title = userName ? `${esc(userName)}'s Journal` : 'My Journal';
  const subtitle = dateRange
    ? `${dateRange.from} — ${dateRange.to}`
    : stats
    ? `${stats.totalEntries} entries across ${stats.totalDays} days`
    : '';

  let bodyContent = '';

  for (const group of groups) {
    bodyContent += `
      <div class="day-group">
        <h3 class="day-date">${group.displayDate}</h3>
        ${group.entries.map(renderEntry).join('')}
        ${group.reflection ? renderReflection(group.reflection) : ''}
      </div>
    `;
  }

  if (groups.length === 0) {
    bodyContent = '<p class="empty">No journal entries in this period.</p>';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Tender</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Josefin Sans', sans-serif;
      font-weight: 300;
      font-size: 14px;
      line-height: 1.6;
      color: #2D2226;
      background: #FDF6F0;
      padding: 40px;
    }

    .cover {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 32px;
      border-bottom: 1px solid #E0D3CE;
    }

    .cover h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 36px;
      letter-spacing: -0.5px;
      color: #2D2226;
      margin-bottom: 8px;
    }

    .cover .subtitle {
      font-family: 'Jost', sans-serif;
      font-weight: 300;
      font-size: 14px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #6B5B5E;
    }

    .cover .branding {
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      font-size: 11px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #A8B4CC;
      margin-top: 12px;
    }

    .day-group {
      margin-bottom: 32px;
      page-break-inside: avoid;
    }

    .day-date {
      font-family: 'Jost', sans-serif;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 1px;
      color: #4A5A78;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #F0E6E0;
    }

    .entry {
      margin-bottom: 14px;
      padding: 12px 16px;
      background: #FFFFFF;
      border-radius: 10px;
      border: 1px solid #F0E6E0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .badge {
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 2px 10px;
      border-radius: 999px;
    }

    .entry-time {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 12px;
      color: #6B5B5E;
    }

    .entry-title {
      font-family: 'Josefin Sans', sans-serif;
      font-weight: 400;
      font-size: 15px;
      color: #2D2226;
    }

    .entry-subtitle {
      font-size: 13px;
      color: #6B5B5E;
      margin-top: 4px;
    }

    .entry-detail {
      font-size: 12px;
      color: #6B5E61;
      margin-top: 4px;
    }

    .reflection {
      margin-top: 12px;
      padding: 16px;
      background: #FAF0E6;
      border-radius: 10px;
      border: 1px solid #E0D3CE;
    }

    .reflection-heading {
      font-family: 'Jost', sans-serif;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.8px;
      color: #4A5A78;
      margin-bottom: 10px;
    }

    .reflection-qa { margin-bottom: 10px; }

    .reflection-q {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 13px;
      color: #6B5B5E;
      margin-bottom: 4px;
    }

    .reflection-a {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 14px;
      color: #2D2226;
    }

    .reflection-free {
      font-family: 'Josefin Sans', sans-serif;
      font-size: 14px;
      color: #2D2226;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #E0D3CE;
    }

    .tag-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 10px;
    }

    .tag {
      font-family: 'Jost', sans-serif;
      font-weight: 400;
      font-size: 11px;
      letter-spacing: 0.5px;
      padding: 2px 10px;
      border-radius: 999px;
      background: #E8ECF2;
      color: #6B7B9B;
    }

    .empty {
      text-align: center;
      color: #6B5E61;
      padding: 40px;
      font-style: italic;
    }

    @media print {
      body { padding: 20px; background: white; }
      .day-group { page-break-inside: avoid; }
      .cover { page-break-after: always; }
    }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${title}</h1>
    ${subtitle ? `<p class="subtitle">${esc(subtitle)}</p>` : ''}
    <p class="branding">Tender — Your Relational Journey</p>
  </div>
  ${bodyContent}
</body>
</html>`;
}
