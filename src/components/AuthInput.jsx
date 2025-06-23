// src/components/AuthInput.jsx
import React from "react";
import Image from "next/image";

const EYE_CLOSED_URL = "/images/auth/eye_closed.png";
const EYE_OPEN_URL = "/images/auth/eye_open.png";

export default function AuthInput({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  isPasswordVisible,
  togglePasswordVisibility,
  apiError,
}) {
  const inputWrapperBaseClasses =
    "flex items-center w-full h-14 rounded-xl bg-gray-100";
  const inputWrapperFocusClasses =
    "focus-within:border focus-within:border-blue-500";
  const inputWrapperErrorClasses = "border border-red-500";
  const inputWrapperDefaultBorderClasses = "border border-transparent";
  const inputBaseClasses =
    "w-full h-[26px] bg-transparent border-none focus:outline-none text-base placeholder:text-gray-400 leading-[26px] text-gray-900";

  const isApiErrorRelated =
    apiError &&
    ((id === "email" && apiError.includes("이메일")) ||
      (id === "password" && apiError.includes("비밀번호")));

  const hasError = !!error || isApiErrorRelated;

  return (
    <div className="flex flex-col gap-4 w-full text-left">
      <label
        htmlFor={id}
        className="font-bold text-lg leading-[26px] text-gray-800"
      >
        {label}
      </label>
      <div
        className={`${inputWrapperBaseClasses} ${
          hasError ? inputWrapperErrorClasses : inputWrapperDefaultBorderClasses
        } ${inputWrapperFocusClasses} px-4`}
      >
        <div className="flex items-center justify-between w-full">
          <input
            id={id}
            name={id}
            type={
              type === "password" && isPasswordVisible !== undefined
                ? isPasswordVisible
                  ? "text"
                  : "password"
                : type
            }
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required
            autoComplete={
              type === "email"
                ? "email"
                : type === "password"
                ? "current-password"
                : "off"
            }
            className={`${inputBaseClasses} ${
              type === "password" ? "pr-2" : ""
            }`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : undefined}
          />
          {type === "password" && togglePasswordVisibility && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(id)}
              className="flex-shrink-0"
              aria-label={
                isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"
              }
            >
              <Image
                src={isPasswordVisible ? EYE_OPEN_URL : EYE_CLOSED_URL}
                alt={isPasswordVisible ? "뜬 눈 아이콘" : "가려진 눈 아이콘"}
                width={20}
                height={20}
              />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="font-semibold text-[15px] leading-[17.9px] text-red-500 text-left"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
