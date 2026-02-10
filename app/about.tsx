import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { AboutSection } from '../src/components/settings/AboutSection';
import { useTheme } from '../src/hooks/useTheme';
import type { AppColors } from '../src/constants/theme';

export default function AboutScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'About',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primary,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <AboutSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
});
