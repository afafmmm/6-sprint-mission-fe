// src/components/CommonModal.jsx
import React from "react";

export default function CommonModal({
  isOpen,
  onClose,
  message,
  type = "error",
}) {
  if (!isOpen) return null;

  const isSuccess = type === "success";
  const title = isSuccess ? "성공" : "오류 발생";
  const titleColor = isSuccess ? "text-green-700" : "text-red-700";
  const buttonColor = isSuccess
    ? "bg-green-500 hover:bg-green-600 focus:ring-green-500"
    : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {" "}
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="common-modal-title"
        aria-describedby="common-modal-description"
      >
        <h2
          id="common-modal-title"
          className={`text-xl font-semibold mb-4 ${titleColor}`}
        >
          {title}
        </h2>
        <p id="common-modal-description" className="mb-6 text-gray-600">
          {message}
        </p>
        <button
          onClick={onClose}
          className={`px-6 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColor}`}
        >
          확인
        </button>
      </div>
    </div>
  );
}
