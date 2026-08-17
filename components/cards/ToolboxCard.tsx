import { toolboxItems } from "@/lib/mock-data";
import TeaserCardBody from "@/components/cards/TeaserCardBody";
import Link from "next/link";

export default function ToolboxCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
      {toolboxItems.map((t) => (
        <Link key={t.title} href={t.href} className="editorial-link-card">
          <TeaserCardBody title={t.title} desc={t.desc} />
        </Link>
      ))}
    </div>
  );
}
