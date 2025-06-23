// src/components/layout/SocialLinks.jsx
import Image from "next/image";

const socialMedia = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/",
    icon: "/images/social/facebook-logo.svg",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/",
    icon: "/images/social/twitter-logo.svg",
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/",
    icon: "/images/social/youtube-logo.svg",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/",
    icon: "/images/social/instagram-logo.svg",
  },
];

export default function SocialLinks() {
  return (
    <div className="flex gap-[10px]">
      {socialMedia.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          className="opacity-80 hover:opacity-100 transition-opacity"
        >
          <Image src={social.icon} alt={social.name} width={20} height={20} />
        </a>
      ))}
    </div>
  );
}
