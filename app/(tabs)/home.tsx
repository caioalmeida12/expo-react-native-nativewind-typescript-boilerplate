import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, View, ScrollView } from "react-native";
import { Navbar } from "../components/Navbar";
import { PersonalInformations } from "../components/PersonalInformations";
import { useStudentInfo } from "../hooks/useStudentInfo";
import MenusByDay from "../components/MenusByDay";

export default function HomeScreen() {
  const { studentInfo, isLoading } = useStudentInfo();

  const studentNavItems = [
    {
      title: "Refeições para hoje",
      rota: "/home",
    },
    {
      title: "Histórico de refeições",
      rota: "/mealHistory",
    },
    {
      title: "Refeições autorizadas",
      rota: "/allowedMeals",
    },
    {
      title: "Sair",
      rota: "/",
    },
  ];

  if (isLoading) return "Loading";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Navbar navItems={studentNavItems} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-4 flex flex-col gap-y-4">
            {studentInfo ? (
              <>
                <PersonalInformations studentInfo={studentInfo} />
                <MenusByDay />
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
