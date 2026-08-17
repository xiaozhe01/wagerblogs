import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import type { LinkTier, PrimaryDomainLinkData } from "@/lib/types";

type PrimaryDomainLinkProps = {
  linkTier: LinkTier;
  primaryDomainLink?: PrimaryDomainLinkData;
  className?: string;
};

const relMap: Record<PrimaryDomainLinkData["relAttribute"], string> = {
  dofollow: "noopener",
  sponsored: "sponsored noopener",
  nofollow: "nofollow noopener",
};

export default function PrimaryDomainLink({
  linkTier,
  primaryDomainLink,
  className,
}: PrimaryDomainLinkProps) {
  if (linkTier === "tier1" || !primaryDomainLink) return null;

  const { anchorText, url, relAttribute } = primaryDomainLink;
  return (
    <Link
      href={url}
      rel={relMap[relAttribute]}
      target="_blank"
      className={`btn-primary gap-1.5${className ? ` ${className}` : ""}`}
      data-link-tier={linkTier}
    >
      {anchorText}
      <SquareArrowOutUpRight size={16} aria-hidden="true" />
    </Link>
  );
}
