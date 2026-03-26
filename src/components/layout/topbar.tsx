"use client";

import { LogOut } from "lucide-react";
import { SidebarToggle } from "./sidebar";

interface TopbarProps {
  onSidebarToggle: () => void;
  onLogout?: () => void;
}

export function Topbar({ onSidebarToggle, onLogout }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/80 backdrop-blur-sm border-b border-purple-100/50">
      <div className="flex items-center gap-3">
        <SidebarToggle onToggle={onSidebarToggle} />
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        )}
      </div>
    </header>
  );
}
