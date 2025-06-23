// lib/commentService.js
import { defaultPandaFetch, cookiePandaFetch } from "@/lib/fetchClient";

export const commentPandaService = {
  // 상품 댓글 작성 (인증 필요)
  createProductComment: (
    productId,
    commentData // { content }
  ) =>
    cookiePandaFetch(`/products/${productId}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    }),

  // 상품 댓글 목록 조회 (인증 불필요)
  getProductComments: (productId, params = {}) => {
    // { page, size }
    const query = new URLSearchParams(params).toString();
    return defaultPandaFetch(`/products/${productId}/comments?${query}`);
  },

  // 게시글 댓글 작성 (인증 필요)
  createArticleComment: (
    articleId,
    commentData // { content }
  ) =>
    cookiePandaFetch(`/articles/${articleId}/comments`, {
      method: "POST",
      body: JSON.stringify(commentData),
    }),

  // 게시글 댓글 목록 조회 (인증 불필요)
  getArticleComments: (articleId, params = {}) => {
    // { page, size }
    const query = new URLSearchParams(params).toString();
    return defaultPandaFetch(`/articles/${articleId}/comments?${query}`);
  },

  // 댓글 수정 (인증 필요)
  updateComment: (commentId, commentData) =>
    cookiePandaFetch(`/comments/${commentId}`, {
      method: "PATCH",
      body: JSON.stringify(commentData),
    }),

  // 댓글 삭제 (인증 필요)
  deleteComment: (commentId) =>
    cookiePandaFetch(`/comments/${commentId}`, {
      method: "DELETE",
    }),
};
