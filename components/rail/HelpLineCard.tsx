import ArrowLink from "@/components/ui/ArrowLink";
import { railCtaOnDarkClassName } from "@/components/rail/InfoCard";
import { helplineText } from "@/lib/mock-data";

export default function HelpLineCard() {
  return (
    <section className="card-inverted" aria-labelledby="rail-play-responsibly">
      <h2 id="rail-play-responsibly" className="heading text-sm text-text-on-inverted mb-2.5">
        Play Responsibly
      </h2>
      <p className="text-xs font-medium text-text-on-inverted-muted leading-loose">
        {helplineText}
      </p>
      <ArrowLink href="/responsible-gambling/help-directory" className={railCtaOnDarkClassName}>
        Find help near you
      </ArrowLink>
    </section>
  );
}
