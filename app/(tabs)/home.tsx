import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Navbar } from "../components/Navbar";
import { useStudentInfo } from "../hooks/useStudentInfo";
import { DatesHelper } from "../helpers/DatesHelper";
import { PersonalInformations } from "../components/PersonalInformations";

export default function HomeScreen() {
  const { studentInfo, isLoading } = useStudentInfo();

  if (isLoading) return "Loading";

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Navbar
          navItems={[
            {
              title: "Sair",
              rota: "/",
            },
          ]}
        />
        <View className="p-4">
          {studentInfo ? (
            <PersonalInformations studentInfo={studentInfo} />
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
