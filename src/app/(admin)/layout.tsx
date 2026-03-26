"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-screen-2xl p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
