"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Trash2, Plus, Calendar } from "lucide-react";
import { api } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { NewsItem } from "@/types";

const schema = z.object({
  title:       z.string().min(1, "Required"),
  excerpt:     z.string().min(1, "Required"),
  imageUrl:    z.string(),
  publishedAt: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function fmtDate(iso: string) {
  const [y, m, d] = iso.split("T")[0].split("-");
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`;
}

export default function AdminNewsPage() {
  const [news,    setNews]    = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [saving,  setSaving]  = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const load = useCallback(async () => {
    setLoading(true);
    try { setNews(await api.get("/api/news")); } catch { /* keep existing */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    reset({ title: "", excerpt: "", imageUrl: "", publishedAt: "2026-10-20T12:00" });
    setOpen(true);
  }

  function openEdit(item: NewsItem) {
    setEditing(item);
    reset({ title: item.title, excerpt: item.excerpt, imageUrl: item.imageUrl,
      publishedAt: item.publishedAt.slice(0, 16) });
    setOpen(true);
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      const publishedAt = new Date(data.publishedAt).toISOString();
      if (editing) {
        await api.patch(`/api/news/${editing.id}`, { ...data, publishedAt });
      } else {
        await api.post("/api/news", { ...data, publishedAt, id: `n${Date.now()}`, season: "2026" });
      }
      setOpen(false);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this news item?")) return;
    try { await api.delete(`/api/news/${id}`); await load(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed"); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-navy uppercase">News</h1>
          <p className="text-gray-400 text-sm">{loading ? "Loading…" : `${news.length} articles`}</p>
        </div>
        <Button onClick={openAdd} className="bg-neon-lime text-navy hover:bg-neon-lime/90 gap-2">
          <Plus size={16} /> Add Article
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-surface-2 px-4 py-3 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy text-sm leading-snug">{item.title}</p>
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.excerpt}</p>
              <div className="flex items-center gap-1 mt-2 text-gray-400 text-[10px]">
                <Calendar size={10} />
                <span>{fmtDate(item.publishedAt)}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-navy transition-colors"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Article" : "Add Article"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Title</Label>
              <Input {...register("title")} placeholder="Desert Hawks storm into top spot…" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Excerpt</Label>
              <textarea {...register("excerpt")} rows={3} placeholder="Brief summary…"
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50" />
              {errors.excerpt && <p className="text-red-500 text-xs">{errors.excerpt.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Published At</Label>
                <Input type="datetime-local" {...register("publishedAt")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Image URL</Label>
                <Input {...register("imageUrl")} placeholder="/news/news1.jpg" />
              </div>
            </div>
            <DialogFooter className="border-0 bg-transparent p-0 mt-2">
              <Button type="submit" disabled={saving} className="bg-neon-lime text-navy hover:bg-neon-lime/90 disabled:opacity-60">
                {saving ? "Saving…" : editing ? "Save Changes" : "Publish Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
