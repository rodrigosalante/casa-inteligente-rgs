import { Tabs } from "expo-router";
import { Home, Zap, Settings, Bell, Grid3x3 } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#E5E7EB",
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="rooms"
        options={{
          title: "Cômodos",
          tabBarIcon: ({ color, size }) => <Grid3x3 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="automations"
        options={{
          title: "Automações",
          tabBarIcon: ({ color, size }) => <Zap color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="energy"
        options={{
          title: "Energia",
          tabBarIcon: ({ color, size }) => <Settings color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color, size }) => <Bell color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
