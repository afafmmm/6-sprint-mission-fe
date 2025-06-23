import Link from "next/link";
import Image from "next/image";
import { formatDateToKorean } from "@/utils/dateUtils"; // 경로가 맞는지 확인해주세요.
import BestArticleCard from "./BestArticleCard";

// "list" variant에 사용될 클래스명 (기존 clsx 로직을 기반으로 단순화)
const listCardClassName =
  "flex flex-col gap-[10px] w-full min-h-[138px] bg-[#FCFCFC] rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-200 p-[24px] relative";
const listImageClassName =
  "object-cover rounded-md border flex-shrink-0 w-[72px] h-[72px]";

export default function ArticleCard({ article, variant = "best" }) {
  // article 객체와 id 존재 여부 확인 강화
  if (!article || typeof article !== "object" || !article.id) {
    console.warn("ArticleCard received invalid article prop:", article);
    return null; // 유효하지 않은 article이면 아무것도 렌더링하지 않음
  }

  const formattedDate = formatDateToKorean(article.createdAt);

  if (variant === "best") {
    return <BestArticleCard article={article} formattedDate={formattedDate} />;
  }

  // "list" variant (또는 지정되지 않은 다른 variant) 렌더링
  return (
    <Link href={`/board/${article.id}`} className={listCardClassName}>
      <div className="flex gap-[10px] items-start">
        <h3 className="flex-grow text-lg leading-7 font-semibold text-[#1F2937] line-clamp-2">
          {article.title || "Untitled"}
        </h3>
        <Image
          src={article.imageUrl || "/images/board/default-thumbnail.png"}
          alt={
            article.title
              ? `Thumbnail for ${article.title}`
              : "Article thumbnail"
          }
          width={72}
          height={72}
          className={listImageClassName}
          priority={false}
          unoptimized={!article.imageUrl} // 기존 로직 유지
        />
      </div>

      <div className="mt-auto flex justify-between items-center text-sm font-normal leading-6">
        <div className="flex items-center gap-2">
          <span className="text-[#9CA3AF]">
            {article.author?.nickname || "익명"}
          </span>
          <span className="text-[#9CA3AF]">{formattedDate}</span>
        </div>
        <span className="text-[#6B7280] flex items-center gap-1 mr-5">
          <span>❤️</span>
          <span>{article.likes ?? 0}</span>
        </span>
      </div>
    </Link>
  );
}
