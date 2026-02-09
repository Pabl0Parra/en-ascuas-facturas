import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { COLORS, FONT_SIZE } from '../../src/constants/theme';

// Extract icon components to prevent re-renders
const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home" size={size} color={color} />
);

const ClientsIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="people" size={size} color={color} />
);

const HistoryIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="document-text" size={size} color={color} />
);

const SettingsIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="settings" size={size} color={color} />
);

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.divider,
          borderTopWidth: 1,
          paddingTop: 4,
          paddingBottom: Math.max(insets.bottom, 8),
          height: 60 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: FONT_SIZE.xs,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: t('navigation.clientes'),
          tabBarIcon: ClientsIcon,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: t('navigation.historial'),
          tabBarIcon: HistoryIcon,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('navigation.settings'),
          tabBarIcon: SettingsIcon,
        }}
      />
      <Tabs.Screen
        name="pdf-viewer"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}