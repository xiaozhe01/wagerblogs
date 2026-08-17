import BylineCard from "./BylineCard";

export default function WriterQuoteCard() {
  return (
    /* TODO(cms): EditorialByline — requires a real Person record (photo, fullName,
            credential, authorUrl, quote). Sample fixture shown for layout reference only;
            omit this section entirely until a real author is connected. */
    <BylineCard
      as="section"
      wrapperClassName="card bg-bg-card flex gap-4 items-center"
      profileHref="/authors/jane-placeholder"
    >
      <div className="text-sm text-text-strong-secondary italic leading-relaxed mb-2">
        &ldquo;Every operator on this list was funded, wagered on, and withdrawn from by our team
        before it was scored.&rdquo;
      </div>
      <div className="text-sm text-text-meta font-semibold mb-1.5">
        — Jane Placeholder · Example Analyst, Example Credential Body
      </div>
    </BylineCard>
  );
}
