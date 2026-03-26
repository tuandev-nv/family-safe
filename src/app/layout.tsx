"use client";

import { useState } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin", "vietnamese"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html
      lang="vi"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <title>Family Safe - Quản lý gia đình</title>
        <meta name="description" content="Dashboard quản lý thưởng phạt cho con" />
      </head>
      <body className="h-full font-sans">
        <div className="flex h-screen overflow-hidden">
          <Sidebar
            open={sidebarOpen}
            onToggle={() => setSidebarOpen((prev) => !prev)}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Topbar onSidebarToggle={() => setSidebarOpen((prev) => !prev)} />
            <main className="flex-1 overflow-y-auto bg-background">
              <div className="mx-auto max-w-screen-2xl p-6 md:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
