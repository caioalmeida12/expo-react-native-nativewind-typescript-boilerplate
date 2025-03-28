import { useCallback, useState } from "react";
import { Text } from "react-native";

type ResponseMessage =
  | { success: boolean; message: string }
  | { message: string };

type ResponseStyle = {
  isInfo: boolean;
  isSuccess: boolean;
  isError: boolean;
};

const useResponseMessage = () => {
  const [message, setMessage] = useState("");
  const [style, setStyle] = useState<ResponseStyle>({
    isInfo: true,
    isSuccess: false,
    isError: false,
  });

  const updateMessage = useCallback((response: ResponseMessage) => {
    setMessage(response.message);

    if (!("success" in response)) {
      setStyle({ isInfo: true, isSuccess: false, isError: false });
    } else {
      setStyle({
        isInfo: false,
        isSuccess: response.success,
        isError: !response.success,
      });
    }
  }, []);

  const ResponseText = () => {
    if (!message) return null;

    let colorClass = style.isInfo
      ? "text-blue-400"
      : style.isSuccess
        ? "text-green-300"
        : "text-red-400";

    return (
      <Text className={`text-center text-sm ${colorClass}`}>{message}</Text>
    );
  };

  return { ResponseText, updateMessage };
};

export default useResponseMessage;
