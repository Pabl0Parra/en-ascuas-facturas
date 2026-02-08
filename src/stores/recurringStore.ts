// src/stores/recurringStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  RecurringRule,
  CreateRecurringRuleInput,
  UpdateRecurringRuleInput,
  RecurringRuleFilters,
  RecurringRuleSortBy,
  RecurringAnalytics,
} from '../types/recurring';
import { generateSecureId } from '../utils/idGenerator';

interface RecurringStoreState {
  /** All recurring rules */
  rules: RecurringRule[];

  // CRUD operations
  createRule: (input: CreateRecurringRuleInput) => RecurringRule;
  getRuleById: (id: string) => RecurringRule | undefined;
  getAllRules: () => RecurringRule[];
  updateRule: (id: string, updates: UpdateRecurringRuleInput) => void;
  deleteRule: (id: string) => void;

  // Active/Pause
  toggleRuleStatus: (id: string) => void;
  pauseRule: (id: string) => void;
  resumeRule: (id: string) => void;

  // Generation tracking
  recordGeneration: (ruleId: string, documentId: string) => void;
  updateNextDueDate: (ruleId: string, nextDate: string) => void;

  // Queries
  getActiveRules: () => RecurringRule[];
  getDueRules: (asOfDate?: string) => RecurringRule[];
  getRulesByTemplate: (templateId: string) => RecurringRule[];

  // Filtering & Sorting
  getFilteredRules: (filters: RecurringRuleFilters) => RecurringRule[];
  getSortedRules: (sortBy: RecurringRuleSortBy, ascending?: boolean) => RecurringRule[];

  // Analytics
  getAnalytics: () => RecurringAnalytics;

  // Bulk operations
  deleteMultipleRules: (ids: string[]) => void;
  pauseMultipleRules: (ids: string[]) => void;
  resumeMultipleRules: (ids: string[]) => void;
  exportRules: () => RecurringRule[];
  importRules: (rules: RecurringRule[]) => void;
}

export const useRecurringStore = create<RecurringStoreState>()(
  persist(
    (set, get) => ({
      rules: [],

      // Create new recurring rule
      createRule: (input: CreateRecurringRuleInput): RecurringRule => {
        const now = new Date().toISOString();
        const newRule: RecurringRule = {
          ...input,
          id: generateSecureId(),
          nextDueDate: input.startDate, // First due date = start date
          lastGeneratedDate: null,
          generatedDocumentIds: [],
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          rules: [...state.rules, newRule],
        }));

        return newRule;
      },

      // Get rule by ID
      getRuleById: (id: string): RecurringRule | undefined => {
        return get().rules.find((r) => r.id === id);
      },

      // Get all rules
      getAllRules: (): RecurringRule[] => {
        return get().rules;
      },

      // Update rule
      updateRule: (id: string, updates: UpdateRecurringRuleInput): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id
              ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
              : rule
          ),
        }));
      },

      // Delete rule
      deleteRule: (id: string): void => {
        set((state) => ({
          rules: state.rules.filter((r) => r.id !== id),
        }));
      },

      // Toggle rule status
      toggleRuleStatus: (id: string): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id
              ? {
                  ...rule,
                  isActive: !rule.isActive,
                  updatedAt: new Date().toISOString(),
                }
              : rule
          ),
        }));
      },

      // Pause rule
      pauseRule: (id: string): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id
              ? {
                  ...rule,
                  isActive: false,
                  updatedAt: new Date().toISOString(),
                }
              : rule
          ),
        }));
      },

      // Resume rule
      resumeRule: (id: string): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === id
              ? {
                  ...rule,
                  isActive: true,
                  updatedAt: new Date().toISOString(),
                }
              : rule
          ),
        }));
      },

      // Record generation
      recordGeneration: (ruleId: string, documentId: string): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === ruleId
              ? {
                  ...rule,
                  lastGeneratedDate: new Date().toISOString(),
                  generatedDocumentIds: [...rule.generatedDocumentIds, documentId],
                  updatedAt: new Date().toISOString(),
                }
              : rule
          ),
        }));
      },

      // Update next due date
      updateNextDueDate: (ruleId: string, nextDate: string): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            rule.id === ruleId
              ? {
                  ...rule,
                  nextDueDate: nextDate,
                  updatedAt: new Date().toISOString(),
                }
              : rule
          ),
        }));
      },

      // Get active rules
      getActiveRules: (): RecurringRule[] => {
        return get().rules.filter((r) => r.isActive);
      },

      // Get due rules (active rules where nextDueDate <= today)
      getDueRules: (asOfDate?: string): RecurringRule[] => {
        const today = asOfDate || new Date().toISOString().split('T')[0];
        return get()
          .getActiveRules()
          .filter((rule) => rule.nextDueDate <= today);
      },

      // Get rules by template
      getRulesByTemplate: (templateId: string): RecurringRule[] => {
        return get().rules.filter((r) => r.templateId === templateId);
      },

      // Get filtered rules
      getFilteredRules: (filters: RecurringRuleFilters): RecurringRule[] => {
        let filtered = [...get().rules];

        if (filters.templateId) {
          filtered = filtered.filter((r) => r.templateId === filters.templateId);
        }

        if (filters.frequency) {
          filtered = filtered.filter((r) => r.frequency === filters.frequency);
        }

        if (filters.isActive !== undefined) {
          filtered = filtered.filter((r) => r.isActive === filters.isActive);
        }

        if (filters.dueBefore) {
          filtered = filtered.filter((r) => r.nextDueDate < filters.dueBefore!);
        }

        if (filters.dueAfter) {
          filtered = filtered.filter((r) => r.nextDueDate > filters.dueAfter!);
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.name.toLowerCase().includes(query) ||
              (r.description?.toLowerCase().includes(query) ?? false)
          );
        }

        return filtered;
      },

      // Get sorted rules
      getSortedRules: (sortBy: RecurringRuleSortBy, ascending: boolean = false): RecurringRule[] => {
        const rules = [...get().rules];

        rules.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;

            case 'nextDueDate':
              comparison =
                new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime();
              break;

            case 'lastGeneratedDate': {
              const dateA = a.lastGeneratedDate ? new Date(a.lastGeneratedDate).getTime() : 0;
              const dateB = b.lastGeneratedDate ? new Date(b.lastGeneratedDate).getTime() : 0;
              comparison = dateB - dateA;
              break;
            }

            case 'createdAt':
              comparison =
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              break;
          }

          return ascending ? comparison : -comparison;
        });

        return rules;
      },

      // Get analytics
      getAnalytics: (): RecurringAnalytics => {
        const rules = get().rules;
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const nextDue = rules
          .filter((r) => r.isActive)
          .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())[0] || null;

        const generatedThisMonth = rules.reduce((count, rule) => {
          return count + rule.generatedDocumentIds.filter((id) => {
            // Note: We don't have document dates here, so this is approximate
            // In a real implementation, you'd check document metadata
            return rule.lastGeneratedDate && new Date(rule.lastGeneratedDate) >= firstOfMonth;
          }).length;
        }, 0);

        return {
          totalRules: rules.length,
          activeRules: rules.filter((r) => r.isActive).length,
          pausedRules: rules.filter((r) => !r.isActive).length,
          weeklyRules: rules.filter((r) => r.frequency === 'weekly').length,
          biweeklyRules: rules.filter((r) => r.frequency === 'biweekly').length,
          monthlyRules: rules.filter((r) => r.frequency === 'monthly').length,
          quarterlyRules: rules.filter((r) => r.frequency === 'quarterly').length,
          yearlyRules: rules.filter((r) => r.frequency === 'yearly').length,
          totalGenerated: rules.reduce((sum, r) => sum + r.generatedDocumentIds.length, 0),
          generatedThisMonth,
          nextDueRule: nextDue,
        };
      },

      // Delete multiple rules
      deleteMultipleRules: (ids: string[]): void => {
        set((state) => ({
          rules: state.rules.filter((r) => !ids.includes(r.id)),
        }));
      },

      // Pause multiple rules
      pauseMultipleRules: (ids: string[]): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            ids.includes(rule.id)
              ? { ...rule, isActive: false, updatedAt: new Date().toISOString() }
              : rule
          ),
        }));
      },

      // Resume multiple rules
      resumeMultipleRules: (ids: string[]): void => {
        set((state) => ({
          rules: state.rules.map((rule) =>
            ids.includes(rule.id)
              ? { ...rule, isActive: true, updatedAt: new Date().toISOString() }
              : rule
          ),
        }));
      },

      // Export rules
      exportRules: (): RecurringRule[] => {
        return get().rules;
      },

      // Import rules
      importRules: (rules: RecurringRule[]): void => {
        set((state) => ({
          rules: [...state.rules, ...rules],
        }));
      },
    }),
    {
      name: 'recurring-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
