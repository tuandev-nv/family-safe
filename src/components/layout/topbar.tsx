"use client";

import { SidebarToggle } from "./sidebar";

interface TopbarProps {
  onSidebarToggle: () => void;
}

export function Topbar({ onSidebarToggle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <SidebarToggle onToggle={onSidebarToggle} />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </header>
  );
}
