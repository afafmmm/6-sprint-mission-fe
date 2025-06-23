// src/app/items/[itemId]/page.jsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";
import ProductImage from "@/components/items/ProductImage";
import ProductHeader from "@/components/items/ProductHeader";
import ProductInfo from "@/components/items/ProductInfo";
import ProductActionBar from "@/components/items/ProductActionBar";
import { useItemDetail } from "@/hooks/useItemDetail"; // 커스텀 훅 임포트

const DEFAULT_PROFILE_IMAGE = "/images/board/ic_profile.png";
const DEFAULT_PRODUCT_IMAGE = "/images/default_product.png";

export default function ItemDetailPage() {
  const { itemId } = useParams();
  const { user } = useAuth(); // user 정보는 여전히 필요할 수 있음 (UI 조건부 렌더링 등)

  const {
    product,
    comments,
    nextCursor,
    isLoading,
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
  } = useItemDetail(itemId); // 훅 사용

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  if (!product) {
    const message = error || "상품 정보를 찾을 수 없습니다.";
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className={error ? "text-red-600" : ""}>{message}</p>
          <div className="flex justify-center mt-8">
            <Link href="/items">
              <button className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                목록으로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col max-w-[1200px] min-h-[1257px] mx-auto gap-[64px] py-8 px-4">
      <div className="flex flex-col gap-[64px]">
        <div className="flex w-full h-auto md:h-auto gap-[40px] flex-col md:flex-row">
          <ProductImage
            images={product.images}
            alt={product.name || "상품 이미지"}
            defaultImage={DEFAULT_PRODUCT_IMAGE}
          />

          <div className="flex flex-col w-full md:w-auto h-auto gap-[32px] flex-grow">
            <ProductHeader
              name={product.name}
              price={product.price}
              isSeller={isSeller}
              onEdit={handleEditProductClick}
              onDelete={handleDeleteConfirm}
              isDeleting={isDeletingProduct}
            />

            <ProductInfo
              description={product.description}
              tags={product.tags}
            />

            <ProductActionBar
              createdAt={product.createdAt}
              formatDate={formatDate}
              isLiked={isLiked}
              favoriteCount={product.favoriteCount}
              onLikeToggle={handleLikeToggle}
              isLiking={isLiking}
              isUserLoggedIn={!!user}
              profileImage={product.owner?.image || DEFAULT_PROFILE_IMAGE}
              ownerNickname={product.owner?.nickname || "판매자"}
            />
          </div>
        </div>

        <div className="w-full h-auto flex flex-col gap-[24px]">
          {user && (
            <CommentForm
              onSubmit={handleCommentSubmit}
              isLoading={isCreatingComment}
            />
          )}
          {!user && (
            <p className="text-gray-500 text-center mb-6">
              문의를 남기려면{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                로그인
              </Link>
              이 필요합니다.
            </p>
          )}

          <CommentList
            comments={comments}
            onEditComment={handleEditComment}
            editingCommentId={editingCommentId}
            editingCommentContent={editingCommentContent}
            onEditingContentChange={setEditingCommentContent}
            onSaveEdit={handleSaveComment}
            onCancelEdit={handleCancelEdit}
            isSavingEdit={isSavingEdit}
            onDeleteComment={handleCommentDelete}
            deletingCommentId={deletingCommentId}
          />
          {nextCursor && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMoreComments}
                disabled={isLoadingMore}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isLoadingMore ? "로딩 중..." : "문의 더보기"}
              </button>
            </div>
          )}
          {error && ( // product가 없을 때의 에러는 위에서 처리됨
            <p className="text-red-500 text-center mt-4">오류: {error}</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Link href="/items">
          <Image
            src="/images/board/btn_medium.png"
            alt="목록으로 돌아가기"
            width={240}
            height={48}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            priority={false}
          />
        </Link>
      </div>
    </div>
  );
}
