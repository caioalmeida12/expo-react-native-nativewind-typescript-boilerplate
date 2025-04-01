import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { FetchHelper } from "../helpers/FetchHelper";
import { TMeal, TMenuAndMeal } from "../types/TMeal";
import { useMenusByDay } from "./useMenusByDay";

type ReservationParams = {
  meal_id: number;
  date: string;
};

type JustificationParams = {
  ticket_id: number;
  justificationIndex: number;
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
  const mealHistory = useQuery({
    queryKey: ["mealHistory"],
    queryFn: async ({ signal }) => {
      const response = await FetchHelper.get<TMenuAndMeal[]>({
        rota: "/student/schedulings/to-use",
        headers: { signal: signal as any },
      });

      if (!response.sucesso) {
        throw new Error(response.message);
      }

      return response.resposta;
    },
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

  return {
    // Queries
    meals: menus,
    authorizedMeals: authorizedMeals.data,
    mealHistory: mealHistory.data,

    // Mutations
    reserve: reserveMutation.mutate,
    cancel: cancelMutation.mutate,
    justify: justifyMutation.mutate,

    // Loading states
    isLoading:
      isMenusLoading || authorizedMeals.isPending || mealHistory.isPending,

    // Error states
    error:
      reserveMutation.error || cancelMutation.error || justifyMutation.error,

    // Refetch functions
    refetchHistory: mealHistory.refetch,
  };
};
