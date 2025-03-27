import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import { X } from "lucide-react-native";
import { useMeals } from "../hooks/useMeals";
import useResponseMessage from "../hooks/useResponseMessage";
import { Button } from "./Button";

interface CancelMealModalProps {
  meal_id: number;
  date: string;
}

export const CancelMealModal = ({ meal_id, date }: CancelMealModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = () => setIsVisible(false);
  const handleOpen = () => setIsVisible(true);

  return (
    <>
      <Button variant="remove" text="Cancelar" onPress={handleOpen} />
      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-black/25 justify-center items-center">
          <View className="w-[90%] max-w-[500px] bg-white p-6 rounded-lg">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-medium">
                Tem certeza que deseja cancelar a sua reserva?
              </Text>
              <Pressable
                onPress={handleClose}
                className="p-1 rounded-full active:bg-gray-200"
              >
                <X size={20} color="#666" />
              </Pressable>
            </View>

            <Text className="leading-normal mb-6">
              Caso cancele sua reserva, não será possível reservar novamente.
            </Text>

            <CancelActions
              meal_id={meal_id}
              date={date}
              onClose={handleClose}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const CancelActions = ({
  meal_id,
  date,
  onClose,
}: CancelMealModalProps & { onClose: () => void }) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const { updateMessage, responseMessageRef } = useResponseMessage();
  const { cancel } = useMeals();

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonDisabled(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    updateMessage({ message: "Cancelando..." });
    cancel(
      { meal_id, date },
      {
        onSuccess: (response) => {
          updateMessage({
            ...response,
            message: (response as any)?.message,
            success: response.sucesso,
          });
          setTimeout(onClose, 1000);
        },
        onError: (error) =>
          updateMessage({ message: error.message, success: false }),
      }
    );
  };

  return (
    <View className="gap-y-4">
      <View className="hidden" ref={responseMessageRef} />
      <Button
        variant="remove"
        text="Sim, desejo cancelar"
        onPress={handleCancel}
        disabled={buttonDisabled}
      />
      <Button
        variant="edit"
        text="Não, não desejo cancelar"
        onPress={onClose}
      />
    </View>
  );
};
