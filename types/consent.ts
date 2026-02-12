export type ConsentType = 'store_and_share' | 'view_and_erase';

export interface DataConsent {
  id: string;
  userId: string;
  consentType: ConsentType;
  consentText: string;
  consentedAt: string;
  revokedAt: string | null;
}

export interface SharingPreference {
  id: string;
  userId: string;
  coupleId: string;
  assessmentType: string;
  shared: boolean;
  updatedAt: string;
}
