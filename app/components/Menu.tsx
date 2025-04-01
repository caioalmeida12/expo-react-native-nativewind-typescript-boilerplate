import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { DatesHelper } from "../helpers/DatesHelper";
import { useMeals } from "../hooks/useMeals";
import useResponseMessage from "../hooks/useResponseMessage";
import { TMeal, TMenu, TMenuAndMeal } from "../types/TMeal";
import { Button } from "./Button";
import { MealName } from "./MealName";
import { MealStatus } from "./MealStatus";
import { MealTime } from "./MealTime";
import { Section } from "./Section";
import { CancelMealModal } from "./CancelMealModal";

const statusElementByStatusText = {
  available: (
    <MealStatus
      color="green-300"
      icon="circulo-check"
      text="Disponível"
      tooltipText="Você pode reservar esta refeição."
    />
  ),
  closed: (
    <MealStatus
      color="gray-600"
      icon="relogio-x"
      text="Encerrado"
      tooltipText="O horário de reservas já foi ultrapassado."
    />
  ),
  blocked: (
    <MealStatus
      color="yellow-200"
      icon="cadeado"
      text="Bloqueado"
      tooltipText="Esta refeição não está liberada para você."
    />
  ),
  canceled: (
    <MealStatus
      color="red-400"
      icon="tag-x"
      text="Cancelado"
      tooltipText="Você cancelou esta refeição."
    />
  ),
  reserved: (
    <MealStatus
      color="green-300"
      icon="circulo-check"
      text="Reservado"
      tooltipText="Você reservou esta refeição."
    />
  ),
  unavailable: (
    <MealStatus
      color="gray-600"
      icon="relogio-x"
      text="Indisponível"
      tooltipText="Está muito cedo ou muito tarde para reservar esta refeição."
    />
  ),
};

/**
 * Converts menu description into an array of strings.
 * @param description - The menu description.
 * @returns Array of strings.
 */
const menuDescriptionToStringArray = (description: string) => {
  return description.split(/[;+]/).filter((notEmpty) => notEmpty);
};

type IMealProps =
  | {
      meal: TMeal;
      menu: TMenu;
    }
  | {
      meal: TMeal;
    };

type MealStatus =
  | "available"
  | "closed"
  | "blocked"
  | "canceled"
  | "reserved"
  | "unavailable";
// Available: the meal is available for reservation when current date and time are within reservation interval
// Closed: the meal is no longer available for reservation as current date and time exceeded reservation interval
// Blocked: the meal is not available for reservation as the menu is not available (permission = false)
// Canceled: the meal was canceled by the student (canceled_by_student = true)
// Reserved: the meal was reserved by the student (agendado = true)
// Unavailable: the meal is not available for reservation as current date and time are not within reservation interval

/**
 * Returns the meal status.
 * @param props - The meal properties.
 * @returns The meal status.
 */
export const getMealStatus = (props: TMenuAndMeal): MealStatus => {
  if (!props.meal || !props.menu) return "unavailable";
  if (!props.menu.permission) return "blocked";
  if (props.menu.canceled_by_student) return "canceled";
  if (props.menu.agendado) return "reserved";

  const mealStartDateTime = DatesHelper.compileDateTime(
    props.menu.date,
    props.meal.timeStart
  );
  const hoursUntilStart = DatesHelper.getDifferenceInHours(mealStartDateTime);

  const mealEndDateTime = DatesHelper.compileDateTime(
    props.menu.date,
    props.meal.timeEnd
  );
  const hoursUntilEnd = DatesHelper.getDifferenceInHours(mealEndDateTime);

  if (hoursUntilStart < 0 || hoursUntilEnd < 0) return "closed";
  if (hoursUntilStart > props.meal.qtdTimeReservationStart)
    return "unavailable";
  if (hoursUntilStart < props.meal.qtdTimeReservationEnd) return "unavailable";
  return "available";
};

const ShortMeal = (props: TMenuAndMeal) => {
  const MealStatusElement = statusElementByStatusText[getMealStatus(props)];

  return (
    <Section className="h-fit">
      <View className="flex-row justify-between gap-x-2 flex-wrap">
        <MealName meal={props.meal} />
        {MealStatusElement}
      </View>
    </Section>
  );
};

const LongMeal = (props: TMenuAndMeal, showButton: boolean) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { updateMessage, ResponseText } = useResponseMessage();
  const { reserve } = useMeals();

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonDisabled(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleReserve = () => {
    updateMessage({ message: "Reservando sua refeição..." });
    reserve(
      { meal_id: props.meal.id, date: props.menu.date },
      {
        onSuccess: (response) => {
          updateMessage({
            ...response,
            success: true,
            message: "Refeição reservada com sucesso!",
          });
          setTimeout(() => {
            updateMessage({ message: "", success: true });
          }, 2000);
        },
        onError: (error) =>
          updateMessage({ message: error.message, success: false }),
      }
    );
  };

  if ("shift" in props) return <ShortMeal {...props} />;

  const MealStatusElement = statusElementByStatusText[getMealStatus(props)];
  const statusText = getMealStatus(props);

  return (
    <Section className="flex-col h-fit gap-y-1">
      <View className="flex-row justify-between gap-x-2 flex-wrap">
        <MealName meal={props.meal} />
        {MealStatusElement}
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
        {menuDescriptionToStringArray(props.menu.description).map(
          (description, index) => (
            <Text key={index} className="leading-6">
              {description}
            </Text>
          )
        )}
      </View>
      {showButton && statusText === "available" && (
        <View className="mt-2 flex-col gap-y-2">
          <ResponseText />
          <Button
            text="Reservar"
            variant="add"
            onPress={handleReserve}
            disabled={buttonDisabled}
          />
        </View>
      )}
      {showButton && statusText === "reserved" && (
        <CancelMealModal date={props.menu.date} meal_id={props.meal.id} />
      )}
    </Section>
  );
};

const UnavailableMeal = ({ meal }: { meal: TMeal }) => {
  return (
    <Section className="flex-col h-fit gap-y-2">
      <View className="flex-row justify-between gap-x-2 flex-wrap">
        <MealName meal={meal} />
        <MealStatus
          color="gray-600"
          icon="relogio-x"
          text="Indisponível"
          tooltipText="Está muito cedo ou muito tarde para reservar esta refeição."
        />
      </View>
    </Section>
  );
};

export const Menu = (props: IMealProps) => {
  if ("meal" in props && !("menu" in props)) {
    return <UnavailableMeal meal={props.meal} />;
  }

  const statusText = getMealStatus(props);
  const showButton = statusText === "available" || statusText === "reserved";
  return LongMeal(props, showButton);
};

export const MealLoading = () => {
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
      <View className="w-full h-[58px] bg-gray-300"></View>
    </Section>
  );
};
