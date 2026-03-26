"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PopConfirmProps {
  title: string;
  description?: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  triggerVariant?: "destructive" | "ghost" | "outline";
  triggerSize?: "sm" | "default" | "icon-sm";
  triggerLabel: string;
}

export function PopConfirm({
  title,
  description,
  onConfirm,
  confirmText = "Xóa",
  cancelText = "Hủy",
  triggerVariant = "destructive",
  triggerSize = "sm",
  triggerLabel,
}: PopConfirmProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant={triggerVariant} size={triggerSize} className="h-10 px-5 rounded-xl text-sm font-semibold" />}
      >
        {triggerLabel}
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-72 p-4 bg-white rounded-xl shadow-xl border border-gray-100">
        <div className="flex items-start gap-3">
          <span className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-base shrink-0 mt-0.5">⚠️</span>
          <div>
            <p className="font-bold text-gray-800 text-sm">{title}</p>
            {description && (
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <Button size="sm" variant="outline" onClick={() => setOpen(false)} className="rounded-lg px-4">
            {cancelText}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => { onConfirm(); setOpen(false); }}
            className="rounded-lg px-4 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow shadow-rose-500/20">
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
