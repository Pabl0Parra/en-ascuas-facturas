import { useTaxConfigStore } from '../taxConfigStore';
import type { TaxPreset } from '../../types/tax';

describe('taxConfigStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useTaxConfigStore.setState({
      config: {
        taxName: 'Tax',
        presets: [],
        allowPerLineItemTax: false,
        reverseChargeEnabled: false,
        reverseChargeLabel: 'Reverse Charge',
      },
    });
  });

  describe('addPreset', () => {
    it('should add a new tax preset', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Standard VAT',
        rate: 20,
        isDefault: true,
      });

      const { config } = useTaxConfigStore.getState();
      expect(config.presets).toHaveLength(1);
      expect(config.presets[0].name).toBe('Standard VAT');
      expect(config.presets[0].rate).toBe(20);
      expect(config.presets[0].isDefault).toBe(true);
      expect(config.presets[0].id).toBeDefined();
      expect(config.presets[0].createdAt).toBeDefined();
    });

    it('should add multiple presets', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Standard Rate',
        rate: 21,
        isDefault: true,
      });

      useTaxConfigStore.getState().addPreset({
        name: 'Reduced Rate',
        rate: 10,
        isDefault: false,
      });

      const { config } = useTaxConfigStore.getState();
      expect(config.presets).toHaveLength(2);
    });
  });

  describe('updatePreset', () => {
    it('should update an existing preset', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Original Name',
        rate: 15,
        isDefault: true,
      });

      const presetId = useTaxConfigStore.getState().config.presets[0].id;

      useTaxConfigStore.getState().updatePreset(presetId, {
        name: 'Updated Name',
        rate: 18,
      });

      const preset = useTaxConfigStore.getState().getPresetById(presetId);
      expect(preset?.name).toBe('Updated Name');
      expect(preset?.rate).toBe(18);
      expect(preset?.isDefault).toBe(true); // Unchanged
    });

    it('should not update non-existent preset', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Test',
        rate: 10,
        isDefault: true,
      });

      const initialLength = useTaxConfigStore.getState().config.presets.length;

      useTaxConfigStore.getState().updatePreset('non-existent-id', {
        name: 'Should Not Exist',
      });

      expect(useTaxConfigStore.getState().config.presets).toHaveLength(initialLength);
    });
  });

  describe('deletePreset', () => {
    it('should delete a preset', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'To Delete',
        rate: 5,
        isDefault: false,
      });

      const presetId = useTaxConfigStore.getState().config.presets[0].id;
      expect(useTaxConfigStore.getState().config.presets).toHaveLength(1);

      useTaxConfigStore.getState().deletePreset(presetId);
      expect(useTaxConfigStore.getState().config.presets).toHaveLength(0);
    });

    it('should not affect other presets when deleting', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Keep This',
        rate: 20,
        isDefault: true,
      });

      useTaxConfigStore.getState().addPreset({
        name: 'Delete This',
        rate: 10,
        isDefault: false,
      });

      const deleteId = useTaxConfigStore.getState().config.presets[1].id;
      useTaxConfigStore.getState().deletePreset(deleteId);

      const { config } = useTaxConfigStore.getState();
      expect(config.presets).toHaveLength(1);
      expect(config.presets[0].name).toBe('Keep This');
    });
  });

  describe('setDefaultPreset', () => {
    it('should set a preset as default', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Preset 1',
        rate: 20,
        isDefault: true,
      });

      useTaxConfigStore.getState().addPreset({
        name: 'Preset 2',
        rate: 10,
        isDefault: false,
      });

      const preset2Id = useTaxConfigStore.getState().config.presets[1].id;
      useTaxConfigStore.getState().setDefaultPreset(preset2Id);

      const { config } = useTaxConfigStore.getState();
      expect(config.presets[0].isDefault).toBe(false);
      expect(config.presets[1].isDefault).toBe(true);
    });

    it('should unset previous default when setting new default', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'First Default',
        rate: 21,
        isDefault: true,
      });

      useTaxConfigStore.getState().addPreset({
        name: 'New Default',
        rate: 10,
        isDefault: false,
      });

      const preset2Id = useTaxConfigStore.getState().config.presets[1].id;
      useTaxConfigStore.getState().setDefaultPreset(preset2Id);

      const defaultPreset = useTaxConfigStore.getState().getDefaultPreset();
      expect(defaultPreset?.name).toBe('New Default');
    });
  });

  describe('getPresetById', () => {
    it('should return preset when found', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Test Preset',
        rate: 15,
        isDefault: true,
      });

      const presetId = useTaxConfigStore.getState().config.presets[0].id;
      const preset = useTaxConfigStore.getState().getPresetById(presetId);

      expect(preset).toBeDefined();
      expect(preset?.name).toBe('Test Preset');
    });

    it('should return undefined when not found', () => {
      const preset = useTaxConfigStore.getState().getPresetById('non-existent');
      expect(preset).toBeUndefined();
    });
  });

  describe('getDefaultPreset', () => {
    it('should return the default preset', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Not Default',
        rate: 5,
        isDefault: false,
      });

      useTaxConfigStore.getState().addPreset({
        name: 'Default One',
        rate: 20,
        isDefault: true,
      });

      const defaultPreset = useTaxConfigStore.getState().getDefaultPreset();
      expect(defaultPreset?.name).toBe('Default One');
    });

    it('should return undefined when no default exists', () => {
      useTaxConfigStore.getState().addPreset({
        name: 'Not Default',
        rate: 10,
        isDefault: false,
      });

      const defaultPreset = useTaxConfigStore.getState().getDefaultPreset();
      expect(defaultPreset).toBeUndefined();
    });
  });

  describe('initializeFromCountryDefaults', () => {
    it('should initialize presets from Spain defaults', () => {
      useTaxConfigStore.getState().initializeFromCountryDefaults('ES');

      const { config } = useTaxConfigStore.getState();
      expect(config.taxName).toBe('IVA');
      expect(config.presets.length).toBeGreaterThan(0);
      expect(config.reverseChargeEnabled).toBe(true);
      expect(config.reverseChargeLabel).toBe('Inversión del Sujeto Pasivo');

      // First preset should be default
      expect(config.presets[0].isDefault).toBe(true);

      // Should have Spanish tax rates
      const rates = config.presets.map(p => p.rate);
      expect(rates).toContain(21); // IVA General
    });

    it('should initialize presets from UK defaults', () => {
      useTaxConfigStore.getState().initializeFromCountryDefaults('GB');

      const { config } = useTaxConfigStore.getState();
      expect(config.taxName).toBe('VAT');
      expect(config.reverseChargeEnabled).toBe(true);
      expect(config.reverseChargeLabel).toBe('Reverse Charge');

      const rates = config.presets.map(p => p.rate);
      expect(rates).toContain(20); // Standard VAT
    });

    it('should initialize presets from US defaults', () => {
      useTaxConfigStore.getState().initializeFromCountryDefaults('US');

      const { config } = useTaxConfigStore.getState();
      expect(config.taxName).toBe('Sales Tax');
      expect(config.reverseChargeEnabled).toBe(false);
    });

    it('should handle unknown country codes gracefully', () => {
      useTaxConfigStore.getState().initializeFromCountryDefaults('XX');

      const { config } = useTaxConfigStore.getState();
      expect(config.taxName).toBe('Tax');
      expect(config.presets.length).toBeGreaterThan(0);
    });
  });
});
