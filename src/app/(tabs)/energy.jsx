import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import {
  Sun,
  Zap,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react-native";

export default function Energy() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [energyData, setEnergyData] = useState(null);
  const [period, setPeriod] = useState("24h");
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/energy?period=${period}`);

      if (!response.ok) {
        throw new Error("Erro ao carregar dados de energia");
      }

      const data = await response.json();
      setEnergyData(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados de energia");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

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

  const currentConsumption = parseFloat(
    energyData?.current?.consumption_kwh || 0,
  );
  const currentSolar = parseFloat(
    energyData?.current?.solar_production_kwh || 0,
  );
  const balance = currentSolar - currentConsumption;
  const isPositive = balance > 0;

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
            Energia
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            Monitore consumo e produção solar
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

        {/* Period Selector */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              backgroundColor: "#fff",
              padding: 4,
              borderRadius: 12,
            }}
          >
            {["24h", "7d", "30d"].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: period === p ? "#3B82F6" : "transparent",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: period === p ? "#fff" : "#6B7280",
                  }}
                >
                  {p === "24h" ? "24h" : p === "7d" ? "7 dias" : "30 dias"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Current Status */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: isPositive ? "#ECFDF5" : "#FEF2F2",
              padding: 24,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: isPositive ? "#10B981" : "#EF4444",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {isPositive ? (
                <TrendingUp size={28} color="#10B981" />
              ) : (
                <TrendingDown size={28} color="#EF4444" />
              )}
              <Text
                style={{
                  marginLeft: 12,
                  fontSize: 18,
                  fontWeight: "600",
                  color: isPositive ? "#059669" : "#DC2626",
                }}
              >
                {isPositive ? "Produzindo Excedente" : "Consumindo da Rede"}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: isPositive ? "#059669" : "#DC2626",
              }}
            >
              {isPositive ? "+" : ""}
              {balance.toFixed(2)} kWh
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: isPositive ? "#059669" : "#DC2626",
                marginTop: 4,
              }}
            >
              Balanço energético atual
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ gap: 12 }}>
            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
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
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#FEF3C7",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Sun size={24} color="#F59E0B" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    Produção Solar
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#111827",
                      marginTop: 4,
                    }}
                  >
                    {currentSolar.toFixed(2)} kWh
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderColor: "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  Total ({period}):{" "}
                  {parseFloat(energyData?.totals?.total_solar || 0).toFixed(2)}{" "}
                  kWh
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
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
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#DBEAFE",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Zap size={24} color="#3B82F6" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    Consumo
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#111827",
                      marginTop: 4,
                    }}
                  >
                    {currentConsumption.toFixed(2)} kWh
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderColor: "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  Total ({period}):{" "}
                  {parseFloat(
                    energyData?.totals?.total_consumption || 0,
                  ).toFixed(2)}{" "}
                  kWh
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: "#fff",
                padding: 20,
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
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: "#D1FAE5",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <DollarSign size={24} color="#10B981" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, color: "#6B7280" }}>
                    Custo Total
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#111827",
                      marginTop: 4,
                    }}
                  >
                    R${" "}
                    {parseFloat(energyData?.totals?.total_cost || 0).toFixed(2)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderColor: "#F3F4F6",
                }}
              >
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  Período:{" "}
                  {period === "24h"
                    ? "Últimas 24 horas"
                    : period === "7d"
                      ? "Últimos 7 dias"
                      : "Últimos 30 dias"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "#EFF6FF",
              padding: 20,
              borderRadius: 16,
              borderLeftWidth: 4,
              borderColor: "#3B82F6",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#1E40AF",
                marginBottom: 8,
              }}
            >
              💡 Dica de Economia
            </Text>
            <Text style={{ fontSize: 14, color: "#1E40AF", lineHeight: 20 }}>
              {isPositive
                ? "Sua produção solar está superando o consumo! Aproveite para ligar equipamentos de alto consumo."
                : "Considere ligar equipamentos de alto consumo durante o dia, quando a produção solar é maior."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
