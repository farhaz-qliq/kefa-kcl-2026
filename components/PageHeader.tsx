interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="hero-gradient px-4 pt-10 pb-6">
      <p className="text-electric-cyan text-[10px] font-semibold tracking-[0.25em] uppercase mb-1">
        KEFA KCL 2026
      </p>
      <h1 className="font-heading text-3xl text-white uppercase leading-none">{title}</h1>
      {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}
