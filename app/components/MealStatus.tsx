import React from "react";
import { View, Text } from "react-native";
import Icone from "./Icone";
import { Tooltip } from "./Tooltip";

type StatusColors =
  | "green-300"
  | "red-400"
  | "gray-600"
  | "yellow-200"
  | "blue-400";

// Updated to match Icone.Status variant types
type StatusIcons =
  | "circulo-x"
  | "circulo-check"
  | "tag-x"
  | "cadeado"
  | "relogio-x";

interface MealStatusProps {
  text: string;
  color: StatusColors;
  icon: StatusIcons;
  tooltipText?: string;
}

const colorMapping = {
  "green-300": {
    fill: "#359830",
    text: "#359830",
  },
  "red-400": {
    fill: "#C80B0F",
    text: "#C80B0F",
  },
  "gray-600": {
    fill: "#A29C9B",
    text: "#A29C9B",
  },
  "yellow-200": {
    fill: "#D7AF70",
    text: "#D7AF70",
  },
  "blue-400": {
    fill: "#0075FF",
    text: "#0075FF",
  },
} as const;

export const MealStatus = ({
  text,
  color,
  icon,
  tooltipText,
}: MealStatusProps) => {
  if (!tooltipText) {
    return (
      <View className="flex-row items-center gap-x-2">
        <Text style={{ color: colorMapping[color].text }}>{text}</Text>
        <Icone.Status variante={icon} fill={colorMapping[color].fill} />
      </View>
    );
  }

  return (
    <Tooltip
      triggerElement={
        <View className="flex-row items-center gap-x-2">
          <Text style={{ color: colorMapping[color].text }}>{text}</Text>
          <Icone.Status variante={icon} fill={colorMapping[color].fill} />
        </View>
      }
      contentElement={<Text className="text-gray-800">{tooltipText}</Text>}
    />
  );
};
