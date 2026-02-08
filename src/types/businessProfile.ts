export interface BusinessProfile {
  id: string;
  companyName: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  country: string; // ISO 3166-1 alpha-2 (e.g., "ES", "GB", "US")
  taxIdLabel: string; // "NIF", "VAT", "EIN", "ABN", etc.
  taxId: string;
  paymentMethod: string;
  paymentDetails: string; // IBAN, account number, etc.
  logoUri: string | null; // Local file URI from image picker
  primaryColor: string; // Hex color for branding (e.g., "#FF4500")
  currency: string; // ISO 4217 code: "EUR", "USD", "GBP"
  locale: string; // BCP 47: "es-ES", "en-US", "fr-FR"
  defaultTaxRate: number; // e.g., 21 for Spain, 20 for UK
  taxName: string; // "IVA", "VAT", "GST", "Sales Tax"
  invoicePrefix: string; // e.g., "INV-", "FA-"
  quotePrefix: string; // e.g., "QUO-", "PRE-"
  nextInvoiceNumber: number; // Auto-increment counter
  nextQuoteNumber: number; // Auto-increment counter
  preferredTemplate: 'classic' | 'modern' | 'minimal'; // PDF template selection
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export interface MigrationState {
  schemaVersion: number; // Current: 1 (for future migrations)
  hasCompletedOnboarding: boolean;
  migratedFromLegacy: boolean; // True if auto-migrated from hardcoded COMPANY constants
  migrationDate: string | null; // ISO date of migration
}

export type BusinessProfileFormData = Omit<
  BusinessProfile,
  'id' | 'createdAt' | 'updatedAt' | 'nextInvoiceNumber' | 'nextQuoteNumber'
>;
