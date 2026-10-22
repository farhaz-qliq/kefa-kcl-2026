import type { Banner } from "@/types";

export const MOCK_BANNERS: Banner[] = [
  {
    id: "b1",
    title: "PICK YOUR\nDREAM TEAM",
    subtitle: "7S FOOTBALL FANTASY LEAGUE",
    ctaLabel: "BUILD YOUR TEAM",
    ctaHref: "/fantasy",
    imageUrl: "/la-perfume-fantasy.png",
    season: "2026",
  },
  {
    id: "b2",
    title: "GLORY\nAWAITS",
    subtitle: "ARKEY KEFA CHAMPIONS LEAGUE 2026 · SEASON 6",
    ctaLabel: "VIEW FIXTURES",
    ctaHref: "/fixtures",
    imageUrl: "",
    season: "2026",
  },
  {
    id: "b3",
    title: "GROUP STAGE\nUNDERWAY",
    subtitle: "24 MATCHES · 4 GROUPS · LIVE SCORES",
    ctaLabel: "POINTS TABLE",
    ctaHref: "/points-table",
    imageUrl: "",
    season: "2026",
  },
];
