import { Stack } from "expo-router";
import React, { memo } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useMenusByDay } from "../hooks/useMenusByDay";
import { Menu, MealLoading } from "./Menu";
import { Ionicons } from "@expo/vector-icons";
import { Section } from "./Section";
import { Slider } from "./Slider";

type MenuItemProps = {
  menuItem: any;
  index: number;
};

const MenuList = memo(({ menuItem, index }: MenuItemProps) => (
  <View key={`menu-${index}`}>
    {menuItem?.meal ? (
      <Menu
        key={`meal-${menuItem.meal.id}`}
        meal={menuItem.meal}
        menu={menuItem.menu}
      />
    ) : menuItem?.menu ? (
      <Menu
        key={`default-${index}`}
        meal={{
          id: index + 1,
          description: menuItem.menu.description,
          qtdTimeReservationStart: 0,
          qtdTimeReservationEnd: 0,
          timeStart: "",
          timeEnd: "",
          campus_id: 1,
        }}
      />
    ) : null}
  </View>
));

const LoadingState = memo(() => (
  <View className="flex-1 gap-y-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <MealLoading key={`loading-${index}`} />
    ))}
  </View>
));

export default function MenusByDay() {
  const {
    menus,
    isLoading,
    dateText,
    goToNextDay,
    goToPreviousDay,
    daysDifference,
    hasNoMenus,
  } = useMenusByDay();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Section>
          <Slider
            text={`Refeições para ${dateText}`}
            className="col-span-2 flex-row bg-preto-400"
            onNext={() => {
              if (daysDifference > 7) return;
              goToNextDay();
            }}
            onPrevious={() => {
              if (daysDifference < -7) return;
              goToPreviousDay();
            }}
            tooltip={
              hasNoMenus ? (
                <View className="ml-2">
                  <Ionicons name="warning" size={20} color="#f87171" />
                </View>
              ) : undefined
            }
          />

          <View className="flex-1">
            {isLoading ? (
              <LoadingState />
            ) : (
              <View className="flex-1 gap-y-4">
                {menus?.map((menuItem, index) => (
                  <MenuList
                    key={`menulist-${index}`}
                    menuItem={menuItem}
                    index={index}
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
