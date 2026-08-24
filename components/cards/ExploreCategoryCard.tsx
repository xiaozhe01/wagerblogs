import { categories } from "@/lib/site-data";
import TeaserCardBody from "@/components/cards/TeaserCardBody";
import Link from "next/link";

export default function ExploreCategoryCard() {
  return (
    <>
      {/* TODO(cms): category list must render from the CMS taxonomy — never a hardcoded array. */}
      <ul
        role="list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3"
      >
        {categories.map((c) => (
          <li key={c.name}>
            <Link href="/categories/sample" className="editorial-link-card min-h-11 lg:min-h-0">
              <TeaserCardBody title={c.name} desc={c.desc} />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
