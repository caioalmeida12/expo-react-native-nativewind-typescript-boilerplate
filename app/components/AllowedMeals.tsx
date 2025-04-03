import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Stack } from "expo-router";
import { useMeals } from "../hooks/useMeals";
import { AllowedMealCard } from "./AllowedMealCard";
import { Section } from "./Section";
import { Slider } from "./Slider";

const getAllowedDaysOfWeek = (meal: any) => {
  const days = [];
  if (meal.monday === 1) days.push("segunda-feira");
  if (meal.tuesday === 1) days.push("terça-feira");
  if (meal.wednesday === 1) days.push("quarta-feira");
  if (meal.thursday === 1) days.push("quinta-feira");
  if (meal.friday === 1) days.push("sexta-feira");
  if (meal.saturday === 1) days.push("sábado");

  if (days.length === 6) return ["segunda a sábado"];
  if (days.length === 5) return ["segunda a sexta"];
  if (days.length === 0) return ["não autorizado"];

  return days;
};

export function AllowedMeals() {
  const { allowedMeals, isAllowedMealsLoading, allowedMealsError } = useMeals();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Section>
          <Slider
            text="Refeições Autorizadas"
            className="col-span-2 flex-row bg-preto-400"
            showArrows={false}
          />

          <View className="flex-1">
            {isAllowedMealsLoading ? (
              <View className="flex-1 items-center justify-center">
                <Text>Carregando...</Text>
              </View>
            ) : allowedMealsError ? (
              <View className="flex-1 items-center justify-center">
                <Text>Erro: {allowedMealsError.message}</Text>
              </View>
            ) : (
              <View className="flex flex-col gap-4">
                {Object.values(
                  [1, 2, 3, 4].reduce(
                    (acc, mealId) => {
                      const meal = allowedMeals.find((m) => m.id === mealId);
                      if (meal) {
                        acc[mealId] = {
                          meal: meal,
                          days: getAllowedDaysOfWeek(meal),
                        };
                      }
                      return acc;
                    },
                    {} as Record<number, { meal: any; days: string[] }>
                  )
                ).map((item, index) => (
                  <AllowedMealCard
                    key={index}
                    meal={item.meal}
                    allowedDays={item.days}
                  />
                ))}
              </View>
            )}
          </View>
        </Section>
      </KeyboardAvoidingView>
    </>
  );
}
