// src/hooks/useProductForm.js
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { productPandaService as productService } from "@/lib/productService";
import { imagePandaService } from "@/lib/imageService";

// --- 상수 정의 (변경 없음) ---
const MAX_TAG_COUNT = 5;
const MAX_TAG_LENGTH = 20;
const MAX_NAME_LENGTH = 100;
const MAX_DESC_LENGTH = 1000;
const IMAGE_MAX_SIZE_MB = 5;

export function useProductForm(itemId = null) {
  const router = useRouter();
  // --- 상태 변수 정의 (변경 없음) ---
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(!!itemId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!itemId;

  // --- 수정 모드 시 데이터 로딩 useEffect (변경 없음) ---
  useEffect(() => {
    if (!isEditMode) return;
    const fetchProductData = async () => {
      setIsLoading(true);
      setSubmitError(null);
      try {
        const product = await productService.getProduct(itemId);
        if (product) {
          setName(product.name || "");
          setDescription(product.description || "");
          setPrice(product.price?.toString() || "");
          setTags(product.tags || []);
          const imageUrl = product.images?.[0] || "";
          if (imageUrl) {
            setImagePreview(imageUrl);
            setExistingImageUrl(imageUrl);
          } else {
            setImagePreview(null);
            setExistingImageUrl("");
          }
        } else {
          setSubmitError("상품 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        console.error("상품 정보 로딩 중 오류 발생:", error);
        setSubmitError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [itemId, isEditMode]);

  const handleImageChange = useCallback(
    (file, previewUrl) => {
      setImageFile(file);
      setImagePreview(previewUrl);

      if (submitError?.includes("이미지")) setSubmitError(null);
    },
    [submitError]
  );

  const handleImageError = useCallback((errorMsg) => {
    setSubmitError(errorMsg);
    setImageFile(null);
  }, []); // 의존성 없음

  useEffect(() => {
    const currentPreview = imagePreview;
    return () => {
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [imagePreview]);

  const handleNameChange = useCallback(
    (e) => {
      setName(e.target.value);
      if (submitError) setSubmitError(null);
    },
    [submitError]
  );

  const handleDescriptionChange = useCallback(
    (e) => {
      setDescription(e.target.value);
      if (submitError) setSubmitError(null);
    },
    [submitError]
  );

  const handlePriceChange = useCallback(
    (e) => {
      const value = e.target.value.replace(/[^0-9]/g, "");
      setPrice(value);
      if (submitError) setSubmitError(null);
    },
    [submitError]
  );

  const handleTagError = useCallback((errorMsg) => {
    setSubmitError(errorMsg);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (isSubmitting || isLoading) return;

      setSubmitError(null);

      setIsSubmitting(true);
      let finalImageUrl = existingImageUrl;

      try {
        if (imageFile) {
          const imageFormData = new FormData();
          imageFormData.append("image", imageFile);
          const uploadResponse = await imagePandaService.uploadImage(
            imageFormData
          );

          if (!uploadResponse?.imageUrl) {
            // 'url' 대신 'imageUrl'을 확인합니다.
            throw new Error("이미지 업로드 후 URL을 받지 못했습니다.");
          }

          finalImageUrl = uploadResponse.imageUrl; // 'url' 대신 'imageUrl'을 사용합니다.
        } else if (!imagePreview && existingImageUrl && isEditMode) {
          finalImageUrl = "";
        }

        const productData = {
          name: name.trim(),
          description: description.trim(),

          price: parseInt(price, 10) || 0,
          tags: tags,
          images: finalImageUrl ? [finalImageUrl] : [],
        };

        if (isEditMode) {
          await productService.updateProduct(itemId, productData);
          alert("상품이 성공적으로 수정되었습니다.");
          router.push(`/items/${itemId}`);
        } else {
          await productService.createProduct(productData);
          alert("상품이 성공적으로 등록되었습니다.");
          router.push("/items");
        }
      } catch (error) {
        console.error(
          `상품 ${isEditMode ? "수정" : "생성"} 과정 중 오류 발생:`,
          error
        );
        let errorMessage = `상품 ${
          isEditMode ? "수정" : "등록"
        } 중 오류가 발생했습니다.`;
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setSubmitError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },

    [
      isSubmitting,
      isLoading,

      existingImageUrl,
      imageFile,
      imagePreview,
      isEditMode,
      name,
      description,
      price,
      tags,
      itemId,
      router,
    ]
  );

  // --- 훅 반환 값 (변경 없음) ---
  return {
    name,
    description,
    price,
    tags,
    imageFile,
    imagePreview,
    existingImageUrl,
    submitError,
    isLoading,
    isSubmitting,
    isEditMode,
    setName,
    setDescription,
    setPrice,
    setTags,
    handleNameChange,
    handleDescriptionChange,
    handlePriceChange,
    handleTagError,
    handleImageChange,
    handleImageError,
    handleSubmit,
    constants: {
      MAX_TAG_COUNT,
      MAX_TAG_LENGTH,
      MAX_NAME_LENGTH,
      MAX_DESC_LENGTH,
      IMAGE_MAX_SIZE_MB,
    },
  };
}
