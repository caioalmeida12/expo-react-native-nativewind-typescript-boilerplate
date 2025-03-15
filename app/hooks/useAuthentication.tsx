import { useMutation } from "@tanstack/react-query";
import { FetchHelper } from "../helpers/FetchHelper";
import { redirecionar } from "../helpers/Redirecionar";
import { TAuthenticationResponse } from "../types/TAuthentication";

type LoginCredentials = {
  email: string;
  password: string;
};

export const useAuthentication = () => {
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await FetchHelper.post<TAuthenticationResponse>({
        rota: "/login",
        body: credentials,
      });

      console.log({ response });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      if (!response.resposta.length)
        throw new Error("Não foi possível realizar o login");

      return response.resposta[0];
    },
    onError: () => {
      redirecionar("login");
    },
  });

  return {
    userInfo: loginMutation.data,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
