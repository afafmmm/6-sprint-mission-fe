// src/components/layout/Header.jsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserAuthStatus from "./UserAuthStatus"; // 새 컴포넌트

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full h-[70px] flex items-center px-[50px] md:px-[100px] lg:px-[200px] bg-white border-b border-[#DFDFDF]">
      <Link href="/" className="mr-10 flex-shrink-0">
        <Image
          src="/images/logo/panda-market-logo.png"
          alt="판다마켓 홈"
          width={153}
          height={40}
          priority
        />
      </Link>
      <nav className="flex items-center gap-5">
        <Link
          href="/board"
          className={`text-lg font-bold no-underline ${
            pathname.startsWith("/board") ? "text-blue-500" : "text-gray-700"
          } hover:text-blue-600 transition-colors`}
        >
          자유게시판
        </Link>
        <Link
          href="/items"
          className={`text-lg font-bold no-underline ${
            pathname.startsWith("/items") ? "text-blue-500" : "text-gray-700"
          } hover:text-blue-600 transition-colors`}
        >
          중고마켓
        </Link>
      </nav>
      <div className="ml-auto flex items-center">
        <UserAuthStatus />
      </div>
    </header>
  );
};

export default Header;
