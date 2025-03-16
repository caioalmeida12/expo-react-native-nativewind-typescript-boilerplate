import { View, Text } from "react-native";
import { useRedirect } from "../hooks/useRedirect";
import { ErrorBoundaryProps } from "expo-router";
import { useLayoutEffect } from "react";

export function NullUserInfoErrorBoundary({
  error,
  retry,
}: ErrorBoundaryProps) {
  const { redirect } = useRedirect();

  useLayoutEffect(() => {
    console.log("NullUserINfoError caught");
    redirect("/", { throw: true });
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Text className="text-xl font-bold text-red-500 mb-4">Oops!</Text>
      <Text className="text-gray-600 dark:text-gray-300 text-center px-4">
        {error?.message || "Something went wrong"}
      </Text>
    </View>
  );
}
