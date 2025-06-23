// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 다른 설정들이 있을 수 있습니다...
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.wccftech.com",
        port: "",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
        port: "",
        // pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        // pathname: '/**',
      },

      {
        protocol: "https",
        hostname: "sprint-fe-project.s3.ap-northeast-2.amazonaws.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
