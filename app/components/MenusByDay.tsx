import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useMenusByDay } from "../hooks/useMenusByDay";
import { Menu } from "./Menu";

export default function MenusByDay() {
  const { menus, isLoading } = useMenusByDay();

  if (isLoading) return "Loading";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {menus
          ? menus.map((res) =>
              res?.meal ? <Menu meal={res.meal} menu={res.menu} /> : null
            )
          : null}
      </KeyboardAvoidingView>
    </>
  );
}
