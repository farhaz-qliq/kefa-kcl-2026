import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080d18] flex flex-col items-center justify-center px-6 text-center">
      {/* Branding */}
      <p className="font-heading text-[#C7FF00] text-[11px] tracking-[0.3em] uppercase mb-6">
        KEFA KCL 2026
      </p>

      {/* 404 */}
      <p
        className="font-heading leading-none select-none"
        style={{ fontSize: 120, color: "rgba(199,255,0,0.08)" }}
      >
        404
      </p>

      {/* Message */}
      <div className="-mt-6 mb-8">
        <h1 className="font-heading text-white text-[28px] uppercase leading-none mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 text-[13px] leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist<br />or has been moved.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/"
        className="font-heading text-[12px] uppercase tracking-wider px-6 py-3.5 rounded-xl transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#C7FF00", color: "#080d18" }}
      >
        Back to Home
      </Link>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#C7FF00]/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#C7FF00]/5" />
      </div>
    </div>
  );
}
