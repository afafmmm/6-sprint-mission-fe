// src/components/items/ProductInfo.jsx

export default function ProductInfo({ description, tags }) {
  return (
    <div className="flex flex-col w-full gap-[24px]">
      <div className="w-full flex flex-col gap-[8px]">
        <h3 className="font-semibold text-base leading-[26px] text-gray-600">
          상품 소개
        </h3>
        <p className="font-normal text-base leading-[26px] text-gray-600 whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
          {description || "상품 설명이 없습니다."}
        </p>
      </div>
      <div className="w-full flex flex-col gap-[8px]">
        <h3 className="font-semibold text-base leading-[26px] text-gray-600">
          상품 태그
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block h-auto rounded-[26px] px-[16px] py-[6px] bg-gray-100 text-sm text-gray-700 whitespace-nowrap"
              >
                #{tag}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">등록된 태그가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
