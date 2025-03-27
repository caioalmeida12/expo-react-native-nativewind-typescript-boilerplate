import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  variant: "add" | "remove" | "edit" | "hide";
  disabled?: boolean;
}

const classNamePorVariante = {
  add: "bg-verde-300 active:bg-verde-400",
  remove: "bg-white border border-vermelho-400 active:bg-vermelho-50",
  edit: "bg-cinza-600 active:bg-cinza-700",
  hide: "bg-white active:bg-cinza-100",
};

const textColorPorVariante = {
  add: "text-white",
  remove: "text-vermelho-400",
  edit: "text-white",
  hide: "text-preto-400",
};

export function Button({
  text: texto,
  variant: variante,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      {...rest}
      disabled={disabled}
      className={twMerge(
        "h-fit w-full rounded-md p-4",
        classNamePorVariante[variante],
        disabled && "opacity-50",
        className
      )}
    >
      <Text
        className={twMerge(
          "text-center font-bold",
          textColorPorVariante[variante]
        )}
      >
        {texto}
      </Text>
    </TouchableOpacity>
  );
}
