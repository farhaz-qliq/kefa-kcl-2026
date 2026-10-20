"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FantasyState, FantasySquad } from "@/types/fantasy";

export const useFantasyStore = create<FantasyState>()(
  persist(
    (set) => ({
      user: null,
      squad: null,
      gwHistory: [],
      isAuthenticated: false,
      onboardingComplete: false,
      freeTransfers: 1,

      login: (email) =>
        set((s) => ({
          user: s.user ? { ...s.user, email } : { email, name: "", teamName: "", avatarColor: "#C7FF00" },
          isAuthenticated: true,
        })),

      setProfile: (name, avatarColor) =>
        set((s) => ({
          user: s.user ? { ...s.user, name, avatarColor } : { email: "", name, teamName: "", avatarColor },
        })),

      setTeamName: (teamName) =>
        set((s) => ({
          user: s.user ? { ...s.user, teamName } : { email: "", name: "", teamName, avatarColor: "#C7FF00" },
        })),

      setSquad: (squad: FantasySquad) =>
        set({ squad, onboardingComplete: true }),

      makeTransfer: (outId, inId) =>
        set((s) => {
          if (!s.squad) return s;
          const playerIds     = s.squad.playerIds.map((id) => (id === outId ? inId : id));
          const captainId     = s.squad.captainId === outId     ? inId : s.squad.captainId;
          const viceCaptainId = s.squad.viceCaptainId === outId ? inId : s.squad.viceCaptainId;
          return {
            squad: { playerIds, captainId, viceCaptainId },
            freeTransfers: Math.max(0, s.freeTransfers - 1),
          };
        }),

      logout: () =>
        set({ user: null, squad: null, gwHistory: [], isAuthenticated: false, onboardingComplete: false, freeTransfers: 1 }),

      syncUser: (data) =>
        set({
          user: { email: data.email, name: data.name, teamName: data.teamName, avatarColor: data.avatarColor },
          isAuthenticated: true,
          onboardingComplete: data.onboardingComplete,
          freeTransfers: data.freeTransfers,
          squad: data.squad ?? null,
        }),
    }),
    { name: "kefa-fantasy" }
  )
);
