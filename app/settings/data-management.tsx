import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/ui/Header';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useBusinessProfileStore } from '../../src/stores/businessProfileStore';
import { useClientStore } from '../../src/stores/clientStore';
import { useDocumentStore } from '../../src/stores/documentStore';
import { useTemplateStore } from '../../src/stores/templateStore';
import { useRecurringStore } from '../../src/stores/recurringStore';
import { useTaxConfigStore } from '../../src/stores/taxConfigStore';
import { exportBackup, importBackup, getBackupStats } from '../../src/services/backupService';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';

export default function DataManagementScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);

      const result = await exportBackup();

      if (result.success) {
        Alert.alert(
          t('success.guardado'),
          t('settings.dataManagement.exportSuccess')
        );
      } else {
        Alert.alert(
          t('errors.error'),
          result.error || 'Failed to export data'
        );
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        t('errors.error'),
        'Failed to export data: ' + (error as Error).message
      );
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleImportData = async () => {
    try {
      setIsImporting(true);

      const result = await importBackup();

      if (result.success && result.imported) {
        const { clients, documents, templates, recurringRules } = result.imported;
        const total = clients + documents + templates + recurringRules;

        if (total === 0) {
          Alert.alert(
            t('settings.dataManagement.importData'),
            'No new data to import. All items already exist.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            t('success.guardado'),
            `Successfully imported:\n\n• ${clients} clients\n• ${documents} documents\n• ${templates} templates\n• ${recurringRules} recurring rules`,
            [{ text: 'OK' }]
          );
        }
      } else if (result.error === 'Import cancelled') {
        // User cancelled, do nothing
      } else {
        Alert.alert(
          t('errors.error'),
          result.error || 'Failed to import data'
        );
      }
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert(
        t('errors.error'),
        'Failed to import data: ' + (error as Error).message
      );
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      '⚠️ Warning',
      t('settings.dataManagement.confirmClear'),
      [
        { text: t('actions.cancelar'), style: 'cancel' },
        {
          text: t('actions.eliminar'),
          style: 'destructive',
          onPress: confirmClearData,
        },
      ]
    );
  };

  const confirmClearData = () => {
    Alert.alert(
      '⚠️ Final Confirmation',
      'This will permanently delete ALL data including:\n\n• Business Profile\n• All Clients\n• All Documents\n• All Templates\n• All Recurring Rules\n\nThis action CANNOT be undone!\n\nAre you absolutely sure?',
      [
        { text: t('actions.cancelar'), style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: executeClearData,
        },
      ]
    );
  };

  const executeClearData = async () => {
    try {
      setIsClearing(true);

      // Get all data before clearing
      const templates = useTemplateStore.getState().getAllTemplates();
      const recurringRules = useRecurringStore.getState().getAllRules();

      // Clear all stores
      useBusinessProfileStore.getState().reset();
      useClientStore.getState().clearAll();
      useDocumentStore.getState().clearAll();
      useTemplateStore.getState().deleteMultipleTemplates(templates.map((t) => t.id));
      useRecurringStore.getState().deleteMultipleRules(recurringRules.map((r) => r.id));
      useTaxConfigStore.getState().reset();

      Alert.alert(
        t('success.guardado'),
        'All data has been cleared successfully. The app will restart the onboarding process.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Small delay to ensure Alert closes cleanly before navigation
              setTimeout(() => {
                router.replace('/onboarding');
              }, 300);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Clear data error:', error);
      Alert.alert(t('errors.error'), 'Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  const stats = getBackupStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={t('settings.dataManagement.title')}
        showBack
        onBack={() => router.back()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Statistics */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data Overview</Text>

          <View style={styles.statRow}>
            <Ionicons name="people" size={24} color={COLORS.primary} />
            <Text style={styles.statLabel}>Clients</Text>
            <Text style={styles.statValue}>{stats.clients}</Text>
          </View>

          <View style={styles.statRow}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
            <Text style={styles.statLabel}>Documents</Text>
            <Text style={styles.statValue}>{stats.documents}</Text>
          </View>

          <View style={styles.statRow}>
            <Ionicons name="copy" size={24} color={COLORS.primary} />
            <Text style={styles.statLabel}>Templates</Text>
            <Text style={styles.statValue}>{stats.templates}</Text>
          </View>

          <View style={styles.statRow}>
            <Ionicons name="repeat" size={24} color={COLORS.primary} />
            <Text style={styles.statLabel}>Recurring Rules</Text>
            <Text style={styles.statValue}>{stats.recurringRules}</Text>
          </View>
        </Card>

        {/* Export Data */}
        <Card style={styles.section}>
          <View style={styles.actionHeader}>
            <Ionicons name="download" size={32} color={COLORS.primary} />
            <Text style={styles.actionTitle}>
              {t('settings.dataManagement.exportData')}
            </Text>
          </View>

          <Text style={styles.actionDescription}>
            {t('settings.dataManagement.exportDescription')}
          </Text>

          <Button
            onPress={handleExportData}
            variant="primary"
            disabled={isExporting}
            icon={isExporting ? undefined : 'download-outline'}
          >
            {isExporting ? 'Exporting...' : t('settings.dataManagement.exportData')}
          </Button>

          {isExporting && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.loader}
            />
          )}
        </Card>

        {/* Import Data */}
        <Card style={styles.section}>
          <View style={styles.actionHeader}>
            <Ionicons name="cloud-upload" size={32} color={COLORS.primary} />
            <Text style={styles.actionTitle}>
              {t('settings.dataManagement.importData')}
            </Text>
          </View>

          <Text style={styles.actionDescription}>
            {t('settings.dataManagement.importDescription')}
          </Text>

          <Button
            onPress={handleImportData}
            variant="outline"
            disabled={isImporting}
            icon="cloud-upload-outline"
          >
            {isImporting ? 'Importing...' : t('settings.dataManagement.importData')}
          </Button>

          {isImporting && (
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
              style={styles.loader}
            />
          )}
        </Card>

        {/* Clear All Data */}
        <Card style={[styles.section, styles.dangerSection]}>
          <View style={styles.actionHeader}>
            <Ionicons name="warning" size={32} color={COLORS.error} />
            <Text style={[styles.actionTitle, styles.dangerTitle]}>
              {t('settings.dataManagement.clearAllData')}
            </Text>
          </View>

          <Text style={styles.actionDescription}>
            {t('settings.dataManagement.clearDescription')}
          </Text>

          <Button
            onPress={handleClearAllData}
            variant="outline"
            disabled={isClearing}
            style={styles.dangerButton}
            icon="trash-outline"
          >
            {isClearing ? 'Clearing...' : t('settings.dataManagement.clearAllData')}
          </Button>

          {isClearing && (
            <ActivityIndicator
              size="small"
              color={COLORS.error}
              style={styles.loader}
            />
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  statLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  statValue: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  actionTitle: {
    flex: 1,
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
  },
  actionDescription: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  dangerSection: {
    borderWidth: 2,
    borderColor: COLORS.error + '30',
  },
  dangerTitle: {
    color: COLORS.error,
  },
  dangerButton: {
    borderColor: COLORS.error,
  },
  loader: {
    marginTop: SPACING.md,
  },
});
