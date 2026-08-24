import { toolboxItems } from "@/lib/mock-data";
import TeaserCardBody from "@/components/cards/TeaserCardBody";
import Link from "next/link";

export default function ToolboxCard() {
  return (
    <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
      {toolboxItems.map((t) => (
        <li key={t.title}>
          <Link href={t.href} className="editorial-link-card min-h-11 lg:min-h-0">
            <TeaserCardBody title={t.title} desc={t.desc} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
