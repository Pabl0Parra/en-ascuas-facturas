import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../ui/Button';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONTS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';

interface BrandingData {
  logoUri: string | null;
  primaryColor: string;
}

interface BrandingStepProps {
  initialData?: Partial<BrandingData>;
  onNext: (data: BrandingData) => void;
  onBack: () => void;
}

const PRESET_COLORS = [
  { name: 'Orange Red', color: '#FF4500' },
  { name: 'Royal Blue', color: '#4169E1' },
  { name: 'Emerald', color: '#10B981' },
  { name: 'Purple', color: '#8B5CF6' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Teal', color: '#14B8A6' },
  { name: 'Amber', color: '#F59E0B' },
  { name: 'Indigo', color: '#6366F1' },
];

export const BrandingStep: React.FC<BrandingStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [logoUri, setLogoUri] = useState<string | null>(initialData?.logoUri || null);
  const [primaryColor, setPrimaryColor] = useState<string>(
    initialData?.primaryColor || PRESET_COLORS[0].color
  );

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photo library to upload a logo.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your camera to take a photo.',
        [{ text: 'OK' }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUri(null);
  };

  const handleContinue = () => {
    onNext({ logoUri, primaryColor });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={150}
      >
      <View style={styles.header}>
        <Text style={styles.title}>Branding</Text>
        <Text style={styles.subtitle}>
          Customize your invoices with your logo and brand color
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Logo (Optional)</Text>
        <Text style={styles.sectionHint}>
          Your logo will appear on all generated invoices and quotes
        </Text>

        {logoUri ? (
          <View style={styles.logoPreview}>
            <Image source={{ uri: logoUri }} style={styles.logoImage} />
            <TouchableOpacity
              style={styles.removeLogo}
              onPress={handleRemoveLogo}
            >
              <Text style={styles.removeLogoText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoPlaceholderText}>No logo uploaded</Text>
          </View>
        )}

        <View style={styles.logoButtons}>
          <View style={styles.logoButtonHalf}>
            <Button onPress={handlePickImage} variant="outline" fullWidth>
              Choose from Library
            </Button>
          </View>
          <View style={styles.logoButtonHalf}>
            <Button onPress={handleTakePhoto} variant="outline" fullWidth>
              Take Photo
            </Button>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Color</Text>
        <Text style={styles.sectionHint}>
          This color will be used as an accent in your PDF templates
        </Text>

        <View style={styles.colorGrid}>
          {PRESET_COLORS.map((preset) => (
            <ColorOption
              key={preset.color}
              color={preset.color}
              name={preset.name}
              selected={primaryColor === preset.color}
              onSelect={() => setPrimaryColor(preset.color)}
              colors={colors}
            />
          ))}
        </View>

        <View style={[styles.colorPreview, { backgroundColor: primaryColor }]}>
          <Text style={styles.colorPreviewText}>
            Preview: This is your brand color
          </Text>
        </View>
      </View>

        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonHalf}>
              <Button onPress={onBack} variant="outline" fullWidth>
                Back
              </Button>
            </View>
            <View style={styles.buttonHalf}>
              <Button onPress={handleContinue} fullWidth>
                Continue
              </Button>
            </View>
          </View>
          <Text style={styles.progress}>Step 3 of 6</Text>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

interface ColorOptionProps {
  color: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
  colors: AppColors;
}

const ColorOption: React.FC<ColorOptionProps> = ({ color, name, selected, onSelect, colors }) => {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <TouchableOpacity
      style={[
        styles.colorOption,
        { borderColor: selected ? color : colors.border },
        selected && styles.colorOptionSelected,
      ]}
      onPress={onSelect}
    >
      <View style={[styles.colorCircle, { backgroundColor: color }]} />
      <Text style={styles.colorName}>{name}</Text>
      {selected && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );
};

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  header: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  sectionHint: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: SPACING.md,
  },
  logoPreview: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.md,
  },
  removeLogo: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeLogoText: {
    color: colors.textInverse,
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.bold,
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  logoPlaceholderText: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
  },
  logoButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  logoButtonHalf: {
    flex: 1,
  },
  colorGrid: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderWidth: 2,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: colors.background,
  },
  colorOptionSelected: {
    borderWidth: 3,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SPACING.md,
  },
  colorName: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
  },
  checkmark: {
    fontSize: FONT_SIZE.xl,
    color: colors.success,
    fontFamily: FONTS.bold,
  },
  colorPreview: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  colorPreviewText: {
    fontSize: FONT_SIZE.md,
    color: colors.textInverse,
    fontFamily: FONTS.semibold,
  },
  footer: {
    marginTop: SPACING.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonHalf: {
    flex: 1,
  },
  progress: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
