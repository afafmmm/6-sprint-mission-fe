// src/app/layout.jsx
"use client";

import { usePathname } from "next/navigation";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Providers from "@/app/providers";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <html lang="ko">
      <head>
        <title>Panda Market</title>
        <meta name="description" content="Welcome to Panda Market" />
      </head>
      <body className="flex flex-col min-h-screen">
        {/* Providers 컴포넌트로 감싸기 */}
        <Providers>
          {!isAuthPage && <Header />}
          <main className="flex-grow">{children}</main>
          {!isAuthPage && <Footer />}
        </Providers>
      </body>
    </html>
  );
}
