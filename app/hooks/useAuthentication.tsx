import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchHelper } from "../helpers/FetchHelper";
import { TLoginResponse } from "../types/TAuthentication";
import { useRedirect } from "./useRedirect";
import AsyncStorage from "@react-native-async-storage/async-storage";

type LoginCredentials = {
  email: string;
  password: string;
};

export const useAuthentication = () => {
  const { redirect } = useRedirect();
  const queryClient = useQueryClient();

  const userInfo = useQuery({
    initialData: null,
    queryKey: ["userInfo"],
    queryFn: async () => {
      const userInfo = await AsyncStorage.getItem("userInfo");

      return JSON.parse(userInfo || "null") as TLoginResponse | null;
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await FetchHelper.post({
        rota: "/login",
        body: credentials,
      });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      if (!response.resposta.length)
        throw new Error("Não foi possível realizar o login");

      return (
        response.resposta
          .map((res) => TLoginResponse.safeParse(res))
          .filter((res) => res.success)
          .map((res) => res.data)
          .at(0) ?? null
      );
    },
    onError: () => {
      console.log("Invalid authentication response at useAuthentication");
      redirect("/", { throw: true });
    },
    onSuccess: async (userInfo) => {
      await AsyncStorage.setItem("token", userInfo?.access_token || "");
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

      queryClient.setQueryData(["userInfo"], userInfo);
      queryClient.invalidateQueries({
        queryKey: ["userInfo"],
      });

      redirect("/home");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem("token");
    },
    onSuccess: () => {
      queryClient.setQueryData(["userInfo"], null);
      queryClient.invalidateQueries({
        queryKey: ["userInfo"],
      });

      redirect("/", { throw: true });
    },
  });

  return {
    userInfo: userInfo.data as TLoginResponse | null,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    error: loginMutation.error || logoutMutation.error,
  };
};
