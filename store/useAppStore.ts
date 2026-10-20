"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Team, Player, Fixture, Banner, NewsItem } from "@/types";
import { MOCK_TEAMS, MOCK_PLAYERS, MOCK_FIXTURES, MOCK_BANNERS, MOCK_NEWS } from "@/mocks";

interface AppState {
  teams: Team[];
  players: Player[];
  fixtures: Fixture[];
  banners: Banner[];
  news: NewsItem[];

  // Teams
  addTeam: (team: Team) => void;
  updateTeam: (id: string, patch: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Players
  addPlayer: (player: Player) => void;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Fixtures
  addFixture: (fixture: Fixture) => void;
  updateFixture: (id: string, patch: Partial<Fixture>) => void;
  deleteFixture: (id: string) => void;
  enterResult: (id: string, homeScore: number, awayScore: number) => void;

  // Banners
  addBanner: (banner: Banner) => void;
  updateBanner: (id: string, patch: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  // News
  addNews: (item: NewsItem) => void;
  updateNews: (id: string, patch: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      teams: MOCK_TEAMS,
      players: MOCK_PLAYERS,
      fixtures: MOCK_FIXTURES,
      banners: MOCK_BANNERS,
      news: MOCK_NEWS,

      addTeam: (team) => set((s) => ({ teams: [...s.teams, team] })),
      updateTeam: (id, patch) =>
        set((s) => ({ teams: s.teams.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      deleteTeam: (id) => set((s) => ({ teams: s.teams.filter((t) => t.id !== id) })),

      addPlayer: (player) => set((s) => ({ players: [...s.players, player] })),
      updatePlayer: (id, patch) =>
        set((s) => ({ players: s.players.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deletePlayer: (id) => set((s) => ({ players: s.players.filter((p) => p.id !== id) })),

      addFixture: (fixture) => set((s) => ({ fixtures: [...s.fixtures, fixture] })),
      updateFixture: (id, patch) =>
        set((s) => ({
          fixtures: s.fixtures.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),
      deleteFixture: (id) => set((s) => ({ fixtures: s.fixtures.filter((f) => f.id !== id) })),
      enterResult: (id, homeScore, awayScore) =>
        set((s) => ({
          fixtures: s.fixtures.map((f) =>
            f.id === id ? { ...f, homeScore, awayScore, status: "finished" } : f
          ),
        })),

      addBanner: (banner) => set((s) => ({ banners: [...s.banners, banner] })),
      updateBanner: (id, patch) =>
        set((s) => ({ banners: s.banners.map((b) => (b.id === id ? { ...b, ...patch } : b)) })),
      deleteBanner: (id) => set((s) => ({ banners: s.banners.filter((b) => b.id !== id) })),

      addNews: (item) => set((s) => ({ news: [...s.news, item] })),
      updateNews: (id, patch) =>
        set((s) => ({ news: s.news.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      deleteNews: (id) => set((s) => ({ news: s.news.filter((n) => n.id !== id) })),
    }),
    {
      name: "kefa-kcl-2026",
    }
  )
);
