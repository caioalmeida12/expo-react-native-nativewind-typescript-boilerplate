import React from "react";
import { Text } from "react-native";

export interface ITimes {
  qtdTimeReservationEnd: number;
  qtdTimeReservationStart: number;
  timeEnd: string;
  timeStart: string;
}

export type ITimeOnly = {
  variant: "time";
  times: ITimes;
};

export type IDateOnly = {
  variant: "date";
  date: string;
};

export type ITimeAndDate = {
  variant: "time-and-date";
  times: ITimes;
  date: string;
};

type MealTimeProps = ITimeOnly | IDateOnly | ITimeAndDate;

const removeSeconds = (time: string) => time.slice(0, 5);

const getTextByVariant = (props: MealTimeProps) => {
  switch (props.variant) {
    case "time":
      return `${removeSeconds(props.times.timeStart)}h às ${removeSeconds(props.times.timeEnd)}h`;
    case "date":
      return `${removeSeconds(props.date)}`;
    case "time-and-date":
      return `${removeSeconds(props.date)} - ${removeSeconds(props.times.timeStart)}h às ${removeSeconds(props.times.timeEnd)}h`;
  }
};

export const MealTime = (props: MealTimeProps) => {
  return <Text className="text-gray-600">{getTextByVariant(props)}</Text>;
};
