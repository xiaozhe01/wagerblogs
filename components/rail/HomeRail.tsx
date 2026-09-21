import TrendingCard from "./TrendingCard";

// TODO(cms): EditorsCard — an editor's pick is a curated claim, and nothing in
// the schema records one. See MIGRATION.md "Editor's pick surfacing".
export default function HomeRail({
  trending,
}: {
  trending: { href: string; label: string; key: string }[];
}) {
  return <TrendingCard items={trending} />;
}
