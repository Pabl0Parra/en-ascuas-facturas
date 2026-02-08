import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { AboutSection } from '../src/components/settings/AboutSection';
import { COLORS } from '../src/constants/theme';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'About',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.primary,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <AboutSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
});
