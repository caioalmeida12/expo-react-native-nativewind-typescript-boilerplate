import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { INavItem } from "./Navbar";
import { useRedirect } from "../hooks/useRedirect";

type SideMenuProps = {
  isVisible: boolean;
  onClose: () => void;
  navItems: INavItem[];
};

export const SideMenu = ({ isVisible, onClose, navItems }: SideMenuProps) => {
  const { redirect } = useRedirect();
  const slideAnim = useRef(new Animated.Value(-256)).current; // Initial position (off-screen left)

  useEffect(() => {
    if (isVisible) {
      // Slide in from left to right
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide out from right to left
      Animated.timing(slideAnim, {
        toValue: -256,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnim]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none" // We'll handle animation ourselves
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 flex-row" onPress={onClose}>
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            width: 256,
            height: "100%",
          }}
        >
          <View className="w-64 h-full bg-white shadow-lg">
            <View className="bg-verde-400 p-4 flex-row justify-between items-center">
              <Text className="text-white font-bold">Menu</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex-1 p-4">
              {navItems.map((item, index) => (
                <View key={index} className="mb-4">
                  <TouchableOpacity
                    onPress={() => {
                      redirect(item.rota);
                      onClose();
                    }}
                  >
                    <Text className="text-verde-400 font-bold">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};
