// Section.tsx
import React from "react";
import { View, ViewProps } from "react-native";

interface SectionProps extends ViewProps {
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  children,
  style,
  ...rest
}: SectionProps) => {
  return (
    <View
      {...rest}
      className="rounded border-[1px] border-cinza-600 bg-branco-400 p-4 flex flex-col gap-y-2"
    >
      {children}
    </View>
  );
};
