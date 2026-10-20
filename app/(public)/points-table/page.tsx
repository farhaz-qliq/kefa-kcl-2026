import PageHeader from "@/components/PageHeader";
import StandingsTable from "@/components/StandingsTable";
import { getStandings } from "@/lib/data";
import type { GroupName } from "@/types";

const GROUP_NAMES: GroupName[] = ["A", "B", "C", "D"];

export default async function PointsTablePage() {
  const standings = await getStandings();

  return (
    <div>
      <PageHeader title="Points Table" subtitle="Group stage standings" />
      <div className="px-4 py-5 flex flex-col gap-4">
        {GROUP_NAMES.map((gid) => (
          <StandingsTable key={gid} groupName={`Group ${gid}`} rows={standings[gid] ?? []} />
        ))}
      </div>
    </div>
  );
}
