import { useBusinessProfileStore } from '../stores/businessProfileStore';
import { useClientStore } from '../stores/clientStore';
import { useDocumentStore } from '../stores/documentStore';
import { COMPANY } from '../constants/company';
import type { BusinessProfile } from '../types/businessProfile';
import { generateSecureId } from '../utils/idGenerator';

export class MigrationService {
  /**
   * Detects if there is legacy data (clients or documents) in AsyncStorage.
   * This indicates an existing user who needs migration.
   */
  static async detectLegacyData(): Promise<boolean> {
    const clients = useClientStore.getState().clients;
    const documents = useDocumentStore.getState().documents;
    return clients.length > 0 || documents.length > 0;
  }

  /**
   * Migrates hardcoded COMPANY constants to a BusinessProfile.
   * This preserves existing user data while enabling genericization.
   */
  static async migrateToBusinessProfile(): Promise<BusinessProfile> {
    const now = new Date().toISOString();

    // Map hardcoded COMPANY constants to BusinessProfile
    const profile: BusinessProfile = {
      id: generateSecureId(),
      companyName: COMPANY.nombre,
      address: COMPANY.direccion,
      postalCode: COMPANY.codigoPostal,
      city: COMPANY.ciudad,
      region: COMPANY.provincia,
      country: 'ES', // Spain
      taxIdLabel: 'NIF',
      taxId: COMPANY.nif,
      paymentMethod: COMPANY.metodoPago,
      paymentDetails: COMPANY.iban,
      logoUri: null, // Will use embedded logo initially
      primaryColor: '#FF4500', // Original En Ascuas brand color
      currency: 'EUR',
      locale: 'es-ES',
      defaultTaxRate: 21, // Spanish standard IVA
      taxName: 'IVA',
      invoicePrefix: 'FA-',
      quotePrefix: 'PRE-',
      nextInvoiceNumber: this.calculateNextInvoiceNumber(),
      nextQuoteNumber: this.calculateNextQuoteNumber(),
      preferredTemplate: 'classic', // Closest to original design
      createdAt: now,
      updatedAt: now,
    };

    // Persist to store
    useBusinessProfileStore.getState().setProfile(profile);
    useBusinessProfileStore.setState((state) => ({
      migration: {
        ...state.migration,
        hasCompletedOnboarding: true,
        migratedFromLegacy: true,
        migrationDate: now,
      },
    }));

    return profile;
  }

  /**
   * Determines if the app should show onboarding flow.
   * Returns true for fresh installs, false for existing users or completed onboarding.
   */
  static async shouldShowOnboarding(): Promise<boolean> {
    const { profile, migration } = useBusinessProfileStore.getState();

    // If onboarding already completed, skip
    if (migration.hasCompletedOnboarding && profile) {
      return false;
    }

    // Check for legacy data
    const hasLegacyData = await this.detectLegacyData();

    if (hasLegacyData) {
      // Auto-migrate existing users silently
      await this.migrateToBusinessProfile();
      return false; // Don't show onboarding, show "What's New" instead
    }

    // Fresh install - show onboarding
    return true;
  }

  /**
   * Calculates the next invoice number based on existing documents.
   * Extracts the numeric part from invoice numbers and finds the max.
   */
  private static calculateNextInvoiceNumber(): number {
    const documents = useDocumentStore.getState().documents;
    const invoices = documents.filter(doc => doc.tipo === 'factura');

    if (invoices.length === 0) return 1;

    // Extract numbers from invoice numbers (e.g., "FA-2024-005" → 5)
    const numbers = invoices.map(inv => {
      const match = inv.numeroDocumento.match(/\d+/g);
      if (!match) return 0;
      return parseInt(match[match.length - 1], 10);
    });

    const maxNumber = Math.max(...numbers, 0);
    return maxNumber + 1;
  }

  /**
   * Calculates the next quote number based on existing documents.
   * Extracts the numeric part from quote numbers and finds the max.
   */
  private static calculateNextQuoteNumber(): number {
    const documents = useDocumentStore.getState().documents;
    const quotes = documents.filter(doc => doc.tipo === 'presupuesto');

    if (quotes.length === 0) return 1;

    // Extract numbers from quote numbers
    const numbers = quotes.map(quote => {
      const match = quote.numeroDocumento.match(/\d+/g);
      if (!match) return 0;
      return parseInt(match[match.length - 1], 10);
    });

    const maxNumber = Math.max(...numbers, 0);
    return maxNumber + 1;
  }

  /**
   * Check if the user has been migrated from legacy data.
   * Used to show "What's New" screen once after migration.
   */
  static hasMigratedFromLegacy(): boolean {
    const { migration } = useBusinessProfileStore.getState();
    return migration.migratedFromLegacy;
  }

  /**
   * Mark "What's New" screen as seen (by clearing the migration flag).
   * This ensures it only shows once after migration.
   */
  static markWhatsNewSeen(): void {
    useBusinessProfileStore.setState((state) => ({
      migration: {
        ...state.migration,
        migratedFromLegacy: false, // Clear flag so it doesn't show again
      },
    }));
  }
}
