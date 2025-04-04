import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { MealHistory } from "../components/MealHistory";
import { Navbar } from "../components/Navbar";
import { PersonalInformations } from "../components/PersonalInformations";
import { useMealHistory } from "../hooks/useMealHistory";
import { useStudentInfo } from "../hooks/useStudentInfo";

export default function MealHistoryScreen() {
  const { mealHistory, isLoading: isMealHistoryLoading } = useMealHistory();
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

  if (isMealHistoryLoading) return "Loading";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Navbar navItems={studentNavItems} />
        <ScrollView className="flex-1 p-4">
          <View className="flex flex-col gap-y-4">
            {studentInfo ? (
              <>
                <PersonalInformations studentInfo={studentInfo} />
              </>
            ) : null}
            <MealHistory />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
