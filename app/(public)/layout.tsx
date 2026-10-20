import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex justify-center bg-surface"
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      <div className="w-full max-w-[480px] h-full flex flex-col bg-white shadow-xl">
        <TopNav />
        <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
