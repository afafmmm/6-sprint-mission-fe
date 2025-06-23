"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { articlePandaService } from "@/lib/articleService";
import { useAuth } from "@/providers/AuthProvider";
import ArticleForm from "@/components/ArticleForm";
import clsx from "clsx";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id;
  const { user: currentUser } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  const loadArticle = useCallback(async () => {
    if (!articleId) return;
    setIsFetching(true);
    setError(null);
    try {
      const article = await articlePandaService.getArticle(articleId);
      const articleWriter = article.writer;

      if (
        !currentUser ||
        !articleWriter ||
        articleWriter.id !== currentUser.id
      ) {
        setError("이 게시글을 수정할 권한이 없습니다.");
        setIsFetching(false);
        return;
      }
      setTitle(article.title || "");
      setContent(article.content || "");
    } catch (err) {
      console.error("게시글 로드 실패:", err);
      setError("게시글 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsFetching(false);
    }
  }, [articleId, currentUser, router]);

  useEffect(() => {
    if (currentUser !== undefined) {
      loadArticle();
    }
  }, [loadArticle, currentUser]);

  const isSubmitDisabled =
    !title.trim() || !content.trim() || isLoading || isFetching;

  const handleFormSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await articlePandaService.updateArticle(articleId, { title, content });
      router.push(`/board/${articleId}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      setError("게시글 수정 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-[1200px] mx-auto pt-[24px] pb-10">
        게시글 정보 로딩 중...
      </div>
    );
  }

  if (
    error &&
    (title === "" || content === "" || (!isFetching && !title && !content))
  ) {
    return (
      <div className="max-w-[1200px] mx-auto pt-[24px] pb-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto pt-[24px] pb-10">
      <div className="flex justify-between items-center h-[42px] mb-6">
        <h1 className="font-bold text-xl leading-8 text-[#1F2937]">
          게시글 수정
        </h1>
        <button
          type="submit"
          form="article-form"
          disabled={isSubmitDisabled}
          className={clsx(
            "w-[74px] h-[42px] py-3 px-[23px] rounded-lg flex items-center justify-center text-white text-sm font-bold transition-colors duration-200 bg-[#9CA3AF]",
            !isSubmitDisabled && "bg-blue-500 hover:bg-blue-700",
            isSubmitDisabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? "수정 중..." : "수정"}
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
