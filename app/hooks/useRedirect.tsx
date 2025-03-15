import { useRouter } from "expo-router";

type RedirectOptions = {
  replace?: boolean;
};

export const useRedirect = () => {
  const router = useRouter();

  const redirect = (path: string, options: RedirectOptions = {}) => {
    if (options.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };

  const goBack = () => {
    router.back();
  };

  return {
    redirect,
    goBack,
  };
};
