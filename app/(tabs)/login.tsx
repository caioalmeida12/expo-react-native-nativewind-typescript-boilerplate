import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthentication();

  const handleLogin = () => {
    login({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 items-center justify-center bg-white dark:bg-black px-6">
        <View className="w-full max-w-sm space-y-6">
          <View className="space-y-2">
            <Text className="text-3xl font-bold text-center text-dark dark:text-white">
              Welcome Back
            </Text>
            <Text className="text-zinc-500 dark:text-zinc-400 text-center">
              Sign in to your account
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <TextInput
                className="w-full h-12 px-4 border border-zinc-200 dark:border-zinc-700 rounded-lg text-dark dark:text-white bg-white dark:bg-zinc-900"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <TextInput
                className="w-full h-12 px-4 border border-zinc-200 dark:border-zinc-700 rounded-lg text-dark dark:text-white bg-white dark:bg-zinc-900"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {error && (
              <Text className="text-red-500 text-sm text-center">
                {error instanceof Error ? error.message : "Login failed"}
              </Text>
            )}

            <TouchableOpacity
              className={`w-full h-12 flex items-center justify-center rounded-lg bg-blue-500 ${
                isLoading ? "opacity-50" : ""
              }`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold">
                {isLoading ? "Signing in..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
