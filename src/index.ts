import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { getBaseUrl } from "./utils/getBaseUrl";
import { authorize } from "@frontify/frontify-authenticator";

type FrontifyClientConfig = {
  baseUrl: string;
  clientId?: string;
  token?: string;
  enableBetaFeatures?: boolean;
  scopes?: string[];
};

type FrontifyQuery = {
  query: string;
  variables?: Record<string, any>;
};

export const ERROR_MESSAGES = {
  CONFIG_REQUIRED: "Configuration object is required.",
  BASE_URL_REQUIRED: "Base URL must be provided.",
  TOKEN_OR_CLIENT_ID_REQUIRED: "Either token or clientId must be provided.",
  QUERY_REQUIRED: "Query object with a 'query' string is required.",
  AUTHORIZATION_FAILED: "Authorization failed: ",
  QUERY_FAILED: "GraphQL query failed: ",
  TOKEN_NODE_REQUIRED: "Token is required in a node environment.",
};

const SCOPES = [
  "basic:read",
  "basic:write",
  "account:read",
  "webhook:write",
  "webhook:read",
];

const createAuthLink = (token: string, enableBetaFeatures: boolean) =>
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "x-frontify-beta": enableBetaFeatures ? "enabled" : "",
    },
  }));

const getToken = async (
  baseUrl: string,
  clientId: string,
  scopes: string[],
): Promise<string> => {
  try {
    const response = await authorize({
      domain: baseUrl,
      clientId,
      scopes: scopes ? scopes : SCOPES,
    });
    return response.bearerToken.accessToken;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(ERROR_MESSAGES.AUTHORIZATION_FAILED + error.message);
    } else {
      throw new Error(ERROR_MESSAGES.AUTHORIZATION_FAILED + error);
    }
  }
};

export const createClient = async (config: FrontifyClientConfig) => {
  if (!config) {
    throw new Error(ERROR_MESSAGES.CONFIG_REQUIRED);
  }

  const {
    baseUrl,
    clientId,
    enableBetaFeatures = false,
    scopes = SCOPES,
  } = config;
  let { token } = config;

  if (!baseUrl) {
    throw new Error(ERROR_MESSAGES.BASE_URL_REQUIRED);
  }

  if (!token) {
    if (typeof window === "undefined") {
      throw new Error(ERROR_MESSAGES.TOKEN_NODE_REQUIRED);
    }
    if (!clientId) {
      throw new Error(ERROR_MESSAGES.TOKEN_OR_CLIENT_ID_REQUIRED);
    }
    token = await getToken(baseUrl, clientId, scopes);
  }

  const httpLink = createHttpLink({
    uri: getBaseUrl(baseUrl),
  });

  const authLink = createAuthLink(token, enableBetaFeatures);

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  // TODO: add exponential backoff logic
  const query = async (queryData: FrontifyQuery) => {
    if (!queryData || typeof queryData.query !== "string") {
      throw new Error(ERROR_MESSAGES.QUERY_REQUIRED);
    }

    try {
      return await client.query({
        query: gql`
          ${queryData.query}
        `,
        variables: queryData.variables,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(ERROR_MESSAGES.QUERY_FAILED + error.message);
      } else {
        throw new Error(ERROR_MESSAGES.QUERY_FAILED + error);
      }
    }
  };

  return { query };
};
