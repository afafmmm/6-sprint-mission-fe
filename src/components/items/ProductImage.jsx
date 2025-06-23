// src/components/items/ProductImage.jsx
"use client"; // Image onError 사용 위해 필요

import { useState } from "react";
import Image from "next/image";

export default function ProductImage({ images, alt, defaultImage }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = images?.[0];

  return (
    <div className="w-full md:w-[486px] h-[486px] rounded-2xl overflow-hidden relative flex-shrink-0 bg-gray-200">
      {imageUrl && !imageError ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 486px"
          style={{ objectFit: "cover" }}
          priority
          onError={() => {
            console.error("Image load error:", imageUrl);
            setImageError(true);
          }}
        />
      ) : (
        <Image
          src={defaultImage}
          alt="기본 상품 이미지"
          fill
          sizes="(max-width: 768px) 100vw, 486px"
          style={{ objectFit: "cover" }}
        />
      )}
    </div>
  );
}
