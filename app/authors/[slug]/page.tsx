import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import ArrowLink from "@/components/ui/ArrowLink";
import { mockAuthor, authorBeats, authorArticles, authorStandards } from "@/lib/mock-data";

// TODO(cms): replace with generateStaticParams() from the CMS author list. This
// route must 404 when no Person record exists — never render with a placeholder
// name, stock headshot, or invented credential.
// Required fields: photo, fullName, credential, bio, slug. Optional: sameAs, beats.
export const metadata: Metadata = { title: `${mockAuthor.name} — WagerBlogs` };

export default function AuthorPage() {
  return (
    <PageShell activeNavId="more">
      {/* Register: Editorial · Tier 1 — author identity surface, no outbound operator links */}
      <Breadcrumbs items={[{ label: "About", href: "/about" }, { label: mockAuthor.name }]} />

      <section className="flex flex-col gap-4 md:gap-5 border-t border-border-divider border-b py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-5">
          <div className="w-24 h-24 md:w-30 md:h-30 rounded-full placeholder-asset shrink-0" />
          <div className="min-w-0 flex flex-col gap-2">
            <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
              {mockAuthor.name}
            </h1>
            <div className="text-sm text-text-meta">{mockAuthor.credentialLine}</div>
            <div className="text-sm text-text-body leading-relaxed">{mockAuthor.bio}</div>
          </div>
        </div>
        {/* TODO(cms): Person record — required: photo, fullName, credential, bio, slug.
            Optional: sameAs, beats. Person schema requires name + url; no "WagerBlogs
            Staff" fallback, no stock headshot, no invented credential. */}
      </section>

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">Coverage areas</h2>
        <div className="flex gap-2 flex-wrap">
          {authorBeats.map((b) => (
            <Link
              key={b}
              href="/categories/sample"
              className="btn-secondary min-h-0 py-1.5 px-3 text-xs"
            >
              {b}
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="heading text-h2 leading-heading">Recent work</h2>
        {/* TODO(cms): article list renders from posts where author === this record. */}
        <div className="flex flex-col">
          {authorArticles.map((a) => (
            <PostRow key={a.title} post={a} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">How this author works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3 mb-3">
          {authorStandards.map((s) => (
            <div key={s.title} className="border-t border-border-hairline pt-3">
              <div className="text-md font-semibold text-text-primary mb-1.5">{s.title}</div>
              <div className="text-sm text-text-meta leading-loose">{s.body}</div>
            </div>
          ))}
        </div>
        <ArrowLink
          href="/about"
          className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
        >
          Read our full editorial standards
        </ArrowLink>
      </section>

      {/* TODO(cms): sameAs profiles — omitted; contact routes to the editorial desk instead. */}
      <section className="flex flex-col items-start gap-1">
        <div className="text-sm text-text-body leading-relaxed">
          Questions about this author&apos;s work?
        </div>
        <ArrowLink
          href="/contact"
          className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
        >
          Contact the editorial desk
        </ArrowLink>
      </section>
    </PageShell>
  );
}
