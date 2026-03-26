"use client";

import { SessionProvider } from "next-auth/react";
import { GlobalProvider } from "@/context/GlobalContext";
import AuthProvider from "@/components/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GlobalProvider>
        <AuthProvider>{children}</AuthProvider>
      </GlobalProvider>
    </SessionProvider>
  );
}
