import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ClientForm } from '../../src/components/cliente/ClientForm';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useClientStore } from '../../src/stores/clientStore';
import { useTheme } from '../../src/hooks/useTheme';
import type { AppColors } from '../../src/constants/theme';

export default function EditClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const getClientById = useClientStore((state) => state.getClientById);
  const client = id ? getClientById(id) : undefined;

  if (!client) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="person-outline"
          title="Cliente no encontrado"
          actionLabel="Volver"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ClientForm client={client} isEditing />
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
