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
        render={<Button variant={triggerVariant} size={triggerSize} />}
      >
        {triggerLabel}
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-64 p-3 bg-white">
        <p className="font-medium text-sm">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        <div className="flex gap-2 justify-end mt-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            {confirmText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
