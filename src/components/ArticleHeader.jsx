import Image from "next/image";

export default function ArticleHeader({ article, onEdit, onDelete }) {
  if (!article) return null;

  const formattedDate = article?.createdAt
    ? new Date(article.createdAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, ".")
        .slice(0, -1)
    : "";

  return (
    <div className="mb-6 border-b pb-4">
      <div className="flex justify-between items-start mb-3">
        <h1 className="text-xl font-bold leading-8 text-[#1F2937] mr-4">
          {article.title || ""}
        </h1>

        {article.isOwner && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              수정하기
            </button>
            <button
              onClick={onDelete}
              className="text-sm text-red-500 hover:text-red-700"
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <Image
          src={article.author?.profileUrl || "/images/board/ic_profile.png"}
          alt={`${article.author?.nickname || "작성자"} 프로필`}
          width={32}
          height={32}
          className="rounded-full object-cover border"
        />
        <span>{article.author?.nickname || ""}</span>
        <span>·</span>
        <span>{formattedDate}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <span>❤️</span>
          <span>{article.likes ?? 0}</span>
        </span>
      </div>
    </div>
  );
}
