import { useRouter } from "expo-router";
import NullUserInfoError from "../helpers/NullUserInfoError";

type RedirectOptions = {
  replace?: boolean;
  throw?: boolean;
};

export const useRedirect = () => {
  const router = useRouter();

  const redirect = (path: string, options: RedirectOptions = {}) => {
    if (options.replace) {
      router.replace({ pathname: path });
    } else {
      router.push({ pathname: path });
    }

    if (options.throw) throw new NullUserInfoError();
  };

  const goBack = () => {
    router.back();
  };

  return {
    redirect,
    goBack,
  };
};
