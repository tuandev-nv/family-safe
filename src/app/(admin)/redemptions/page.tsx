"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopConfirm } from "@/components/ui/pop-confirm";
import { ChildAvatar } from "@/components/ui/child-avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChildAvailable {
  id: string;
  name: string;
  emoji: string;
  avatarUrl?: string | null;
  earned: number;
  redeemed: number;
  available: number;
}

interface Redemption {
  id: string;
  childId: string;
  points: number;
  description: string;
  createdAt: string;
  child: { name: string; emoji: string; avatarUrl?: string | null };
}

export default function RedemptionsPage() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [childrenAvailable, setChildrenAvailable] = useState<ChildAvailable[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  // Form state
  const [childId, setChildId] = useState("");
  const [points, setPoints] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(() => {
    Promise.all([
      fetch("/api/redemptions").then((r) => r.json()),
      fetch("/api/redemptions/available").then((r) => r.json()),
    ])
      .then(([r, c]) => { setRedemptions(r); setChildrenAvailable(c); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const selectedChild = childrenAvailable.find((c) => c.id === childId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!childId) { setError("Vui lòng chọn bé"); return; }
    if (selectedChild && selectedChild.available <= 0) {
      setError(`${selectedChild.name} không có điểm khả dụng để đổi`);
      return;
    }
    const pts = parseInt(points);
    if (!pts || pts <= 0) { setError("Vui lòng nhập số điểm lớn hơn 0"); return; }
    if (!description.trim()) { setError("Vui lòng nhập mô tả"); return; }
    if (selectedChild && pts > selectedChild.available) {
      setError(`${selectedChild.name} chỉ có ${selectedChild.available} điểm khả dụng`);
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/redemptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        points: parseInt(points),
        description,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    setFormOpen(false);
    setChildId("");
    setPoints("");
    setDescription("");
    fetchData();
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/redemptions/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  }

  function openForm() {
    setChildId("");
    setPoints("");
    setDescription("");
    setError("");
    setFormOpen(true);
  }

  const totalRedeemed = redemptions.reduce((s, r) => s + r.points, 0);

  return (
    <div>
      <Header
        title="Đổi điểm"
        description="Quản lý đổi điểm lấy phần thưởng"
        action={
          <Button onClick={openForm} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/25">
            + Đổi điểm
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-orange-100/60 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-xl mb-3">🎁</div>
          <p className="text-3xl font-extrabold text-gray-800">{redemptions.length}</p>
          <p className="text-sm text-gray-400 mt-0.5">Lần đổi</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-purple-100/60 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-xl mb-3">💎</div>
          <p className="text-3xl font-extrabold text-purple-600">{totalRedeemed}</p>
          <p className="text-sm text-gray-400 mt-0.5">Tổng điểm đã đổi</p>
        </div>
      </div>

      {/* Available points per child */}
      {childrenAvailable.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span> Điểm khả dụng
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {childrenAvailable.map((child) => (
              <div key={child.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
                <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size="lg" />
                <div>
                  <p className="font-bold text-gray-800">{child.name}</p>
                  <p className="text-2xl font-extrabold text-emerald-600">{child.available}</p>
                  <p className="text-xs text-gray-400">điểm có thể đổi</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-muted-foreground py-8 text-center">Đang tải...</p>
      ) : redemptions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-7xl mb-4">🎁</div>
          <p className="text-xl font-semibold text-gray-600 mb-2">Chưa có lần đổi điểm nào</p>
          <p className="text-muted-foreground mb-6">Khi bé tích đủ điểm, hãy đổi lấy phần thưởng!</p>
          <Button onClick={openForm} className="h-11 px-6 rounded-xl text-base font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg">
            + Đổi điểm
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl bg-white shadow-sm overflow-hidden border border-gray-100">
          <div className="px-5 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <span>🎁</span> Lịch sử đổi điểm
            </h3>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
              {redemptions.length} lần đổi
            </span>
          </div>
          <div className="p-4 space-y-2">
            {redemptions.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3.5 rounded-xl bg-orange-50/70 hover:bg-orange-50 transition-colors">
                <div className="flex items-center gap-3">
                  <ChildAvatar emoji={r.child.emoji} avatarUrl={r.child.avatarUrl} size="md" />
                  <div>
                    <p className="text-base">
                      <span className="font-bold text-gray-800">{r.child.name}</span>
                      <span className="text-gray-300 mx-1.5">/</span>
                      <span className="text-gray-600">{r.description}</span>
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full text-sm font-extrabold bg-orange-400 text-white">
                    -{r.points}
                  </span>
                  <PopConfirm
                    title="Hoàn tác đổi điểm?"
                    description="Điểm sẽ được trả lại."
                    onConfirm={() => handleDelete(r.id)}
                    triggerLabel="✕"
                    triggerVariant="ghost"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-lg">🎁</span>
              Đổi điểm
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate className="space-y-5 mt-2">
            {/* Child select - avatar style */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2.5">Chọn bé</label>
              <div className="grid grid-cols-2 gap-2">
                {childrenAvailable.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => { setChildId(child.id); setPoints(""); setError(""); }}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      childId === child.id
                        ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10"
                        : "border-gray-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <ChildAvatar emoji={child.emoji} avatarUrl={child.avatarUrl} size="lg" />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 truncate">{child.name}</p>
                      <p className={`text-lg font-extrabold ${child.available > 0 ? "text-emerald-600" : "text-gray-300"}`}>
                        {child.available} <span className="text-xs font-medium text-gray-400">khả dụng</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Points with available info */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Số điểm đổi</label>
              <Input
                type="number"
                value={points}
                onChange={(e) => {
                  const v = e.target.value;
                  setPoints(v);
                  const pts = parseInt(v);
                  if (selectedChild && pts > selectedChild.available) {
                    setError(`Vượt quá điểm khả dụng (${selectedChild.available})`);
                  } else {
                    setError("");
                  }
                }}
                placeholder="VD: 50"
                className={`h-11 rounded-xl bg-white text-base ${
                  selectedChild && parseInt(points) > selectedChild.available
                    ? "border-rose-400 focus:ring-rose-400"
                    : "border-gray-200"
                }`}
              />
              {selectedChild && (
                <p className="text-xs mt-1.5 flex items-center gap-1">
                  <span className="text-gray-400">Khả dụng:</span>
                  <span className={`font-bold ${selectedChild.available > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                    {selectedChild.available} điểm
                  </span>
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="text-gray-400">Tính đến hết tháng trước</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Đổi lấy gì?</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Đi công viên, Mua đồ chơi..."
                className="h-11 rounded-xl bg-white border-gray-200 text-base"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium">{error}</div>
            )}

            <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="px-6 h-11 rounded-xl">
                Hủy
              </Button>
              <Button type="submit" disabled={submitting || !childId || (!!points && selectedChild != null && parseInt(points) > selectedChild.available)}
                className="px-8 h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 text-base font-bold">
                {submitting ? "Đang xử lý..." : "Đổi điểm"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
