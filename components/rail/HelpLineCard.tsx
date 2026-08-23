import ArrowLink from "@/components/ui/ArrowLink";
import { railCtaOnDarkClassName } from "@/components/rail/InfoCard";
import { helplineText } from "@/lib/mock-data";

export default function HelpLineCard() {
  return (
    <div className="card-dark">
      <div className="font-bold text-sm mb-2.5">Play Responsibly</div>
      <div className="text-xs text-text-on-dark-muted leading-loose">{helplineText}</div>
      <ArrowLink href="/responsible-gambling/help-directory" className={railCtaOnDarkClassName}>
        Find help near you
      </ArrowLink>
    </div>
  );
}
