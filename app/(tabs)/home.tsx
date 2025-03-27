import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Navbar } from "../components/Navbar";
import { PersonalInformations } from "../components/PersonalInformations";
import { useStudentInfo } from "../hooks/useStudentInfo";
import MenusByDay from "../components/MenusByDay";

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
        <View className="p-4 flex flex-col gap-y-4">
          {studentInfo ? (
            <>
              <PersonalInformations studentInfo={studentInfo} />
              <MenusByDay />
            </>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
