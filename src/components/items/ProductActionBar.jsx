// src/components/items/ProductActionBar.jsx
import Image from "next/image";

export default function ProductActionBar({
  createdAt,
  formatDate,
  isLiked,
  favoriteCount,
  onLikeToggle,
  isLiking,
  isUserLoggedIn,
  profileImage,
  ownerNickname, // 판매자 닉네임 prop 추가
}) {
  return (
    <div className="flex justify-between items-center w-full mt-auto pt-4 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden relative">
          <Image
            src={profileImage} // prop 사용
            alt={ownerNickname ? `${ownerNickname} 프로필` : "판매자 프로필"} // prop 사용
            fill
            sizes="40px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-col text-sm">
          {/* 판매자 닉네임 표시 (선택적) */}
          {/* <span className="font-medium text-gray-800">{ownerNickname || '판매자'}</span> */}
          <span className="text-gray-500">{formatDate(createdAt)}</span>
        </div>
      </div>

      <button
        onClick={onLikeToggle}
        disabled={isLiking || !isUserLoggedIn}
        className={`h-[40px] rounded-[35px] border border-gray-300 px-3 py-1 flex items-center justify-center gap-1.5 transition-colors ${
          isLiked
            ? "bg-pink-500 text-white border-pink-500 hover:bg-pink-600"
            : "bg-white text-gray-800 hover:bg-gray-50"
        } disabled:opacity-70 disabled:cursor-not-allowed`}
        aria-pressed={isLiked}
        aria-label={isLiked ? "찜 취소" : "찜하기"}
      >
        <span>{isLiked ? "❤️" : "🤍"}</span>
        <span className="text-sm">({favoriteCount ?? 0})</span>
      </button>
    </div>
  );
}
