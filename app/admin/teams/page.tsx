"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
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
import type { Team, GroupName } from "@/types";

const schema = z.object({
  name:         z.string().min(1, "Required"),
  shortName:    z.string().min(1, "Required").max(5),
  logo:         z.string(),
  groupId:      z.enum(["A", "B", "C", "D"]),
  primaryColor: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

const GROUPS: GroupName[] = ["A", "B", "C", "D"];

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Team | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const load = useCallback(async () => {
    setLoading(true);
    try { setTeams(await api.get("/api/teams")); } catch { /* keep existing */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    reset({ name: "", shortName: "", logo: "", groupId: "A", primaryColor: "#C7FF00" });
    setOpen(true);
  }

  function openEdit(team: Team) {
    setEditing(team);
    reset({ name: team.name, shortName: team.shortName, logo: team.logo, groupId: team.groupId, primaryColor: team.primaryColor });
    setOpen(true);
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/api/teams/${editing.id}`, data);
      } else {
        await api.post("/api/teams", { ...data, id: `t${Date.now()}`, season: "2026" });
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
    if (!confirm("Delete this team?")) return;
    try { await api.delete(`/api/teams/${id}`); await load(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed"); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-navy uppercase">Teams</h1>
          <p className="text-gray-400 text-sm">{loading ? "Loading…" : `${teams.length} teams`}</p>
        </div>
        <Button onClick={openAdd} className="bg-neon-lime text-navy hover:bg-neon-lime/90 gap-2">
          <Plus size={16} /> Add Team
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-surface-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-surface-2">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Team</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Short</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">Group</th>
              <th className="text-center px-4 py-3 text-gray-500 font-medium">Color</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b border-surface-2 hover:bg-surface/50">
                <td className="px-4 py-3 font-medium text-navy">{team.name}</td>
                <td className="px-4 py-3 text-gray-500">{team.shortName}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-0.5 rounded-full bg-navy text-neon-lime text-xs font-semibold">
                    {team.groupId}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block w-5 h-5 rounded-full border border-gray-200"
                    style={{ backgroundColor: team.primaryColor }} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(team)}
                      className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-navy transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(team.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Team" : "Add Team"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Team Name</Label>
                <Input {...register("name")} placeholder="Desert Hawks" />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Short Name</Label>
                <Input {...register("shortName")} placeholder="DHK" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Logo (emoji)</Label>
                <Input {...register("logo")} placeholder="🦅" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Group</Label>
                <Controller control={control} name="groupId" render={({ field }) => (
                  <select value={field.value} onChange={field.onChange}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm">
                    {GROUPS.map((g) => <option key={g} value={g}>Group {g}</option>)}
                  </select>
                )} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Primary Color</Label>
                <Input {...register("primaryColor")} placeholder="#C7FF00" />
              </div>
            </div>
            <DialogFooter className="border-0 bg-transparent p-0 mt-2">
              <Button type="submit" disabled={saving} className="bg-neon-lime text-navy hover:bg-neon-lime/90 disabled:opacity-60">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Team"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
