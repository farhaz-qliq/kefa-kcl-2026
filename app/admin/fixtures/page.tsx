"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Pencil, Trash2, Plus, ClipboardEdit, BarChart2, Star } from "lucide-react";
import { api } from "@/lib/admin-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Fixture, Team, Player, GroupName, MatchStats } from "@/types";

// ── Schemas ───────────────────────────────────────────────────────────────

const fixtureSchema = z.object({
  homeTeamId: z.string().min(1, "Required"),
  awayTeamId: z.string().min(1, "Required"),
  groupId:    z.enum(["A", "B", "C", "D"]),
  date:       z.string().min(1, "Required"),
  time:       z.string().min(1, "Required"),
  venue:      z.string().min(1, "Required"),
  status:     z.enum(["scheduled", "live", "finished"]),
});
type FixtureForm = z.infer<typeof fixtureSchema>;

const resultSchema = z.object({
  homeScore: z.number().min(0),
  awayScore: z.number().min(0),
});
type ResultForm = z.infer<typeof resultSchema>;

const STATUS_STYLES: Record<string, string> = {
  live:      "bg-red-100 text-red-600",
  finished:  "bg-gray-100 text-gray-600",
  scheduled: "bg-blue-50 text-blue-600",
};

// Per-player stat row state
interface PlayerRow {
  playerId:    string;
  name:        string;
  teamId:      string;
  goals:       number;
  assists:     number;
  yellowCards: number;
  redCards:    number;
  isMotm:      boolean;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function AdminFixturesPage() {
  const [fixtures,     setFixtures]     = useState<Fixture[]>([]);
  const [teams,        setTeams]        = useState<Team[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [filterGroup,  setFilterGroup]  = useState<GroupName | "ALL">("ALL");

  // Fixture dialog
  const [fixtureOpen, setFixtureOpen] = useState(false);
  const [editing,     setEditing]     = useState<Fixture | null>(null);
  const [saving,      setSaving]      = useState(false);

  // Result dialog
  const [resultOpen,   setResultOpen]   = useState(false);
  const [resultTarget, setResultTarget] = useState<Fixture | null>(null);

  // Stats dialog
  const [statsOpen,    setStatsOpen]    = useState(false);
  const [statsTarget,  setStatsTarget]  = useState<Fixture | null>(null);
  const [playerRows,   setPlayerRows]   = useState<PlayerRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsSaving,  setStatsSaving]  = useState(false);

  const fixtureForm = useForm<FixtureForm>({ resolver: zodResolver(fixtureSchema) });
  const resultForm  = useForm<ResultForm>({ resolver: zodResolver(resultSchema) });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [f, t] = await Promise.all([api.get("/api/fixtures"), api.get("/api/teams")]);
      setFixtures(f); setTeams(t);
    } catch { /* keep existing */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const teamMap = Object.fromEntries(teams.map((t: Team) => [t.id, t]));
  const filtered = filterGroup === "ALL" ? fixtures : fixtures.filter((f) => f.groupId === filterGroup);
  const sorted   = [...filtered].sort((a, b) => a.date.localeCompare(b.date));

  // ── Fixture CRUD ─────────────────────────────────────────────────────

  function openAdd() {
    setEditing(null);
    fixtureForm.reset({ homeTeamId: teams[0]?.id ?? "", awayTeamId: teams[1]?.id ?? "",
      groupId: "A", date: "2026-10-01", time: "18:00", venue: "KCL Arena, Dubai", status: "scheduled" });
    setFixtureOpen(true);
  }

  function openEdit(fixture: Fixture) {
    setEditing(fixture);
    fixtureForm.reset({ homeTeamId: fixture.homeTeamId, awayTeamId: fixture.awayTeamId,
      groupId: fixture.groupId, date: fixture.date, time: fixture.time,
      venue: fixture.venue, status: fixture.status });
    setFixtureOpen(true);
  }

  async function onFixtureSubmit(data: FixtureForm) {
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/api/fixtures/${editing.id}`, data);
      } else {
        await api.post("/api/fixtures", { ...data, id: `f${Date.now()}`, homeScore: null, awayScore: null, season: "2026" });
      }
      setFixtureOpen(false);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this fixture?")) return;
    try { await api.delete(`/api/fixtures/${id}`); await load(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : "Delete failed"); }
  }

  // ── Result entry ──────────────────────────────────────────────────────

  function openResult(fixture: Fixture) {
    setResultTarget(fixture);
    resultForm.reset({ homeScore: fixture.homeScore ?? 0, awayScore: fixture.awayScore ?? 0 });
    setResultOpen(true);
  }

  async function onResultSubmit(data: ResultForm) {
    if (!resultTarget) return;
    try {
      await api.patch(`/api/fixtures/${resultTarget.id}`, {
        homeScore: data.homeScore, awayScore: data.awayScore, status: "finished",
      });
      setResultOpen(false);
      await load();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Save failed");
    }
  }

  // ── Match stats entry ─────────────────────────────────────────────────

  async function openStats(fixture: Fixture) {
    setStatsTarget(fixture);
    setStatsLoading(true);
    setStatsOpen(true);

    try {
      const [homePlayers, awayPlayers, existing]: [Player[], Player[], MatchStats[]] =
        await Promise.all([
          api.get(`/api/players?teamId=${fixture.homeTeamId}`),
          api.get(`/api/players?teamId=${fixture.awayTeamId}`),
          api.get(`/api/match-stats?fixtureId=${fixture.id}`),
        ]);

      const existingMap = Object.fromEntries(existing.map((s) => [s.playerId, s]));

      const rows: PlayerRow[] = [...homePlayers, ...awayPlayers].map((p: Player) => ({
        playerId:    p.id,
        name:        p.name,
        teamId:      p.teamId,
        goals:       existingMap[p.id]?.goals       ?? 0,
        assists:     existingMap[p.id]?.assists      ?? 0,
        yellowCards: existingMap[p.id]?.yellowCards  ?? 0,
        redCards:    existingMap[p.id]?.redCards     ?? 0,
        isMotm:      existingMap[p.id]?.isMotm       ?? false,
      }));
      setPlayerRows(rows);
    } catch { /* keep empty */ }
    setStatsLoading(false);
  }

  function updateRow(playerId: string, field: keyof PlayerRow, value: number | boolean) {
    setPlayerRows((rows) =>
      rows.map((r) => {
        if (r.playerId !== playerId) return r;
        if (field === "isMotm") {
          // Only one MOTM at a time
          return { ...r, isMotm: value as boolean };
        }
        return { ...r, [field]: value };
      })
    );
  }

  function setMotm(playerId: string) {
    setPlayerRows((rows) => rows.map((r) => ({ ...r, isMotm: r.playerId === playerId })));
  }

  async function saveStats() {
    if (!statsTarget) return;
    setStatsSaving(true);
    try {
      const stats = playerRows.filter((r) =>
        r.goals > 0 || r.assists > 0 || r.yellowCards > 0 || r.redCards > 0 || r.isMotm
      );
      await api.post("/api/match-stats", { fixtureId: statsTarget.id, stats });
      setStatsOpen(false);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setStatsSaving(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl text-navy uppercase">Fixtures</h1>
          <p className="text-gray-400 text-sm">{loading ? "Loading…" : `${fixtures.length} fixtures`}</p>
        </div>
        <Button onClick={openAdd} className="bg-neon-lime text-navy hover:bg-neon-lime/90 gap-2">
          <Plus size={16} /> Add Fixture
        </Button>
      </div>

      {/* Group filter */}
      <div className="flex gap-2 mb-4">
        {(["ALL", "A", "B", "C", "D"] as const).map((g) => (
          <button key={g} onClick={() => setFilterGroup(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterGroup === g ? "bg-navy text-neon-lime border-navy" : "bg-transparent text-gray-500 border-gray-300 hover:border-navy"
            }`}>
            {g === "ALL" ? "All" : `Group ${g}`}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-surface-2 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface border-b border-surface-2">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Match</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">Grp</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">Score</th>
              <th className="text-center px-3 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((fixture) => {
              const home = teamMap[fixture.homeTeamId];
              const away = teamMap[fixture.awayTeamId];
              return (
                <tr key={fixture.id} className="border-b border-surface-2 hover:bg-surface/50">
                  <td className="px-4 py-2.5 text-gray-500 text-xs whitespace-nowrap">
                    {fixture.date}<br /><span className="text-gray-400">{fixture.time}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="font-medium text-navy">{home?.shortName ?? "?"}</span>
                      <span className="text-gray-300">vs</span>
                      <span className="font-medium text-navy">{away?.shortName ?? "?"}</span>
                    </div>
                    <p className="text-gray-400 text-[10px] mt-0.5">{fixture.venue}</p>
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs text-gray-500">{fixture.groupId}</td>
                  <td className="px-3 py-2.5 text-center font-medium text-navy text-xs">
                    {fixture.homeScore !== null ? `${fixture.homeScore} – ${fixture.awayScore}` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", STATUS_STYLES[fixture.status])}>
                      {fixture.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openResult(fixture)} title="Enter result"
                        className="p-1.5 rounded-lg hover:bg-neon-lime/10 text-gray-400 hover:text-neon-lime transition-colors">
                        <ClipboardEdit size={13} />
                      </button>
                      <button onClick={() => openStats(fixture)} title="Enter match stats"
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
                        <BarChart2 size={13} />
                      </button>
                      <button onClick={() => openEdit(fixture)}
                        className="p-1.5 rounded-lg hover:bg-surface text-gray-400 hover:text-navy transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(fixture.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Add/Edit fixture dialog ──────────────────────────────────────── */}
      <Dialog open={fixtureOpen} onOpenChange={setFixtureOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Fixture" : "Add Fixture"}</DialogTitle></DialogHeader>
          <form onSubmit={fixtureForm.handleSubmit(onFixtureSubmit)} className="flex flex-col gap-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              {(["homeTeamId", "awayTeamId"] as const).map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <Label className="text-xs text-gray-500">{field === "homeTeamId" ? "Home Team" : "Away Team"}</Label>
                  <Controller control={fixtureForm.control} name={field} render={({ field: f }) => (
                    <select value={f.value} onChange={f.onChange}
                      className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm">
                      {teams.map((t: Team) => <option key={t.id} value={t.id}>{t.shortName}</option>)}
                    </select>
                  )} />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Group</Label>
                <Controller control={fixtureForm.control} name="groupId" render={({ field }) => (
                  <select value={field.value} onChange={field.onChange}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm">
                    {(["A","B","C","D"] as const).map((g) => <option key={g} value={g}>Group {g}</option>)}
                  </select>
                )} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Status</Label>
                <Controller control={fixtureForm.control} name="status" render={({ field }) => (
                  <select value={field.value} onChange={field.onChange}
                    className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm">
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                )} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Date</Label>
                <Input type="date" {...fixtureForm.register("date")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-gray-500">Time</Label>
                <Input type="time" {...fixtureForm.register("time")} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Venue</Label>
              <Input {...fixtureForm.register("venue")} placeholder="KCL Arena, Dubai" />
            </div>
            <DialogFooter className="border-0 bg-transparent p-0 mt-2">
              <Button type="submit" disabled={saving} className="bg-neon-lime text-navy hover:bg-neon-lime/90 disabled:opacity-60">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Fixture"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Result entry dialog ──────────────────────────────────────────── */}
      <Dialog open={resultOpen} onOpenChange={setResultOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader><DialogTitle>Enter Result</DialogTitle></DialogHeader>
          {resultTarget && (
            <p className="text-center text-sm text-gray-500 mb-2">
              <span className="font-semibold text-navy">{teamMap[resultTarget.homeTeamId]?.shortName}</span>
              {" vs "}
              <span className="font-semibold text-navy">{teamMap[resultTarget.awayTeamId]?.shortName}</span>
            </p>
          )}
          <form onSubmit={resultForm.handleSubmit(onResultSubmit)} className="flex flex-col gap-4 mt-1">
            <div className="flex items-center gap-4 justify-center">
              <div className="flex flex-col items-center gap-1.5">
                <Label className="text-xs text-gray-500">{teamMap[resultTarget?.homeTeamId ?? ""]?.shortName ?? "Home"}</Label>
                <Input type="number" {...resultForm.register("homeScore", { valueAsNumber: true })}
                  className="w-20 text-center font-heading text-xl" min={0} />
              </div>
              <span className="font-heading text-2xl text-gray-300 mt-4">–</span>
              <div className="flex flex-col items-center gap-1.5">
                <Label className="text-xs text-gray-500">{teamMap[resultTarget?.awayTeamId ?? ""]?.shortName ?? "Away"}</Label>
                <Input type="number" {...resultForm.register("awayScore", { valueAsNumber: true })}
                  className="w-20 text-center font-heading text-xl" min={0} />
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">Status will be set to &quot;finished&quot;</p>
            <DialogFooter className="border-0 bg-transparent p-0">
              <Button type="submit" className="w-full bg-neon-lime text-navy hover:bg-neon-lime/90">Save Result</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Match stats dialog ───────────────────────────────────────────── */}
      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart2 size={16} />
              Match Stats —{" "}
              {statsTarget && `${teamMap[statsTarget.homeTeamId]?.shortName} vs ${teamMap[statsTarget.awayTeamId]?.shortName}`}
            </DialogTitle>
          </DialogHeader>

          {statsLoading ? (
            <p className="text-center text-gray-400 py-8">Loading players…</p>
          ) : (
            <div className="mt-2">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center px-2 pb-2 border-b border-gray-100">
                <p className="text-xs text-gray-400 font-medium">Player</p>
                <p className="text-xs text-gray-400 font-medium w-12 text-center">Goals</p>
                <p className="text-xs text-gray-400 font-medium w-12 text-center">Ast</p>
                <p className="text-xs text-gray-400 font-medium w-10 text-center">YC</p>
                <p className="text-xs text-gray-400 font-medium w-10 text-center">RC</p>
                <p className="text-xs text-gray-400 font-medium w-14 text-center">MOTM</p>
              </div>

              {/* Home team */}
              {statsTarget && (
                <>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pt-3 pb-1">
                    {teamMap[statsTarget.homeTeamId]?.shortName}
                  </p>
                  {playerRows.filter((r) => r.teamId === statsTarget.homeTeamId).map((row) => (
                    <PlayerStatRow key={row.playerId} row={row} onUpdate={updateRow} onMotm={setMotm} />
                  ))}

                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-2 pt-4 pb-1">
                    {teamMap[statsTarget.awayTeamId]?.shortName}
                  </p>
                  {playerRows.filter((r) => r.teamId === statsTarget.awayTeamId).map((row) => (
                    <PlayerStatRow key={row.playerId} row={row} onUpdate={updateRow} onMotm={setMotm} />
                  ))}
                </>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button onClick={saveStats} disabled={statsSaving}
                  className="w-full bg-neon-lime text-navy hover:bg-neon-lime/90 disabled:opacity-60">
                  {statsSaving ? "Saving…" : "Save Match Stats"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Player stat row sub-component ─────────────────────────────────────────

function StatCounter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1 justify-center">
      <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
        className="w-5 h-5 rounded bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 flex items-center justify-center">−</button>
      <span className="w-5 text-center text-sm font-medium text-navy">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)}
        className="w-5 h-5 rounded bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 flex items-center justify-center">+</button>
    </div>
  );
}

function PlayerStatRow({
  row, onUpdate, onMotm,
}: {
  row: PlayerRow;
  onUpdate: (id: string, field: keyof PlayerRow, value: number | boolean) => void;
  onMotm: (id: string) => void;
}) {
  return (
    <div className={cn(
      "grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center px-2 py-1.5 rounded-lg",
      row.isMotm && "bg-yellow-50"
    )}>
      <p className="text-sm text-navy truncate">{row.name}</p>
      <div className="w-12"><StatCounter value={row.goals}       onChange={(v) => onUpdate(row.playerId, "goals",       v)} /></div>
      <div className="w-12"><StatCounter value={row.assists}     onChange={(v) => onUpdate(row.playerId, "assists",     v)} /></div>
      <div className="w-10"><StatCounter value={row.yellowCards} onChange={(v) => onUpdate(row.playerId, "yellowCards", v)} /></div>
      <div className="w-10"><StatCounter value={row.redCards}    onChange={(v) => onUpdate(row.playerId, "redCards",    v)} /></div>
      <div className="w-14 flex justify-center">
        <button type="button" onClick={() => onMotm(row.playerId)}
          className={cn("p-1.5 rounded-full transition-colors",
            row.isMotm ? "text-yellow-500 bg-yellow-100" : "text-gray-300 hover:text-yellow-400")}>
          <Star size={14} fill={row.isMotm ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
