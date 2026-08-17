import PrimaryDomainLink from "@/components/PrimaryDomainLink";
import type { AtAGlanceItem, PrimaryDomainLinkData } from "@/lib/types";

type AtAGlanceCardProps = {
  items: AtAGlanceItem[];
  primaryDomainLink?: PrimaryDomainLinkData;
};

// "At a glance" rail card — byte-identical between the two reviews
// templates (DRY-21), differing only in which AtAGlanceItem[] is passed in.
export default function AtAGlanceCard({ items, primaryDomainLink }: AtAGlanceCardProps) {
  return (
    <div className="card">
      <div className="font-bold text-sm text-text-primary mb-2.5">At a glance</div>
      {items.map((a) => (
        <div
          key={a.label}
          className="flex justify-between gap-2.5 text-xs text-text-muted py-1.5 border-b border-border-hairline-alt"
        >
          <span>{a.label}</span>
          <span className="text-text-strong-secondary font-semibold text-right">{a.value}</span>
        </div>
      ))}
      <PrimaryDomainLink linkTier="tier3" primaryDomainLink={primaryDomainLink} className="mt-3" />
      <div className="text-2xs text-text-subtle leading-relaxed mt-2">
        21+. T&amp;Cs apply. [terms placeholder]
      </div>
    </div>
  );
}
