import type { AuthProvider } from "@refinedev/core";

import { API_URL, dataProvider } from "./data";

export const authCredentials = {
  email: "michael.scott@dundermifflin.com",
  password: "demodemo",
};

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  timezone: string;
  avatarUrl: string;
}

export const authProvider: AuthProvider = {
  /**
   * Authenticates the user against the GraphQL API
   * and stores the returned access token locally.
   */
  login: async ({ email }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `,
        },
      });

      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      const authError = error as Error;

      return {
        success: false,
        error: {
          name: authError.name || "Login Error",
          message: authError.message || "Login failed",
        },
      };
    }
  },

  /**
   * Clears the current access token and redirects
   * the user back to the login page.
   */
  logout: async () => {
    localStorage.removeItem("access_token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  /**
   * Forces a logout when the API reports
   * that the current authentication is invalid.
   */
  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
        ...error,
      };
    }

    return {
      error,
    };
  },

  /**
   * Verifies that the current session is still valid.
   */
  check: async () => {
    try {
      await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          rawQuery: `
            query Me {
              me {
                name
              }
            }
          `,
        },
      });

      return {
        authenticated: true,
        redirectTo: "/",
      };
    } catch {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  /**
   * Retrieves the profile of the currently
   * authenticated user.
   */
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");

    try {
      const { data } = await dataProvider.custom<{
        me: User;
      }>({
        url: API_URL,
        method: "post",
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {},
        meta: {
          rawQuery: `
            query Me {
              me {
                id
                name
                email
                phone
                jobTitle
                timezone
                avatarUrl
              }
            }
          `,
        },
      });

      return data.me;
    } catch {
      return undefined;
    }
  },
};
