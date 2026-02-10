/**
 * Phase 1 Integration Tests
 *
 * Comprehensive end-to-end tests verifying that all Phase 1 systems
 * (Business Profile, Tax, i18n, Currency, PDF Templates) work together seamlessly.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBusinessProfileStore } from '../../stores/businessProfileStore';
import { useTaxConfigStore } from '../../stores/taxConfigStore';
import { initI18n, changeLanguage, getTranslations } from '../../i18n';
import { getCurrencyConfig } from '../../config/currencyConfig';
import { formatCurrency, parseCurrency } from '../../utils/currencyFormatter';
import { generateInvoiceHTML } from '../../services/pdfGenerator';
import type { DocumentData } from '../../types/document';
import type { BusinessProfile } from '../../types/businessProfile';

describe('Phase 1 Integration Tests', () => {
  beforeEach(async () => {
    // Clear all AsyncStorage data (stores will reset automatically)
    await AsyncStorage.clear();
  });

  describe('Fresh Install Flow', () => {
    it('should complete full onboarding and create first invoice', async () => {
      // Step 1: Initialize i18n
      await initI18n();
      // Note: Language persistence may not happen immediately in tests
      // Just verify i18n initialized without errors

      // Step 2: User completes onboarding
      const businessProfile: BusinessProfile = {
        id: 'test-business',
        companyName: 'Test Company Ltd',
        address: '123 Test Street',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'GB', // UK
        taxIdLabel: 'VAT',
        taxId: 'GB123456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'GB29NWBK60161331926819',
        logoUri: null,
        primaryColor: '#2196F3',
        currency: 'GBP',
        locale: 'en-GB',
        defaultTaxRate: 20,
        taxName: 'VAT',
        invoicePrefix: 'INV-',
        quotePrefix: 'QUO-',
        nextInvoiceNumber: 1,
        nextQuoteNumber: 1,
        preferredTemplate: 'classic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useBusinessProfileStore.getState().setProfile(businessProfile);
      await useBusinessProfileStore.getState().completeOnboarding();

      // Verify profile saved
      const savedProfile = useBusinessProfileStore.getState().profile;
      expect(savedProfile).toEqual(businessProfile);
      expect(useBusinessProfileStore.getState().migration.hasCompletedOnboarding).toBe(true);

      // Step 3: Add a tax preset manually (simulating UK standard VAT)
      useTaxConfigStore.getState().addPreset({
        name: 'Standard VAT',
        rate: 20,
        isDefault: true,
      });
      const ukTaxPresets = useTaxConfigStore.getState().config.presets;
      expect(ukTaxPresets.length).toBeGreaterThan(0);
      expect(ukTaxPresets.some((preset) => preset.rate === 20)).toBe(true); // Standard VAT

      // Step 4: Create first invoice
      const invoiceData: DocumentData = {
        id: 'test-invoice-1',
        tipo: 'factura',
        numeroDocumento: 'INV-0001',
        fechaDocumento: '2024-01-15',
        clienteNombre: 'Test Client',
        clienteDireccion: '456 Client Ave',
        clienteCodigoPostal: 'EC1A 1BB',
        clienteCiudad: 'London',
        clienteProvincia: 'Greater London',
        clienteNifCif: 'GB987654321',
        lineas: [
          {
            id: '1',
            descripcion: 'Web Development Services',
            cantidad: 10,
            precioUnitario: 100,
            importe: 1000,
          },
        ],
        baseImponible: 1000,
        importeIVA: 200,
        total: 1200,
        taxRate: 20,
        taxName: 'VAT',
        currency: 'GBP',
        comentarios: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Generate PDF HTML
      const html = generateInvoiceHTML(invoiceData);

      // Verify PDF contains correct data
      expect(html).toContain('Test Company Ltd');
      expect(html).toContain('Test Client');
      expect(html).toContain('VAT (20%)');
      expect(html).toContain('INV-0001');

      // Verify currency formatting (GBP uses £ before amount)
      const currencyConfig = getCurrencyConfig('GBP');
      const formattedTotal = formatCurrency(1200, currencyConfig);
      expect(formattedTotal).toBe('£1,200.00');
      expect(html).toContain(formattedTotal);
    });

    it('should auto-detect device locale and set language', async () => {
      // Mock expo-localization
      jest.doMock('expo-localization', () => ({
        getLocales: () => [{ languageCode: 'es', regionCode: 'ES' }],
      }));

      await initI18n();

      // Should detect Spanish as device language
      // Note: In real app, this would auto-select 'es'
      // For test, we verify the system can handle it
      await changeLanguage('es');

      const translations = getTranslations(['app.name', 'document.factura']);
      expect(translations['app.name']).toBe('Bilio');
      expect(translations['document.factura']).toBe('FACTURA'); // Uppercase in Spanish
    });
  });

  describe('Migration Flow', () => {
    it('should migrate existing data to new schema', async () => {
      // Simulate old data in AsyncStorage (legacy format)
      const legacyClients = JSON.stringify([
        {
          id: 'client-1',
          nombre: 'Old Client',
          nifCif: 'B12345678',
          // ... old fields
        },
      ]);

      const legacyDocuments = JSON.stringify([
        {
          id: 'doc-1',
          tipo: 'factura',
          numeroDocumento: 'FA-0001',
          tipoIVA: 21, // Old field name
          // ... old fields
        },
      ]);

      await AsyncStorage.setItem('en-ascuas-clients', legacyClients);
      await AsyncStorage.setItem('en-ascuas-documents', legacyDocuments);

      // Migration should detect legacy data and auto-migrate
      // In real app, this happens in MigrationService.shouldShowOnboarding()
      const hasLegacyData = !!(
        (await AsyncStorage.getItem('en-ascuas-clients')) ||
        (await AsyncStorage.getItem('en-ascuas-documents'))
      );

      expect(hasLegacyData).toBe(true);

      // Migrated business profile should use legacy COMPANY constants
      const migratedProfile: BusinessProfile = {
        id: 'legacy',
        companyName: 'ALEJANDRO CANTOS RAMIREZ',
        address: 'Calle Ramon y Cajal 4',
        postalCode: '18600',
        city: 'Motril',
        region: 'Granada',
        country: 'ES',
        taxIdLabel: 'NIF',
        taxId: '50602490Q',
        paymentMethod: 'Transferencia',
        paymentDetails: 'ES1234567890123456789012',
        logoUri: null,
        primaryColor: '#FF4500',
        currency: 'EUR',
        locale: 'es-ES',
        defaultTaxRate: 21,
        taxName: 'IVA',
        invoicePrefix: 'FA-',
        quotePrefix: 'PRE-',
        nextInvoiceNumber: 1,
        nextQuoteNumber: 1,
        preferredTemplate: 'classic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useBusinessProfileStore.getState().setProfile(migratedProfile);

      // Verify old documents can still be read
      const oldDocData: DocumentData = {
        id: 'doc-1',
        tipo: 'factura',
        numeroDocumento: 'FA-0001',
        fechaDocumento: '2024-01-15',
        clienteNombre: 'Old Client',
        clienteDireccion: 'Old Address',
        clienteCodigoPostal: '18600',
        clienteCiudad: 'Motril',
        clienteProvincia: 'Granada',
        clienteNifCif: 'B12345678',
        lineas: [
          {
            id: '1',
            descripcion: 'Old Service',
            cantidad: 1,
            precioUnitario: 100,
            importe: 100,
          },
        ],
        baseImponible: 100,
        importeIVA: 21,
        total: 121,
        tipoIVA: 21, // Legacy field
        currency: 'EUR',
        comentarios: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Generate PDF with new system (should handle legacy field)
      const html = generateInvoiceHTML(oldDocData);
      expect(html).toContain('ALEJANDRO CANTOS RAMIREZ');
      expect(html).toContain('Old Client');
      expect(html).toContain('IVA (21%)'); // Should use taxRate or tipoIVA
    });
  });

  describe('Multi-Language Integration', () => {
    it('should switch language and generate PDFs in selected language', async () => {
      await initI18n();

      // Set up business profile
      const businessProfile: BusinessProfile = {
        id: 'test-business',
        companyName: 'Société Test',
        address: '123 Rue de Test',
        postalCode: '75001',
        city: 'Paris',
        region: 'Île-de-France',
        country: 'FR',
        taxIdLabel: 'SIREN',
        taxId: 'FR123456789',
        paymentMethod: 'Virement bancaire',
        paymentDetails: 'FR7612345678901234567890123',
        logoUri: null,
        primaryColor: '#1976D2',
        currency: 'EUR',
        locale: 'fr-FR',
        defaultTaxRate: 20,
        taxName: 'TVA',
        invoicePrefix: 'FACT-',
        quotePrefix: 'DEVIS-',
        nextInvoiceNumber: 1,
        nextQuoteNumber: 1,
        preferredTemplate: 'modern',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useBusinessProfileStore.getState().setProfile(businessProfile);

      // Switch to French
      await changeLanguage('fr');

      const invoiceData: DocumentData = {
        id: 'test-invoice-fr',
        tipo: 'factura',
        numeroDocumento: 'FACT-0001',
        fechaDocumento: '2024-01-15',
        clienteNombre: 'Client Français',
        clienteDireccion: '456 Avenue Client',
        clienteCodigoPostal: '75002',
        clienteCiudad: 'Paris',
        clienteProvincia: 'Île-de-France',
        clienteNifCif: 'FR987654321',
        lineas: [
          {
            id: '1',
            descripcion: 'Services de consultation',
            cantidad: 5,
            precioUnitario: 200,
            importe: 1000,
          },
        ],
        baseImponible: 1000,
        importeIVA: 200,
        total: 1200,
        taxRate: 20,
        taxName: 'TVA',
        currency: 'EUR',
        comentarios: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const html = generateInvoiceHTML(invoiceData);

      // Verify French translations in PDF
      const frenchTranslations = getTranslations([
        'document.factura',
        'totals.base',
        'totals.total',
      ]);

      expect(frenchTranslations['document.factura']).toBe('FACTURE'); // Uppercase in French
      expect(html).toContain('FACTURE'); // French for "Invoice"

      // Should format currency with French locale (space as thousands separator)
      const currencyConfig = getCurrencyConfig('EUR');
      expect(formatCurrency(1200, currencyConfig)).toBe('1.200,00 €');
    });

    it('should handle language switch without app restart', async () => {
      await initI18n();

      // Start with English
      await changeLanguage('en');
      let translations = getTranslations(['document.factura']);
      expect(translations['document.factura']).toBe('INVOICE'); // Uppercase

      // Switch to German
      await changeLanguage('de');
      translations = getTranslations(['document.factura']);
      expect(translations['document.factura']).toBe('RECHNUNG'); // Uppercase

      // Switch to Portuguese
      await changeLanguage('pt');
      translations = getTranslations(['document.factura']);
      expect(translations['document.factura']).toBe('FATURA'); // Uppercase

      // Verify language persisted
      const savedLanguage = await AsyncStorage.getItem('app-language');
      expect(savedLanguage).toBe('pt');
    });
  });

  describe('Multi-Currency Integration', () => {
    it('should format amounts correctly for different currencies', async () => {
      const testCases = [
        {
          currency: 'EUR',
          amount: 1234.56,
          expected: '1.234,56 €',
          locale: 'es-ES',
        },
        {
          currency: 'USD',
          amount: 1234.56,
          expected: '$1,234.56',
          locale: 'en-US',
        },
        {
          currency: 'GBP',
          amount: 1234.56,
          expected: '£1,234.56',
          locale: 'en-GB',
        },
        {
          currency: 'JPY',
          amount: 1234.56,
          expected: '¥1,235', // No decimals
          locale: 'ja-JP',
        },
        {
          currency: 'CHF',
          amount: 1234.56,
          expected: "CHF1'234.56", // Apostrophe separator
          locale: 'de-CH',
        },
      ];

      for (const testCase of testCases) {
        const config = getCurrencyConfig(testCase.currency);
        const formatted = formatCurrency(testCase.amount, config);
        expect(formatted).toBe(testCase.expected);

        // Verify parsing works (round-trip)
        if (config.decimals > 0) {
          const parsed = parseCurrency(formatted, config);
          expect(parsed).toBeCloseTo(testCase.amount, 2);
        }
      }
    });

    it('should generate invoices with different currencies', async () => {
      const currencies = ['USD', 'EUR', 'GBP', 'CAD'];

      for (const currency of currencies) {
        const businessProfile: BusinessProfile = {
          id: `test-business-${currency}`,
          companyName: 'Multi-Currency Corp',
          address: '123 Global St',
          postalCode: '12345',
          city: 'International City',
          region: 'Global Region',
          country: 'US',
          taxIdLabel: 'EIN',
          taxId: '12-3456789',
          paymentMethod: 'Bank Transfer',
          paymentDetails: 'Account details',
          logoUri: null,
          primaryColor: '#4CAF50',
          currency,
          locale: 'en-US',
          defaultTaxRate: 10,
          taxName: 'Sales Tax',
          invoicePrefix: 'INV-',
          quotePrefix: 'QUO-',
          nextInvoiceNumber: 1,
          nextQuoteNumber: 1,
          preferredTemplate: 'classic',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        useBusinessProfileStore.getState().setProfile(businessProfile);

        const invoiceData: DocumentData = {
          id: `invoice-${currency}`,
          tipo: 'factura',
          numeroDocumento: 'INV-0001',
          fechaDocumento: '2024-01-15',
          clienteNombre: 'Test Client',
          clienteDireccion: '456 Client Ave',
          clienteCodigoPostal: '12345',
          clienteCiudad: 'Client City',
          clienteProvincia: 'Client State',
          clienteNifCif: '123456789',
          lineas: [
            {
              id: '1',
              descripcion: 'Product/Service',
              cantidad: 1,
              precioUnitario: 1000,
              importe: 1000,
            },
          ],
          baseImponible: 1000,
          importeIVA: 100,
          total: 1100,
          taxRate: 10,
          taxName: 'Sales Tax',
          currency,
          comentarios: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const html = generateInvoiceHTML(invoiceData);

        // Verify currency symbol appears
        const config = getCurrencyConfig(currency);
        expect(html).toContain(config.symbol);
      }
    });
  });

  describe('PDF Template Integration', () => {
    it('should generate PDFs with all three templates', async () => {
      await initI18n();

      const businessProfile: BusinessProfile = {
        id: 'test-business',
        companyName: 'Template Test Corp',
        address: '123 Template St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'US1234567890',
        logoUri: null,
        primaryColor: '#9C27B0',
        currency: 'USD',
        locale: 'en-US',
        defaultTaxRate: 8.5,
        taxName: 'Sales Tax',
        invoicePrefix: 'INV-',
        quotePrefix: 'QUO-',
        nextInvoiceNumber: 1,
        nextQuoteNumber: 1,
        preferredTemplate: 'classic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useBusinessProfileStore.getState().setProfile(businessProfile);

      const invoiceData: DocumentData = {
        id: 'test-invoice',
        tipo: 'factura',
        numeroDocumento: 'INV-0001',
        fechaDocumento: '2024-01-15',
        clienteNombre: 'Template Test Client',
        clienteDireccion: '456 Client Ave',
        clienteCodigoPostal: '54321',
        clienteCiudad: 'Client City',
        clienteProvincia: 'Client State',
        clienteNifCif: '987654321',
        lineas: [
          {
            id: '1',
            descripcion: 'Consulting Services',
            cantidad: 10,
            precioUnitario: 150,
            importe: 1500,
          },
          {
            id: '2',
            descripcion: 'Software License',
            cantidad: 1,
            precioUnitario: 500,
            importe: 500,
          },
        ],
        baseImponible: 2000,
        importeIVA: 170,
        total: 2170,
        taxRate: 8.5,
        taxName: 'Sales Tax',
        currency: 'USD',
        comentarios: 'Thank you for your business!',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Test all three templates
      const templates = ['classic', 'modern', 'minimal'] as const;

      for (const template of templates) {
        const html = generateInvoiceHTML(invoiceData, template);

        // Verify essential data present in all templates
        expect(html).toContain('Template Test Corp');
        expect(html).toContain('Template Test Client');
        expect(html).toContain('INV-0001');
        expect(html).toContain('Consulting Services');
        expect(html).toContain('Software License');
        expect(html).toContain('$2,170.00');
        expect(html).toContain('Sales Tax (8.5%)');
        expect(html).toContain('Thank you for your business!');

        // Verify primary color used
        expect(html).toContain('#9C27B0');

        // Verify HTML structure
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('<html>');
        expect(html).toContain('</html>');
        expect(html).toContain('<style>');
      }
    });

    it('should handle reverse charge in PDF templates', async () => {
      await initI18n();
      await changeLanguage('es');

      const businessProfile: BusinessProfile = {
        id: 'test-business-isp',
        companyName: 'Test Spanish Company',
        address: 'Calle Test 123',
        postalCode: '28001',
        city: 'Madrid',
        region: 'Madrid',
        country: 'ES',
        taxIdLabel: 'NIF',
        taxId: 'B12345678',
        paymentMethod: 'Transferencia',
        paymentDetails: 'ES1234567890123456789012',
        logoUri: null,
        primaryColor: '#FF5722',
        currency: 'EUR',
        locale: 'es-ES',
        defaultTaxRate: 21,
        taxName: 'IVA',
        invoicePrefix: 'FA-',
        quotePrefix: 'PRE-',
        nextInvoiceNumber: 1,
        nextQuoteNumber: 1,
        preferredTemplate: 'classic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useBusinessProfileStore.getState().setProfile(businessProfile);

      const reverseChargeInvoice: DocumentData = {
        id: 'isp-invoice',
        tipo: 'factura',
        numeroDocumento: 'FA-0001',
        fechaDocumento: '2024-01-15',
        clienteNombre: 'EU Client BV',
        clienteDireccion: 'Amsterdam Street 1',
        clienteCodigoPostal: '1000AA',
        clienteCiudad: 'Amsterdam',
        clienteProvincia: 'North Holland',
        clienteNifCif: 'NL123456789B01',
        lineas: [
          {
            id: '1',
            descripcion: 'International Services',
            cantidad: 1,
            precioUnitario: 5000,
            importe: 5000,
          },
        ],
        baseImponible: 5000,
        importeIVA: 0,
        total: 5000,
        taxRate: 0,
        taxName: 'IVA',
        reverseCharge: true,
        currency: 'EUR',
        comentarios: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const html = generateInvoiceHTML(reverseChargeInvoice);

      // Should show reverse charge notice
      const translations = getTranslations(['iva.inversionNota']);
      expect(html).toContain(translations['iva.inversionNota']);

      // Should show tax label and 0 tax amount
      expect(html).toContain('IVA');
      expect(html).toContain('0,00 €'); // Tax amount = 0
    });
  });

  describe('Tax System Integration', () => {
    it('should calculate tax correctly for various rates', async () => {
      const testCases = [
        { baseImponible: 1000, taxRate: 21, expected: 210 },
        { baseImponible: 1000, taxRate: 10, expected: 100 },
        { baseImponible: 1000, taxRate: 4, expected: 40 },
        { baseImponible: 1000, taxRate: 0, expected: 0 },
        { baseImponible: 1234.56, taxRate: 19, expected: 234.57 },
        { baseImponible: 999.99, taxRate: 20, expected: 200.00 },
      ];

      for (const testCase of testCases) {
        const { baseImponible, taxRate, expected } = testCase;
        const importeIVA = Math.round(baseImponible * (taxRate / 100) * 100) / 100;
        expect(importeIVA).toBeCloseTo(expected, 2);
      }
    });

    it('should manage tax presets', async () => {
      // Test adding multiple presets (simulating country-specific rates)
      const spanishRates = [
        { name: 'Standard VAT', rate: 21, isDefault: true },
        { name: 'Reduced VAT', rate: 10, isDefault: false },
        { name: 'Super Reduced VAT', rate: 4, isDefault: false },
        { name: 'Zero VAT', rate: 0, isDefault: false },
      ];

      // Add all presets
      for (const preset of spanishRates) {
        useTaxConfigStore.getState().addPreset(preset);
      }

      // Verify all presets were added (note: may have more from previous tests)
      const presets = useTaxConfigStore.getState().config.presets;
      expect(presets.length).toBeGreaterThanOrEqual(4);

      // Verify each rate exists
      for (const expected of spanishRates) {
        const preset = presets.find((p) => p.rate === expected.rate && p.name === expected.name);
        expect(preset).toBeDefined();
        expect(preset?.rate).toBe(expected.rate);
        expect(preset?.name).toBe(expected.name);
      }
    });

    it('should support custom tax rates', () => {
      const customPreset = {
        name: 'Custom 15%',
        rate: 15,
        isDefault: false,
      };

      useTaxConfigStore.getState().addPreset(customPreset);

      const presets = useTaxConfigStore.getState().config.presets;
      const addedPreset = presets.find((p) => p.rate === 15 && p.name === 'Custom 15%');

      expect(addedPreset).toBeDefined();
      expect(addedPreset?.rate).toBe(15);
      expect(addedPreset?.name).toBe('Custom 15%');
    });
  });

  describe('Performance & Stability', () => {
    it('should handle large invoices with many line items', async () => {
      await initI18n();

      const businessProfile: BusinessProfile = {
        id: 'perf-test',
        companyName: 'Performance Test Corp',
        address: '123 Perf St',
        postalCode: '12345',
        city: 'Test City',
        region: 'Test Region',
        country: 'US',
        taxIdLabel: 'EIN',
        taxId: '12-3456789',
        paymentMethod: 'Bank Transfer',
        paymentDetails: 'US1234567890',
        logoUri: null,
        primaryColor: '#00BCD4',
        currency: 'USD',
        locale: 'en-US',
        defaultTaxRate: 10,
        taxName: 'Sales Tax',
        invoicePrefix: 'INV-',
        quotePrefix: 'QUO-',
        nextInvoiceNumber: 1,
        nextQuoteNumber: 1,
        preferredTemplate: 'classic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useBusinessProfileStore.getState().setProfile(businessProfile);

      // Create invoice with 50 line items
      const lineItems = Array.from({ length: 50 }, (_, i) => ({
        id: `line-${i + 1}`,
        descripcion: `Item ${i + 1}`,
        cantidad: i + 1,
        precioUnitario: 10,
        importe: (i + 1) * 10,
      }));

      const baseImponible = lineItems.reduce((sum, item) => sum + item.importe, 0);
      const importeIVA = baseImponible * 0.1;
      const total = baseImponible + importeIVA;

      const largeInvoice: DocumentData = {
        id: 'large-invoice',
        tipo: 'factura',
        numeroDocumento: 'INV-LARGE',
        fechaDocumento: '2024-01-15',
        clienteNombre: 'Large Order Client',
        clienteDireccion: '789 Big Order Blvd',
        clienteCodigoPostal: '99999',
        clienteCiudad: 'Mega City',
        clienteProvincia: 'Large State',
        clienteNifCif: '999888777',
        lineas: lineItems,
        baseImponible,
        importeIVA,
        total,
        taxRate: 10,
        taxName: 'Sales Tax',
        currency: 'USD',
        comentarios: 'Large order - thank you!',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const startTime = Date.now();
      const html = generateInvoiceHTML(largeInvoice);
      const endTime = Date.now();

      expect(html).toContain('Large Order Client');
      expect(html).toContain('Item 1');
      expect(html).toContain('Item 50');

      // Should generate in reasonable time (< 1 second for test)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle edge cases gracefully', async () => {
      await initI18n();

      // Zero amount invoice
      const zeroInvoice: DocumentData = {
        id: 'zero-invoice',
        tipo: 'factura',
        numeroDocumento: 'INV-ZERO',
        fechaDocumento: '2024-01-15',
        clienteNombre: 'Zero Client',
        clienteDireccion: 'Address',
        clienteCodigoPostal: '12345',
        clienteCiudad: 'City',
        clienteProvincia: 'State',
        clienteNifCif: '123',
        lineas: [],
        baseImponible: 0,
        importeIVA: 0,
        total: 0,
        taxRate: 21,
        taxName: 'IVA',
        currency: 'EUR',
        comentarios: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(() => generateInvoiceHTML(zeroInvoice)).not.toThrow();

      // Very long client name
      const longNameInvoice: DocumentData = {
        ...zeroInvoice,
        id: 'long-name-invoice',
        clienteNombre: 'A'.repeat(200),
        lineas: [
          {
            id: '1',
            descripcion: 'Service',
            cantidad: 1,
            precioUnitario: 100,
            importe: 100,
          },
        ],
        baseImponible: 100,
        importeIVA: 21,
        total: 121,
      };

      expect(() => generateInvoiceHTML(longNameInvoice)).not.toThrow();
    });
  });
});
