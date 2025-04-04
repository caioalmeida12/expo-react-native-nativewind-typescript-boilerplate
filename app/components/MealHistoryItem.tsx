import React from "react";
import { View, Text } from "react-native";
import { Section } from "./Section";
import { TMealHistory } from "../types/TMeal";
import { MealStatus } from "./MealStatus";
import { MealName } from "./MealName";
import { MealTime } from "./MealTime";
import { DatesHelper } from "../helpers/DatesHelper";

type StatusType =
  | "a-ser-utilizado"
  | "utilizado"
  | "justificado"
  | "cancelado"
  | "nao-utilizado";

const statusElements = {
  "a-ser-utilizado": {
    color: "green-300" as const,
    text: "Reservado",
    tooltipText: "Você ainda pode utilizar este ticket.",
  },
  utilizado: {
    color: "green-300" as const,
    text: "Utilizado",
    tooltipText: "Você reservou e utilizou este ticket.",
  },
  justificado: {
    color: "blue-400" as const,
    text: "Justificado",
    tooltipText: "Você justificou sua ausência para esta refeição.",
  },
  cancelado: {
    color: "red-400" as const,
    text: "Cancelado",
    tooltipText: "Você cancelou esta reserva.",
  },
  "nao-utilizado": {
    color: "yellow-200" as const,
    text: "Não Utilizado",
    tooltipText: "Você esteve ausente nesta refeição.",
  },
} as const;

const parseMenuDescription = (description: string) => {
  return description.split(/[;+]/).filter((item) => item.trim() !== "");
};

interface ExtendedTMealHistory extends TMealHistory {
  status: StatusType;
}

export const MealHistoryItem: React.FC<ExtendedTMealHistory> = (props) => {
  if (!props.status || !props.meal.id) return null;

  const status = statusElements[props.status];

  if (!status) {
    console.warn(`Invalid status value: ${props.status}`);
    return null;
  }

  const mealWithLiteralCampusId = {
    ...props.meal,
    campus_id: 1 as const,
  };

  return (
    <Section className="flex-col h-fit gap-y-1">
      <View className="flex-row justify-between gap-x-2 flex-wrap">
        <MealName meal={mealWithLiteralCampusId} />
        <MealStatus
          color={status.color}
          text={status.text}
          tooltipText={status.tooltipText}
        />
      </View>
      <MealTime
        variant="time-and-date"
        date={DatesHelper.convertToBrazilianFormat(props.menu.date)}
        times={{
          qtdTimeReservationEnd: props.meal.qtdTimeReservationEnd,
          qtdTimeReservationStart: props.meal.qtdTimeReservationStart,
          timeEnd: DatesHelper.removeSecondsFromTime(props.meal.timeEnd),
          timeStart: DatesHelper.removeSecondsFromTime(props.meal.timeStart),
        }}
      />
      <View className="mt-2">
        {parseMenuDescription(props.menu.description).map((desc, index) => (
          <Text key={index} className="leading-6">
            {desc}
          </Text>
        ))}
      </View>
    </Section>
  );
};

export const MealHistoryItemLoading: React.FC = () => {
  return (
    <Section className="flex-col h-fit gap-y-2">
      <View className="flex-row justify-between gap-x-2 flex-wrap">
        <View className="w-[140px] h-[20px] bg-gray-300"></View>
        <View className="w-[80px] h-[20px] bg-gray-300"></View>
      </View>
      <View className="w-[70%] h-[20px] bg-gray-300"></View>
      <View className="leading-6">
        <View className="w-[60%] h-[20px] bg-gray-300 mb-1"></View>
        <View className="w-[70%] h-[20px] bg-gray-300 mb-1"></View>
        <View className="w-[50%] h-[20px] bg-gray-300 mb-1"></View>
        <View className="w-[45%] h-[20px] bg-gray-300"></View>
      </View>
    </Section>
  );
};
