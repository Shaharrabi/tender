/**
 * Sticker System — Barrel exports for the Tender Sticker Library.
 *
 * 12 Step stickers + 10 concept stickers + 8 UI stickers + utility constants.
 */

export { default as StepSticker } from './StepSticker';
export { default as ConceptSticker } from './ConceptSticker';
export type { ConceptType } from './ConceptSticker';
export { default as UISticker } from './UIStickers';
export type { UIStickerType } from './UIStickers';
export { StepConceptBadge, getConceptForStep } from './StepConceptMap';
