"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    type: string;
    icon: string;
    levels: Array<{
      id: string;
      label: string;
      points: number;
    }>;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleDelete() {
    const res = await fetch(`/api/categories/${category.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }

    router.refresh();
  }

  const isReward = category.type === "REWARD";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{category.icon}</span>
            <div>
              <h3 className="font-semibold">{category.name}</h3>
              <Badge variant={isReward ? "default" : "destructive"} className="text-xs">
                {isReward ? "Thưởng" : "Phạt"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-1 mb-3">
          {category.levels.map((level) => (
            <div
              key={level.id}
              className="flex items-center justify-between text-sm py-1 px-2 rounded bg-muted/50"
            >
              <span>{level.label}</span>
              <span
                className={`font-mono font-medium ${
                  level.points >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {level.points > 0 ? "+" : ""}
                {level.points}
              </span>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-destructive mb-2">{error}</p>}

        <div className="flex gap-2">
          <Link
            href={`/categories/${category.id}/edit`}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Sửa
          </Link>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="destructive" size="sm" />}
            >
              Xóa
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                <AlertDialogDescription>
                  Xóa danh mục &quot;{category.name}&quot;? Không thể xóa nếu đã có hoạt
                  động sử dụng.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
