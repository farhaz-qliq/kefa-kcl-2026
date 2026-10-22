import Link from "next/link";
import Image from "next/image";
import type { NewsItem } from "@/types";
import { Calendar, ChevronRight } from "lucide-react";

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <Link href={`/news/${item.id}`} className="flex gap-3 p-3 bg-white rounded-xl border border-surface-2 hover:border-[#C7FF00]/60 active:scale-[0.98] transition-all">
      <div className="w-20 h-20 rounded-lg bg-navy flex-shrink-0 flex items-center justify-center overflow-hidden relative">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
        ) : (
          <span className="text-3xl">⚽</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-navy font-semibold text-sm leading-tight line-clamp-2">{item.title}</h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-snug">{item.excerpt}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <Calendar size={10} />
            <span>{formatDate(item.publishedAt)}</span>
          </div>
          <ChevronRight size={12} className="text-gray-300" />
        </div>
      </div>
    </Link>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
