import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import {
  Lightbulb,
  Zap,
  Sun,
  Bell,
  Power,
  LogOut,
  Home as HomeIcon,
  Moon,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [dashResponse, scenesResponse] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/scenes"),
      ]);

      if (!dashResponse.ok || !scenesResponse.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const dashData = await dashResponse.json();
      const scenesData = await scenesResponse.json();

      setDashboardData(dashData);
      setScenes(scenesData.scenes);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const executeScene = async (sceneId, sceneName) => {
    try {
      const response = await fetch(`/api/scenes/${sceneId}/execute`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao executar cena");
      }

      alert(`Cena "${sceneName}" executada com sucesso!`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erro ao executar cena");
    }
  };

  const getSceneIcon = (iconName) => {
    switch (iconName) {
      case "log-out":
        return LogOut;
      case "home":
        return HomeIcon;
      case "moon":
        return Moon;
      default:
        return Zap;
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 4,
            }}
          >
            Casa Inteligente
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            Bem-vindo ao seu painel de controle
          </Text>
        </View>

        {error && (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 16,
              padding: 16,
              backgroundColor: "#FEE2E2",
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#DC2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Power size={20} color="#3B82F6" />
                <Text style={{ marginLeft: 8, fontSize: 14, color: "#6B7280" }}>
                  Ativos
                </Text>
              </View>
              <Text
                style={{ fontSize: 28, fontWeight: "bold", color: "#111827" }}
              >
                {dashboardData?.deviceStats?.active || 0}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Zap size={20} color="#10B981" />
                <Text style={{ marginLeft: 8, fontSize: 14, color: "#6B7280" }}>
                  Automações
                </Text>
              </View>
              <Text
                style={{ fontSize: 28, fontWeight: "bold", color: "#111827" }}
              >
                {dashboardData?.activeAutomations || 0}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Sun size={20} color="#F59E0B" />
                <Text style={{ marginLeft: 8, fontSize: 14, color: "#6B7280" }}>
                  Solar
                </Text>
              </View>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}
              >
                {dashboardData?.energy?.solar_production_kwh || 0} kWh
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Bell size={20} color="#EF4444" />
                <Text style={{ marginLeft: 8, fontSize: 14, color: "#6B7280" }}>
                  Alertas
                </Text>
              </View>
              <Text
                style={{ fontSize: 28, fontWeight: "bold", color: "#111827" }}
              >
                {dashboardData?.unreadNotifications || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Scenes */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#111827",
              marginBottom: 16,
            }}
          >
            Cenas Rápidas
          </Text>
          <View style={{ gap: 12 }}>
            {scenes.map((scene) => {
              const IconComponent = getSceneIcon(scene.icon);
              return (
                <TouchableOpacity
                  key={scene.id}
                  onPress={() => executeScene(scene.id, scene.name)}
                  style={{
                    backgroundColor: "#fff",
                    padding: 20,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: "#EFF6FF",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IconComponent size={24} color="#3B82F6" />
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      marginLeft: 16,
                      fontSize: 16,
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {scene.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Active Devices */}
        {dashboardData?.activeDevices &&
          dashboardData.activeDevices.length > 0 && (
            <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#111827",
                  marginBottom: 16,
                }}
              >
                Dispositivos Ativos
              </Text>
              <View style={{ gap: 12 }}>
                {dashboardData.activeDevices.map((device) => (
                  <View
                    key={device.id}
                    style={{
                      backgroundColor: "#fff",
                      padding: 16,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: "#DBEAFE",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Lightbulb size={20} color="#3B82F6" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {device.name}
                      </Text>
                      <Text
                        style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}
                      >
                        {device.room_name}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#10B981",
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}
      </ScrollView>
    </View>
  );
}
