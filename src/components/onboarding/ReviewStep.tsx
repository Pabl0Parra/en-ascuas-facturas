import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../ui/Button';
import { SPACING, FONT_SIZE, BORDER_RADIUS, FONTS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import type { AppColors } from '../../constants/theme';
import type { BusinessProfile } from '../../types/businessProfile';

interface ReviewStepProps {
  profileData: Partial<BusinessProfile>;
  onEdit: (step: number) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  profileData,
  onEdit,
  onComplete,
  onBack,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <Text style={styles.title}>Review Your Profile</Text>
        <Text style={styles.subtitle}>
          Review your business information before getting started
        </Text>
      </View>

      <View style={styles.sections}>
        {/* Business Information */}
        <ReviewSection
          title="Business Information"
          onEdit={() => onEdit(1)}
          colors={colors}
        >
          <ReviewItem label="Company Name" value={profileData.companyName} colors={colors} />
          <ReviewItem label="Country" value={profileData.country} colors={colors} />
          <ReviewItem label="Address" value={profileData.address} colors={colors} />
          <ReviewItem label="City" value={profileData.city} colors={colors} />
          {profileData.postalCode && (
            <ReviewItem label="Postal Code" value={profileData.postalCode} colors={colors} />
          )}
          {profileData.region && (
            <ReviewItem label="Region" value={profileData.region} colors={colors} />
          )}
          <ReviewItem
            label={profileData.taxIdLabel || 'Tax ID'}
            value={profileData.taxId}
            colors={colors}
          />
        </ReviewSection>

        {/* Branding */}
        <ReviewSection
          title="Branding"
          onEdit={() => onEdit(2)}
          colors={colors}
        >
          {profileData.logoUri ? (
            <View style={styles.logoContainer}>
              <Text style={styles.reviewLabel}>Logo</Text>
              <Image
                source={{ uri: profileData.logoUri }}
                style={styles.logoPreview}
              />
            </View>
          ) : (
            <ReviewItem label="Logo" value="No logo uploaded" muted colors={colors} />
          )}
          <View style={styles.colorContainer}>
            <Text style={styles.reviewLabel}>Primary Color</Text>
            <View style={styles.colorPreviewRow}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: profileData.primaryColor || colors.primary },
                ]}
              />
              <Text style={styles.reviewValue}>
                {profileData.primaryColor || '#FF4500'}
              </Text>
            </View>
          </View>
        </ReviewSection>

        {/* Financial Settings */}
        <ReviewSection
          title="Financial Settings"
          onEdit={() => onEdit(3)}
          colors={colors}
        >
          <ReviewItem label="Currency" value={profileData.currency} colors={colors} />
          <ReviewItem
            label="Tax"
            value={`${profileData.taxName} (${profileData.defaultTaxRate}%)`}
            colors={colors}
          />
          <ReviewItem label="Payment Method" value={profileData.paymentMethod} colors={colors} />
          <ReviewItem
            label="Payment Details"
            value={profileData.paymentDetails}
            multiline
            colors={colors}
          />
        </ReviewSection>

        {/* Document Numbering */}
        <ReviewSection
          title="Document Numbering"
          onEdit={() => onEdit(4)}
          colors={colors}
        >
          <ReviewItem
            label="Invoice Format"
            value={`${profileData.invoicePrefix}${String(profileData.nextInvoiceNumber || 1).padStart(4, '0')}`}
            colors={colors}
          />
          <ReviewItem
            label="Quote Format"
            value={`${profileData.quotePrefix}${String(profileData.nextQuoteNumber || 1).padStart(4, '0')}`}
            colors={colors}
          />
        </ReviewSection>
      </View>

        <View style={styles.footer}>
          <Button onPress={onComplete} size="lg" fullWidth>
            Get Started
          </Button>
          <Button
            onPress={onBack}
            variant="outline"
            style={styles.backButton}
            fullWidth
          >
            Back
          </Button>
          <Text style={styles.progress}>Step 6 of 6</Text>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

interface ReviewSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  colors: AppColors;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, onEdit, children, colors }) => {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

interface ReviewItemProps {
  label: string;
  value?: string;
  multiline?: boolean;
  muted?: boolean;
  colors: AppColors;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ label, value, multiline, muted, colors }) => {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={[styles.reviewItem, multiline && styles.reviewItemMultiline]}>
      <Text style={styles.reviewLabel}>{label}</Text>
      <Text style={[styles.reviewValue, muted && styles.reviewValueMuted]}>
        {value || '\u2014'}
      </Text>
    </View>
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
  sections: {
    gap: SPACING.md,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontFamily: FONTS.semibold,
    color: colors.textPrimary,
  },
  editButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  editButtonText: {
    fontSize: FONT_SIZE.md,
    color: colors.primary,
    fontFamily: FONTS.semibold,
  },
  sectionContent: {
    gap: SPACING.sm,
  },
  reviewItem: {
    paddingVertical: SPACING.xs,
  },
  reviewItemMultiline: {
    paddingVertical: SPACING.sm,
  },
  reviewLabel: {
    fontSize: FONT_SIZE.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  reviewValue: {
    fontSize: FONT_SIZE.md,
    color: colors.textPrimary,
    fontFamily: FONTS.medium,
  },
  reviewValueMuted: {
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  logoContainer: {
    paddingVertical: SPACING.xs,
  },
  logoPreview: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.xs,
  },
  colorContainer: {
    paddingVertical: SPACING.xs,
  },
  colorPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  footer: {
    marginTop: SPACING.xl,
  },
  backButton: {
    marginTop: SPACING.sm,
  },
  progress: {
    fontSize: FONT_SIZE.sm,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
