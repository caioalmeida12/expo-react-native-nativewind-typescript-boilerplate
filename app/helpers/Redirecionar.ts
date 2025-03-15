import { CommonActions, useNavigation } from '@react-navigation/native';

/**
 * Redireciona para a rota especificada.
 *
 * @param route - A rota para a qual redirecionar. Por padrão é "Login" se não for fornecida.
 * @scope Deve ser usado dentro de componentes React.
 */
export const redirecionar = (route = 'Login') => {
  const navigation = useNavigation();
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: route }],
    })
  );
};