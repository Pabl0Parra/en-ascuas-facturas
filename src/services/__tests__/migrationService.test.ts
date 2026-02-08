import { MigrationService } from '../migrationService';
import { useBusinessProfileStore } from '../../stores/businessProfileStore';
import { useClientStore } from '../../stores/clientStore';
import { useDocumentStore } from '../../stores/documentStore';
import type { Client } from '../../types/client';
import type { DocumentMetadata } from '../../types/document';

describe('MigrationService', () => {
  beforeEach(() => {
    // Reset all stores before each test
    useBusinessProfileStore.setState({
      profile: null,
      migration: {
        schemaVersion: 1,
        hasCompletedOnboarding: false,
        migratedFromLegacy: false,
        migrationDate: null,
      },
    });

    useClientStore.setState({ clients: [] });
    useDocumentStore.setState({ documents: [] });
  });

  describe('detectLegacyData', () => {
    it('should return false when no clients or documents exist', async () => {
      const result = await MigrationService.detectLegacyData();
      expect(result).toBe(false);
    });

    it('should return true when clients exist', async () => {
      const mockClient: Client = {
        id: 'client-1',
        nombre: 'Test Client',
        direccion: '123 Test St',
        codigoPostal: '12345',
        ciudad: 'Test City',
        provincia: 'Test Province',
        nifCif: '123456789',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      useClientStore.setState({ clients: [mockClient] });

      const result = await MigrationService.detectLegacyData();
      expect(result).toBe(true);
    });

    it('should return true when documents exist', async () => {
      const mockDocument: DocumentMetadata = {
        id: 'doc-1',
        tipo: 'factura',
        numeroDocumento: 'FA-001',
        fechaDocumento: '2024-01-01',
        clienteNombre: 'Test Client',
        clienteNifCif: '123456789',
        total: 100,
        pdfFileName: 'test.pdf',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useDocumentStore.setState({ documents: [mockDocument] });

      const result = await MigrationService.detectLegacyData();
      expect(result).toBe(true);
    });

    it('should return true when both clients and documents exist', async () => {
      const mockClient: Client = {
        id: 'client-1',
        nombre: 'Test Client',
        direccion: '123 Test St',
        codigoPostal: '12345',
        ciudad: 'Test City',
        provincia: 'Test Province',
        nifCif: '123456789',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const mockDocument: DocumentMetadata = {
        id: 'doc-1',
        tipo: 'factura',
        numeroDocumento: 'FA-001',
        fechaDocumento: '2024-01-01',
        clienteNombre: 'Test Client',
        clienteNifCif: '123456789',
        total: 100,
        pdfFileName: 'test.pdf',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      useClientStore.setState({ clients: [mockClient] });
      useDocumentStore.setState({ documents: [mockDocument] });

      const result = await MigrationService.detectLegacyData();
      expect(result).toBe(true);
    });
  });

  describe('migrateToBusinessProfile', () => {
    it('should create a business profile from hardcoded COMPANY constants', async () => {
      const profile = await MigrationService.migrateToBusinessProfile();

      expect(profile).toBeDefined();
      expect(profile.companyName).toBe('ALEJANDRO CANTOS RAMIREZ');
      expect(profile.address).toBe('C/NUEVA N 4 6-E');
      expect(profile.postalCode).toBe('18600');
      expect(profile.city).toBe('MOTRIL');
      expect(profile.region).toBe('GRANADA');
      expect(profile.country).toBe('ES');
      expect(profile.taxIdLabel).toBe('NIF');
      expect(profile.taxId).toBe('74717895-A');
      expect(profile.paymentMethod).toBe('TRANSFERENCIA');
      expect(profile.paymentDetails).toBe('ES87-0049-4197-9825-1413-9105');
      expect(profile.currency).toBe('EUR');
      expect(profile.locale).toBe('es-ES');
      expect(profile.defaultTaxRate).toBe(21);
      expect(profile.taxName).toBe('IVA');
      expect(profile.preferredTemplate).toBe('classic');
    });

    it('should save profile to businessProfileStore', async () => {
      await MigrationService.migrateToBusinessProfile();

      const state = useBusinessProfileStore.getState();
      expect(state.profile).not.toBeNull();
      expect(state.profile?.companyName).toBe('ALEJANDRO CANTOS RAMIREZ');
    });

    it('should mark migration state correctly', async () => {
      await MigrationService.migrateToBusinessProfile();

      const state = useBusinessProfileStore.getState();
      expect(state.migration.hasCompletedOnboarding).toBe(true);
      expect(state.migration.migratedFromLegacy).toBe(true);
      expect(state.migration.migrationDate).not.toBeNull();
    });

    it('should calculate next invoice number when invoices exist', async () => {
      const mockInvoices: DocumentMetadata[] = [
        {
          id: 'doc-1',
          tipo: 'factura',
          numeroDocumento: 'FA-001',
          fechaDocumento: '2024-01-01',
          clienteNombre: 'Test',
          clienteNifCif: '123',
          total: 100,
          pdfFileName: 'test.pdf',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'doc-2',
          tipo: 'factura',
          numeroDocumento: 'FA-005',
          fechaDocumento: '2024-01-02',
          clienteNombre: 'Test',
          clienteNifCif: '123',
          total: 100,
          pdfFileName: 'test.pdf',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      useDocumentStore.setState({ documents: mockInvoices });

      const profile = await MigrationService.migrateToBusinessProfile();
      expect(profile.nextInvoiceNumber).toBe(6); // Max is 5, so next is 6
    });

    it('should calculate next quote number when quotes exist', async () => {
      const mockQuotes: DocumentMetadata[] = [
        {
          id: 'doc-1',
          tipo: 'presupuesto',
          numeroDocumento: 'PRE-003',
          fechaDocumento: '2024-01-01',
          clienteNombre: 'Test',
          clienteNifCif: '123',
          total: 100,
          pdfFileName: 'test.pdf',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      useDocumentStore.setState({ documents: mockQuotes });

      const profile = await MigrationService.migrateToBusinessProfile();
      expect(profile.nextQuoteNumber).toBe(4); // Max is 3, so next is 4
    });
  });

  describe('shouldShowOnboarding', () => {
    it('should return true for fresh install (no profile, no data)', async () => {
      const result = await MigrationService.shouldShowOnboarding();
      expect(result).toBe(true);
    });

    it('should return false when onboarding completed and profile exists', async () => {
      // Simulate completed onboarding
      useBusinessProfileStore.setState({
        profile: {
          id: 'test',
          companyName: 'Test Company',
          address: '123 Test St',
          postalCode: '12345',
          city: 'Test City',
          region: 'Test Region',
          country: 'US',
          taxIdLabel: 'EIN',
          taxId: '123456789',
          paymentMethod: 'Transfer',
          paymentDetails: 'Account 123',
          logoUri: null,
          primaryColor: '#FF0000',
          currency: 'USD',
          locale: 'en-US',
          defaultTaxRate: 7,
          taxName: 'Sales Tax',
          invoicePrefix: 'INV-',
          quotePrefix: 'QUO-',
          nextInvoiceNumber: 1,
          nextQuoteNumber: 1,
          preferredTemplate: 'classic',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        migration: {
          schemaVersion: 1,
          hasCompletedOnboarding: true,
          migratedFromLegacy: false,
          migrationDate: null,
        },
      });

      const result = await MigrationService.shouldShowOnboarding();
      expect(result).toBe(false);
    });

    it('should auto-migrate and return false for existing users with data', async () => {
      // Add legacy data
      const mockClient: Client = {
        id: 'client-1',
        nombre: 'Test Client',
        direccion: '123 Test St',
        codigoPostal: '12345',
        ciudad: 'Test City',
        provincia: 'Test Province',
        nifCif: '123456789',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      useClientStore.setState({ clients: [mockClient] });

      const result = await MigrationService.shouldShowOnboarding();
      expect(result).toBe(false); // Should auto-migrate and skip onboarding

      // Verify migration occurred
      const state = useBusinessProfileStore.getState();
      expect(state.profile).not.toBeNull();
      expect(state.migration.migratedFromLegacy).toBe(true);
    });
  });

  describe('hasMigratedFromLegacy', () => {
    it('should return false initially', () => {
      const result = MigrationService.hasMigratedFromLegacy();
      expect(result).toBe(false);
    });

    it('should return true after migration', async () => {
      await MigrationService.migrateToBusinessProfile();

      const result = MigrationService.hasMigratedFromLegacy();
      expect(result).toBe(true);
    });
  });

  describe('markWhatsNewSeen', () => {
    it('should clear migratedFromLegacy flag', async () => {
      // Migrate first
      await MigrationService.migrateToBusinessProfile();

      expect(MigrationService.hasMigratedFromLegacy()).toBe(true);

      // Mark as seen
      MigrationService.markWhatsNewSeen();

      expect(MigrationService.hasMigratedFromLegacy()).toBe(false);
    });
  });
});
