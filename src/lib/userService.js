import { cookiePandaFetch } from "@/lib/fetchClient"; // Panda Market용 fetch 함수 임포트

export const userPandaService = {
  getMe: () => cookiePandaFetch("/users/me"),

  updateMe: (userData) =>
    cookiePandaFetch("/users/me", {
      method: "PATCH",
      body: userData,
    }),

  updatePassword: (currentPassword, newPassword) =>
    cookiePandaFetch("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getMyProducts: () => cookiePandaFetch("/users/me/products"),

  getMyFavorites: () => cookiePandaFetch("/users/me/favorites"),
};
