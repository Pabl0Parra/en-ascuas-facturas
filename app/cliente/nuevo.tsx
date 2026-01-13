import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ClientForm } from '../../src/components/cliente/ClientForm';
import { COLORS } from '../../src/constants/theme';

export default function NuevoClienteScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ClientForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
