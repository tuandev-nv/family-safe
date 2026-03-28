"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCurrentMonth, formatMonthLabel } from "@/lib/date-utils";

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const current = getCurrentMonth();
  const isCurrentMonth = year === current.year && month === current.month;

  function prev() {
    if (month === 1) {
      onChange(year - 1, 12);
    } else {
      onChange(year, month - 1);
    }
  }

  function next() {
    if (isCurrentMonth) return;
    if (month === 12) {
      onChange(year + 1, 1);
    } else {
      onChange(year, month + 1);
    }
  }

  function goToday() {
    onChange(current.year, current.month);
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
        <button
          onClick={prev}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-l-xl transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="px-4 text-sm font-bold text-gray-700 min-w-35 text-center">
          {formatMonthLabel(year, month)}
        </span>
        <button
          onClick={next}
          disabled={isCurrentMonth}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-r-xl transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      {!isCurrentMonth && (
        <button
          onClick={goToday}
          className="h-10 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold shadow shadow-purple-500/20 hover:from-purple-600 hover:to-pink-600 transition-all cursor-pointer"
        >
          Tháng này
        </button>
      )}
    </div>
  );
}
