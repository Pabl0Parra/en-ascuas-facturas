import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/ui/Header';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useTaxConfigStore } from '../../src/stores/taxConfigStore';
import { useBusinessProfileStore } from '../../src/stores/businessProfileStore';
import { useTheme } from '../../src/hooks/useTheme';
import type { AppColors } from '../../src/constants/theme';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';

export default function TaxConfigurationScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { config, addPreset, updatePreset, deletePreset, setDefault } = useTaxConfigStore();
  const { profile, updateProfile } = useBusinessProfileStore();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [showAddPreset, setShowAddPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetRate, setNewPresetRate] = useState('');

  const handleAddPreset = () => {
    const name = newPresetName.trim();
    const rate = parseFloat(newPresetRate);

    if (!name) {
      Alert.alert(t('errors.validation'), 'Preset name is required');
      return;
    }

    if (isNaN(rate) || rate < 0 || rate > 100) {
      Alert.alert(t('errors.validation'), 'Tax rate must be between 0 and 100');
      return;
    }

    addPreset({
      name,
      rate,
      isDefault: config.presets.length === 0,
    });

    setNewPresetName('');
    setNewPresetRate('');
    setShowAddPreset(false);

    Alert.alert(t('success.guardado'), 'Tax preset added successfully');
  };

  const handleDeletePreset = (presetId: string) => {
    const preset = config.presets.find((p) => p.id === presetId);
    if (!preset) return;

    Alert.alert(
      t('settings.taxConfiguration.confirmDelete'),
      `${preset.name} (${preset.rate}%)`,
      [
        { text: t('actions.cancelar'), style: 'cancel' },
        {
          text: t('actions.eliminar'),
          style: 'destructive',
          onPress: () => {
            deletePreset(presetId);
            Alert.alert(t('success.guardado'), 'Tax preset deleted');
          },
        },
      ]
    );
  };

  const handleSetDefault = (presetId: string) => {
    const preset = config.presets.find((p) => p.id === presetId);
    if (!preset) return;

    setDefault(presetId);

    // Also update business profile default tax rate
    if (profile) {
      updateProfile({
        defaultTaxRate: preset.rate,
      });
    }

    Alert.alert(t('success.guardado'), `Default tax rate set to ${preset.rate}%`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={t('settings.taxConfiguration.title')}
        showBack
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <KeyboardAwareScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid={true}
          enableAutomaticScroll={true}
          extraScrollHeight={150}
        >
        {/* Tax Name */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.taxConfiguration.taxName')}
          </Text>
          <Text style={styles.taxName}>{config.taxName || 'TAX'}</Text>
          <Text style={styles.hint}>
            Set in onboarding or business profile
          </Text>
        </Card>

        {/* Tax Presets */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.taxConfiguration.presets')}
          </Text>

          {config.presets.map((preset) => (
            <View key={preset.id} style={styles.presetCard}>
              <View style={styles.presetInfo}>
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetRate}>{preset.rate}%</Text>
              </View>

              <View style={styles.presetActions}>
                {!preset.isDefault && (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(preset.id)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>
                      Set Default
                    </Text>
                  </TouchableOpacity>
                )}
                {preset.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => handleDeletePreset(preset.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {config.presets.length === 0 && (
            <Text style={styles.emptyText}>
              No tax presets configured
            </Text>
          )}
        </Card>

        {/* Add Preset */}
        {showAddPreset ? (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('settings.taxConfiguration.addPreset')}
            </Text>

            <Input
              label={t('settings.taxConfiguration.presetName')}
              value={newPresetName}
              onChangeText={setNewPresetName}
              placeholder="Standard Rate"
              autoCapitalize="words"
            />

            <Input
              label={t('settings.taxConfiguration.rate')}
              value={newPresetRate}
              onChangeText={setNewPresetRate}
              placeholder="21"
              keyboardType="decimal-pad"
            />

            <View style={styles.addPresetButtons}>
              <Button
                onPress={() => {
                  setShowAddPreset(false);
                  setNewPresetName('');
                  setNewPresetRate('');
                }}
                variant="outline"
                style={styles.halfButton}
              >
                {t('actions.cancelar')}
              </Button>
              <Button
                onPress={handleAddPreset}
                variant="primary"
                style={styles.halfButton}
              >
                {t('actions.guardar')}
              </Button>
            </View>
          </Card>
        ) : (
          <Button
            onPress={() => setShowAddPreset(true)}
            variant="outline"
          >
            {t('settings.taxConfiguration.addPreset')}
          </Button>
        )}
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  taxName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: SPACING.xs,
  },
  hint: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
  },
  presetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  presetRate: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: colors.primary,
  },
  presetActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: colors.primary + '15',
  },
  actionButtonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: colors.primary,
  },
  defaultBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: colors.success + '15',
  },
  defaultBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: colors.success,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  addPresetButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  halfButton: {
    flex: 1,
  },
});
