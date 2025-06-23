// src/hooks/useItemDetail.js
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { productPandaService as productService } from "@/lib/productService";
import { commentPandaService as commentService } from "@/lib/commentService";

const DEFAULT_PROFILE_IMAGE = "/images/board/ic_profile.png";

export function useItemDetail(itemId) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "날짜 없음";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      console.error("날짜 포맷 오류:", e, dateString);
      return "날짜 형식 오류";
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    if (!itemId) return;
    setIsLoading(true);
    setError(null);
    setComments([]);
    setNextCursor(null);
    setProduct(null);
    setIsLiked(false);

    try {
      const [productData, commentsResponse] = await Promise.all([
        productService.getProduct(itemId),
        commentService.getProductComments(itemId, { limit: 10 }),
      ]);

      setProduct(productData);

      if (user && productData?.isFavorite !== undefined) {
        setIsLiked(productData.isFavorite);
      } else {
        setIsLiked(false);
      }

      const fetchedComments = (commentsResponse?.list || []).map((comment) => ({
        ...comment,
        author: {
          id: comment.writer?.id,
          nickname: comment.writer?.nickname || "익명",
          profileUrl: comment.writer?.image || DEFAULT_PROFILE_IMAGE,
        },
      }));
      setComments(fetchedComments);
      setNextCursor(commentsResponse?.nextCursor || null);
    } catch (err) {
      console.error("상품 상세 정보 또는 초기 댓글 로딩 실패:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "데이터를 불러올 수 없습니다.";
      setError(errorMessage);
      setProduct(null);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [itemId, user]);

  const loadMoreComments = useCallback(async () => {
    if (!itemId || !nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const commentsResponse = await commentService.getProductComments(itemId, {
        limit: 10,
        cursor: nextCursor,
      });
      const newComments = (commentsResponse?.list || []).map((comment) => ({
        ...comment,
        author: {
          id: comment.writer?.id,
          nickname: comment.writer?.nickname || "익명",
          profileUrl: comment.writer?.image || DEFAULT_PROFILE_IMAGE,
        },
      }));
      setComments((prev) => [...prev, ...newComments]);
      setNextCursor(commentsResponse?.nextCursor || null);
    } catch (err) {
      console.error("추가 댓글 로딩 실패:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "댓글을 더 불러올 수 없습니다.";
      setError(errorMessage);
    } finally {
      setIsLoadingMore(false);
    }
  }, [itemId, nextCursor, isLoadingMore]);

  const handleLikeToggle = useCallback(async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (isLiking || !product || !itemId) return;

    setIsLiking(true);
    const originalLiked = isLiked;
    const originalCount = product.favoriteCount ?? 0;

    setIsLiked(!originalLiked);
    setProduct((prev) => ({
      ...prev,
      isFavorite: !originalLiked,
      favoriteCount: originalLiked
        ? Math.max(0, originalCount - 1)
        : originalCount + 1,
    }));

    try {
      if (originalLiked) {
        await productService.removeFavorite(itemId);
      } else {
        await productService.addFavorite(itemId);
      }
    } catch (err) {
      console.error("좋아요 처리 API 실패:", err);
      alert(`좋아요 처리에 실패했습니다: ${err.message || "알 수 없는 오류"}`);
      setIsLiked(originalLiked);
      setProduct((prev) => ({
        ...prev,
        isFavorite: originalLiked,
        favoriteCount: originalCount,
      }));
    } finally {
      setIsLiking(false);
    }
  }, [user, isLiking, product, isLiked, itemId]);

  const handleCommentSubmit = useCallback(
    async (content) => {
      if (!user) {
        alert("문의를 작성하려면 로그인이 필요합니다.");
        return;
      }
      if (!content?.trim()) return;
      if (isCreatingComment || !itemId) return;

      setIsCreatingComment(true);
      setError(null);
      try {
        const newComment = await commentService.createProductComment(itemId, {
          content,
        });

        const formattedComment = {
          ...newComment,
          author: {
            id: newComment.writer?.id || user.id,
            nickname: newComment.writer?.nickname || user.nickname || "사용자",
            profileUrl:
              newComment.writer?.image || user.image || DEFAULT_PROFILE_IMAGE,
          },
          createdAt: newComment.createdAt || new Date().toISOString(),
        };

        setComments((prev) => [formattedComment, ...prev]);
        setProduct((prev) => ({
          ...prev,
          commentCount: (prev.commentCount ?? 0) + 1,
        }));
      } catch (err) {
        console.error("문의(댓글) 등록 실패:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "문의 등록 중 오류가 발생했습니다.";
        setError(errorMessage);
        alert(errorMessage);
      } finally {
        setIsCreatingComment(false);
      }
    },
    [user, isCreatingComment, itemId]
  );

  const handleEditProductClick = useCallback(() => {
    if (!user || user.id !== product?.ownerId) {
      alert("상품을 수정할 권한이 없습니다.");
      return;
    }
    router.push(`/items/${itemId}/edit`);
  }, [user, product, itemId, router]);

  const handleDeleteProduct = useCallback(async () => {
    if (!itemId || !user || user.id !== product?.ownerId) return;

    setIsDeletingProduct(true);
    try {
      await productService.deleteProduct(itemId);
      alert("상품이 삭제되었습니다.");
      router.push("/items");
    } catch (err) {
      console.error("상품 삭제 실패:", err);
      alert(`상품 삭제에 실패했습니다: ${err.message || "알 수 없는 오류"}`);
      setIsDeletingProduct(false);
    }
  }, [itemId, user, product, router]);

  const handleDeleteConfirm = useCallback(() => {
    if (!user || user.id !== product?.ownerId) {
      alert("상품을 삭제할 권한이 없습니다.");
      return;
    }
    if (
      window.confirm(
        "정말로 이 상품을 삭제하시겠습니까? 삭제된 상품은 복구할 수 없습니다."
      )
    ) {
      handleDeleteProduct();
    }
  }, [user, product, handleDeleteProduct]);

  const handleEditComment = useCallback((commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(currentContent);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  }, []);

  const handleSaveComment = useCallback(
    async (commentId) => {
      if (!editingCommentContent?.trim()) {
        alert("수정할 문의 내용을 입력해주세요.");
        return;
      }
      if (isSavingEdit) return;

      setIsSavingEdit(true);
      setError(null);
      try {
        const updatedComment = await commentService.updateComment(commentId, {
          content: editingCommentContent,
        });

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  content: updatedComment.content || editingCommentContent,
                  updatedAt:
                    updatedComment.updatedAt || new Date().toISOString(),
                }
              : comment
          )
        );
        handleCancelEdit();
      } catch (err) {
        console.error("문의(댓글) 수정 실패:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "문의 수정 중 오류가 발생했습니다.";
        setError(errorMessage);
        alert(errorMessage);
      } finally {
        setIsSavingEdit(false);
      }
    },
    [editingCommentContent, isSavingEdit, handleCancelEdit]
  );

  const handleCommentDelete = useCallback(
    async (commentId) => {
      if (deletingCommentId) return;

      if (!window.confirm("정말로 이 문의를 삭제하시겠습니까?")) {
        return;
      }

      setDeletingCommentId(commentId);
      setError(null);
      try {
        await commentService.deleteComment(commentId);

        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
        setProduct((prev) => ({
          ...prev,
          commentCount: Math.max(0, (prev.commentCount ?? 0) - 1),
        }));
      } catch (err) {
        console.error("문의(댓글) 삭제 실패:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "문의 삭제 중 오류가 발생했습니다.";
        setError(errorMessage);
        alert(errorMessage);
      } finally {
        setDeletingCommentId(null);
      }
    },
    [deletingCommentId]
  );

  useEffect(() => {
    if (!isAuthLoading && itemId) {
      loadInitialData();
    }
  }, [itemId, isAuthLoading, loadInitialData]);

  useEffect(() => {
    if (!user) {
      setEditingCommentId(null);
      setEditingCommentContent("");
    }
  }, [user]);

  const isSeller = user && product && user.id === product.ownerId;

  return {
    product,
    comments,
    nextCursor,
    isLoading: isLoading || isAuthLoading,
    isLoadingMore,
    error,
    isLiked,
    isLiking,
    isDeletingProduct,
    isCreatingComment,
    deletingCommentId,
    editingCommentId,
    editingCommentContent,
    isSavingEdit,
    isSeller,
    loadMoreComments,
    handleLikeToggle,
    handleCommentSubmit,
    handleEditProductClick,
    handleDeleteConfirm,
    handleEditComment,
    handleCancelEdit,
    handleSaveComment,
    handleCommentDelete,
    setEditingCommentContent,
    formatDate,
  };
}
