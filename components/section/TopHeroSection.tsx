import ArrowLink from "@/components/ui/ArrowLink";

export default function TopHeroSection() {
  return (
    <section className="flex flex-col gap-5">
      <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
        Compare legal sports betting and online casino sites in the US
      </h1>
      <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
        [placeholder SEO intro paragraph — independent reviews, odds comparisons, and state-by-state
        legal betting guides. Written to stand on its own as editorial, with no operator link in
        this section.]
      </p>
      <ArrowLink
        href="/reviews"
        className="inline-flex gap-1 group items-center min-h-11 text-md text-text-primary font-semibold w-fit"
      >
        Compare top sites
      </ArrowLink>
    </section>
  );
}
