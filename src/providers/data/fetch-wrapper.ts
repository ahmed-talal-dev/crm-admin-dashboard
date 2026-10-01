import type { GraphQLFormattedError } from "graphql";

type GraphQLErrorResponse = {
  message: string;
  statusCode: string | number;
};

/**
 * Sends a request to the GraphQL API with the current access token
 * and the required request headers.
 */
const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");

  const headers = options.headers as Record<string, string>;

  return fetch(url, {
    ...options,
    headers: {
      ...headers,

      // Preserve an explicitly provided Authorization header.
      Authorization: headers?.Authorization || `Bearer ${accessToken}`,

      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

/**
 * Normalizes GraphQL errors into a consistent application-level shape.
 */
const getGraphQLErrors = (
  body:
    | {
        errors?: GraphQLFormattedError[];
      }
    | undefined,
): GraphQLErrorResponse | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }

  if (body.errors?.length) {
    const message = body.errors.map((error) => error.message).join(", ");

    const statusCode =
      body.errors[0]?.extensions?.code ?? "INTERNAL_SERVER_ERROR";

    return {
      message,
      statusCode: statusCode as string | number,
    };
  }

  return null;
};

/**
 * Wraps the native fetch request so GraphQL errors can be detected
 * and forwarded to Refine's error handling flow.
 */
export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);

  // Clone the response because a Response body can only be consumed once.
  const responseClone = response.clone();
  const body = await responseClone.json();

  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};
