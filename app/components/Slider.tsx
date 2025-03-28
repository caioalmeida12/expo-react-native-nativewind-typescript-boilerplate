import React from "react";
import { View, Text, TouchableOpacity, ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SliderProps extends ViewProps {
  text: string;
  tooltip?: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const Slider: React.FC<SliderProps> = ({
  text,
  onPrevious,
  onNext,
  tooltip,
  ...rest
}) => {
  return (
    <View
      {...rest}
      className={`${rest.className} flex items-center justify-between rounded bg-cinza-600 p-4 text-center font-bold text-branco-400`}
    >
      <TouchableOpacity
        onPress={onPrevious}
        accessibilityLabel="Ver dia anterior"
        className="relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[''] hover:before:absolute"
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color="white"
          className="fill-branco-400"
        />
      </TouchableOpacity>

      <View className="flex-1 mx-2 items-center">
        <Text
          className="text-branco-400 font-bold text-center flex-wrap"
          numberOfLines={2}
        >
          {text}
        </Text>
        {tooltip}
      </View>

      <TouchableOpacity
        onPress={onNext}
        accessibilityLabel="Ver dia posterior"
        className="relative before:inset-[-.5em] before:rounded before:bg-branco-400 before:opacity-10 before:content-[''] hover:before:absolute"
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color="white"
          className="fill-branco-400"
        />
      </TouchableOpacity>
    </View>
  );
};
