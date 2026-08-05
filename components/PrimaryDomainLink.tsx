import Link from "next/link";
import type { LinkTier, PrimaryDomainLinkData } from "@/lib/types";

type PrimaryDomainLinkProps = {
  linkTier: LinkTier;
  primaryDomainLink?: PrimaryDomainLinkData;
};

const relMap: Record<PrimaryDomainLinkData["relAttribute"], string> = {
  dofollow: "noopener",
  sponsored: "sponsored noopener",
  nofollow: "nofollow noopener",
};

export default function PrimaryDomainLink({ linkTier, primaryDomainLink }: PrimaryDomainLinkProps) {
  if (linkTier === "tier1" || !primaryDomainLink) return null;

  const { anchorText, url, relAttribute } = primaryDomainLink;
  return (
    <Link
      href={url}
      rel={relMap[relAttribute]}
      target="_blank"
      className="btn-primary"
      data-link-tier={linkTier}
    >
      {anchorText}
    </Link>
  );
}
