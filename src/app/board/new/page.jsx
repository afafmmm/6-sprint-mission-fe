"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { articlePandaService } from "@/lib/articleService";
import ArticleForm from "@/components/ArticleForm";
import clsx from "clsx";

export default function NewArticlePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isSubmitDisabled = !title.trim() || !content.trim() || isLoading;

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newArticle = await articlePandaService.createArticle({
        title,
        content,
      });
      router.push(`/board/${newArticle.id}`);
    } catch (err) {
      console.error("게시글 생성 실패:", err);
      setError("게시글 등록 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pt-[24px] pb-10">
      <div className="flex justify-between items-center h-[42px] mb-6">
        {" "}
        <h1 className="font-bold text-xl leading-8 text-[#1F2937]">
          {" "}
          게시글 쓰기
        </h1>
        <button
          type="submit"
          form="article-form"
          disabled={isSubmitDisabled}
          className={clsx(
            "w-[74px] h-[42px] py-3 px-[23px] rounded-lg flex items-center justify-center text-white text-sm font-bold transition-colors duration-200 bg-[#9CA3AF]", // 기본 비활성 배경색
            !isSubmitDisabled && "bg-blue-500 hover:bg-blue-700",
            isSubmitDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? "등록 중..." : "등록"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ArticleForm
        onFormSubmit={handleFormSubmit}
        title={title}
        content={content}
        onTitleChange={setTitle}
        onContentChange={setContent}
        isLoading={isLoading}
        formId="article-form"
      />
    </div>
  );
}
