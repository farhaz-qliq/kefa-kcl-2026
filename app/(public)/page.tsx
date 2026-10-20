import BannerSlider from "@/components/BannerSlider";
import FantasyTeaser from "@/components/FantasyTeaser";
import MatchHighlight from "@/components/MatchHighlight";
import NewsCard from "@/components/NewsCard";
import SponsorBlock from "@/components/SponsorBlock";
import { getBanners, getFixtures, getNews, getTeams } from "@/lib/data";

export default async function HomePage() {
  const [banners, fixtures, teams, news] = await Promise.all([
    getBanners(),
    getFixtures(),
    getTeams(),
    getNews(),
  ]);

  return (
    <div className="pb-2">
      {/* 1 — Hero Slider */}
      <div className="pt-3">
        <BannerSlider banners={banners} />
      </div>

      {/* 2 — Fantasy Teaser Card */}
      <FantasyTeaser />

      {/* 3 — Live / Next Match */}
      <MatchHighlight fixtures={fixtures} teams={teams} />

      {/* 4 — Latest Updates */}
      <div className="px-4 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-5 rounded-full bg-[#C7FF00]" />
          <h2 className="font-heading text-xl text-navy uppercase tracking-wide">Latest Updates</h2>
        </div>
        <div className="flex flex-col gap-3">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* 5 — Sponsor Block */}
      <SponsorBlock />
    </div>
  );
}
