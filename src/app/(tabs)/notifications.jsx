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
  Bell,
  DoorOpen,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react-native";

export default function Notifications() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/notifications");

      if (!response.ok) {
        throw new Error("Erro ao carregar notificações");
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as notificações");
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

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Erro ao marcar notificação como lida");
      }

      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "security":
        return DoorOpen;
      case "motion":
        return Activity;
      case "energy":
        return Zap;
      case "scene":
        return CheckCircle;
      case "alert":
        return AlertTriangle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "security":
        return "#EF4444";
      case "motion":
        return "#F59E0B";
      case "energy":
        return "#3B82F6";
      case "scene":
        return "#10B981";
      case "alert":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora";
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
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
            Notificações
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            Acompanhe os eventos da sua casa
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

        {/* Notifications List */}
        <View style={{ paddingHorizontal: 20 }}>
          {notifications.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Bell size={48} color="#D1D5DB" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                Nenhuma notificação
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#9CA3AF",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Você está em dia com todos os alertas
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {notifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);

                return (
                  <TouchableOpacity
                    key={notification.id}
                    onPress={() =>
                      !notification.is_read && markAsRead(notification.id)
                    }
                    style={{
                      backgroundColor: notification.is_read
                        ? "#fff"
                        : "#EFF6FF",
                      padding: 16,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "flex-start",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 2,
                      borderLeftWidth: 3,
                      borderColor: notification.is_read
                        ? "transparent"
                        : "#3B82F6",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: notification.is_read
                          ? "#F3F4F6"
                          : `${iconColor}20`,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconComponent size={20} color={iconColor} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "600",
                            color: "#111827",
                          }}
                        >
                          {notification.title}
                        </Text>
                        {!notification.is_read && (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: "#3B82F6",
                            }}
                          />
                        )}
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#6B7280",
                          lineHeight: 20,
                          marginBottom: 8,
                        }}
                      >
                        {notification.message}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                        {formatDate(notification.created_at)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
