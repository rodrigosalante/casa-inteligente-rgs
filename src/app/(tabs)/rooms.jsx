import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import {
  Sofa,
  Bed,
  UtensilsCrossed,
  Car,
  Trees,
  Lightbulb,
  Wind,
  DoorOpen,
  Camera,
  Droplet,
  Plug,
  Activity,
  Thermometer,
} from "lucide-react-native";

export default function Rooms() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [roomsResponse, devicesResponse] = await Promise.all([
        fetch("/api/rooms"),
        fetch("/api/devices"),
      ]);

      if (!roomsResponse.ok || !devicesResponse.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const roomsData = await roomsResponse.json();
      const devicesData = await devicesResponse.json();

      setRooms(roomsData.rooms);
      setDevices(devicesData.devices);

      if (!selectedRoom && roomsData.rooms.length > 0) {
        setSelectedRoom(roomsData.rooms[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar os dados");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedRoom]);

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const toggleDevice = async (deviceId, currentState) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_on: !currentState }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar dispositivo");
      }

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar dispositivo");
    }
  };

  const getRoomIcon = (iconName) => {
    switch (iconName) {
      case "sofa":
        return Sofa;
      case "bed":
        return Bed;
      case "utensils":
        return UtensilsCrossed;
      case "car":
        return Car;
      case "trees":
        return Trees;
      default:
        return Sofa;
    }
  };

  const getDeviceIcon = (iconName) => {
    switch (iconName) {
      case "lightbulb":
        return Lightbulb;
      case "wind":
        return Wind;
      case "door-open":
        return DoorOpen;
      case "camera":
        return Camera;
      case "droplet":
        return Droplet;
      case "plug":
        return Plug;
      case "activity":
        return Activity;
      case "thermometer":
        return Thermometer;
      default:
        return Lightbulb;
    }
  };

  const filteredDevices = devices.filter((d) => d.room_id === selectedRoom);

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
            Cômodos
          </Text>
          <Text style={{ fontSize: 16, color: "#6B7280" }}>
            Controle os dispositivos por ambiente
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

        {/* Room Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 24,
          }}
        >
          {rooms.map((room) => {
            const IconComponent = getRoomIcon(room.icon);
            const isSelected = selectedRoom === room.id;
            return (
              <TouchableOpacity
                key={room.id}
                onPress={() => setSelectedRoom(room.id)}
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 24,
                  backgroundColor: isSelected ? "#3B82F6" : "#fff",
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <IconComponent
                  size={20}
                  color={isSelected ? "#fff" : "#6B7280"}
                />
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 15,
                    fontWeight: "600",
                    color: isSelected ? "#fff" : "#111827",
                  }}
                >
                  {room.name}
                </Text>
                <View
                  style={{
                    marginLeft: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 10,
                    backgroundColor: isSelected
                      ? "rgba(255,255,255,0.2)"
                      : "#F3F4F6",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: isSelected ? "#fff" : "#6B7280",
                    }}
                  >
                    {room.device_count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Devices */}
        <View style={{ paddingHorizontal: 20 }}>
          {filteredDevices.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Text
                style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}
              >
                Nenhum dispositivo neste cômodo
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {filteredDevices.map((device) => {
                const IconComponent = getDeviceIcon(device.device_icon);
                return (
                  <View
                    key={device.id}
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
                          backgroundColor: device.is_on ? "#DBEAFE" : "#F3F4F6",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IconComponent
                          size={24}
                          color={device.is_on ? "#3B82F6" : "#9CA3AF"}
                        />
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
                          style={{
                            fontSize: 14,
                            color: "#6B7280",
                            marginTop: 2,
                          }}
                        >
                          {device.device_type}
                        </Text>
                      </View>
                      <Switch
                        value={device.is_on}
                        onValueChange={() =>
                          toggleDevice(device.id, device.is_on)
                        }
                        trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                        thumbColor={device.is_on ? "#3B82F6" : "#F3F4F6"}
                      />
                    </View>

                    {device.current_value?.temperature && (
                      <View
                        style={{
                          paddingTop: 12,
                          borderTopWidth: 1,
                          borderColor: "#F3F4F6",
                        }}
                      >
                        <Text style={{ fontSize: 14, color: "#6B7280" }}>
                          Temperatura: {device.current_value.temperature}°C
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
