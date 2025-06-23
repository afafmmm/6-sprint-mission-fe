// src/components/auth/AuthPageLink.jsx
import Link from "next/link";

export default function AuthPageLink({ text, link, linkText }) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium text-gray-800 leading-6">
      <span>{text}</span>
      <Link
        href={link}
        className="font-medium text-sm underline text-blue-500 hover:text-blue-600 leading-[16.71px]"
      >
        {linkText}
      </Link>
    </div>
  );
}
