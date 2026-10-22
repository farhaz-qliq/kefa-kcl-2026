"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Shield, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Banner } from "@/types";

interface BannerSliderProps {
  banners: Banner[];
}

const SLIDE_CONFIG = [
  {
    rightGrad: "from-emerald-800 via-green-700 to-lime-600",
    accent: "#C7FF00",
    bigStat: "16",
    bigLabel: "TEAMS",
    bigEmoji: "🏆",
    features: [
      { Icon: Shield, text: "4 GROUPS · SEASON 6" },
      { Icon: Trophy, text: "ARKEY KCL 2026" },
    ],
  },
  {
    rightGrad: "from-cyan-900 via-teal-800 to-blue-700",
    accent: "#00D9FF",
    bigStat: "24",
    bigLabel: "MATCHES",
    bigEmoji: "⚽",
    features: [
      { Icon: Shield, text: "LIVE SCORES" },
      { Icon: Users, text: "REAL-TIME STANDINGS" },
      { Icon: Trophy, text: "GROUP STAGE RESULTS" },
    ],
  },
];

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);


  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3 px-4">
          {banners.map((banner, i) => {
            const isActive = i === selectedIndex;
            const cfgIndex = i === 0 ? 0 : (i - 1) % SLIDE_CONFIG.length;
            const cfg = SLIDE_CONFIG[cfgIndex];
            const [line1, line2] = banner.title.split("\n");

            return (
              <div
                key={banner.id}
                className="flex-[0_0_83%] min-w-0 transition-opacity duration-300"
                style={{ opacity: isActive ? 1 : 0.55 }}
              >
                <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ height: "195px" }}>
                  {banner.imageUrl ? (
                    /* ── Real image slide ── */
                    <div className="relative w-full h-full">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title.replace("\n", " ")}
                        fill
                        className="object-cover object-center"
                        priority={i === 0}
                      />
                      {/* Subtle bottom gradient for dot visibility */}
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  ) : (
                    /* ── Styled content slide ── */
                    <div className="relative w-full h-full bg-[#080d18] overflow-hidden">
                      {/* Purple left glow */}
                      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-purple-900/50 to-transparent" />

                      {/* Right vivid panel */}
                      <div
                        className={`absolute right-0 top-0 bottom-0 w-[44%] bg-gradient-to-br ${cfg.rightGrad}`}
                        style={{ clipPath: "polygon(16% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
                      >
                        {/* Lightning bolt watermark */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-15 text-white">
                          <svg viewBox="0 0 100 200" className="h-full w-auto" fill="currentColor">
                            <polygon points="60,0 20,110 55,110 40,200 80,80 48,80" />
                          </svg>
                        </div>
                        {/* Stat */}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-4 pt-8">
                          <span className="text-3xl mb-0.5">{cfg.bigEmoji}</span>
                          <span className="font-heading text-5xl text-white leading-none">{cfg.bigStat}</span>
                          <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">{cfg.bigLabel}</span>
                        </div>
                      </div>

                      {/* Left content */}
                      <div className="relative z-20 flex flex-col justify-between px-4 pt-3 pb-3 h-full" style={{ width: "62%" }}>
                        {/* Branding */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-1 bg-white/10 rounded px-1.5 py-0.5">
                            <span className="font-heading text-white text-[10px]">ARKEY</span>
                            <span className="font-heading text-[#C7FF00] text-[10px]">KCL</span>
                            <span className="font-heading text-white text-[10px]">2026</span>
                          </div>
                          <div className="flex flex-col leading-none">
                            <span className="text-white/40 text-[7px] uppercase tracking-wide">Powered by</span>
                            <span className="text-white/70 text-[8px] font-semibold uppercase">La Perfume</span>
                          </div>
                        </div>

                        {/* Label */}
                        <p className="text-[#00D9FF] text-[8px] font-bold tracking-[0.15em] uppercase">
                          {banner.subtitle}
                        </p>

                        {/* Headline */}
                        <div className="leading-none">
                          <p className="font-heading text-[26px] text-white uppercase leading-none">{line1}</p>
                          <p className="font-heading text-[26px] uppercase leading-none"
                            style={{ color: cfg.accent, textShadow: `0 0 16px ${cfg.accent}80` }}>
                            {line2}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="flex flex-col gap-1">
                          {cfg.features.map(({ Icon, text }, fi) => (
                            <div key={fi} className="flex items-center gap-1.5">
                              <Icon size={9} className="text-white/40 flex-shrink-0" />
                              <span className="text-white text-[8px] font-semibold uppercase tracking-wide">{text}</span>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <Link
                          href={banner.ctaHref}
                          className="self-start flex items-center gap-1 px-3 py-1.5 rounded-full font-heading text-[10px] uppercase tracking-wider hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: cfg.accent, color: "#080d18" }}
                        >
                          {banner.ctaLabel} <ChevronRight size={10} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3 mb-1">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "rounded-full transition-all",
              i === selectedIndex ? "w-5 h-1.5 bg-[#C7FF00]" : "w-1.5 h-1.5 bg-gray-400/50"
            )}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
