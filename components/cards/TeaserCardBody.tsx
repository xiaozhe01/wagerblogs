type TeaserCardBodyProps = {
  title: string;
  desc: string;
};

// Title + description content rendered inside an `editorial-link-card`
// wrapper. Canonicalizes on ExploreCategoryCard's classes, which also match
// categorySubCategories elsewhere — ToolboxCard had drifted (mb-1.5,
// text-body/leading-loose) from this shared shape.
export default function TeaserCardBody({ title, desc }: TeaserCardBodyProps) {
  return (
    <>
      <div className="font-semibold text-md text-text-primary mb-1">{title}</div>
      <div className="text-xs text-text-meta leading-relaxed">{desc}</div>
    </>
  );
}
