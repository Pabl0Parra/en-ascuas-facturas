// src/stores/businessProfileStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BusinessProfile, MigrationState, BusinessProfileFormData } from '../types/businessProfile';
import { generateSecureId } from '../utils/idGenerator';

interface BusinessProfileState {
  profile: BusinessProfile | null;
  migration: MigrationState;

  // Actions
  setProfile: (profile: BusinessProfile | null) => void;
  updateProfile: (updates: Partial<BusinessProfile>) => void;
  completeOnboarding: () => void;
  isOnboardingRequired: () => boolean;
  incrementInvoiceNumber: () => number;
  incrementQuoteNumber: () => number;
  reset: () => void;
}

export const useBusinessProfileStore = create<BusinessProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      migration: {
        schemaVersion: 1,
        hasCompletedOnboarding: false,
        migratedFromLegacy: false,
        migrationDate: null,
      },

      setProfile: (profile: BusinessProfile | null): void => {
        set({ profile });
      },

      updateProfile: (updates: Partial<BusinessProfile>): void => {
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates, updatedAt: new Date().toISOString() }
            : null
        }));
      },

      completeOnboarding: (): void => {
        set((state) => ({
          migration: {
            ...state.migration,
            hasCompletedOnboarding: true,
          },
        }));
      },

      isOnboardingRequired: (): boolean => {
        const { profile, migration } = get();
        return !migration.hasCompletedOnboarding || !profile;
      },

      incrementInvoiceNumber: (): number => {
        const { profile } = get();
        if (!profile) return 1;

        const currentNumber = profile.nextInvoiceNumber;
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, nextInvoiceNumber: currentNumber + 1 }
            : null
        }));

        return currentNumber;
      },

      incrementQuoteNumber: (): number => {
        const { profile } = get();
        if (!profile) return 1;

        const currentNumber = profile.nextQuoteNumber;
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, nextQuoteNumber: currentNumber + 1 }
            : null
        }));

        return currentNumber;
      },

      reset: (): void => {
        set({
          profile: null,
          migration: {
            schemaVersion: 1,
            hasCompletedOnboarding: false,
            migratedFromLegacy: false,
            migrationDate: null,
          },
        });
      },
    }),
    {
      name: 'business-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
