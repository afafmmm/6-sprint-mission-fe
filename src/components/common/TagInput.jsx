// src/components/common/TagInput.jsx
import { useState } from "react";

export default function TagInput({
  tags,
  setTags,
  maxCount,
  maxLength,
  onError,
  isSubmitting,
  isRequired,
  error,
}) {
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyPress = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();

      if (newTag.length > maxLength) {
        onError(`태그는 ${maxLength}자 이하로 입력해주세요.`);
        return;
      }
      if (tags.includes(newTag)) {
        onError("이미 추가된 태그입니다.");
        setTagInput("");
        return;
      }
      if (tags.length >= maxCount) {
        onError(`태그는 최대 ${maxCount}개까지 등록할 수 있습니다.`);
        return;
      }

      setTags([...tags, newTag]);
      setTagInput("");
      onError(null); // Clear error on success
    } else if (e.key === "Enter") {
      e.preventDefault();
    } else {
      if (error) onError(null); // Clear error on other key press
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    if (error) onError(null); // Clear error on remove
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="tags-input"
        className="block mb-2 font-bold text-lg leading-[26px] text-gray-600"
      >
        태그{" "}
        {isRequired ? (
          <span className="text-red-500">*</span>
        ) : (
          <span className="text-gray-500 text-sm">(선택)</span>
        )}{" "}
        (최대 {maxCount}개, 각 {maxLength}자 이하)
      </label>
      <input
        id="tags-input"
        type="text"
        placeholder={`태그 입력 후 Enter (${
          isRequired ? "최소 1개 필수" : "선택"
        })`}
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagKeyPress}
        disabled={isSubmitting || tags.length >= maxCount}
        maxLength={maxLength}
        className={`w-full h-14 bg-gray-100 text-gray-900 placeholder:text-gray-400 p-3 border rounded-xl text-base leading-[26px] font-normal outline-none transition-colors duration-300 ease-in-out focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-blue-500 text-white px-[0.8rem] py-[0.4rem] rounded text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              disabled={isSubmitting}
              aria-label={`태그 ${tag} 삭제`}
              className="ml-1.5 text-white opacity-70 hover:opacity-100 text-xs"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      {/* Hidden input for form validation */}
      <input
        type="text"
        value={tags.length > 0 ? "filled" : ""}
        required={isRequired}
        className="hidden"
        readOnly
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
