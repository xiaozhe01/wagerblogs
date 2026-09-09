export default function TopHeroSection() {
  return (
    <header className="flex flex-col gap-3 border-b border-border-divider pb-4">
      {/* TODO(cms): render from the page's real lastReviewed date, as <time dateTime>. */}
      <p className="meta-label-caps">Updated [date from CMS]</p>
      <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
        Compare legal sports betting and online casino sites in the US
      </h1>
      <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
        [placeholder SEO intro paragraph — independent reviews, odds comparisons, and state-by-state
        legal betting guides. Written to stand on its own as editorial, with no operator link in
        this section.]
      </p>
    </header>
  );
}
