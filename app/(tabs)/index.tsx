import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { Stack } from "expo-router";
import { Checkbox } from "expo-checkbox";
import { Button } from "../components/Button";
import { Navbar } from "../components/Navbar";

const LoadingMessage = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <Text className="text-center text-sm text-blue-400">Carregando...</Text>
  );
};

const ErrorMessage = ({ error }: { error: Error | string | null }) => {
  if (!error) return null;
  return (
    <Text className="text-center text-sm text-red-500">
      {error instanceof Error ? error.message : error}
    </Text>
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState("caiodealmeida12@gmail.com");
  const [password, setPassword] = useState("123456");
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isLoading, error } = useAuthentication();

  const handleLogin = () => {
    login({ email, password });
  };

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
              title: "Login",
              rota: "/",
            },
          ]}
          showLogout={false}
        />
        <View className="flex-1 flex-col gap-y-8 items-center justify-center bg-white px-4">
          <Image
            source={require("../../assets/images/sisrefLogo.png")}
            className="w-32 h-32"
            resizeMode="contain"
          />

          <View className="w-full min-w-[256px] max-w-[400px] space-y-4">
            <View>
              <Text className="mb-2 font-medium">Email</Text>
              <TextInput
                className="w-full px-4 py-2 rounded border border-cinza-600 text-dark bg-cinza-400"
                placeholder="estudante@ifce.edu.br"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="mb-2 font-medium">Senha</Text>
              <TextInput
                className="w-full px-4 py-2 rounded border border-cinza-600 text-dark bg-cinza-400"
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View className="flex-row items-center gap-2">
              <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                className="rounded border-2 border-zinc-600"
              />
              <Text>Lembre-se de mim</Text>
            </View>

            <ErrorMessage error={error} />
            <LoadingMessage isLoading={isLoading} />

            <Button
              text="Entrar"
              variant="add"
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
