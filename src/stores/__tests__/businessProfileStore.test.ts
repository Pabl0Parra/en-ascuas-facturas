import { useBusinessProfileStore } from '../businessProfileStore';
import type { BusinessProfile } from '../../types/businessProfile';

describe('businessProfileStore', () => {
  // Reset store before each test
  beforeEach(() => {
    useBusinessProfileStore.setState({
      profile: null,
      migration: {
        schemaVersion: 1,
        hasCompletedOnboarding: false,
        migratedFromLegacy: false,
        migrationDate: null,
      },
    });
  });

  describe('setProfile', () => {
    it('should set a business profile', () => {
      const mockProfile: BusinessProfile = {
        id: 'test-id',
        companyName: 'Test Company',
        address: '123 Test St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'Account 123456',
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
      };

      useBusinessProfileStore.getState().setProfile(mockProfile);

      const state = useBusinessProfileStore.getState();
      expect(state.profile).toEqual(mockProfile);
    });
  });

  describe('updateProfile', () => {
    it('should update profile fields and updatedAt timestamp', () => {
      const initialProfile: BusinessProfile = {
        id: 'test-id',
        companyName: 'Old Name',
        address: '123 Test St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'Account 123456',
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
      };

      useBusinessProfileStore.getState().setProfile(initialProfile);

      const updatesBefore = initialProfile.updatedAt;

      // Wait a tiny bit to ensure timestamp changes
      setTimeout(() => {
        useBusinessProfileStore.getState().updateProfile({
          companyName: 'New Name',
          primaryColor: '#00FF00',
        });

        const state = useBusinessProfileStore.getState();
        expect(state.profile?.companyName).toBe('New Name');
        expect(state.profile?.primaryColor).toBe('#00FF00');
        expect(state.profile?.address).toBe('123 Test St'); // Unchanged
        expect(state.profile?.updatedAt).not.toBe(updatesBefore);
      }, 10);
    });

    it('should not update if profile is null', () => {
      useBusinessProfileStore.getState().updateProfile({ companyName: 'Test' });

      const state = useBusinessProfileStore.getState();
      expect(state.profile).toBeNull();
    });
  });

  describe('completeOnboarding', () => {
    it('should mark onboarding as completed', () => {
      useBusinessProfileStore.getState().completeOnboarding();

      const state = useBusinessProfileStore.getState();
      expect(state.migration.hasCompletedOnboarding).toBe(true);
    });
  });

  describe('isOnboardingRequired', () => {
    it('should return true when no profile exists', () => {
      const result = useBusinessProfileStore.getState().isOnboardingRequired();
      expect(result).toBe(true);
    });

    it('should return true when profile exists but onboarding not completed', () => {
      const mockProfile: BusinessProfile = {
        id: 'test-id',
        companyName: 'Test',
        address: '123 Test St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'Account 123456',
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
      };

      useBusinessProfileStore.getState().setProfile(mockProfile);

      const result = useBusinessProfileStore.getState().isOnboardingRequired();
      expect(result).toBe(true); // Still true because onboarding not marked complete
    });

    it('should return false when profile exists and onboarding completed', () => {
      const mockProfile: BusinessProfile = {
        id: 'test-id',
        companyName: 'Test',
        address: '123 Test St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'Account 123456',
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
      };

      useBusinessProfileStore.getState().setProfile(mockProfile);
      useBusinessProfileStore.getState().completeOnboarding();

      const result = useBusinessProfileStore.getState().isOnboardingRequired();
      expect(result).toBe(false);
    });
  });

  describe('incrementInvoiceNumber', () => {
    it('should return 1 if no profile exists', () => {
      const number = useBusinessProfileStore.getState().incrementInvoiceNumber();
      expect(number).toBe(1);
    });

    it('should increment invoice number and return current value', () => {
      const mockProfile: BusinessProfile = {
        id: 'test-id',
        companyName: 'Test',
        address: '123 Test St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'Account 123456',
        logoUri: null,
        primaryColor: '#FF0000',
        currency: 'USD',
        locale: 'en-US',
        defaultTaxRate: 7,
        taxName: 'Sales Tax',
        invoicePrefix: 'INV-',
        quotePrefix: 'QUO-',
        nextInvoiceNumber: 5,
        nextQuoteNumber: 1,
        preferredTemplate: 'classic',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      useBusinessProfileStore.getState().setProfile(mockProfile);

      const number = useBusinessProfileStore.getState().incrementInvoiceNumber();
      expect(number).toBe(5);

      const state = useBusinessProfileStore.getState();
      expect(state.profile?.nextInvoiceNumber).toBe(6);
    });
  });

  describe('incrementQuoteNumber', () => {
    it('should return 1 if no profile exists', () => {
      const number = useBusinessProfileStore.getState().incrementQuoteNumber();
      expect(number).toBe(1);
    });

    it('should increment quote number and return current value', () => {
      const mockProfile: BusinessProfile = {
        id: 'test-id',
        companyName: 'Test',
        address: '123 Test St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'Account 123456',
        logoUri: null,
        primaryColor: '#FF0000',
        currency: 'USD',
        locale: 'en-US',
        defaultTaxRate: 7,
        taxName: 'Sales Tax',
        invoicePrefix: 'INV-',
        quotePrefix: 'QUO-',
        nextInvoiceNumber: 1,
        nextQuoteNumber: 10,
        preferredTemplate: 'classic',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      useBusinessProfileStore.getState().setProfile(mockProfile);

      const number = useBusinessProfileStore.getState().incrementQuoteNumber();
      expect(number).toBe(10);

      const state = useBusinessProfileStore.getState();
      expect(state.profile?.nextQuoteNumber).toBe(11);
    });
  });
});
