// src/hooks/useItems.js
import { useState, useEffect } from "react";
import { productPandaService as productService } from "@/lib/productService";

export function useItems() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productData = await productService.getProducts();
        const productList = productData?.list || [];
        setItems(Array.isArray(productList) ? productList : []);
      } catch (err) {
        console.error("상품 목록 로딩 실패:", err);
        setError(err.message || "상품 목록을 불러올 수 없습니다.");
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, isLoading, error };
}
