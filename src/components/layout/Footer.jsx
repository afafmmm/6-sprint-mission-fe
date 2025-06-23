// src/components/layout/Footer.jsx
import React from "react";
import Link from "next/link";
import SocialLinks from "./SocialLinks"; // 새 컴포넌트

const Footer = () => {
  return (
    <footer className="w-full h-[160px] bg-[#111827] text-gray-400 flex justify-between items-center py-[32px] px-[50px] md:px-[100px] lg:px-[200px] xl:px-[400px]">
      {" "}
      {/* 반응형 패딩 조정 */}
      <div className="text-sm">©codeit - 2024</div>
      <div className="flex gap-6 md:gap-12 text-gray-200 text-sm">
        {" "}
        {/* 간격 조정 */}
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/faq" className="hover:underline">
          FAQ
        </Link>
      </div>
      <SocialLinks />
    </footer>
  );
};

export default Footer;
