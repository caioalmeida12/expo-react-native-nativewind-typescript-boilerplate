import { mensagemDeErroPorCodigoHTTP } from "./MensagemDeErroPorCodigoHTTP";
import { redirecionar } from "./Redirecionar";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RespostaDaAPI<T> =
  | {
      sucesso: false;
      message: string;
    }
  | {
      sucesso: true;
      resposta: Array<T>;
    };

/**
 * Verifica se a resposta da API foi um erro. Para isso, verifica se o objeto é um objeto json e se possui a chave `message`.
 *
 * Em alguns casos, a API retorna um objeto json com a chave `message` mas que não é um erro (por algum motivo -- espero que seja corrigido).
 *
 * @param resposta um objeto json que foi retornado pela API
 * @returns true se a resposta foi um erro, false caso contrário
 */
const respostaFoiErro = (resposta: unknown) => {
  if (
    typeof resposta === "object" &&
    resposta !== null &&
    "message" in resposta
  ) {
    return true;
  }
  if (
    typeof resposta === "object" &&
    resposta !== null &&
    "error" in resposta
  ) {
    return true;
  }
  if (
    typeof resposta === "object" &&
    resposta !== null &&
    "errors" in resposta
  ) {
    return true;
  }

  return false;
};

const extrairMensagemDeErro = (json_resolvido: any) => {
  if (json_resolvido.errors)
    return `${Array(Object.values(json_resolvido.errors[0]))[0].flat()[0]}`;

  if (json_resolvido.error) return json_resolvido.error;

  return json_resolvido.message;
};

/**
 * Função auxiliar para fazer requisições à API.
 *
 * @param method - O método HTTP da requisição (GET, POST, etc.).
 * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
 * @param body - O corpo da requisição. Deve ser um objeto serializável em JSON.
 * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão.
 * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
 * @param rotaParaRedirecionarCasoFalhe - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá redirecionar para a rota de login e informará qual foi o erro. Deve incluir a / no início. Defina como `null` para não redirecionar.
 *
 * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
 * @default rotaParaRedirecionarCasoFalhe - /login (apenas em caso de status 401)
 */
const fetchAPI = async <T>({
  metodo,
  rota,
  body,
  headers,
  rotaParaRedirecionarCasoFalhe,
}: {
  metodo: string;
  rota: string;
  body?: any;
  headers?: HeadersInit;
  rotaParaRedirecionarCasoFalhe?: string | null;
}): Promise<RespostaDaAPI<T>> => {
  if (!process.env.EXPO_PUBLIC_URL_BASE_API)
    return { sucesso: false, message: "A URL base da API não foi informada." };
  if (!rota)
    return {
      sucesso: false,
      message: "A URL da rota da API não foi informada.",
    };

  const token = await AsyncStorage.getItem("token");

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    (
      requestHeaders as typeof requestHeaders & { authorization: string }
    ).authorization = `Bearer ${token}`;
  }

  const resposta_inicial = await fetch(
    process.env.EXPO_PUBLIC_URL_BASE_API + rota,
    {
      method: metodo,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  // Por padrão, redireciona para a página de login em caso de erro 401
  if (
    resposta_inicial.status === 401 &&
    typeof rotaParaRedirecionarCasoFalhe === "undefined"
  )
    return redirecionar(
      `/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(401))}`
    ) as never;

  try {
    const json_resolvido = await resposta_inicial.json();

    if (!resposta_inicial.ok) {
      if (rotaParaRedirecionarCasoFalhe === null)
        return {
          sucesso: false,
          message:
            extrairMensagemDeErro(json_resolvido) ??
            mensagemDeErroPorCodigoHTTP(resposta_inicial.status),
        };

      if (rotaParaRedirecionarCasoFalhe)
        return redirecionar(rotaParaRedirecionarCasoFalhe) as never;

      return redirecionar(
        `/login?erro=${encodeURIComponent(mensagemDeErroPorCodigoHTTP(resposta_inicial.status))}`
      ) as never;
    }

    // Na resposta da API, quando retorna status 202 geralmente é porque a requisição contém campos inválidos
    // Nesse caso, a resposta vem como { message: "Mensagem de erro" }
    if (resposta_inicial.status === 202)
      return { sucesso: false, message: extrairMensagemDeErro(json_resolvido) };

    // Passa mais uma checagem manual para verificar se a resposta foi um erro
    if (respostaFoiErro(json_resolvido))
      return { sucesso: false, message: extrairMensagemDeErro(json_resolvido) };

    return {
      sucesso: true,
      resposta: Array.isArray(json_resolvido)
        ? json_resolvido
        : [json_resolvido],
    };
  } catch (erro) {
    if (rotaParaRedirecionarCasoFalhe === null)
      return {
        sucesso: false,
        message: mensagemDeErroPorCodigoHTTP(resposta_inicial.status),
      };

    // Se for erro de JSON mal formatado, retorna o erro
    if (erro instanceof SyntaxError)
      return redirecionar(
        `/login?erro=${encodeURIComponent("Erro ao processar a resposta da API.")}`
      ) as never;

    return redirecionar(
      `/login?erro=${encodeURIComponent("Erro desconhecido ao processar a resposta da API.")}`
    ) as never;
  }
};

export class FetchHelper {
  /**
   * Executa uma requisição GET para a API.
   *
   * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
   * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão.
   * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
   * @param rotaParaRedirecionarCasoFalhe - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como `null` para não redirecionar.
   *
   * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
   * @default rotaParaRedirecionarCasoFalhe - /login (apenas em caso de status 401)
   */
  static async get<T>({
    rota,
    headers,
    rotaParaRedirecionarCasoFalhe,
  }: {
    rota: string;
    headers?: HeadersInit;
    rotaParaRedirecionarCasoFalhe?: string | null;
  }): Promise<RespostaDaAPI<T>> {
    return fetchAPI<T>({
      metodo: "GET",
      rota,
      headers,
      rotaParaRedirecionarCasoFalhe,
    });
  }

  /**
   * Executa uma requisição POST para a API.
   *
   * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
   * @param body - O corpo da requisição. Deve ser um objeto serializável em JSON.
   * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão.
   * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
   * @param rotaParaRedirecionarCasoFalhe - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como `null` para não redirecionar.
   *
   * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
   * @default rotaParaRedirecionarCasoFalhe - /login (apenas em caso de status 401)
   */
  static async post<T>({
    rota,
    body,
    headers,
    rotaParaRedirecionarCasoFalhe,
  }: {
    rota: string;
    body: Record<string, any>;
    headers?: HeadersInit;
    rotaParaRedirecionarCasoFalhe?: string | null;
  }): Promise<RespostaDaAPI<T>> {
    return fetchAPI<T>({
      metodo: "POST",
      rota,
      body,
      headers,
      rotaParaRedirecionarCasoFalhe,
    });
  }

  /**
   * Executa uma requisição DELETE para a API.
   *
   * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
   * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão.
   * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
   * @param rotaParaRedirecionarCasoFalhe - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como `null` para não redirecionar.
   *
   * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
   * @default rotaParaRedirecionarCasoFalhe - /login (apenas em caso de status 401)
   */
  static async delete<T>({
    rota,
    headers,
    rotaParaRedirecionarCasoFalhe,
  }: {
    rota: string;
    headers?: HeadersInit;
    rotaParaRedirecionarCasoFalhe?: string | null;
  }): Promise<RespostaDaAPI<T>> {
    return fetchAPI<T>({
      metodo: "DELETE",
      rota,
      headers,
      rotaParaRedirecionarCasoFalhe,
    });
  }

  /**
   * Executa uma requisição PUT para a API.
   *
   * @param rota - A URL a ser requisitada. Já possui o caminho base da API, portanto, não é necessário informar o caminho completo.
   * @param body - O corpo da requisição. Deve ser um objeto serializável em JSON.
   * @param headers - Os cabeçalhos da requisição. O cabeçalho `Content-Type` é definido como `application/json` por padrão.
   * O cabeçalho `Authorization` é definido com o token de autenticação, que é obtido via cookies.
   * @param rotaParaRedirecionarCasoFalhe - A rota para redirecionar o usuário caso a requisição falhe. Se não for informada, a requisição irá retornar um erro. Deve incluir a / no início. Defina como `null` para não redirecionar.
   *
   * @default headers - { "content-type": "application/json", "authorization": `Bearer ${cookies.get("authorization")?.value}` }
   * @default rotaParaRedirecionarCasoFalhe - /login (apenas em caso de status 401)
   */
  static async put<T>({
    rota,
    body,
    headers,
    rotaParaRedirecionarCasoFalhe,
  }: {
    rota: string;
    body: Record<string, any>;
    headers?: HeadersInit;
    rotaParaRedirecionarCasoFalhe?: string | null;
  }): Promise<RespostaDaAPI<T>> {
    return fetchAPI<T>({
      metodo: "PUT",
      rota,
      body,
      headers,
      rotaParaRedirecionarCasoFalhe,
    });
  }
}
