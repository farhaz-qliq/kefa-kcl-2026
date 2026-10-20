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
import type { Player, Team, Position } from "@/types";

const POSITIONS: Position[] = ["GK", "DEF", "MID", "FWD"];

const schema = z.object({
  name:        z.string().min(1, "Required"),
  teamId:      z.string().min(1, "Required"),
  number:      z.number().min(1).max(99),
  position:    z.enum(["GK", "DEF", "MID", "FWD"]),
  goals:       z.number().min(0),
  assists:     z.number().min(0),
  yellowCards: z.number().min(0),
  redCards:    z.number().min(0),
});
type FormData = z.infer<typeof schema>;

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams,   setTeams]   = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTeam, setFilterTeam] = useState("ALL");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Player | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t] = await Promise.all([api.get("/api/players"), api.get("/api/teams")]);
      setPlayers(p); setTeams(t);
    } catch { /* keep existing */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const teamMap = Object.fromEntries(teams.map((t: Team) => [t.id, t]));
  const filtered = filterTeam === "ALL" ? players : players.filter((p) => p.teamId === filterTeam);

  function openAdd() {
    setEditing(null);
    reset({ name: "", teamId: teams[0]?.id ?? "", number: 1, position: "MID", goals: 0, assists: 0, yellowCards: 0, redCards: 0 });
    setOpen(true);
  }

  function openEdit(player: Player) {
    setEditing(player);
    reset({ name: player.name, teamId: player.teamId, number: player.number, position: player.position,
      goals: player.goals, assists: player.assists, yellowCards: player.yellowCards, redCards: player.redCards });
    setOpen(true);
  }

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/api/players/${editing.id}`, data);
      } else {
        await api.post("/api/players", { ...data, id: `${data.teamId}-p${Date.now()}`, season: "2026" });
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
    if (!confirm("Delete this player?")) return;
    try { await api.delete(`/api/players/${id}`); await load(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed"); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-navy uppercase">Players</h1>
          <p className="text-gray-400 text-sm">{loading ? "Loading…" : `${filtered.length} players`}</p>
        </div>
        <Button onClick={openAdd} className="bg-neon-lime text-navy hover:bg-neon-lime/90 gap-2">
          <Plus size={16} /> Add Player
        </Button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["ALL", ...teams.map((t: Team) => t.id)].map((id) => (
          <button key={id} onClick={() => setFilterTeam(id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterTeam === id ? "bg-navy text-neon-lime border-navy" : "bg-transparent text-gray-500 border-gray-300 hover:border-navy"
            }`}>
            {id === "ALL" ? "All" : teamMap[id]?.shortName ?? id}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-surface-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-surface-2">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">#</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Player</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Team</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">Pos</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">G</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">A</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">YC</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">RC</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((player) => {
              const team = teamMap[player.teamId];
              return (
                <tr key={player.id} className="border-b border-surface-2 hover:bg-surface/50">
                  <td className="px-4 py-2.5 text-gray-400 text-xs">{player.number}</td>
                  <td className="px-4 py-2.5 font-medium text-navy">{player.name}</td>
                  <td className="px-4 py-2.5 text-gray-500 text-xs">{team?.shortName ?? "—"}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded bg-navy text-electric-cyan text-[10px] font-semibold">
                      {player.position}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm text-navy">{player.goals}</td>
                  <td className="px-3 py-2.5 text-center text-sm text-gray-500">{player.assists}</td>
                  <td className="px-3 py-2.5 text-center text-sm text-yellow-500">{player.yellowCards}</td>
                  <td className="px-3 py-2.5 text-center text-sm text-red-500">{player.redCards}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(player)} className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-navy transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(player.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Player" : "Add Player"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Full Name</Label>
              <Input {...register("name")} placeholder="Ali Hassan" />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Team</Label>
                <Controller control={control} name="teamId" render={({ field }) => (
                  <select value={field.value} onChange={field.onChange}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm">
                    {teams.map((t: Team) => <option key={t.id} value={t.id}>{t.shortName}</option>)}
                  </select>
                )} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Position</Label>
                <Controller control={control} name="position" render={({ field }) => (
                  <select value={field.value} onChange={field.onChange}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm">
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                )} />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(["number","goals","assists","yellowCards"] as const).map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <Label className="text-xs text-gray-500">{field === "number" ? "No." : field === "yellowCards" ? "YC" : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input type="number" {...register(field, { valueAsNumber: true })} className="text-center" min={0} />
                </div>
              ))}
            </div>
            <DialogFooter className="border-0 bg-transparent p-0 mt-2">
              <Button type="submit" disabled={saving} className="bg-neon-lime text-navy hover:bg-neon-lime/90 disabled:opacity-60">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Player"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
