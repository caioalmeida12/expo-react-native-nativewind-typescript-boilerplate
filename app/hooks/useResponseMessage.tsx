import { useRef } from "react";
import { View } from "react-native";

type ResponseMessage =
  | { success: boolean; message: string }
  | { message: string };

const useResponseMessage = () => {
  const responseMessageRef = useRef<View | null>(null);

  const updateMessage = (response: ResponseMessage) => {
    if (!responseMessageRef.current) return;

    // Remove all color classes
    responseMessageRef.current?.setNativeProps({
      className: responseMessageRef.current?.props.className?.replace(
        /(text-green-300|text-red-400|text-blue-400|hidden)/g,
        ""
      ),
    });

    if (!("success" in response)) {
      responseMessageRef.current?.setNativeProps({
        className:
          responseMessageRef.current?.props.className + " text-blue-400",
      });
      return;
    }

    if (response.success) {
      responseMessageRef.current?.setNativeProps({
        className:
          (responseMessageRef.current?.props.className || "").replace(
            /(text-red-400|text-blue-400)/g,
            ""
          ) + " text-green-300",
      });
    } else {
      responseMessageRef.current?.setNativeProps({
        className:
          (responseMessageRef.current?.props.className || "").replace(
            /(text-green-300|text-blue-400)/g,
            ""
          ) + " text-red-400",
      });
    }
  };

  return { responseMessageRef, updateMessage };
};

export default useResponseMessage;
