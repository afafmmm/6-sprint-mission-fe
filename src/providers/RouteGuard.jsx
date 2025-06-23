// src/providers/RouteGuard.jsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const protectedPaths = ["/items/new"];

const publicPaths = ["/", "/login", "/signup", "/items", "/board"];

export default function RouteGuard({ children }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    const path = pathname.split("?")[0];

    const isProtectedRoute = protectedPaths.some(
      (route) =>
        path === route || (path.startsWith(route + "/") && route !== "/")
    );

    const isPublicRoute = publicPaths.some(
      (route) =>
        path === route || (path.startsWith(route + "/") && route !== "/")
    );

    if (isProtectedRoute && !user) {
      console.log(
        "RouteGuard: Redirecting to /login (protected route, no user)"
      );
      router.push("/login");
    } else if (isPublicRoute && user) {
      if (path === "/login" || path === "/signup") {
        console.log(
          "RouteGuard: Redirecting to / (public auth route, user exists)"
        );
        router.push("/items");
      }
    }
  }, [user, isAuthLoading, pathname, router]);

  if (isAuthLoading) {
    return null;
  }

  const path = pathname.split("?")[0];
  const isProtectedRoute = protectedPaths.some(
    (route) => path === route || (path.startsWith(route + "/") && route !== "/")
  );
  const isPublicAuthRoute = path === "/login" || path === "/signup";

  if (isProtectedRoute && !user) {
    return null;
  }
  if (isPublicAuthRoute && user) {
    return null;
  }

  return children;
}
