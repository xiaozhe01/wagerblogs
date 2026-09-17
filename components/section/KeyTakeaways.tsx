// Shared by the article and the news story — the same numbered block, keyed
// off whichever record supplies the takeaways.
export default function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <section
      className="flex flex-col gap-3 border-l-2 border-text-primary pl-4 md:pl-5"
      aria-labelledby="key-takeaways"
    >
      {/* A <p>, not a heading — it labels a callout. aria-labelledby still
          names the section. */}
      <p id="key-takeaways" className="meta-label-caps">
        Key takeaways
      </p>
      <ol role="list" className="flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={item} className="flex gap-2.5 items-start">
            <span
              aria-hidden="true"
              className="w-legacy-6 h-legacy-6 shrink-0 rounded-full bg-bg-accent text-text-on-fill flex items-center justify-center text-2xs font-bold"
            >
              {i + 1}
            </span>
            <span className="text-lg leading-relaxed text-text-strong-secondary">{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
