import ArrowLink from "@/components/ui/ArrowLink";
import { helplineText } from "@/lib/mock-data";

export default function HelpLineCard() {
  return (
    <div className="card-dark">
      <div className="font-bold text-sm mb-1.5">Play Responsibly</div>
      <div className="text-xs text-text-on-dark-muted leading-loose mb-2.5">{helplineText}</div>
      <ArrowLink
        href="/responsible-gambling/help-directory"
        className="inline-flex items-center gap-1 text-sm text-text-on-dark font-semibold group w-fit"
      >
        Find help near you
      </ArrowLink>
    </div>
  );
}
