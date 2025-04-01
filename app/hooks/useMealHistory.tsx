import { useMeals } from "./useMeals";

export const useMealHistory = () => {
  const { mealHistory, isLoading, isFetching, error, refetchHistory } =
    useMeals();

  return {
    mealHistory,
    isLoading,
    isFetching,
    error,
    refetchHistory,
  };
};
