import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors } from '../../styles/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceCard,
          borderTopColor: colors.outline,
          height: 84,
          paddingTop: 8,
          paddingBottom: 24,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          title: 'Energy',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="wb-sunny" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="lightbulb-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ev"
        options={{
          title: 'EV',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="ev-station" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}