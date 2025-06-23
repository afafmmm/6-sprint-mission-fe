// lib/authService.js
import { defaultPandaFetch, authUtils } from "@/lib/fetchClient";

export const authPandaService = {
  signUp: (nickname, email, password, passwordConfirmation) =>
    defaultPandaFetch("/auth/signUp", {
      method: "POST",
      body: JSON.stringify({ nickname, email, password, passwordConfirmation }),
    }),

  signIn: async (email, password) => {
    try {
      const response = await defaultPandaFetch("/auth/signIn", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
        cache: "no-store",
      });

      if (response && response.accessToken) {
        authUtils.setAccessToken(response.accessToken);
      }
      return response;
    } catch (error) {
      console.error("로그인 실패", error);
      authUtils.clearAccessToken();
      throw error;
    }
  },

  signOut: () => {
    authUtils.clearAccessToken();
    return Promise.resolve();
  },
};
