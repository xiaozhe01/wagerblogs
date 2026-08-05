import Link from 'next/link';

// TODO(cms): Tier 3 review routes only — in production this component should return
// null on Tier 1 (editorial) templates, and live routes should start in the
// signed-out/empty state. The populated sample below is static placeholder content
// for visual reference only — not wired to auth, moderation, or a comments API.
const sampleComments = [
  { username: 'Sample User One', date: '[MM/DD/YYYY]', text: '[Fictional example comment — reference only. Payout timing matched the review in my case.]' },
  { username: 'Sample User Two', date: '[MM/DD/YYYY]', text: '[Fictional example comment — reference only. Would add that the app slows during live games.]' },
  { username: 'Sample User Three', date: '[MM/DD/YYYY]', text: '[Fictional example comment — reference only. Moderation declined my first draft for an operator link.]' },
];

export default function Comments() {
  return (
    <div className="pt-1">
      <div className="border-t border-border-divider pt-4 flex items-baseline gap-3 flex-wrap mb-1">
        <div className="text-md font-bold text-text-primary">Comments</div>
        <div className="text-2xs text-text-whisper font-mono">[n] published</div>
      </div>

      {/* TODO(cms): composer assumes a signed-in viewer — placeholder only, not wired to auth */}
      <div className="flex gap-2.5 items-start py-3 border-b border-border-hairline-alt">
        <div className="w-7 h-7 rounded-full placeholder-asset shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="border border-dashed border-border-placeholder rounded-sm px-3 py-2.5 text-xs text-text-meta font-mono mb-2">
            [comment input — plain text, no links to operators]
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button className="btn-primary">Post comment</button>
            <div className="text-2xs text-text-whisper font-mono">held for moderation before it appears</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {sampleComments.map((c, i) => (
          <div key={i} className="py-3.5 border-b border-border-hairline-alt">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-full placeholder-asset shrink-0" />
              <span className="text-sm font-semibold text-text-primary">{c.username}</span>
              <span className="text-2xs text-text-whisper font-mono">{c.date}</span>
            </div>
            <div className="text-sm text-text-body leading-relaxed">{c.text}</div>
          </div>
        ))}
      </div>

      <div className="pt-2.5">
        <Link href="/about" className="text-2xs text-text-whisper underline">comment policy</Link>
      </div>
    </div>
  );
}
