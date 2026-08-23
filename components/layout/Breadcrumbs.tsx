import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd, breadcrumbJsonLd } from "@/lib/schema";

type BreadcrumbItemData = {
  label: string;
  /** Omit for the trailing/current-page crumb, which renders as plain text. */
  href?: string;
};

type BreadcrumbsProps = {
  /** Crumbs after "Home" — "Home" (href="/") is prepended automatically. */
  items: BreadcrumbItemData[];
};

// Breadcrumb nav duplicated verbatim across 7 route files (DRY-10), rebuilt
// on components/ui/breadcrumb.tsx and paired with BreadcrumbList JSON-LD
// per docs/00-six-layer-map.md Layer 4 ("standard on every route").
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems: BreadcrumbItemData[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {allItems.map((item, i) => (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink render={<Link href={item.href} />}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <JsonLd data={breadcrumbJsonLd(allItems)} />
    </>
  );
}
