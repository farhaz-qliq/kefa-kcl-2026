import PageHeader from "@/components/PageHeader";
import FixturesClient from "./FixturesClient";
import { getFixtures, getTeams } from "@/lib/data";

export default async function FixturesPage() {
  const [fixtures, teams] = await Promise.all([getFixtures(), getTeams()]);
  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

  return (
    <div>
      <PageHeader title="Fixtures" subtitle="24 matches · 4 groups" />
      <FixturesClient fixtures={fixtures} teamMap={teamMap} />
    </div>
  );
}
