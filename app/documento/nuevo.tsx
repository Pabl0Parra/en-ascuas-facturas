import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Changed import
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '../../src/components/ui/Header';
import { DocumentForm } from '../../src/components/documento/DocumentForm';
import { useFormStore } from '../../src/stores/formStore';
import { useTheme } from '../../src/hooks/useTheme';
import type { AppColors } from '../../src/constants/theme';
import { STRINGS } from '../../src/constants/strings';
import type { DocumentType } from '../../src/types/document';

export default function NuevoDocumentoScreen() {
  const { tipo } = useLocalSearchParams<{ tipo: DocumentType }>();
  const documentType: DocumentType =
    tipo === 'presupuesto' ? 'presupuesto' : 'factura';

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const initializeForm = useFormStore((state) => state.initializeForm);

  useEffect(() => {
    const today = format(new Date(), 'dd-MM-yyyy');
    initializeForm(documentType, '', today);
  }, [documentType]);

  const headerTitle =
    documentType === 'factura'
      ? STRINGS.navigation.nuevaFactura
      : STRINGS.navigation.nuevoPresupuesto;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title={headerTitle} showBack />
      <DocumentForm tipo={documentType} />
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
