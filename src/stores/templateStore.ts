// src/stores/templateStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  DocumentTemplate,
  CreateTemplateInput,
  UpdateTemplateInput,
  TemplateFilters,
  TemplateSortBy,
  TemplateAnalytics,
} from '../types/template';
import { generateSecureId } from '../utils/idGenerator';

interface TemplateStoreState {
  /** All templates */
  templates: DocumentTemplate[];

  // CRUD operations
  createTemplate: (input: CreateTemplateInput) => DocumentTemplate;
  getTemplateById: (id: string) => DocumentTemplate | undefined;
  getAllTemplates: () => DocumentTemplate[];
  updateTemplate: (id: string, updates: UpdateTemplateInput) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string, newName: string) => DocumentTemplate | null;

  // Usage tracking
  recordTemplateUsage: (id: string) => void;
  getMostUsedTemplates: (limit?: number) => DocumentTemplate[];
  getRecentlyUsedTemplates: (limit?: number) => DocumentTemplate[];

  // Favorites
  toggleFavorite: (id: string) => void;
  getFavoriteTemplates: () => DocumentTemplate[];

  // Filtering & Sorting
  getFilteredTemplates: (filters: TemplateFilters) => DocumentTemplate[];
  getSortedTemplates: (sortBy: TemplateSortBy, ascending?: boolean) => DocumentTemplate[];

  // Analytics
  getAnalytics: () => TemplateAnalytics;

  // Bulk operations
  deleteMultipleTemplates: (ids: string[]) => void;
  exportTemplates: () => DocumentTemplate[];
  importTemplates: (templates: DocumentTemplate[]) => void;
}

export const useTemplateStore = create<TemplateStoreState>()(
  persist(
    (set, get) => ({
      templates: [],

      // Create new template
      createTemplate: (input: CreateTemplateInput): DocumentTemplate => {
        const now = new Date().toISOString();
        const newTemplate: DocumentTemplate = {
          ...input,
          id: generateSecureId(),
          usageCount: 0,
          lastUsedAt: null,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));

        return newTemplate;
      },

      // Get template by ID
      getTemplateById: (id: string): DocumentTemplate | undefined => {
        return get().templates.find((t) => t.id === id);
      },

      // Get all templates
      getAllTemplates: (): DocumentTemplate[] => {
        return get().templates;
      },

      // Update template
      updateTemplate: (id: string, updates: UpdateTemplateInput): void => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, ...updates, updatedAt: new Date().toISOString() }
              : template
          ),
        }));
      },

      // Delete template
      deleteTemplate: (id: string): void => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      },

      // Duplicate template
      duplicateTemplate: (id: string, newName: string): DocumentTemplate | null => {
        const original = get().getTemplateById(id);
        if (!original) return null;

        const now = new Date().toISOString();
        const duplicated: DocumentTemplate = {
          ...original,
          id: generateSecureId(),
          name: newName,
          usageCount: 0,
          lastUsedAt: null,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          templates: [...state.templates, duplicated],
        }));

        return duplicated;
      },

      // Record template usage
      recordTemplateUsage: (id: string): void => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? {
                  ...template,
                  usageCount: template.usageCount + 1,
                  lastUsedAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : template
          ),
        }));
      },

      // Get most used templates
      getMostUsedTemplates: (limit: number = 5): DocumentTemplate[] => {
        return [...get().templates]
          .filter((t) => t.usageCount > 0)
          .sort((a, b) => b.usageCount - a.usageCount)
          .slice(0, limit);
      },

      // Get recently used templates
      getRecentlyUsedTemplates: (limit: number = 5): DocumentTemplate[] => {
        return [...get().templates]
          .filter((t) => t.lastUsedAt !== null)
          .sort((a, b) => {
            const dateA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
            const dateB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, limit);
      },

      // Toggle favorite
      toggleFavorite: (id: string): void => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? {
                  ...template,
                  isFavorite: !template.isFavorite,
                  updatedAt: new Date().toISOString(),
                }
              : template
          ),
        }));
      },

      // Get favorite templates
      getFavoriteTemplates: (): DocumentTemplate[] => {
        return get().templates.filter((t) => t.isFavorite);
      },

      // Get filtered templates
      getFilteredTemplates: (filters: TemplateFilters): DocumentTemplate[] => {
        let filtered = [...get().templates];

        if (filters.type) {
          filtered = filtered.filter((t) => t.type === filters.type);
        }

        if (filters.clientId) {
          filtered = filtered.filter((t) => t.clientId === filters.clientId);
        }

        if (filters.isFavorite !== undefined) {
          filtered = filtered.filter((t) => t.isFavorite === filters.isFavorite);
        }

        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.name.toLowerCase().includes(query) ||
              (t.description?.toLowerCase().includes(query) ?? false)
          );
        }

        return filtered;
      },

      // Get sorted templates
      getSortedTemplates: (sortBy: TemplateSortBy, ascending: boolean = false): DocumentTemplate[] => {
        const templates = [...get().templates];

        templates.sort((a, b) => {
          let comparison = 0;

          switch (sortBy) {
            case 'name':
              comparison = a.name.localeCompare(b.name);
              break;

            case 'createdAt':
              comparison =
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              break;

            case 'lastUsedAt': {
              const dateA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
              const dateB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
              comparison = dateB - dateA;
              break;
            }

            case 'usageCount':
              comparison = b.usageCount - a.usageCount;
              break;
          }

          return ascending ? -comparison : comparison;
        });

        return templates;
      },

      // Get analytics
      getAnalytics: (): TemplateAnalytics => {
        const templates = get().templates;
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const mostUsed = templates.reduce(
          (max, t) => (t.usageCount > (max?.usageCount ?? 0) ? t : max),
          null as DocumentTemplate | null
        );

        return {
          totalTemplates: templates.length,
          invoiceTemplates: templates.filter((t) => t.type === 'invoice').length,
          quoteTemplates: templates.filter((t) => t.type === 'quote').length,
          favoriteTemplates: templates.filter((t) => t.isFavorite).length,
          mostUsedTemplate: mostUsed,
          recentlyCreated: templates.filter(
            (t) => new Date(t.createdAt) > sevenDaysAgo
          ).length,
        };
      },

      // Delete multiple templates
      deleteMultipleTemplates: (ids: string[]): void => {
        set((state) => ({
          templates: state.templates.filter((t) => !ids.includes(t.id)),
        }));
      },

      // Export templates
      exportTemplates: (): DocumentTemplate[] => {
        return get().templates;
      },

      // Import templates
      importTemplates: (templates: DocumentTemplate[]): void => {
        set((state) => ({
          templates: [...state.templates, ...templates],
        }));
      },
    }),
    {
      name: 'template-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
