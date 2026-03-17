/**
 * PDF Export Service
 *
 * Generates printable reports: portraits, couple portraits, journal.
 * - Web:    opens browser print dialog via a new window
 * - Native: uses expo-print → expo-sharing
 */

import { Platform } from 'react-native';
import { generatePortraitHTML } from '@/utils/portrait/pdf-template';
import { generateCouplePortraitHTML } from '@/utils/portrait/couple-pdf-template';
import { generateJournalHTML, type JournalExportOptions } from '@/utils/journal/journal-pdf-template';
import type { IndividualPortrait } from '@/types/portrait';
import type { DeepCouplePortrait } from '@/types/couples';
import type { JournalEntry, DailyReflection } from '@/services/journal';

// ─── Shared PDF Rendering ─────────────────────────────

/** Present an HTML document as a PDF (web: print dialog, native: share sheet). */
async function presentPDF(html: string, dialogTitle: string): Promise<void> {
  if (Platform.OS === 'web') {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 400);
    } else {
      // Popup blocked — fallback to hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:none;';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 400);
      }
    }
    return;
  }

  // Native — expo-print + expo-sharing
  try {
    const Print = await import('expo-print');
    const Sharing = await import('expo-sharing');
    const { uri } = await Print.printToFileAsync({ html });
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle,
        UTI: 'com.adobe.pdf',
      });
    } else {
      await Print.printAsync({ html });
    }
  } catch (err) {
    try {
      const Print = await import('expo-print');
      await Print.printAsync({ html });
    } catch {
      if (__DEV__) console.warn('[PDF] Export failed:', err);
      throw new Error('Unable to generate PDF. Please try again.');
    }
  }
}

// ─── Portrait PDF ─────────────────────────────────────

/** Generate and present an individual portrait PDF. */
export async function generatePortraitPDF(
  portrait: IndividualPortrait,
  userName?: string,
  allScores?: Record<string, { id: string; scores: any }>,
): Promise<void> {
  const html = generatePortraitHTML(portrait, userName, allScores);
  await presentPDF(html, 'Share Portrait Report');
}

// ─── Couple Portrait PDF ──────────────────────────────

/** Generate and present a couple portrait PDF. */
export async function generateCouplePortraitPDF(
  portrait: DeepCouplePortrait,
  partnerAName?: string,
  partnerBName?: string,
  rawScores?: { partner1: Record<string, any>; partner2: Record<string, any> },
): Promise<void> {
  const html = generateCouplePortraitHTML(portrait, partnerAName, partnerBName, rawScores);
  await presentPDF(html, 'Share Couple Portrait Report');
}

// ─── Journal PDF ──────────────────────────────────────

/** Generate and present a journal export PDF. */
export async function generateJournalPDF(
  entries: JournalEntry[],
  reflections: DailyReflection[],
  options?: JournalExportOptions,
): Promise<void> {
  const html = generateJournalHTML(entries, reflections, options);
  await presentPDF(html, 'Share Journal');
}
