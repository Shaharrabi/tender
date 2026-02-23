/**
 * MC7 Theme — Phone/Texting palette for "The Text Between Us".
 *
 * A modern, digital-native course about texting and digital communication.
 * Cool phone-blues with warm bubble-greens. Conversational and tech-savvy.
 */

export const MC7_PALETTE = {
  // Shared base
  cream: '#F2F0E9',
  ink: '#2C2C2C',
  paper: '#FFFDF5',
  gold: '#D4B483',

  // MC7-specific accents
  phoneBlue: '#4A90D9',         // Primary — digital/phone blue
  phoneBlueLight: '#B3D4F7',    // Light blue for backgrounds
  phoneBlueDark: '#2C6BB5',     // Dark blue for emphasis
  bubbleGreen: '#4CAF50',       // Secondary — sent message green
  bubbleGreenLight: '#C8E6C9',  // Light green background
  bubbleGreenDark: '#2E7D32',   // Dark green for emphasis
  readGray: '#9E9E9E',          // Read receipt / muted UI
  readGrayLight: '#E0E0E0',     // Light gray
  partnerBubble: '#E8EDF2',     // Incoming message bubble
  userBubble: '#DCF8C6',        // Outgoing message bubble
  typingDots: '#9E9E9E',        // Typing indicator
  warmText: '#5D4037',          // Warm brown for emphasis text
  connecting: '#4CAF50',        // Connecting annotation
  neutral: '#FF9800',           // Neutral annotation (amber)
  disconnecting: '#E53935',     // Disconnecting annotation
  correct: '#4CAF50',           // Correct answer
  correctLight: '#C8E6C9',      // Light correct background
  incorrect: '#E57373',         // Incorrect answer
  incorrectLight: '#FDDEDE',    // Light incorrect background
  cardBg: '#FFFCF5',            // Warm card background
  cardBorder: '#E0E0E0',        // Card border
  phoneDark: '#1A1A2E',         // Phone screen dark header
};

export const MC7_TIMING = {
  messageSlide: 300,
  typingDots: 1500,
  cardFlip: 400,
  swipeSnap: 250,
  timerPulse: 500,
  reactionDelay: 200,
  toneReveal: 350,
  branchTransition: 400,
};
