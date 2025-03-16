import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchHelper } from "../helpers/FetchHelper";
import { TLoginResponse } from "../types/TAuthentication";
import { useRedirect } from "./useRedirect";

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
    onSuccess: (userInfo) => {
      queryClient.setQueryData(["userInfo"], userInfo);
      queryClient.invalidateQueries({
        queryKey: ["userInfo"],
      });

      redirect("/home");
    },
  });

  return {
    userInfo: userInfo.data as TLoginResponse | null,
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};
