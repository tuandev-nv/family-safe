"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  ClipboardList,
  CalendarDays,
  Gift,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/children", label: "Trẻ em", icon: Users },
  { href: "/categories", label: "Danh mục", icon: FolderOpen },
  { href: "/activities", label: "Hoạt động", icon: ClipboardList },
  { href: "/redemptions", label: "Đổi điểm", icon: Gift },
  { href: "/year-summary", label: "Tổng kết năm", icon: CalendarDays },
];

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-70 bg-gradient-to-b from-[#3B1F6E] to-[#2D1856] flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold text-white">🏠 Gia đình Gấu Bơ</h1>
          </Link>
          <button
            onClick={onToggle}
            className="lg:hidden text-purple-200/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-purple-200/60">
            Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25"
                    : "text-purple-200/70 hover:text-white hover:bg-white/10",
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-foreground"
    >
      <Menu size={20} />
    </button>
  );
}
