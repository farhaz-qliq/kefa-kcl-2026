"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function FantasyPlayerBack() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="absolute top-5 left-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center z-10"
    >
      <ChevronLeft size={18} className="text-white" />
    </button>
  );
}
