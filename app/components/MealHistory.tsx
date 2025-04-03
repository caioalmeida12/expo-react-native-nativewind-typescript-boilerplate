import React, { memo } from "react";
import {
  Text,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Section } from "./Section";
import { TMealHistory } from "../types/TMeal";
import { MealHistoryItem, MealHistoryItemLoading } from "./MealHistoryItem";
import { useMeals } from "../hooks/useMeals";
import { Stack } from "expo-router";
import { Slider } from "./Slider";

const ITEMS_TO_SHOW = 10;

const LoadingState = memo(() => (
  <View className="flex-1 gap-y-4">
    {Array.from({ length: ITEMS_TO_SHOW }).map((_, index) => (
      <MealHistoryItemLoading key={`loading-${index}`} />
    ))}
  </View>
));

const HistoryList = memo(({ item }: { item: TMealHistory | null }) => (
  <View>
    {item ? (
      <MealHistoryItem key={`history-${item.id}`} {...item} />
    ) : (
      <MealHistoryItemLoading />
    )}
  </View>
));

export const MealHistory: React.FC = () => {
  const { mealHistory, isLoading, error, refetchHistory } = useMeals();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Section>
          <Slider
            text="Histórico de Refeições"
            className="col-span-2 flex-row bg-preto-400"
            showArrows={false}
          />

          <View className="flex-1">
            {isLoading ? (
              <LoadingState />
            ) : (
              <FlatList
                className="flex-1 gap-y-4"
                data={mealHistory}
                keyExtractor={(item, index) =>
                  item ? item.id.toString() : `loading-${index}`
                }
                renderItem={({ item }) => <HistoryList item={item} />}
                ListEmptyComponent={
                  error ? (
                    <Text className="text-red-500">
                      Não foi possível carregar o histórico
                    </Text>
                  ) : null
                }
                onRefresh={refetchHistory}
                refreshing={!!isLoading}
                ItemSeparatorComponent={() => <View className="h-4" />}
              />
            )}
          </View>
        </Section>
      </KeyboardAvoidingView>
    </>
  );
};
