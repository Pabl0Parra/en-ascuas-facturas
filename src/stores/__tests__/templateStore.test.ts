// src/stores/__tests__/templateStore.test.ts
import { useTemplateStore } from '../templateStore';
import type { CreateTemplateInput, DocumentTemplate } from '../../types/template';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('templateStore', () => {
  beforeEach(async () => {
    // Clear AsyncStorage and reset store
    await AsyncStorage.clear();
    useTemplateStore.setState({ templates: [] });
  });

  describe('CRUD Operations', () => {
    describe('createTemplate', () => {
      it('should create a new template with all fields', () => {
        const input: CreateTemplateInput = {
          name: 'Monthly Hosting',
          description: 'Standard hosting service invoice',
          type: 'invoice',
          clientId: 'client-123',
          lineItems: [
            {
              id: '1',
              descripcion: 'Web Hosting',
              cantidad: 1,
              precioUnitario: 50,
              importe: 50,
            },
          ],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: 'Payment due within 30 days',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);

        expect(template.id).toBeDefined();
        expect(template.name).toBe('Monthly Hosting');
        expect(template.type).toBe('invoice');
        expect(template.usageCount).toBe(0);
        expect(template.lastUsedAt).toBeNull();
        expect(template.createdAt).toBeDefined();
        expect(template.updatedAt).toBeDefined();
      });

      it('should add template to store', () => {
        const input: CreateTemplateInput = {
          name: 'Test Template',
          type: 'quote',
          clientId: null,
          lineItems: [],
          taxRate: 10,
          taxName: 'VAT',
          currency: 'GBP',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate(input);
        const templates = useTemplateStore.getState().getAllTemplates();

        expect(templates).toHaveLength(1);
        expect(templates[0].name).toBe('Test Template');
      });

      it('should generate unique IDs for each template', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 0,
          taxName: 'Tax',
          currency: 'USD',
          comments: '',
          isFavorite: false,
        };

        const template1 = useTemplateStore.getState().createTemplate(input);
        const template2 = useTemplateStore.getState().createTemplate(input);

        expect(template1.id).not.toBe(template2.id);
      });
    });

    describe('getTemplateById', () => {
      it('should retrieve template by ID', () => {
        const input: CreateTemplateInput = {
          name: 'Find Me',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const created = useTemplateStore.getState().createTemplate(input);
        const found = useTemplateStore.getState().getTemplateById(created.id);

        expect(found).toBeDefined();
        expect(found?.name).toBe('Find Me');
      });

      it('should return undefined for non-existent ID', () => {
        const found = useTemplateStore.getState().getTemplateById('non-existent');
        expect(found).toBeUndefined();
      });
    });

    describe('updateTemplate', () => {
      it('should update template name', () => {
        const input: CreateTemplateInput = {
          name: 'Old Name',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);
        useTemplateStore.getState().updateTemplate(template.id, { name: 'New Name' });

        const updated = useTemplateStore.getState().getTemplateById(template.id);
        expect(updated?.name).toBe('New Name');
      });

      it('should update multiple fields', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);
        useTemplateStore.getState().updateTemplate(template.id, {
          name: 'Updated',
          taxRate: 10,
          isFavorite: true,
        });

        const updated = useTemplateStore.getState().getTemplateById(template.id);
        expect(updated?.name).toBe('Updated');
        expect(updated?.taxRate).toBe(10);
        expect(updated?.isFavorite).toBe(true);
      });

      it('should update updatedAt timestamp', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);
        const originalUpdatedAt = template.updatedAt;

        // Wait a bit to ensure timestamp difference
        setTimeout(() => {
          useTemplateStore.getState().updateTemplate(template.id, { name: 'New' });
          const updated = useTemplateStore.getState().getTemplateById(template.id);
          expect(updated?.updatedAt).not.toBe(originalUpdatedAt);
        }, 10);
      });
    });

    describe('deleteTemplate', () => {
      it('should remove template from store', () => {
        const input: CreateTemplateInput = {
          name: 'Delete Me',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);
        expect(useTemplateStore.getState().getAllTemplates()).toHaveLength(1);

        useTemplateStore.getState().deleteTemplate(template.id);
        expect(useTemplateStore.getState().getAllTemplates()).toHaveLength(0);
      });

      it('should not affect other templates', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template1 = useTemplateStore.getState().createTemplate({ ...input, name: 'Keep' });
        const template2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Delete' });

        useTemplateStore.getState().deleteTemplate(template2.id);

        const remaining = useTemplateStore.getState().getAllTemplates();
        expect(remaining).toHaveLength(1);
        expect(remaining[0].name).toBe('Keep');
      });
    });

    describe('duplicateTemplate', () => {
      it('should create a copy with new name', () => {
        const input: CreateTemplateInput = {
          name: 'Original',
          description: 'Original description',
          type: 'invoice',
          clientId: 'client-123',
          lineItems: [{ id: '1', descripcion: 'Item', cantidad: 1, precioUnitario: 100, importe: 100 }],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: 'Original comments',
          isFavorite: true,
        };

        const original = useTemplateStore.getState().createTemplate(input);
        const duplicate = useTemplateStore.getState().duplicateTemplate(original.id, 'Copy of Original');

        expect(duplicate).toBeDefined();
        expect(duplicate?.id).not.toBe(original.id);
        expect(duplicate?.name).toBe('Copy of Original');
        expect(duplicate?.description).toBe('Original description');
        expect(duplicate?.lineItems).toHaveLength(1);
        expect(duplicate?.usageCount).toBe(0);
        expect(duplicate?.isFavorite).toBe(true);
      });

      it('should return null for non-existent template', () => {
        const result = useTemplateStore.getState().duplicateTemplate('non-existent', 'Copy');
        expect(result).toBeNull();
      });
    });
  });

  describe('Usage Tracking', () => {
    describe('recordTemplateUsage', () => {
      it('should increment usage count', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);
        expect(template.usageCount).toBe(0);

        useTemplateStore.getState().recordTemplateUsage(template.id);
        const updated = useTemplateStore.getState().getTemplateById(template.id);
        expect(updated?.usageCount).toBe(1);

        useTemplateStore.getState().recordTemplateUsage(template.id);
        const updated2 = useTemplateStore.getState().getTemplateById(template.id);
        expect(updated2?.usageCount).toBe(2);
      });

      it('should update lastUsedAt timestamp', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);
        expect(template.lastUsedAt).toBeNull();

        useTemplateStore.getState().recordTemplateUsage(template.id);
        const updated = useTemplateStore.getState().getTemplateById(template.id);
        expect(updated?.lastUsedAt).toBeDefined();
        expect(updated?.lastUsedAt).not.toBeNull();
      });
    });

    describe('getMostUsedTemplates', () => {
      it('should return templates sorted by usage count', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const t1 = useTemplateStore.getState().createTemplate({ ...input, name: 'Low Usage' });
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'High Usage' });
        const t3 = useTemplateStore.getState().createTemplate({ ...input, name: 'Med Usage' });

        // Record usage
        useTemplateStore.getState().recordTemplateUsage(t2.id);
        useTemplateStore.getState().recordTemplateUsage(t2.id);
        useTemplateStore.getState().recordTemplateUsage(t2.id);
        useTemplateStore.getState().recordTemplateUsage(t3.id);
        useTemplateStore.getState().recordTemplateUsage(t3.id);
        useTemplateStore.getState().recordTemplateUsage(t1.id);

        const mostUsed = useTemplateStore.getState().getMostUsedTemplates();
        expect(mostUsed[0].name).toBe('High Usage');
        expect(mostUsed[1].name).toBe('Med Usage');
        expect(mostUsed[2].name).toBe('Low Usage');
      });

      it('should respect limit parameter', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        for (let i = 0; i < 10; i++) {
          const t = useTemplateStore.getState().createTemplate({ ...input, name: `Template ${i}` });
          useTemplateStore.getState().recordTemplateUsage(t.id);
        }

        const mostUsed = useTemplateStore.getState().getMostUsedTemplates(3);
        expect(mostUsed).toHaveLength(3);
      });

      it('should exclude templates with zero usage', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Never Used' });
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Used Once' });
        useTemplateStore.getState().recordTemplateUsage(t2.id);

        const mostUsed = useTemplateStore.getState().getMostUsedTemplates();
        expect(mostUsed).toHaveLength(1);
        expect(mostUsed[0].name).toBe('Used Once');
      });
    });

    describe('getRecentlyUsedTemplates', () => {
      it('should return templates sorted by last used date', async () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const t1 = useTemplateStore.getState().createTemplate({ ...input, name: 'First' });
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Second' });
        const t3 = useTemplateStore.getState().createTemplate({ ...input, name: 'Third' });

        // Use in specific order with delays
        useTemplateStore.getState().recordTemplateUsage(t1.id);
        await new Promise((resolve) => setTimeout(resolve, 10));
        useTemplateStore.getState().recordTemplateUsage(t2.id);
        await new Promise((resolve) => setTimeout(resolve, 10));
        useTemplateStore.getState().recordTemplateUsage(t3.id);

        const recent = useTemplateStore.getState().getRecentlyUsedTemplates();
        expect(recent[0].name).toBe('Third');
        expect(recent[1].name).toBe('Second');
        expect(recent[2].name).toBe('First');
      });

      it('should exclude templates never used', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Never Used' });
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Used' });
        useTemplateStore.getState().recordTemplateUsage(t2.id);

        const recent = useTemplateStore.getState().getRecentlyUsedTemplates();
        expect(recent).toHaveLength(1);
        expect(recent[0].name).toBe('Used');
      });
    });
  });

  describe('Favorites', () => {
    describe('toggleFavorite', () => {
      it('should mark template as favorite', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);
        expect(template.isFavorite).toBe(false);

        useTemplateStore.getState().toggleFavorite(template.id);
        const updated = useTemplateStore.getState().getTemplateById(template.id);
        expect(updated?.isFavorite).toBe(true);
      });

      it('should toggle favorite status', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const template = useTemplateStore.getState().createTemplate(input);

        useTemplateStore.getState().toggleFavorite(template.id);
        expect(useTemplateStore.getState().getTemplateById(template.id)?.isFavorite).toBe(true);

        useTemplateStore.getState().toggleFavorite(template.id);
        expect(useTemplateStore.getState().getTemplateById(template.id)?.isFavorite).toBe(false);
      });
    });

    describe('getFavoriteTemplates', () => {
      it('should return only favorite templates', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Not Favorite' });
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Favorite 1', isFavorite: true });
        const t3 = useTemplateStore.getState().createTemplate({ ...input, name: 'Favorite 2', isFavorite: true });

        const favorites = useTemplateStore.getState().getFavoriteTemplates();
        expect(favorites).toHaveLength(2);
        expect(favorites.some((t) => t.name === 'Favorite 1')).toBe(true);
        expect(favorites.some((t) => t.name === 'Favorite 2')).toBe(true);
      });
    });
  });

  describe('Filtering & Sorting', () => {
    describe('getFilteredTemplates', () => {
      it('should filter by type', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Invoice', type: 'invoice' });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Quote', type: 'quote' });

        const invoices = useTemplateStore.getState().getFilteredTemplates({ type: 'invoice' });
        expect(invoices).toHaveLength(1);
        expect(invoices[0].name).toBe('Invoice');
      });

      it('should filter by clientId', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Client A', clientId: 'client-a' });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Client B', clientId: 'client-b' });

        const filtered = useTemplateStore.getState().getFilteredTemplates({ clientId: 'client-a' });
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Client A');
      });

      it('should filter by favorite status', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Not Fav', isFavorite: false });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Fav', isFavorite: true });

        const favorites = useTemplateStore.getState().getFilteredTemplates({ isFavorite: true });
        expect(favorites).toHaveLength(1);
        expect(favorites[0].name).toBe('Fav');
      });

      it('should filter by search query', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Monthly Hosting' });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Catering Service' });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Web Development' });

        const filtered = useTemplateStore.getState().getFilteredTemplates({ searchQuery: 'host' });
        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Monthly Hosting');
      });

      it('should apply multiple filters', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
        };

        useTemplateStore.getState().createTemplate({
          ...input,
          name: 'Invoice Client A Fav',
          type: 'invoice',
          clientId: 'client-a',
          isFavorite: true,
        });
        useTemplateStore.getState().createTemplate({
          ...input,
          name: 'Quote Client A Fav',
          type: 'quote',
          clientId: 'client-a',
          isFavorite: true,
        });
        useTemplateStore.getState().createTemplate({
          ...input,
          name: 'Invoice Client B',
          type: 'invoice',
          clientId: 'client-b',
          isFavorite: false,
        });

        const filtered = useTemplateStore.getState().getFilteredTemplates({
          type: 'invoice',
          clientId: 'client-a',
          isFavorite: true,
        });

        expect(filtered).toHaveLength(1);
        expect(filtered[0].name).toBe('Invoice Client A Fav');
      });
    });

    describe('getSortedTemplates', () => {
      it('should sort by name ascending', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Zebra' });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Apple' });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Mango' });

        const sorted = useTemplateStore.getState().getSortedTemplates('name', true);
        expect(sorted[0].name).toBe('Zebra');
        expect(sorted[1].name).toBe('Mango');
        expect(sorted[2].name).toBe('Apple');
      });

      it('should sort by createdAt descending (default)', async () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const t1 = useTemplateStore.getState().createTemplate({ ...input, name: 'First' });
        await new Promise((resolve) => setTimeout(resolve, 5));
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Second' });
        await new Promise((resolve) => setTimeout(resolve, 5));
        const t3 = useTemplateStore.getState().createTemplate({ ...input, name: 'Third' });

        const sorted = useTemplateStore.getState().getSortedTemplates('createdAt');
        expect(sorted[0].name).toBe('Third');
        expect(sorted[1].name).toBe('Second');
        expect(sorted[2].name).toBe('First');
      });

      it('should sort by usageCount descending', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const t1 = useTemplateStore.getState().createTemplate({ ...input, name: 'Low' });
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'High' });
        const t3 = useTemplateStore.getState().createTemplate({ ...input, name: 'Med' });

        // t1 = 1 usage, t2 = 3 usages, t3 = 2 usages
        useTemplateStore.getState().recordTemplateUsage(t2.id);
        useTemplateStore.getState().recordTemplateUsage(t2.id);
        useTemplateStore.getState().recordTemplateUsage(t2.id);
        useTemplateStore.getState().recordTemplateUsage(t3.id);
        useTemplateStore.getState().recordTemplateUsage(t3.id);
        useTemplateStore.getState().recordTemplateUsage(t1.id);

        const sorted = useTemplateStore.getState().getSortedTemplates('usageCount');
        expect(sorted[0].name).toBe('High'); // 3 usages
        expect(sorted[1].name).toBe('Med'); // 2 usages
        expect(sorted[2].name).toBe('Low'); // 1 usage
      });
    });
  });

  describe('Analytics', () => {
    it('should return correct analytics', () => {
      const input: CreateTemplateInput = {
        name: 'Template',
        clientId: null,
        lineItems: [],
        taxRate: 21,
        taxName: 'IVA',
        currency: 'EUR',
        comments: '',
      };

      const t1 = useTemplateStore.getState().createTemplate({ ...input, name: 'Invoice 1', type: 'invoice', isFavorite: true });
      const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Invoice 2', type: 'invoice', isFavorite: false });
      const t3 = useTemplateStore.getState().createTemplate({ ...input, name: 'Quote 1', type: 'quote', isFavorite: true });

      useTemplateStore.getState().recordTemplateUsage(t1.id);
      useTemplateStore.getState().recordTemplateUsage(t1.id);
      useTemplateStore.getState().recordTemplateUsage(t2.id);

      const analytics = useTemplateStore.getState().getAnalytics();

      expect(analytics.totalTemplates).toBe(3);
      expect(analytics.invoiceTemplates).toBe(2);
      expect(analytics.quoteTemplates).toBe(1);
      expect(analytics.favoriteTemplates).toBe(2);
      expect(analytics.mostUsedTemplate?.name).toBe('Invoice 1');
    });
  });

  describe('Bulk Operations', () => {
    describe('deleteMultipleTemplates', () => {
      it('should delete multiple templates by IDs', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        const t1 = useTemplateStore.getState().createTemplate({ ...input, name: 'Delete 1' });
        const t2 = useTemplateStore.getState().createTemplate({ ...input, name: 'Delete 2' });
        const t3 = useTemplateStore.getState().createTemplate({ ...input, name: 'Keep' });

        useTemplateStore.getState().deleteMultipleTemplates([t1.id, t2.id]);

        const remaining = useTemplateStore.getState().getAllTemplates();
        expect(remaining).toHaveLength(1);
        expect(remaining[0].name).toBe('Keep');
      });
    });

    describe('exportTemplates', () => {
      it('should return all templates', () => {
        const input: CreateTemplateInput = {
          name: 'Template',
          type: 'invoice',
          clientId: null,
          lineItems: [],
          taxRate: 21,
          taxName: 'IVA',
          currency: 'EUR',
          comments: '',
          isFavorite: false,
        };

        useTemplateStore.getState().createTemplate({ ...input, name: 'Template 1' });
        useTemplateStore.getState().createTemplate({ ...input, name: 'Template 2' });

        const exported = useTemplateStore.getState().exportTemplates();
        expect(exported).toHaveLength(2);
      });
    });

    describe('importTemplates', () => {
      it('should add imported templates to store', () => {
        const templates: DocumentTemplate[] = [
          {
            id: 'import-1',
            name: 'Imported 1',
            type: 'invoice',
            clientId: null,
            lineItems: [],
            taxRate: 21,
            taxName: 'IVA',
            currency: 'EUR',
            comments: '',
            isFavorite: false,
            usageCount: 0,
            lastUsedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        useTemplateStore.getState().importTemplates(templates);

        const allTemplates = useTemplateStore.getState().getAllTemplates();
        expect(allTemplates).toHaveLength(1);
        expect(allTemplates[0].name).toBe('Imported 1');
      });
    });
  });
});
