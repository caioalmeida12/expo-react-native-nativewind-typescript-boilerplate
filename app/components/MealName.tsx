import React from "react";
import { View, Text } from "react-native";
import { TMeal } from "../types/TMeal";
import Icone from "./Icone";

interface MealNameProps {
  meal: TMeal;
  className?: string;
}

export const MealName: React.FC<MealNameProps> = ({ meal, className }) => {
  const mealTypeMap = {
    "1": "manha",
    "2": "almoco",
    "3": "tarde",
    "4": "noite",
  } as const;

  return (
    <View className={`flex-row items-center gap-x-2 ${className || ""}`}>
      <Icone.Refeicao
        variante={
          mealTypeMap[meal.id as unknown as keyof typeof mealTypeMap] ?? "noite"
        }
      />
      <Text className="font-bold">{meal.description}</Text>
    </View>
  );
};
