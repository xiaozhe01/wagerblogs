import Link from "next/link";
import BylineCard from "./BylineCard";

export default function WriterQuoteCard() {
  return (
    /* TODO(cms): EditorialByline — requires a real Person record (photo, fullName,
            credential, authorUrl, quote). Sample fixture shown for layout reference only;
            omit this section entirely until a real author is connected. */
    <BylineCard as="figure" wrapperClassName="card flex gap-4 items-center">
      <blockquote className="text-sm text-text-strong-secondary italic leading-relaxed mb-2">
        <p>
          &ldquo;Every operator on this list was funded, wagered on, and withdrawn from by our team
          before it was scored.&rdquo;
        </p>
      </blockquote>
      <p className="text-sm text-text-meta font-semibold mb-1.5">
        — {/* not-italic: preflight doesn't reset <cite>'s UA italic. */}
        <cite className="not-italic">
          <Link
            href="/authors/jane-placeholder"
            className="text-text-primary no-underline hover:underline underline-offset-2"
          >
            Jane Placeholder
          </Link>
        </cite>{" "}
        · Example Analyst, Example Credential Body
      </p>
    </BylineCard>
  );
}
