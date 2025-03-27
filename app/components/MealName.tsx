import React from "react";
import { View, Text } from "react-native";
import { TMeal } from "../types/TMeal";
import Icone from "./Icone";

interface MealNameProps {
  meal: TMeal;
  className?: string;
}

export const MealName: React.FC<MealNameProps> = ({ meal, className }) => {
  return (
    <View className={`flex-row items-center gap-x-2 ${className || ""}`}>
      <Icone.Refeicao
        variante={
          ["morning", "lunch", "afternoon", "night"][Number(meal.id) - 1] ??
          "noite"
        }
      />
      <Text className="font-bold">{meal.description}</Text>
    </View>
  );
};
