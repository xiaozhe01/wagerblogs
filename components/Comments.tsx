import { sampleComments } from "@/lib/mock-data";

export default function Comments() {
  return (
    <section aria-labelledby="comments-heading">
      <div className="border-t border-border-divider pt-4 flex items-baseline gap-3 flex-wrap mb-1">
        <h2 id="comments-heading" className="text-md font-bold text-text-primary">
          Comments
        </h2>
        <span className="meta-label ">[n] published</span>
      </div>

      {/* TODO(cms): wire to auth + the moderation queue, then drop the `disabled` flags.
          Controls stay disabled until then — a composer that accepts input it cannot
          submit is a worse affordance than one that is plainly unavailable. */}
      <form className="flex gap-2.5 items-start py-3 border-b border-border-hairline-alt">
        <div aria-hidden="true" className="w-6 h-6 rounded-full placeholder-asset shrink-0" />
        <div className="min-w-0 flex-1">
          <label htmlFor="comment-body" className="sr-only">
            Add a comment
          </label>
          <textarea
            id="comment-body"
            name="comment"
            rows={2}
            disabled
            aria-describedby="comment-moderation-note"
            placeholder="Plain text, no links to operators"
            className="w-full resize-y border border-dashed border-border-placeholder rounded-sm px-3 py-2.5 text-xs text-text-subtle tabular-nums mb-2 disabled:cursor-not-allowed"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="submit"
              disabled
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post comment
            </button>
            <p id="comment-moderation-note" className="meta-label ">
              held for moderation before it appears
            </p>
          </div>
        </div>
      </form>

      <ul role="list" className="flex flex-col">
        {sampleComments.map((c) => (
          <li key={`${c.username}-${c.date}`}>
            <article className="py-3.5 border-b border-border-hairline-alt flex items-start gap-2.5">
              <div aria-hidden="true" className="w-6 h-6 rounded-full placeholder-asset shrink-0" />
              <div className="min-w-0 flex flex-col gap-2">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-sm font-semibold text-text-primary">{c.username}</span>
                  {/* TODO(cms): real comment records carry an ISO timestamp — render as <time dateTime>. */}
                  <span className="meta-label ">{c.date}</span>
                </div>
                <p className="text-sm text-text-body leading-relaxed wrap-break-word">{c.text}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
