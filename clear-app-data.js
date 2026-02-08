// Development utility to clear all app data
// Run with: node clear-app-data.js

const AsyncStorage = require('@react-native-async-storage/async-storage');

async function clearAllData() {
  try {
    console.log('Clearing all AsyncStorage data...');
    await AsyncStorage.clear();
    console.log('✅ All data cleared successfully!');
    console.log('Restart your app to see the onboarding flow.');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

clearAllData();
