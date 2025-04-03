import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchHelper } from "../helpers/FetchHelper";
import {
  TMeal,
  TMealHistory,
  TAllowedMealResponseSchema,
} from "../types/TMeal";
import { useMenusByDay } from "./useMenusByDay";

type ReservationParams = {
  meal_id: number;
  date: string;
};

type JustificationParams = {
  ticket_id: number;
  justificationIndex: number;
};

type TMealHistoryWithStatus = TMealHistory & {
  status:
    | "a-ser-utilizado"
    | "utilizado"
    | "cancelado"
    | "justificado"
    | "nao-utilizado";
};

const urlPorTipoDeTicket = {
  "a-ser-utilizado": "/to-use",
  utilizado: "/used",
  cancelado: "/canceled",
  "nao-utilizado": "/not-used",
} as const;

type TicketType = keyof typeof urlPorTipoDeTicket;

const buscarTickets = async (tipo: TicketType): Promise<TMealHistory[]> => {
  const API_URL = `/student/schedulings${urlPorTipoDeTicket[tipo]}?page=1`;
  const response = await FetchHelper.get<any>({
    rota: API_URL,
  });

  if (!response.sucesso) {
    throw new Error(response.message);
  }

  return response.resposta[0].data;
};

export const useMeals = () => {
  const queryClient = useQueryClient();
  const { menus, isLoading: isMenusLoading } = useMenusByDay();

  const reserveMutation = useMutation({
    mutationFn: async (params: ReservationParams) => {
      const response = await FetchHelper.post<{ message: string }>({
        rota: "/student/schedulings/new",
        body: params,
      });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menusByDay"] });
      queryClient.invalidateQueries({ queryKey: ["mealHistory"] });
    },
  });

  const allowedMealsQuery = useQuery<TMeal[]>({
    queryKey: ["allowedMeals"],
    queryFn: async () => {
      const response = await FetchHelper.get({
        rota: "/student/schedulings/allows-meal-by-day",
      });

      const validated = TAllowedMealResponseSchema.safeParse(response);

      if (!validated.success) {
        throw new Error(`Invalid response: ${validated.error.message}`);
      }

      return validated.data.resposta.map((item) => item.meal);
    },
    initialData: [],
    retry: false,
  });

  const mealHistory = useQuery<TMealHistoryWithStatus[]>({
    queryKey: ["mealHistory"],
    queryFn: async () => {
      const [aSerUtilizado, utilizado, cancelado, naoUtilizado] =
        await Promise.all([
          buscarTickets("a-ser-utilizado"),
          buscarTickets("utilizado"),
          buscarTickets("cancelado"),
          buscarTickets("nao-utilizado"),
        ]);

      const withStatus = {
        aSerUtilizado: aSerUtilizado.map((ticket) => ({
          ...ticket,
          status: "a-ser-utilizado" as const,
        })),
        utilizado: utilizado.map((ticket) => ({
          ...ticket,
          status: "utilizado" as const,
        })),
        cancelado: cancelado.map((ticket) => ({
          ...ticket,
          status: "cancelado" as const,
        })),
        naoUtilizado: naoUtilizado.map((ticket) => ({
          ...ticket,
          status: ticket.absenceJustification
            ? ("justificado" as const)
            : ("nao-utilizado" as const),
        })),
      };

      const allTickets = [
        ...withStatus.aSerUtilizado,
        ...withStatus.utilizado,
        ...withStatus.cancelado,
        ...withStatus.naoUtilizado,
      ];

      const sortedTickets = allTickets.sort(
        (a, b) =>
          new Date(b.menu.date).getTime() - new Date(a.menu.date).getTime()
      );

      return sortedTickets.slice(0, 10);
    },
    initialData: [],
  });

  const cancelMutation = useMutation({
    mutationFn: async (params: ReservationParams) => {
      const response = await FetchHelper.put<{ message: string }>({
        rota: "/student/schedulings/cancel",
        body: params,
      });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menusByDay"] });
      queryClient.invalidateQueries({ queryKey: ["mealHistory"] });
    },
  });

  const justifyMutation = useMutation({
    mutationFn: async ({
      ticket_id,
      justificationIndex,
    }: JustificationParams) => {
      const response = await FetchHelper.put<{ message: string }>({
        rota: `/student/schedulings/student-justification/${ticket_id}`,
        body: { studentJustification: justificationIndex },
      });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealHistory"] });
    },
  });

  return {
    meals: menus,
    authorizedMeals: allowedMealsQuery.data,
    mealHistory: mealHistory.data,
    reserve: reserveMutation.mutate,
    cancel: cancelMutation.mutate,
    justify: justifyMutation.mutate,
    allowedMeals: allowedMealsQuery.data,
    isAllowedMealsLoading: allowedMealsQuery.isPending,
    allowedMealsError: allowedMealsQuery.error,
    refetchAllowedMeals: allowedMealsQuery.refetch,
    isLoading:
      isMenusLoading || allowedMealsQuery.isPending || mealHistory.isPending,
    error:
      reserveMutation.error ||
      cancelMutation.error ||
      justifyMutation.error ||
      mealHistory.error ||
      allowedMealsQuery.error,
    refetchHistory: mealHistory.refetch,
  };
};
