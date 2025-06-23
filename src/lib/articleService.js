// lib/articleService.js
import { defaultPandaFetch, cookiePandaFetch } from "@/lib/fetchClient";

export const articlePandaService = {
  // 게시글 작성 (인증 필요)
  createArticle: (
    articleData // { title, content, category 등 }
  ) =>
    cookiePandaFetch("/articles", {
      method: "POST",
      body: JSON.stringify(articleData),
    }),

  // 게시글 목록 조회 (인증 불필요)
  getArticles: (params = {}) => {
    // { page, size, category 등 }
    const query = new URLSearchParams(params).toString();
    return defaultPandaFetch(`/articles?${query}`);
  },

  // 특정 게시글 상세 조회 (인증 불필요)
  getArticle: (articleId) => defaultPandaFetch(`/articles/${articleId}`),

  // 게시글 수정 (인증 필요)
  updateArticle: (articleId, articleData) =>
    cookiePandaFetch(`/articles/${articleId}`, {
      method: "PATCH",
      body: JSON.stringify(articleData),
    }),

  // 게시글 삭제 (인증 필요)
  deleteArticle: (articleId) =>
    cookiePandaFetch(`/articles/${articleId}`, {
      method: "DELETE",
    }),

  // 게시글 좋아요 (인증 필요)
  likeArticle: (articleId) =>
    cookiePandaFetch(`/articles/${articleId}/like`, {
      method: "POST",
    }),

  // 게시글 좋아요 취소 (인증 필요)
  unlikeArticle: (articleId) =>
    cookiePandaFetch(`/articles/${articleId}/like`, {
      method: "DELETE",
    }),
};
