// src/components/common/ImageUploader.jsx
"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

export default function ImageUploader({
  id,
  label,
  maxSizeMB,
  onImageChange,
  onImageError,
  previewUrl,
  isSubmitting,
  isRequired,
  error,
  existingImageUrl = "", // 수정 시 기존 이미지 URL
  allowRemove = false, // 이미지 제거 버튼 표시 여부
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        onImageError(`이미지 파일 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
        if (fileInputRef.current) fileInputRef.current.value = null;
        return;
      }
      const newPreviewUrl = URL.createObjectURL(file);
      onImageChange(file, newPreviewUrl);
      onImageError(null); // Clear previous error
    } else {
      // 파일 선택 취소 시 (기존 이미지가 있다면 유지, 없다면 null)
      onImageChange(null, existingImageUrl || null);
      if (error) onImageError(null); // Clear error if related
    }
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    onImageChange(null, null); // 파일과 미리보기 모두 제거
    onImageError(null); // 에러 제거
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Clean up blob URL on unmount or when previewUrl changes
  useEffect(() => {
    const currentPreview = previewUrl;
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [previewUrl]);

  return (
    <div className="mb-6">
      <label className="block mb-2 font-bold text-lg leading-[26px] text-gray-600">
        {label}{" "}
        {isRequired ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-gray-500 text-sm">(선택)</span>
        )}{" "}
        (최대 {maxSizeMB}MB)
      </label>
      <div className="flex w-full md:w-[588px] h-auto gap-4 items-start">
        <label
          htmlFor={id}
          className={`w-[282px] h-[282px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <svg
            className="w-10 h-10 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            ></path>
          </svg>
          <span className="text-sm text-gray-500">
            {previewUrl ? "이미지 변경" : "이미지 등록"}
          </span>
          <input
            id={id}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isSubmitting}
            required={isRequired && !previewUrl} // 필수인데 미리보기가 없으면 required
            className="hidden"
          />
        </label>
        <div className="w-[282px] h-[282px] border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 relative">
          {previewUrl ? (
            <>
              <Image
                src={previewUrl}
                alt="미리보기"
                fill
                sizes="282px"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  console.warn(`이미지 미리보기 로드 실패: ${previewUrl}`);
                  onImageError("미리보기 로드에 실패했습니다.");
                  e.target.style.display = "none"; // Hide broken image
                }}
              />
              {allowRemove && !isSubmitting && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs leading-none hover:bg-opacity-75"
                  aria-label="이미지 제거"
                >
                  &times;
                </button>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-400">미리보기</span>
          )}
        </div>
      </div>
      {error && (
        <div role="alert" className="text-red-600 text-sm mt-2">
          {error}
        </div>
      )}
      {/* Hidden input for form validation if needed */}
      <input
        type="text"
        value={previewUrl ? "filled" : ""}
        required={isRequired}
        className="hidden"
        readOnly
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
