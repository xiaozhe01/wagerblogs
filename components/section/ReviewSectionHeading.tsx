type ReviewSectionHeadingProps = {
  title: string;
  badge?: string;
  note?: string;
};

// Comparison-register h2 ("text-2xl tracking-tight") used throughout the
// reviews templates. With badge/note, renders the "TRUST BLOCK n/3"-style
// header row; without, a plain standalone heading.
export default function ReviewSectionHeading({ title, badge, note }: ReviewSectionHeadingProps) {
  if (badge || note) {
    return (
      <div className="flex items-center gap-3 flex-wrap mb-3">
        {badge && (
          <span className="text-2xs tracking-wide px-2 py-1 rounded-sm bg-bg-accent text-text-on-accent">
            {badge}
          </span>
        )}
        <h2 className="text-2xl text-text-primary tracking-tight">{title}</h2>
        {note && <span className="text-xs text-text-subtle font-mono leading-relaxed">{note}</span>}
      </div>
    );
  }

  return <h2 className="text-2xl text-text-primary tracking-tight mb-3">{title}</h2>;
}
