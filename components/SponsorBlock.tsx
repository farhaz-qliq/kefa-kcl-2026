export default function SponsorBlock() {
  return (
    <div className="px-4 pt-6 pb-8">
      <div className="relative rounded-2xl overflow-hidden bg-[#080d18] px-5 py-6 text-center">
        {/* Soft radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(199,255,0,0.07) 0%, transparent 70%)",
          }}
        />

        <p className="relative z-10 text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] mb-1">
          Presented by
        </p>

        <p
          className="relative z-10 font-heading text-[32px] uppercase leading-none mb-1"
          style={{ color: "#C7FF00", textShadow: "0 0 28px #C7FF0060, 0 0 60px #C7FF0030" }}
        >
          La Perfume
        </p>

        <p className="relative z-10 text-gray-600 text-[9px] uppercase tracking-[0.25em] mt-2">
          Official Sponsor · KEFA KCL 2026 · Season 6
        </p>
      </div>
    </div>
  );
}
