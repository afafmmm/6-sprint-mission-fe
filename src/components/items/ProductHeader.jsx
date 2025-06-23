// src/components/items/ProductHeader.jsx

export default function ProductHeader({
  name,
  price,
  isSeller,
  onEdit,
  onDelete,
  isDeleting,
}) {
  return (
    <div className="w-full border-b border-gray-200 pb-4">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex flex-col gap-[8px]">
          <span className="font-semibold text-2xl leading-8 text-gray-800 break-words">
            {name || "상품명 없음"}
          </span>
          <span className="font-semibold text-3xl md:text-[40px] leading-tight md:leading-[40px] text-gray-800">
            {price !== undefined && price !== null
              ? `${price.toLocaleString()}원`
              : "가격 미정"}
          </span>
        </div>
        {isSeller && (
          <div className="flex-shrink-0 flex space-x-2 self-start md:self-center">
            <button
              onClick={onEdit}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
              aria-label="상품 수정"
            >
              수정
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              aria-label="상품 삭제"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
