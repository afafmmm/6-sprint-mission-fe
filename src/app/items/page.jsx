// src/app/items/page.jsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ItemCard from "@/components/ItemCard";
import { useItems } from "@/hooks/useItems"; // 커스텀 훅 임포트

export default function ItemsPage() {
  const router = useRouter();
  const { items, isLoading, error } = useItems(); // 훅 사용

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          &larr; 홈으로 돌아가기
        </button>

        <h1 className="text-3xl font-bold text-center flex-grow mx-4">
          중고 마켓 상품 목록
        </h1>

        <Link href="/items/new">
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap">
            상품 등록하기
          </button>
        </Link>
      </div>

      {isLoading && (
        <p className="text-center text-gray-500">상품 목록을 불러오는 중...</p>
      )}

      {error && <p className="text-center text-red-600">오류: {error}</p>}

      {!isLoading && !error && (
        <>
          {items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item?.id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 pt-10">
              등록된 상품이 없습니다.
            </p>
          )}
        </>
      )}
    </div>
  );
}
