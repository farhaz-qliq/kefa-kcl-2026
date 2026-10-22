import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { getNewsItem } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getNewsItem(id);
  if (!item) notFound();

  const date = new Date(item.publishedAt).toLocaleDateString("en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Hero banner */}
      <div className="w-full h-48 bg-navy flex items-center justify-center flex-shrink-0">
        <span className="text-6xl">⚽</span>
      </div>

      <div className="px-5 pt-5 pb-10">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-4">
          <ArrowLeft size={13} />
          Back
        </Link>

        {/* Date */}
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-3">
          <Calendar size={11} />
          <span>{date}</span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-2xl text-navy uppercase leading-tight mb-4">{item.title}</h1>

        {/* Divider */}
        <div className="w-10 h-1 rounded-full bg-[#C7FF00] mb-5" />

        {/* Body / excerpt */}
        {item.body ? (
          <div className="space-y-4">
            {item.body.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-600 text-[14px] leading-relaxed">{para}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-[14px] leading-relaxed">{item.excerpt}</p>
        )}
      </div>
    </div>
  );
}
