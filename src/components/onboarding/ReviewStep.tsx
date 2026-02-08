import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from '../ui/Button';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
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
        >
          <ReviewItem label="Company Name" value={profileData.companyName} />
          <ReviewItem label="Country" value={profileData.country} />
          <ReviewItem label="Address" value={profileData.address} />
          <ReviewItem label="City" value={profileData.city} />
          {profileData.postalCode && (
            <ReviewItem label="Postal Code" value={profileData.postalCode} />
          )}
          {profileData.region && (
            <ReviewItem label="Region" value={profileData.region} />
          )}
          <ReviewItem
            label={profileData.taxIdLabel || 'Tax ID'}
            value={profileData.taxId}
          />
        </ReviewSection>

        {/* Branding */}
        <ReviewSection
          title="Branding"
          onEdit={() => onEdit(2)}
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
            <ReviewItem label="Logo" value="No logo uploaded" muted />
          )}
          <View style={styles.colorContainer}>
            <Text style={styles.reviewLabel}>Primary Color</Text>
            <View style={styles.colorPreviewRow}>
              <View
                style={[
                  styles.colorSwatch,
                  { backgroundColor: profileData.primaryColor || COLORS.primary },
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
        >
          <ReviewItem label="Currency" value={profileData.currency} />
          <ReviewItem
            label="Tax"
            value={`${profileData.taxName} (${profileData.defaultTaxRate}%)`}
          />
          <ReviewItem label="Payment Method" value={profileData.paymentMethod} />
          <ReviewItem
            label="Payment Details"
            value={profileData.paymentDetails}
            multiline
          />
        </ReviewSection>

        {/* Document Numbering */}
        <ReviewSection
          title="Document Numbering"
          onEdit={() => onEdit(4)}
        >
          <ReviewItem
            label="Invoice Format"
            value={`${profileData.invoicePrefix}${String(profileData.nextInvoiceNumber || 1).padStart(4, '0')}`}
          />
          <ReviewItem
            label="Quote Format"
            value={`${profileData.quotePrefix}${String(profileData.nextQuoteNumber || 1).padStart(4, '0')}`}
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
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ title, onEdit, children }) => (
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

interface ReviewItemProps {
  label: string;
  value?: string;
  multiline?: boolean;
  muted?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ label, value, multiline, muted }) => (
  <View style={[styles.reviewItem, multiline && styles.reviewItemMultiline]}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={[styles.reviewValue, muted && styles.reviewValueMuted]}>
      {value || '—'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 180 : 150,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  sections: {
    gap: SPACING.md,
  },
  section: {
    backgroundColor: COLORS.surface,
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
    borderBottomColor: COLORS.divider,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  editButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  editButtonText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
    fontWeight: '600',
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
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  reviewValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  reviewValueMuted: {
    color: COLORS.textMuted,
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
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
