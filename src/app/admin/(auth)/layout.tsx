"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6", // Neutral clean background
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ width: "100%", maxWidth: "450px", padding: "20px" }}>
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
