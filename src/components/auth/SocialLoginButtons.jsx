// src/components/auth/SocialLoginButtons.jsx
import Image from "next/image";

const GOOGLE_LOGO_URL = "/images/auth/google_logo.png";
const KAKAO_LOGO_URL = "/images/auth/kakao_logo.png";

export default function SocialLoginButtons() {
  return (
    <div className="flex items-center justify-center w-full h-[74px] rounded-lg bg-blue-100 px-6">
      <div className="flex justify-between items-center w-full max-w-[594px]">
        <span className="text-base leading-[26px] font-medium text-gray-800">
          간편 로그인하기
        </span>
        <div className="flex gap-4">
          <a
            href="https://www.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src={GOOGLE_LOGO_URL}
              alt="구글 로그인"
              width={42}
              height={42}
            />
          </a>
          <a
            href="https://www.kakaocorp.com/page/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src={KAKAO_LOGO_URL}
              alt="카카오 로그인"
              width={42}
              height={42}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
