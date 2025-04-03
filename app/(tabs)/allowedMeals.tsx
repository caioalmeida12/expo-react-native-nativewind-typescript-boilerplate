import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { Navbar } from "../components/Navbar";
import { PersonalInformations } from "../components/PersonalInformations";
import { useStudentInfo } from "../hooks/useStudentInfo";
import { AllowedMeals } from "../components/AllowedMeals";

export default function AllowedMealsScreen() {
  const { studentInfo, isLoading: isStudentInfoLoading } = useStudentInfo();

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

  if (isStudentInfoLoading) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Navbar navItems={studentNavItems} />
        <View className="p-4 flex flex-col gap-y-4">
          {studentInfo ? (
            <PersonalInformations studentInfo={studentInfo} />
          ) : null}
        </View>
        <ScrollView className="flex-1">
          <View className="p-4 flex flex-col gap-y-4">
            <AllowedMeals />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
