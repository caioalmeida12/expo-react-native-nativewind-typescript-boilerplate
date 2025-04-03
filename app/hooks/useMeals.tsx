import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FetchHelper } from "../helpers/FetchHelper";
import {
  TMeal,
  TMealHistory,
  TMealHistorySchema,
  TAllowedMeal,
  TAllowedMealsResponse,
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

  // Mutation for meal reservation
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

  // Query for authorized meals
  const authorizedMeals = useQuery({
    queryKey: ["authorizedMeals"],
    queryFn: async ({ signal }) => {
      const response = await FetchHelper.get<TMeal[]>({
        rota: "/student/schedulings/allows-meal-by-day",
        headers: { signal: signal as any },
      });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      return response.resposta;
    },
  });

  // Query for meal history
  const mealHistory = useQuery<TMealHistory[]>({
    queryKey: ["mealHistory"],
    queryFn: async ({ signal }) => {
      const [aSerUtilizado, utilizado, cancelado, naoUtilizado] =
        await Promise.all([
          buscarTickets("a-ser-utilizado"),
          buscarTickets("utilizado"),
          buscarTickets("cancelado"),
          buscarTickets("nao-utilizado"),
        ]);

      // Add status to each ticket
      aSerUtilizado.forEach((ticket) => (ticket.status = "a-ser-utilizado"));
      utilizado.forEach((ticket) => (ticket.status = "utilizado"));
      cancelado.forEach((ticket) => (ticket.status = "cancelado"));
      naoUtilizado.forEach((ticket) => {
        ticket.absenceJustification
          ? (ticket.status = "justificado")
          : (ticket.status = "nao-utilizado");
      });

      // Concatenate and sort all tickets by date
      const allTickets = [
        ...aSerUtilizado,
        ...utilizado,
        ...cancelado,
        ...naoUtilizado,
      ];
      const sortedTickets = allTickets.sort(
        (a, b) =>
          new Date(b.menu.date).getTime() - new Date(a.menu.date).getTime()
      );

      // Return most recent tickets
      return sortedTickets.slice(0, 10);
    },
    initialData: [],
  });

  // Mutation for meal cancellation
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

  // Mutation for meal justification
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

  // Query for allowed meals
  const allowedMealsQuery = useQuery<TAllowedMealsResponse>({
    queryKey: ["allowedMeals"],
    queryFn: async ({ signal }) => {
      console.log("Starting allowedMealsQuery fetch");

      const response = await FetchHelper.get<TAllowedMealsResponse>({
        rota: "/student/schedulings/allows-meal-by-day",
        headers: { signal: signal as any },
      });

      console.log("FetchHelper response:", response);

      if (!response.sucesso) {
        console.log("Request failed:", response.message);
        throw new Error(response.message);
      }

      return response.resposta;
    },
    initialData: [],
    retry: false, // Add this to prevent retries and see errors immediately
    onError: (error) => {
      console.log("Query error:", error);
    },
  });

  return {
    // Queries
    meals: menus,
    authorizedMeals: authorizedMeals.data,
    mealHistory: mealHistory.data,

    // Mutations
    reserve: reserveMutation.mutate,
    cancel: cancelMutation.mutate,
    justify: justifyMutation.mutate,

    allowedMeals: allowedMealsQuery.data,
    isAllowedMealsLoading: allowedMealsQuery.isPending,
    allowedMealsError: allowedMealsQuery.error,
    refetchAllowedMeals: allowedMealsQuery.refetch,

    // Loading states
    isLoading:
      isMenusLoading ||
      authorizedMeals.isPending ||
      mealHistory.isPending ||
      allowedMealsQuery.isPending,

    // Error states
    error:
      reserveMutation.error ||
      cancelMutation.error ||
      justifyMutation.error ||
      mealHistory.error ||
      allowedMealsQuery.error,

    // Refetch functions
    refetchHistory: mealHistory.refetch,
  };
};
