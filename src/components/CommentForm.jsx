// src/components/CommentForm.jsx
import { useState } from "react";

export default function CommentForm({ onSubmit, isLoading }) {
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim() || isLoading) {
      return;
    }

    onSubmit(content);

    setContent("");
  };

  return (
    <div className="mb-10">
      <h3 className="text-sm font-semibold mb-2 text-[#1F2937]">문의하기</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
          required
          disabled={isLoading}
          className="w-full h-[104px] rounded-xl bg-[#F3F4F6] py-4 px-6 border-0 resize-none focus:ring-2 focus:ring-blue-500 outline-none mb-2 text-[#1F2937]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!content.trim() || isLoading}
            className="px-4 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-base font-semibold leading-[26px] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
