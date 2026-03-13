import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Switch,
  TextInput,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import { Zap, Plus, Clock, Thermometer, X } from "lucide-react-native";

export default function Automations() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [automations, setAutomations] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    trigger_type: "time",
    trigger_config: { time: "18:00" },
    action_config: { action: "turn_on_lights" },
  });

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("/api/automations");

      if (!response.ok) {
        throw new Error("Erro ao carregar automações");
      }

      const data = await response.json();
      setAutomations(data.automations);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as automações");
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

  const toggleAutomation = async (automationId, currentState) => {
    try {
      const response = await fetch(`/api/automations/${automationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentState }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar automação");
      }

      fetchData();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar automação");
    }
  };

  const createAutomation = async () => {
    if (!newAutomation.name.trim()) {
      alert("Por favor, insira um nome para a automação");
      return;
    }

    try {
      const response = await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAutomation),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar automação");
      }

      setShowModal(false);
      setNewAutomation({
        name: "",
        trigger_type: "time",
        trigger_config: { time: "18:00" },
        action_config: { action: "turn_on_lights" },
      });
      fetchData();
      alert("Automação criada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar automação");
    }
  };

  const getTriggerDescription = (automation) => {
    if (automation.trigger_type === "time") {
      return `Às ${automation.trigger_config.time || "00:00"}`;
    } else if (automation.trigger_type === "temperature") {
      return `Temperatura > ${automation.trigger_config.threshold || 0}°C`;
    } else if (automation.trigger_type === "solar") {
      return `Produção solar > consumo`;
    }
    return "Condição personalizada";
  };

  const getActionDescription = (automation) => {
    const action = automation.action_config.action;
    if (action === "turn_on_lights") return "Ligar luzes";
    if (action === "turn_off_lights") return "Desligar luzes";
    if (action === "set_ac_temperature")
      return `Ar-condicionado ${automation.action_config.temperature || 24}°C`;
    if (action === "activate_security") return "Ativar segurança";
    return "Ação personalizada";
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
        <View
          style={{
            paddingHorizontal: 20,
            marginBottom: 24,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 4,
              }}
            >
              Automações
            </Text>
            <Text style={{ fontSize: 16, color: "#6B7280" }}>
              Configure regras inteligentes
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#3B82F6",
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Plus size={24} color="#fff" />
          </TouchableOpacity>
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

        {/* Automations List */}
        <View style={{ paddingHorizontal: 20 }}>
          {automations.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <Zap size={48} color="#D1D5DB" />
              <Text
                style={{
                  fontSize: 16,
                  color: "#6B7280",
                  textAlign: "center",
                  marginTop: 16,
                }}
              >
                Nenhuma automação configurada
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#9CA3AF",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                Toque no botão + para criar sua primeira automação
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {automations.map((automation) => (
                <View
                  key={automation.id}
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
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: automation.is_active
                          ? "#DBEAFE"
                          : "#F3F4F6",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {automation.trigger_type === "time" ? (
                        <Clock
                          size={24}
                          color={automation.is_active ? "#3B82F6" : "#9CA3AF"}
                        />
                      ) : (
                        <Thermometer
                          size={24}
                          color={automation.is_active ? "#3B82F6" : "#9CA3AF"}
                        />
                      )}
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                          color: "#111827",
                        }}
                      >
                        {automation.name}
                      </Text>
                      <Text
                        style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}
                      >
                        {getTriggerDescription(automation)}
                      </Text>
                      <Text
                        style={{ fontSize: 14, color: "#3B82F6", marginTop: 2 }}
                      >
                        → {getActionDescription(automation)}
                      </Text>
                    </View>
                    <Switch
                      value={automation.is_active}
                      onValueChange={() =>
                        toggleAutomation(automation.id, automation.is_active)
                      }
                      trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
                      thumbColor={automation.is_active ? "#3B82F6" : "#F3F4F6"}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Automation Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 20,
              paddingBottom: insets.bottom + 20,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Text
                style={{ fontSize: 24, fontWeight: "bold", color: "#111827" }}
              >
                Nova Automação
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={{ gap: 16 }}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Nome
                </Text>
                <TextInput
                  value={newAutomation.name}
                  onChangeText={(text) =>
                    setNewAutomation({ ...newAutomation, name: text })
                  }
                  placeholder="Ex: Ligar luz externa"
                  style={{
                    backgroundColor: "#F9FAFB",
                    padding: 16,
                    borderRadius: 12,
                    fontSize: 16,
                    color: "#111827",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                />
              </View>

              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: 8,
                  }}
                >
                  Quando (Horário)
                </Text>
                <TextInput
                  value={newAutomation.trigger_config.time}
                  onChangeText={(text) =>
                    setNewAutomation({
                      ...newAutomation,
                      trigger_config: { time: text },
                    })
                  }
                  placeholder="18:00"
                  style={{
                    backgroundColor: "#F9FAFB",
                    padding: 16,
                    borderRadius: 12,
                    fontSize: 16,
                    color: "#111827",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={createAutomation}
                style={{
                  backgroundColor: "#3B82F6",
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                >
                  Criar Automação
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
