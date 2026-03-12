/**
 * Content Filter — Basic safety for dating letters
 *
 * Blocks phone numbers, email addresses, URLs, and social media handles
 * from being shared in early letter exchanges. Keeps the "slow letter"
 * philosophy intact by encouraging in-app connection first.
 */

// Patterns for contact info that shouldn't be in early letters
const PHONE_REGEX = /(\+?\d[\d\s\-().]{7,}\d)/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const URL_REGEX = /https?:\/\/[^\s]+|www\.[^\s]+/i;
const SOCIAL_HANDLE_REGEX = /@[a-zA-Z0-9._]{3,}/;
const SOCIAL_PLATFORMS_REGEX = /\b(instagram|snapchat|whatsapp|telegram|signal|facebook|tiktok|twitter|discord|snap)\b/i;

export interface ContentFilterResult {
  isClean: boolean;
  message: string | null;
}

/**
 * Check letter content for contact info that should be shared later.
 * Returns isClean=true if content is fine, or a user-friendly message if not.
 */
export function filterLetterContent(content: string): ContentFilterResult {
  if (PHONE_REGEX.test(content)) {
    return {
      isClean: false,
      message: 'Letters are for getting to know someone through words first. Phone numbers can come later when you both feel ready.',
    };
  }

  if (EMAIL_REGEX.test(content)) {
    return {
      isClean: false,
      message: 'Keep the conversation here for now. Email addresses can be shared when you both feel ready.',
    };
  }

  if (URL_REGEX.test(content)) {
    return {
      isClean: false,
      message: 'Links aren\'t allowed in letters yet. Share your thoughts in your own words.',
    };
  }

  if (SOCIAL_HANDLE_REGEX.test(content) || SOCIAL_PLATFORMS_REGEX.test(content)) {
    return {
      isClean: false,
      message: 'Social media handles can wait. The beauty of letters is getting to know someone without the noise.',
    };
  }

  return { isClean: true, message: null };
}
