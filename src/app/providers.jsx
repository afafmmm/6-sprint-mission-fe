import React from "react";
import AuthProvider from "@/providers/AuthProvider";
import RouteGuard from "@/providers/RouteGuard";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <RouteGuard>{children}</RouteGuard>
    </AuthProvider>
  );
}
