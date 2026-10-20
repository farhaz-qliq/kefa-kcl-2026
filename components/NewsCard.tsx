import type { NewsItem } from "@/types";
import { Calendar } from "lucide-react";

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <article className="flex gap-3 p-3 bg-white rounded-xl border border-surface-2 hover:border-neon-lime/40 transition-colors">
      {/* Image placeholder */}
      <div className="w-20 h-20 rounded-lg bg-navy-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
        <span className="text-3xl">⚽</span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-navy font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-snug">{item.excerpt}</p>
        <div className="flex items-center gap-1 mt-2 text-gray-400 text-[10px]">
          <Calendar size={10} />
          <span>{formatDate(item.publishedAt)}</span>
        </div>
      </div>
    </article>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
