import { View, Text } from "react-native";
import { TMeal } from "../types/TMeal";
import { MealName } from "./MealName";

type AllowedMealCardProps = {
  meal: TMeal;
  allowedDays: string[];
};

export function AllowedMealCard({ meal, allowedDays }: AllowedMealCardProps) {
  const diasAutorizados = allowedDays
    .map((dia) => dia.toLowerCase())
    .join(", ");

  return (
    <View className="flex flex-col gap-y-2 rounded bg-white p-4 border border-cinza-600">
      <View className="flex flex-row items-start justify-between">
        <MealName meal={meal} />
        <Text className="text-sm text-gray-600">
          {meal.timeStart} às {meal.timeEnd}
        </Text>
      </View>
      <View className="flex flex-row">
        <Text className="font-bold">Dias autorizados: </Text>
        <Text>{diasAutorizados === "" ? "nenhum" : diasAutorizados}</Text>
      </View>
    </View>
  );
}
