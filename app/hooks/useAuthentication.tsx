import { useMutation } from "@tanstack/react-query";
import { FetchHelper } from "../helpers/FetchHelper";
import { TAuthenticationResponse } from "../types/TAuthentication";
import { useRedirect } from "./useRedirect";

type LoginCredentials = {
  email: string;
  password: string;
};

export const useAuthentication = () => {
  const { redirect } = useRedirect();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await FetchHelper.post<TAuthenticationResponse>({
        rota: "/login",
        body: credentials,
      });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      if (!response.resposta.length)
        throw new Error("Não foi possível realizar o login");

      return response.resposta[0];
    },
    onError: () => redirect("index"),
    onSuccess: () => redirect("home"),
  });

  return {
    userInfo: loginMutation.data,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
