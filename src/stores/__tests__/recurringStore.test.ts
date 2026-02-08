// src/stores/__tests__/recurringStore.test.ts
import { useRecurringStore } from '../recurringStore';
import type { CreateRecurringRuleInput } from '../../types/recurring';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('recurringStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useRecurringStore.setState({ rules: [] });
  });

  describe('CRUD Operations', () => {
    it('should create a new recurring rule', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Monthly Hosting',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const rule = useRecurringStore.getState().createRule(input);

      expect(rule.id).toBeDefined();
      expect(rule.name).toBe('Monthly Hosting');
      expect(rule.nextDueDate).toBe('2024-01-01'); // First due = start date
      expect(rule.lastGeneratedDate).toBeNull();
      expect(rule.generatedDocumentIds).toEqual([]);
    });

    it('should retrieve rule by ID', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Test Rule',
        templateId: 'template-123',
        frequency: 'weekly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const created = useRecurringStore.getState().createRule(input);
      const found = useRecurringStore.getState().getRuleById(created.id);

      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Rule');
    });

    it('should update rule', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Old Name',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const rule = useRecurringStore.getState().createRule(input);
      useRecurringStore.getState().updateRule(rule.id, { name: 'New Name', frequency: 'weekly' });

      const updated = useRecurringStore.getState().getRuleById(rule.id);
      expect(updated?.name).toBe('New Name');
      expect(updated?.frequency).toBe('weekly');
    });

    it('should delete rule', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Delete Me',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const rule = useRecurringStore.getState().createRule(input);
      expect(useRecurringStore.getState().getAllRules()).toHaveLength(1);

      useRecurringStore.getState().deleteRule(rule.id);
      expect(useRecurringStore.getState().getAllRules()).toHaveLength(0);
    });
  });

  describe('Active/Pause', () => {
    it('should toggle rule status', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Toggle Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const rule = useRecurringStore.getState().createRule(input);
      expect(rule.isActive).toBe(true);

      useRecurringStore.getState().toggleRuleStatus(rule.id);
      expect(useRecurringStore.getState().getRuleById(rule.id)?.isActive).toBe(false);

      useRecurringStore.getState().toggleRuleStatus(rule.id);
      expect(useRecurringStore.getState().getRuleById(rule.id)?.isActive).toBe(true);
    });

    it('should pause rule', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Active Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const rule = useRecurringStore.getState().createRule(input);
      useRecurringStore.getState().pauseRule(rule.id);

      expect(useRecurringStore.getState().getRuleById(rule.id)?.isActive).toBe(false);
    });

    it('should resume rule', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Paused Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: false,
      };

      const rule = useRecurringStore.getState().createRule(input);
      useRecurringStore.getState().resumeRule(rule.id);

      expect(useRecurringStore.getState().getRuleById(rule.id)?.isActive).toBe(true);
    });
  });

  describe('Generation Tracking', () => {
    it('should record generation', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Test Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const rule = useRecurringStore.getState().createRule(input);
      expect(rule.generatedDocumentIds).toEqual([]);

      useRecurringStore.getState().recordGeneration(rule.id, 'doc-1');
      const updated = useRecurringStore.getState().getRuleById(rule.id);
      expect(updated?.generatedDocumentIds).toEqual(['doc-1']);
      expect(updated?.lastGeneratedDate).toBeDefined();

      useRecurringStore.getState().recordGeneration(rule.id, 'doc-2');
      const updated2 = useRecurringStore.getState().getRuleById(rule.id);
      expect(updated2?.generatedDocumentIds).toEqual(['doc-1', 'doc-2']);
    });

    it('should update next due date', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Test Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const rule = useRecurringStore.getState().createRule(input);
      expect(rule.nextDueDate).toBe('2024-01-01');

      useRecurringStore.getState().updateNextDueDate(rule.id, '2024-02-01');
      expect(useRecurringStore.getState().getRuleById(rule.id)?.nextDueDate).toBe('2024-02-01');
    });
  });

  describe('Queries', () => {
    it('should get active rules', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
      };

      useRecurringStore.getState().createRule({ ...input, name: 'Active 1', isActive: true });
      useRecurringStore.getState().createRule({ ...input, name: 'Paused', isActive: false });
      useRecurringStore.getState().createRule({ ...input, name: 'Active 2', isActive: true });

      const active = useRecurringStore.getState().getActiveRules();
      expect(active).toHaveLength(2);
      expect(active.every((r) => r.isActive)).toBe(true);
    });

    it('should get due rules', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      useRecurringStore.getState().createRule({ ...input, name: 'Past Due', startDate: '2024-01-01' });
      useRecurringStore.getState().createRule({ ...input, name: 'Future', startDate: '2099-01-01' });

      const due = useRecurringStore.getState().getDueRules('2024-12-31');
      expect(due).toHaveLength(1);
      expect(due[0].name).toBe('Past Due');
    });

    it('should get rules by template', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      useRecurringStore.getState().createRule({ ...input, name: 'Template A Rule 1', templateId: 'template-a' });
      useRecurringStore.getState().createRule({ ...input, name: 'Template B Rule', templateId: 'template-b' });
      useRecurringStore.getState().createRule({ ...input, name: 'Template A Rule 2', templateId: 'template-a' });

      const rules = useRecurringStore.getState().getRulesByTemplate('template-a');
      expect(rules).toHaveLength(2);
      expect(rules.every((r) => r.templateId === 'template-a')).toBe(true);
    });
  });

  describe('Filtering & Sorting', () => {
    it('should filter by frequency', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      useRecurringStore.getState().createRule({ ...input, name: 'Weekly', frequency: 'weekly' });
      useRecurringStore.getState().createRule({ ...input, name: 'Monthly', frequency: 'monthly' });

      const monthly = useRecurringStore.getState().getFilteredRules({ frequency: 'monthly' });
      expect(monthly).toHaveLength(1);
      expect(monthly[0].name).toBe('Monthly');
    });

    it('should filter by active status', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
      };

      useRecurringStore.getState().createRule({ ...input, name: 'Active', isActive: true });
      useRecurringStore.getState().createRule({ ...input, name: 'Paused', isActive: false });

      const paused = useRecurringStore.getState().getFilteredRules({ isActive: false });
      expect(paused).toHaveLength(1);
      expect(paused[0].name).toBe('Paused');
    });

    it('should sort by name', () => {
      const input: CreateRecurringRuleInput = {
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      useRecurringStore.getState().createRule({ ...input, name: 'Zebra' });
      useRecurringStore.getState().createRule({ ...input, name: 'Apple' });
      useRecurringStore.getState().createRule({ ...input, name: 'Mango' });

      const sorted = useRecurringStore.getState().getSortedRules('name', true);
      expect(sorted[0].name).toBe('Apple');
      expect(sorted[1].name).toBe('Mango');
      expect(sorted[2].name).toBe('Zebra');
    });

    it('should sort by next due date', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      useRecurringStore.getState().createRule({ ...input, name: 'Third', startDate: '2024-03-01' });
      useRecurringStore.getState().createRule({ ...input, name: 'First', startDate: '2024-01-01' });
      useRecurringStore.getState().createRule({ ...input, name: 'Second', startDate: '2024-02-01' });

      const sorted = useRecurringStore.getState().getSortedRules('nextDueDate', true);
      expect(sorted[0].name).toBe('First');
      expect(sorted[1].name).toBe('Second');
      expect(sorted[2].name).toBe('Third');
    });
  });

  describe('Analytics', () => {
    it('should return correct analytics', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
      };

      useRecurringStore.getState().createRule({ ...input, frequency: 'weekly', isActive: true });
      useRecurringStore.getState().createRule({ ...input, frequency: 'monthly', isActive: true });
      useRecurringStore.getState().createRule({ ...input, frequency: 'monthly', isActive: false });
      useRecurringStore.getState().createRule({ ...input, frequency: 'quarterly', isActive: true });

      const analytics = useRecurringStore.getState().getAnalytics();

      expect(analytics.totalRules).toBe(4);
      expect(analytics.activeRules).toBe(3);
      expect(analytics.pausedRules).toBe(1);
      expect(analytics.weeklyRules).toBe(1);
      expect(analytics.monthlyRules).toBe(2);
      expect(analytics.quarterlyRules).toBe(1);
    });
  });

  describe('Bulk Operations', () => {
    it('should delete multiple rules', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const r1 = useRecurringStore.getState().createRule({ ...input, name: 'Delete 1' });
      const r2 = useRecurringStore.getState().createRule({ ...input, name: 'Delete 2' });
      const r3 = useRecurringStore.getState().createRule({ ...input, name: 'Keep' });

      useRecurringStore.getState().deleteMultipleRules([r1.id, r2.id]);

      const remaining = useRecurringStore.getState().getAllRules();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe('Keep');
    });

    it('should pause multiple rules', () => {
      const input: CreateRecurringRuleInput = {
        name: 'Rule',
        templateId: 'template-123',
        frequency: 'monthly',
        startDate: '2024-01-01',
        endDate: null,
        autoNumbering: true,
        isActive: true,
      };

      const r1 = useRecurringStore.getState().createRule({ ...input, name: 'Pause 1' });
      const r2 = useRecurringStore.getState().createRule({ ...input, name: 'Pause 2' });
      const r3 = useRecurringStore.getState().createRule({ ...input, name: 'Keep Active' });

      useRecurringStore.getState().pauseMultipleRules([r1.id, r2.id]);

      expect(useRecurringStore.getState().getRuleById(r1.id)?.isActive).toBe(false);
      expect(useRecurringStore.getState().getRuleById(r2.id)?.isActive).toBe(false);
      expect(useRecurringStore.getState().getRuleById(r3.id)?.isActive).toBe(true);
    });
  });
});
