import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
import { FetchHelper } from "../helpers/FetchHelper";
import { TStudentInfoResponse } from "../types/TAuthentication";
import { useAuthentication } from "./useAuthentication";
import { useRedirect } from "./useRedirect";

export const useStudentInfo = () => {
  const { redirect } = useRedirect();

  const { userInfo } = useAuthentication();

  const studentInfoQuery = useQuery({
    queryKey: ["studentInfo", userInfo?.id],
    queryFn: async () => {
      if (!userInfo?.id) return null;

      const response = await FetchHelper.get({
        rota: `/all/show-student/${userInfo?.id}`,
        headers: {
          authorization: `Bearer ${userInfo?.access_token}`,
        },
      });

      if (!response.sucesso) {
        return redirect("/", { throw: true }) as never;
      }

      return (
        response.resposta
          .map((res) => TStudentInfoResponse.safeParse(res))
          .filter((res) => res.success)
          .map((res) => res.data)
          .at(0) ?? null
      );
    },
  });

  return {
    studentInfo: studentInfoQuery.data,
    isLoading: studentInfoQuery.isLoading,
    error: studentInfoQuery.error,
    refetch: studentInfoQuery.refetch,
  };
};
