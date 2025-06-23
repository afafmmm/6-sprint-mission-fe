// src/components/auth/AuthLogo.jsx
import Link from "next/link";
import Image from "next/image";

const LOGO_URL = "/images/auth/logo.png";

export default function AuthLogo() {
  return (
    <div className="flex justify-center">
      <Link href="/">
        <Image
          src={LOGO_URL}
          alt="판다마켓 로고"
          width={396}
          height={132}
          priority
        />
      </Link>
    </div>
  );
}
