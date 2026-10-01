import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";
import { createClient } from "graphql-ws";

import { fetchWrapper } from "./fetch-wrapper";

// Base API endpoint used by both HTTP and WebSocket clients.
export const API_BASE_URL = "https://api.crm.refine.dev";

// GraphQL HTTP endpoint used for queries and mutations.
export const API_URL = `${API_BASE_URL}/graphql`;

// GraphQL WebSocket endpoint used for real-time subscriptions.
export const WS_URL = "wss://api.crm.refine.dev/graphql";

/**
 * GraphQL client used by Refine's data provider.
 *
 * A custom fetch implementation is injected so every request
 * can pass through the application's authentication and
 * GraphQL error-handling layer.
 */
export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

/**
 * WebSocket client used for GraphQL subscriptions and live updates.
 *
 * The client is created only in the browser because localStorage
 * and WebSocket connections are not available during server-side execution.
 */
export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,

        // Attach the current access token whenever a WebSocket
        // connection is established.
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

/**
 * Main Refine data provider for GraphQL CRUD operations.
 */
export const dataProvider = graphqlDataProvider(client);

/**
 * Live provider used by Refine for real-time GraphQL updates.
 * It remains undefined when the WebSocket client is unavailable.
 */
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
