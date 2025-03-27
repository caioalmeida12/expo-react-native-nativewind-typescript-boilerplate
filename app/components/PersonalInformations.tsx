import { View, Text } from "react-native";
import { DatesHelper } from "../helpers/DatesHelper";
import { TStudentInfoResponse } from "../types/TAuthentication";
import { Section } from "./Section";

export function PersonalInformations({
  studentInfo,
}: {
  studentInfo: TStudentInfoResponse;
}) {
  return (
    <Section>
      <Text className="text-base font-bold text-verde-400">
        Informações pessoais
      </Text>
      <View className="flex flex-col gap-y-1">
        <Text className="font-bold">Nome:</Text>
        <Text>{studentInfo?.name}</Text>
      </View>
      <View className="flex flex-col gap-y-1">
        <Text className="font-bold">Curso:</Text>
        <Text>{studentInfo?.course.description}</Text>
      </View>
      <View className="flex flex-row gap-x-4">
        <View className="flex flex-col gap-y-1">
          <Text className="font-bold">Código:</Text>
          <Text className="px-4 rounded bg-azul-400 text-white font-bold">
            {studentInfo?.id}
          </Text>
        </View>
        <View className="flex flex-col gap-y-1">
          <Text className="font-bold">Validade:</Text>
          <Text className="px-4 rounded bg-verde-300 text-white font-bold">
            {studentInfo?.dateValid
              ? DatesHelper.convertToBrazilianFormat(studentInfo?.dateValid)
              : null}
          </Text>
        </View>
      </View>
    </Section>
  );
}
