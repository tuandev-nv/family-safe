"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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

interface ChildCardProps {
  child: {
    id: string;
    name: string;
    emoji: string;
    birthDate: string | null;
    totalPoints: number;
  };
}

function getAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function ChildCard({ child }: ChildCardProps) {
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/children/${child.id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <Link href={`/children/${child.id}`} className="flex items-center gap-3 flex-1">
            <span className="text-4xl">{child.emoji}</span>
            <div>
              <h3 className="font-semibold text-lg">{child.name}</h3>
              {child.birthDate && (
                <p className="text-sm text-muted-foreground">
                  {getAge(child.birthDate)} tuổi
                </p>
              )}
            </div>
          </Link>

          <div className="text-right">
            <p
              className={`text-2xl font-bold ${
                child.totalPoints >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {child.totalPoints > 0 ? "+" : ""}
              {child.totalPoints}
            </p>
            <p className="text-xs text-muted-foreground">điểm</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            href={`/activities/new?childId=${child.id}`}
            className={buttonVariants({ size: "sm", variant: "default" })}
          >
            + Ghi nhận
          </Link>
          <Link
            href={`/children/${child.id}/edit`}
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
                  Xóa {child.emoji} {child.name} sẽ xóa toàn bộ lịch sử hoạt
                  động. Hành động này không thể hoàn tác.
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
