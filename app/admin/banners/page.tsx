"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Trash2, Plus } from "lucide-react";
import { api } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { Banner } from "@/types";

const schema = z.object({
  title:    z.string().min(1, "Required"),
  subtitle: z.string().min(1, "Required"),
  ctaLabel: z.string().min(1, "Required"),
  ctaHref:  z.string().min(1, "Required"),
  imageUrl: z.string(),
});
type FormData = z.infer<typeof schema>;

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [saving,  setSaving]  = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const load = useCallback(async () => {
    setLoading(true);
    try { setBanners(await api.get("/api/banners")); } catch { /* keep existing */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    reset({ title: "", subtitle: "", ctaLabel: "View", ctaHref: "/", imageUrl: "" });
    setOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditing(banner);
    reset({ title: banner.title, subtitle: banner.subtitle, ctaLabel: banner.ctaLabel,
      ctaHref: banner.ctaHref, imageUrl: banner.imageUrl });
    setOpen(true);
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/api/banners/${editing.id}`, data);
      } else {
        await api.post("/api/banners", { ...data, id: `b${Date.now()}`, season: "2026" });
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
    if (!confirm("Delete this banner?")) return;
    try { await api.delete(`/api/banners/${id}`); await load(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed"); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-navy uppercase">Banners</h1>
          <p className="text-gray-400 text-sm">{loading ? "Loading…" : `${banners.length} banners · hero slider`}</p>
        </div>
        <Button onClick={openAdd} className="bg-neon-lime text-navy hover:bg-neon-lime/90 gap-2">
          <Plus size={16} /> Add Banner
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-surface-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-surface-2">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Subtitle</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">CTA</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="border-b border-surface-2 hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-navy">{banner.title}</td>
                <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{banner.subtitle}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-electric-cyan">{banner.ctaLabel}</span>
                  <span className="text-gray-300 text-xs ml-1">→ {banner.ctaHref}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(banner)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-navy transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => handleDelete(banner.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Banner" : "Add Banner"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Title</Label>
              <Input {...register("title")} placeholder="KEFA KCL 2026" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Subtitle</Label>
              <textarea {...register("subtitle")} rows={2} placeholder="Presented by La Perfume · 16 Teams"
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50" />
              {errors.subtitle && <p className="text-red-500 text-xs">{errors.subtitle.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">CTA Label</Label>
                <Input {...register("ctaLabel")} placeholder="View Fixtures" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">CTA Link</Label>
                <Input {...register("ctaHref")} placeholder="/fixtures" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Image URL (optional)</Label>
              <Input {...register("imageUrl")} placeholder="/banners/banner1.jpg" />
            </div>
            <DialogFooter className="border-0 bg-transparent p-0 mt-2">
              <Button type="submit" disabled={saving} className="bg-neon-lime text-navy hover:bg-neon-lime/90 disabled:opacity-60">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Banner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
