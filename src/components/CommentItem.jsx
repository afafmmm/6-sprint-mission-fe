import Image from "next/image";

import { formatRelativeTime } from "@/utils/dateUtils";

export default function CommentItem({
  comment,
  onEditComment,
  onDeleteComment,
  isEditing,
  editingContent,
  onEditingContentChange,
  onSaveEdit,
  onCancelEdit,
  isSavingEdit,
  isDeleting,
}) {
  if (!comment) return null;

  const formattedRelativeTime = formatRelativeTime(comment?.createdAt);

  return (
    <div className="border-t pt-4">
      <div className="flex items-start gap-4 mb-2">
        <Image
          src={comment.author?.profileUrl || "/images/board/ic_profile.png"}
          alt={`${comment.author?.nickname || "작성자"} 프로필`}
          width={24}
          height={24}
          className="rounded-full flex-shrink-0 mt-0.5"
        />
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#1F2937]">
                {comment.author?.nickname || "익명"}
              </span>
              <span className="text-xs text-gray-400">
                {formattedRelativeTime}
              </span>
            </div>

            {!isEditing && comment.isOwner && (
              <div className="flex gap-2">
                <button
                  onClick={() => onEditComment(comment.id, comment.content)}
                  disabled={isDeleting}
                  className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  aria-label={`댓글 ${comment.id} 수정`}
                >
                  수정
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  disabled={isDeleting}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                  aria-label={`댓글 ${comment.id} 삭제`}
                >
                  {isDeleting ? "삭제중..." : "삭제"}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editingContent}
                onChange={(e) => onEditingContentChange(e.target.value)}
                className="w-full text-sm p-2 border rounded bg-gray-50 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                rows={3}
                disabled={isSavingEdit}
              />
              <div className="flex justify-end gap-2 mt-1">
                <button
                  onClick={onCancelEdit}
                  disabled={isSavingEdit}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={() => onSaveEdit(comment.id)}
                  disabled={!editingContent.trim() || isSavingEdit}
                  className="text-xs text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded disabled:bg-gray-300"
                >
                  {isSavingEdit ? "저장중..." : "저장"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm leading-relaxed">
              {comment.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
