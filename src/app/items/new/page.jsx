// src/app/items/new/page.jsx
"use client";

import { useProductForm } from "@/hooks/useProductForm"; // 커스텀 훅 임포트
import ImageUploader from "@/components/common/ImageUploader";
import TagInput from "@/components/common/TagInput";

export default function CreateProductPage() {
  const {
    name,
    description,
    price,
    tags,
    imagePreview,
    submitError,
    isSubmitting,
    setTags,
    handleNameChange,
    handleDescriptionChange,
    handlePriceChange,
    handleTagError,
    handleImageChange,
    handleImageError,
    handleSubmit,
    constants,
  } = useProductForm(); // 훅 사용 (itemId 없이 호출)

  return (
    <div className="w-[1200px] max-w-full mx-auto p-8 bg-white rounded-lg font-sans flex flex-col">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col flex-grow"
      >
        <div className="flex justify-between items-center w-full mb-6 flex-shrink-0">
          <h2 className="text-xl leading-8 font-bold text-gray-800">
            상품 등록하기
          </h2>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-[74px] h-[42px] flex items-center justify-center bg-blue-500 text-gray-100 text-base leading-[26px] font-semibold border-none rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:enabled:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>
        <div className="flex-grow">
          <ImageUploader
            id="product-image"
            label="상품 이미지"
            maxSizeMB={constants.IMAGE_MAX_SIZE_MB}
            onImageChange={handleImageChange}
            onImageError={handleImageError}
            previewUrl={imagePreview}
            isSubmitting={isSubmitting}
            isRequired={true}
            error={submitError?.includes("이미지") ? submitError : null}
          />

          {submitError &&
            !submitError.includes("이미지") &&
            !submitError.includes("상품명") &&
            !submitError.includes("상품 소개") &&
            !submitError.includes("판매 가격") &&
            !submitError.includes("태그") && (
              <div role="alert" className="text-red-600 text-sm mt-2 mb-4">
                {submitError}
              </div>
            )}

          <div className="mb-6">
            <label
              htmlFor="name"
              className="block mb-2 font-bold text-lg leading-[26px] text-gray-600"
            >
              상품명 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="상품명을 입력해주세요"
              value={name}
              onChange={handleNameChange}
              disabled={isSubmitting}
              maxLength={constants.MAX_NAME_LENGTH}
              required
              className={`w-full h-14 bg-gray-100 text-gray-900 placeholder:text-gray-400 p-3 border rounded-xl text-base leading-[26px] font-normal outline-none transition-colors duration-300 ease-in-out focus:border-blue-500 ${
                submitError?.includes("상품명")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {submitError?.includes("상품명") && (
              <p className="text-red-600 text-sm mt-1">{submitError}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block mb-2 font-bold text-lg leading-[26px] text-gray-600"
            >
              상품 소개 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder="상품 소개를 입력해주세요"
              value={description}
              onChange={handleDescriptionChange}
              disabled={isSubmitting}
              rows={8}
              maxLength={constants.MAX_DESC_LENGTH}
              required
              className={`w-full h-[282px] bg-gray-100 text-gray-900 placeholder:text-gray-400 p-3 border rounded-xl text-base leading-[26px] font-normal outline-none resize-none transition-colors duration-300 ease-in-out focus:border-blue-500 ${
                submitError?.includes("상품 소개")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {submitError?.includes("상품 소개") && (
              <p className="text-red-600 text-sm mt-1">{submitError}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="price"
              className="block mb-2 font-bold text-lg leading-[26px] text-gray-600"
            >
              판매 가격 <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="판매 가격을 입력해주세요 (숫자만)"
              value={price}
              onChange={handlePriceChange}
              disabled={isSubmitting}
              required
              className={`w-full h-14 bg-gray-100 text-gray-900 placeholder:text-gray-400 p-3 border rounded-xl text-base leading-[26px] font-normal outline-none transition-colors duration-300 ease-in-out focus:border-blue-500 ${
                submitError?.includes("판매 가격")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {submitError?.includes("판매 가격") && (
              <p className="text-red-600 text-sm mt-1">{submitError}</p>
            )}
          </div>

          <TagInput
            tags={tags}
            setTags={setTags}
            maxCount={constants.MAX_TAG_COUNT}
            maxLength={constants.MAX_TAG_LENGTH}
            onError={handleTagError}
            isSubmitting={isSubmitting}
            isRequired={true}
            error={submitError?.includes("태그") ? submitError : null}
          />
        </div>
      </form>
    </div>
  );
}
