// lib/imageService.js
import { cookiePandaFetch } from "@/lib/fetchClient";

export const imagePandaService = {
  uploadImage: (formData) =>
    cookiePandaFetch("/images/upload", {
      method: "POST",
      body: formData,
    }),
};
