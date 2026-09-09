"use client";

import { usePathname } from "next/navigation";
import ArrowLink from "@/components/controls/ArrowLink";

const DIRECTORY = "/responsible-gambling/help-directory";
const HUB = "/responsible-gambling";

/** The banner renders on every route, so on the help directory its CTA was a
 * dead end pointing at the current page. There it offers the RG hub instead. */
export default function HelpBannerCta() {
  const onDirectory = usePathname() === DIRECTORY;

  return (
    <ArrowLink href={onDirectory ? HUB : DIRECTORY} className="btn-safety gap-1 group">
      {onDirectory ? "Responsible gambling" : "Get Help"}
    </ArrowLink>
  );
}
