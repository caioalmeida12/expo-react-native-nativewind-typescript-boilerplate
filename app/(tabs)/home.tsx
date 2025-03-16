import { Stack } from "expo-router";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useRedirect } from "../hooks/useRedirect";
import { useStudentInfo } from "../hooks/useStudentInfo";
import { View, Text } from "react-native";

export default function HomeScreen() {
  const { redirect } = useRedirect();
  const { studentInfo, isLoading } = useStudentInfo();

  if (isLoading) return "Loading";

  console.log({ studentInfo });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View>
          <Text>{studentInfo?.name}</Text>
          <Text>{"MAKONHA"}</Text>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
