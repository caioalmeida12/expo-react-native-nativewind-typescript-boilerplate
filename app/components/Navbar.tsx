import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRedirect } from "../hooks/useRedirect";
import { useAuthentication } from "../hooks/useAuthentication";
import { SideMenu } from "./SideMenu";

export type INavItemWithoutDropdown = {
  title: string;
  rota: string;
  isDropdown?: false;
};

export type INavItem = INavItemWithoutDropdown;

export type INavbarProps = {
  navItems: INavItem[];
  showLogout?: boolean;
};

export const Navbar = ({ navItems, showLogout = true }: INavbarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuthentication();

  return (
    <View className="bg-verde-400 px-6 py-4">
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
        {showLogout ? (
          <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
        ) : null}
      </View>

      <SideMenu
        isVisible={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        navItems={navItems}
      />
    </View>
  );
};
