// src/stores/taxConfigStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TaxPreset, TaxConfig } from '../types/tax';
import { generateSecureId } from '../utils/idGenerator';

interface TaxConfigState {
  config: TaxConfig;

  // Actions
  addPreset: (preset: Omit<TaxPreset, 'id' | 'createdAt'>) => void;
  updatePreset: (id: string, updates: Partial<TaxPreset>) => void;
  deletePreset: (id: string) => void;
  setDefaultPreset: (id: string) => void;
  getPresetById: (id: string) => TaxPreset | undefined;
  getDefaultPreset: () => TaxPreset | undefined;
  initializeFromCountryDefaults: (countryCode: string) => void;
  reset: () => void;
}

export const useTaxConfigStore = create<TaxConfigState>()(
  persist(
    (set, get) => ({
      config: {
        taxName: 'Tax',
        presets: [],
        allowPerLineItemTax: false,
        reverseChargeEnabled: false,
        reverseChargeLabel: 'Reverse Charge',
      },

      addPreset: (presetData): void => {
        const newPreset: TaxPreset = {
          ...presetData,
          id: generateSecureId(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          config: {
            ...state.config,
            presets: [...state.config.presets, newPreset],
          },
        }));
      },

      updatePreset: (id: string, updates: Partial<TaxPreset>): void => {
        set((state) => ({
          config: {
            ...state.config,
            presets: state.config.presets.map((preset) =>
              preset.id === id ? { ...preset, ...updates } : preset
            ),
          },
        }));
      },

      deletePreset: (id: string): void => {
        set((state) => ({
          config: {
            ...state.config,
            presets: state.config.presets.filter((preset) => preset.id !== id),
          },
        }));
      },

      setDefaultPreset: (id: string): void => {
        set((state) => ({
          config: {
            ...state.config,
            presets: state.config.presets.map((preset) => ({
              ...preset,
              isDefault: preset.id === id,
            })),
          },
        }));
      },

      getPresetById: (id: string): TaxPreset | undefined => {
        return get().config.presets.find((preset) => preset.id === id);
      },

      getDefaultPreset: (): TaxPreset | undefined => {
        return get().config.presets.find((preset) => preset.isDefault);
      },

      initializeFromCountryDefaults: (countryCode: string): void => {
        // Import here to avoid circular dependencies
        const { getCountryDefaults } = require('../config/countryDefaults');
        const defaults = getCountryDefaults(countryCode);

        const presets: TaxPreset[] = defaults.taxPresets.map((preset: any, index: number) => ({
          id: generateSecureId(),
          name: preset.name,
          rate: preset.rate,
          isDefault: index === 0, // First preset is default
          createdAt: new Date().toISOString(),
        }));

        set({
          config: {
            taxName: defaults.taxName,
            presets,
            allowPerLineItemTax: false,
            reverseChargeEnabled: countryCode === 'ES' || countryCode === 'GB', // Enable for EU
            reverseChargeLabel:
              countryCode === 'ES'
                ? 'Inversión del Sujeto Pasivo'
                : 'Reverse Charge',
          },
        });
      },

      reset: (): void => {
        set({
          config: {
            taxName: 'Tax',
            presets: [],
            allowPerLineItemTax: false,
            reverseChargeEnabled: false,
            reverseChargeLabel: 'Reverse Charge',
          },
        });
      },
    }),
    {
      name: 'tax-config-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
