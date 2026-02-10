import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Header } from '../../src/components/ui/Header';
import { useDocumentStore } from '../../src/stores/documentStore';
import { useClientStore } from '../../src/stores/clientStore';
import { formatCurrency } from '../../src/utils/formatters';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../../src/constants/theme';

export default function PDFViewerScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { filePath, title, documentId } = useLocalSearchParams<{
    filePath: string;
    title: string;
    documentId?: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [fileExists, setFileExists] = useState(false);

  const document = documentId ? useDocumentStore.getState().getDocumentById(documentId) : undefined;
  const client = document ? useClientStore.getState().getClientById(document.clienteId) : undefined;

  useEffect(() => {
    checkFile();
  }, []);

  const checkFile = async () => {
    if (!filePath) {
      Alert.alert(t('errors.error'), t('errors.fileNotFound'));
      router.back();
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      setFileExists(fileInfo.exists);
      setLoading(false);

      if (!fileInfo.exists) {
        Alert.alert(
          t('errors.error'),
          t('errors.fileNotFound'),
          [{ text: t('actions.volver'), onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Error checking file:', error);
      setLoading(false);
      setFileExists(false);
    }
  };

  const handleViewPDF = async () => {
    if (!filePath || !fileExists) return;

    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(t('errors.error'), t('errors.openExternalNotAvailable'));
        return;
      }

      // Open with system's PDF viewer
      await Sharing.shareAsync(filePath, {
        mimeType: 'application/pdf',
        dialogTitle: title || t('document.openDocument'),
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert(t('errors.error'), t('errors.errorOpeningDocument'));
    }
  };

  const handleShare = async () => {
    if (!filePath || !fileExists) return;

    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert(t('errors.error'), t('errors.sharingNotAvailable'));
        return;
      }

      await Sharing.shareAsync(filePath, {
        mimeType: 'application/pdf',
        dialogTitle: title || t('document.shareDocument'),
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      Alert.alert(t('errors.error'), t('errors.errorSharingDocument'));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header title={title || t('document.document')} showBack />
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>{t('document.loadingDocument')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title={title || t('document.document')} showBack />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Document Type Badge */}
        <View style={styles.badgeContainer}>
          <View style={[
            styles.badge,
            document?.tipo === 'factura' ? styles.badgeFactura : styles.badgePresupuesto
          ]}>
            <Ionicons
              name={document?.tipo === 'factura' ? 'document-text' : 'clipboard'}
              size={24}
              color="#fff"
            />
            <Text style={styles.badgeText}>
              {document?.tipo === 'factura' ? t('document.factura') : t('document.presupuesto')}
            </Text>
          </View>
          <Text style={styles.documentNumber}>{document?.numeroDocumento}</Text>
        </View>

        {/* Document Info Card */}
        {document && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="information-circle" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>{t('document.datosFacturacion')}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('client.nombre')}</Text>
              <Text style={styles.infoValue}>{document.clienteNombre}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('client.nifCif')}</Text>
              <Text style={styles.infoValue}>{document.clienteNifCif}</Text>
            </View>

            {client && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('client.direccion')}</Text>
                  <Text style={styles.infoValue}>{client.direccion}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('client.ciudad')}</Text>
                  <Text style={styles.infoValue}>
                    {client.codigoPostal} {client.ciudad}, {client.provincia}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('document.fechaDocumento')}</Text>
              <Text style={styles.infoValue}>{document.fechaDocumento}</Text>
            </View>
          </View>
        )}

        {/* Amount Card */}
        {document && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="cash" size={20} color={COLORS.primary} />
              <Text style={styles.cardTitle}>{t('totals.total')}</Text>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalAmount}>{formatCurrency(document.total)}</Text>
              <Text style={styles.totalCurrency}>EUR</Text>
            </View>
          </View>
        )}

        {/* PDF Preview */}
        <View style={styles.card}>
          <View style={styles.pdfPreviewContainer}>
            <Ionicons name="document-text-outline" size={80} color={COLORS.textMuted} />
            <Text style={styles.pdfPreviewLabel}>PDF {t('document.document')}</Text>
            <Text style={styles.pdfPreviewHint}>
              Tap "View Full PDF" below to open in your PDF reader
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      {fileExists && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={handleViewPDF}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>View Full PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  badgeFactura: {
    backgroundColor: COLORS.primary,
  },
  badgePresupuesto: {
    backgroundColor: COLORS.ember,
  },
  badgeText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    letterSpacing: 1,
  },
  documentNumber: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  totalAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  totalCurrency: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pdfPreviewContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  pdfPreviewLabel: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  pdfPreviewHint: {
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    width: 56,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
});
