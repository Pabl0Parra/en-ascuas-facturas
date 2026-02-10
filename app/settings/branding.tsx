import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
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
import * as ImagePicker from 'expo-image-picker';
import { Header } from '../../src/components/ui/Header';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useBusinessProfileStore } from '../../src/stores/businessProfileStore';
import { useTheme } from '../../src/hooks/useTheme';
import type { AppColors } from '../../src/constants/theme';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '../../src/constants/theme';
import type { PdfTemplateId } from '../../src/types/pdfTemplate';

const COLOR_PRESETS = [
  '#FF4500', // Bilio Orange
  '#E25822', // Ember
  '#2563EB', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

const TEMPLATES: Array<{ id: PdfTemplateId; labelKey: string }> = [
  { id: 'classic', labelKey: 'settings.branding.classic' },
  { id: 'modern', labelKey: 'settings.branding.modern' },
  { id: 'minimal', labelKey: 'settings.branding.minimal' },
];

export default function BrandingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { profile, updateProfile } = useBusinessProfileStore();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#FF4500');
  const [selectedTemplate, setSelectedTemplate] = useState<PdfTemplateId>('classic');

  useEffect(() => {
    if (profile) {
      setLogoUri(profile.logoUri || null);
      setPrimaryColor(profile.primaryColor || '#FF4500');
      setSelectedTemplate(profile.preferredTemplate || 'classic');
    }
  }, [profile]);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          t('errors.permisoDenegado'),
          'Permission to access media library is required'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLogoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('errors.error'), 'Failed to pick image');
    }
  };

  const handleRemoveLogo = () => {
    Alert.alert(
      t('settings.branding.removeLogo'),
      'Are you sure you want to remove the logo?',
      [
        { text: t('actions.cancelar'), style: 'cancel' },
        {
          text: t('actions.eliminar'),
          style: 'destructive',
          onPress: () => setLogoUri(null),
        },
      ]
    );
  };

  const handleSave = () => {
    updateProfile({
      logoUri,
      primaryColor,
      preferredTemplate: selectedTemplate,
    });

    Alert.alert(
      t('success.guardado'),
      'Branding settings updated successfully',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header
        title={t('settings.branding.title')}
        showBack
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
        {/* Logo Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.branding.logo')}</Text>

          <View style={styles.logoContainer}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="image-outline" size={48} color={colors.textMuted} />
              </View>
            )}
          </View>

          <View style={styles.logoButtons}>
            <Button
              onPress={handlePickImage}
              variant="outline"
              style={styles.logoButton}
            >
              {logoUri ? t('settings.branding.changeLogo') : t('settings.branding.uploadLogo')}
            </Button>
            {logoUri && (
              <Button
                onPress={handleRemoveLogo}
                variant="outline"
                style={styles.logoButton}
              >
                {t('settings.branding.removeLogo')}
              </Button>
            )}
          </View>
        </Card>

        {/* Primary Color Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.branding.primaryColor')}
          </Text>

          <View style={styles.colorPreview}>
            <View
              style={[
                styles.colorPreviewBox,
                { backgroundColor: primaryColor },
              ]}
            />
            <Text style={styles.colorCode}>{primaryColor.toUpperCase()}</Text>
          </View>

          <View style={styles.colorGrid}>
            {COLOR_PRESETS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: color },
                  primaryColor === color && styles.colorSwatchSelected,
                ]}
                onPress={() => setPrimaryColor(color)}
                activeOpacity={0.7}
              >
                {primaryColor === color && (
                  <Ionicons name="checkmark" size={24} color={colors.textInverse} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* PDF Template Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('settings.branding.pdfTemplate')}
          </Text>

          <View style={styles.templateGrid}>
            {TEMPLATES.map((template) => (
              <TouchableOpacity
                key={template.id}
                style={[
                  styles.templateCard,
                  selectedTemplate === template.id && styles.templateCardSelected,
                ]}
                onPress={() => setSelectedTemplate(template.id)}
                activeOpacity={0.7}
              >
                <View style={styles.templatePreview}>
                  <Ionicons
                    name="document-text"
                    size={32}
                    color={selectedTemplate === template.id ? colors.primary : colors.textSecondary}
                  />
                </View>
                <Text style={styles.templateName}>{t(template.labelKey)}</Text>
                {selectedTemplate === template.id && (
                  <View style={styles.selectedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

          {/* Save Button */}
          <Button
            onPress={handleSave}
            variant="primary"
            style={styles.saveButton}
          >
            {t('actions.guardar')}
          </Button>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.md,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  logoButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  logoButton: {
    flex: 1,
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  colorPreviewBox: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.md,
  },
  colorCode: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  colorSwatch: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: colors.textPrimary,
  },
  templateGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  templateCard: {
    flex: 1,
    aspectRatio: 0.7,
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  templateCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  templatePreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  selectedBadge: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
});
