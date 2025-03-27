"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { DatesHelper } from "../helpers/DatesHelper";
import { FetchHelper } from "../helpers/FetchHelper"; // Import FetchHelper
import { TMenuAndMeal, TMenu } from "../types/TMeal";

export const useMenusByDay = (initialDate?: string) => {
  const [searchDate, setSearchDate] = useState(
    initialDate || DatesHelper.getToday()
  );

  const [allMenus, setAllMenus] = useState<
    (TMenuAndMeal | { menu: TMenu; meal: null })[]
  >([]);

  const menusQuery = useQuery({
    queryKey: ["menusByDay", searchDate],
    queryFn: async () => {
      const response = await FetchHelper.get<any>({
        rota: `/all/menus-today?date=${searchDate}`,
      });

      if (!response.sucesso) {
        return [];
      }

      // Preserve the meal data from the API response
      return response.resposta.map((item) => {
        // Extract meal data
        const { meal, ...menuData } = item;

        return {
          menu: menuData,
          meal: meal,
        };
      });
    },
  });

  useEffect(() => {
    // Always need to have 4 menus, even if none were found
    // Default menus with IDs from 1 to 4
    const processedMenus = [1, 2, 3, 4, 7].map((id) => {
      console.log({ menusQuery: menusQuery.data, id });
      // Look for a menu item that has a menu with matching ID
      const foundMenuItem = menusQuery.data?.find(
        (item) => item.menu.meal_id == id
      );

      if (foundMenuItem) {
        return foundMenuItem as TMenuAndMeal | { menu: TMenu; meal: null };
      }

      return {
        menu: {
          id: id,
          description: [
            "Lanche da manhã",
            "Almoço",
            "Lanche da tarde",
            "Lanche da noite",
          ][id - 1],
          qtdTimeReservationStart: 0,
          qtdTimeReservationEnd: 0,
          timeStart: "",
          timeEnd: "",
          campus_id: 1,
        } as unknown as TMenu,
        meal: null,
      };
    });

    setAllMenus(processedMenus);
  }, [menusQuery.data]);

  const goToNextDay = () => {
    const nextDay = DatesHelper.getNextDay(searchDate);
    setSearchDate(nextDay);
  };

  const goToPreviousDay = () => {
    const previousDay = DatesHelper.getPreviousDay(searchDate);
    setSearchDate(previousDay);
  };

  const dateText =
    DatesHelper.getToday() === searchDate
      ? "hoje"
      : DatesHelper.convertToBrazilianFormat(searchDate);

  const daysDifference = DatesHelper.getDifferenceInDays(searchDate);

  return {
    menus: allMenus,
    isLoading: menusQuery.isLoading,
    error: menusQuery.error,
    searchDate,
    dateText,
    daysDifference,
    goToNextDay,
    goToPreviousDay,
    setSearchDate,
    hasNoMenus: menusQuery.data?.length === 0,
  };
};
