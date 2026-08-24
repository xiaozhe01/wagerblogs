type ReviewSectionHeadingProps = {
  title: string;
  badge?: string;
  note?: string;
};

export default function ReviewSectionHeading({ title, badge, note }: ReviewSectionHeadingProps) {
  if (badge || note) {
    return (
      <div className="flex items-center gap-3 flex-wrap mb-3">
        {badge && (
          <span className="text-2xs tracking-wide px-2 py-1 rounded-sm bg-bg-accent text-text-on-accent">
            {badge}
          </span>
        )}
        <h2 className="heading text-2xl">{title}</h2>
        {note && <p className="text-xs text-text-subtle font-mono leading-relaxed">{note}</p>}
      </div>
    );
  }

  return <h2 className="heading text-2xl mb-3">{title}</h2>;
}
