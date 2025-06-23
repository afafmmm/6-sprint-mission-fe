// src/components/layout/UserAuthStatus.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";

const DEFAULT_PROFILE_IMAGE = "/images/board/ic_profile.png";

export default function UserAuthStatus() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <span className="text-sm text-gray-500">로딩중...</span>;
  }

  if (user) {
    return (
      <Link href="/mypage" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-200">
          <Image
            src={user.image || DEFAULT_PROFILE_IMAGE}
            alt={user.nickname || "사용자 프로필"}
            fill
            sizes="32px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors hidden sm:inline">
          {user.nickname || "사용자"}
        </span>
      </Link>
    );
  }

  return (
    <Link href="/login">
      <button className="button login-button ml-auto">로그인</button>
    </Link>
  );
}
