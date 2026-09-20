import { getPayload } from "payload";
import config from "../payload.config";
import { applyRls } from "./rls";
import {
  bonusOffers,
  helpDirectory,
  legalDocs,
  marketStats,
  mockAuthor,
  mockPeakWagerReview,
  mockRankedCasinos,
  mockRankedSportsbooks,
  newsStoryAuthor,
} from "../lib/mock-data";
import { blogPosts } from "../lib/blog";
import { newsSections } from "../lib/news";
import { siteFaqs } from "../lib/faq";
import type { Operator } from "../lib/types";

// Seeds the editorial content that lib/ has been standing in for, so wired
// routes render real records instead of empty states. Idempotent: every
// collection is keyed on something natural (slug, or name+country, or an alt
// marker) and an existing record is skipped, never updated.
//
// Bodies are deliberately minimal. lib/ has no article-shaped body to convert —
// the prose lives in page templates as hardcoded JSX — so each record gets a
// short, plainly-labelled placeholder body with one h2, enough to exercise the
// RichText converter and the derived table of contents. Real copy is authored
// in the admin panel.
//
// Order matters: Media -> Authors -> Reviews -> BonusOffers -> Articles ->
// News -> HelpDirectoryEntries -> globals. Later steps reference earlier ids.

const payload = await getPayload({ config });
const created: string[] = [];
const skipped: string[] = [];

function note(kind: "created" | "skipped", label: string) {
  (kind === "created" ? created : skipped).push(label);
  console.log(`  ${kind}: ${label}`);
}

function required<T>(value: T | null | undefined, what: string): T {
  if (value === undefined || value === null || value === "") {
    throw new Error(
      `Seed aborted: "${what}" has no source in lib/. Add it to the source file or ` +
        `extend the mapping in scripts/seed-content.ts — do not substitute a default.`,
    );
  }
  return value;
}

/** lib stores display dates bracketed, e.g. "[Jul 18, 2026]". */
function isoDate(value: string, what: string): string {
  const parsed = new Date(value.replace(/^\[|\]$/g, ""));
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Seed aborted: "${what}" is not a parseable date: ${value}`);
  }
  return parsed.toISOString();
}

// --- Lexical builders -------------------------------------------------------
type Lex = Record<string, unknown>;
const text = (value: string): Lex => ({
  mode: "normal",
  text: value,
  type: "text",
  style: "",
  detail: 0,
  format: 0,
  version: 1,
});
const paragraph = (...children: Lex[]): Lex => ({
  type: "paragraph",
  format: "",
  indent: 0,
  version: 1,
  children,
  direction: null,
  textStyle: "",
  textFormat: 0,
});
const heading = (tag: "h2" | "h3" | "h4", value: string): Lex => ({
  type: "heading",
  tag,
  format: "",
  indent: 0,
  version: 1,
  children: [text(value)],
  direction: null,
});
const internalLink = (relationTo: string, value: number, label: string): Lex => ({
  type: "link",
  format: "",
  indent: 0,
  version: 3,
  direction: null,
  fields: { linkType: "internal", newTab: false, doc: { relationTo, value } },
  children: [text(label)],
});
const richText = (...children: Lex[]) => ({
  root: { type: "root", format: "", indent: 0, version: 1, children, direction: null },
});

/** The stock placeholder body: a labelled paragraph and one h2, so the prose
 * renderer and the heading-derived TOC both have something real to work on. */
const placeholderBody = (subject: string, extra: Lex[] = []) =>
  richText(
    paragraph(
      text(
        `Placeholder body for ${subject}. Real copy is authored in the admin panel — ` +
          `this paragraph exists so the record renders through the rich-text converter.`,
      ),
    ),
    heading("h2", "What this section will cover"),
    paragraph(
      text(
        "A second placeholder paragraph beneath a real heading, so the derived table of " +
          "contents has an entry to link to.",
      ),
    ),
    ...extra,
  );

// --- lookups ---------------------------------------------------------------
async function findBySlug(collection: string, slug: string) {
  const { docs } = await payload.find({
    collection: collection as never,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  });
  return docs[0] as { id: number } | undefined;
}

async function requireBySlug(collection: string, slug: string) {
  const doc = await findBySlug(collection, slug);
  if (!doc) {
    throw new Error(
      `Seed aborted: ${collection} "${slug}" does not exist. Run \`npm run seed\` first — ` +
        `it creates the verticals and news sections this script relates to.`,
    );
  }
  return doc;
}

// --- 2. Authors -------------------------------------------------------------
async function seedAuthors() {
  // mockAuthor and newsStoryAuthor are the same fixture person — both resolve
  // to jane-placeholder — so the list is deduped by slug rather than creating
  // one record twice. Dave is a real record created in the admin and is not a
  // fixture; check-by-slug leaves him alone.
  const byline = [
    {
      slug: mockAuthor.slug,
      name: mockAuthor.name,
      credentialLine: mockAuthor.credentialLine,
      bio: mockAuthor.bio as string | undefined,
    },
    {
      slug: newsStoryAuthor.profileHref.replace("/authors/", ""),
      name: newsStoryAuthor.name,
      credentialLine: newsStoryAuthor.credential,
      bio: undefined as string | undefined,
    },
  ];
  const people = byline.filter(
    (person, index) => byline.findIndex((other) => other.slug === person.slug) === index,
  );

  const ids: Record<string, number> = {};
  for (const person of people) {
    const existing = await findBySlug("authors", person.slug);
    if (existing) {
      note("skipped", `authors/${person.slug}`);
      ids[person.slug] = existing.id;
      continue;
    }
    const doc = await payload.create({
      collection: "authors",
      data: {
        name: required(person.name, `author ${person.slug} name`),
        slug: person.slug,
        credentialLine: required(person.credentialLine, `author ${person.slug} credentialLine`),
        // No photo: the hero placeholder is not a likeness, and the frontend
        // renders a blank profile skeleton when this is empty. A real photo is
        // uploaded per author in the admin panel.

        bio: person.bio ? richText(paragraph(text(person.bio))) : undefined,
        active: true,
        _status: "published",
        seo: {
          metaTitle: `${person.name} — WagerBlogs`,
          metaDescription: person.credentialLine,
        },
      } as never,
    });
    note("created", `authors/${person.slug}`);
    ids[person.slug] = doc.id;
  }
  return ids;
}

// --- 3. Reviews -------------------------------------------------------------
async function seedReviews(authorId: number) {
  const sportsbooks = await requireBySlug("verticals", "sportsbooks");
  const casinos = await requireBySlug("verticals", "online-casinos");
  const groups: [Operator[], number, string][] = [
    [[mockPeakWagerReview, ...mockRankedSportsbooks], sportsbooks.id, "sportsbook"],
    [mockRankedCasinos, casinos.id, "casino"],
  ];

  const ids: Record<string, number> = {};
  for (const [operators, verticalId, noun] of groups) {
    for (const operator of operators) {
      const existing = await findBySlug("reviews", operator.slug);
      if (existing) {
        note("skipped", `reviews/${operator.slug}`);
        ids[operator.slug] = existing.id;
        continue;
      }
      // Reviews.advantages is required with minRows 1. Where lib has none, the
      // record is skipped rather than back-filled from pros — they are
      // different fields with different surfaces.
      if (operator.advantages.length === 0) {
        note("skipped", `reviews/${operator.slug} (no advantages in lib — required, minRows 1)`);
        continue;
      }
      const link = operator.isPrimaryDomain
        ? {
            primaryDomainLink: {
              anchorText: operator.primaryDomainLink?.anchorText ?? `Visit ${operator.name}`,
              url: required(
                operator.primaryDomainLink?.url,
                `${operator.slug} primaryDomainLink.url`,
              ),
              relAttribute: operator.primaryDomainLink?.relAttribute ?? "sponsored",
            },
          }
        : {
            operatorLink: {
              anchorText: `Visit ${operator.name}`,
              url: "https://example.com",
            },
          };

      const doc = await payload.create({
        collection: "reviews",
        data: {
          name: required(operator.name, `${operator.slug} name`),
          slug: operator.slug,
          vertical: verticalId,
          author: authorId,
          score: required(operator.score, `${operator.slug} score`),
          needsReverification: false,
          fundedAccountConfirmed: true,
          categoryScores: operator.categoryScores.map((entry) => ({
            label: entry.label,
            score: entry.score,
          })),
          advantages: operator.advantages.map((advantage) => ({ advantage })),
          pros: (operator.pros ?? []).map((pro) => ({ pro })),
          cons: (operator.cons ?? []).map((con) => ({ con })),
          lastVerified: isoDate(operator.lastVerified, `${operator.slug} lastVerified`),
          isPrimaryDomain: operator.isPrimaryDomain,
          ...link,
          reviewBody: placeholderBody(`the ${operator.name} ${noun} review`),
          _status: "published",
          seo: {
            metaTitle: `${operator.name} review — WagerBlogs`,
            metaDescription: `Our tested ${noun} review of ${operator.name}: editorial score, strengths and trade-offs.`,
          },
        } as never,
      });
      note("created", `reviews/${operator.slug}`);
      ids[operator.slug] = doc.id;
    }
  }
  return ids;
}

// --- 4. BonusOffers ---------------------------------------------------------
async function seedBonusOffers(reviewIds: Record<string, number>) {
  for (const offer of bonusOffers) {
    const { docs } = await payload.find({
      collection: "bonus-offers",
      where: { name: { equals: offer.name } },
      limit: 1,
      depth: 0,
      overrideAccess: false,
    });
    if (docs[0]) {
      note("skipped", `bonus-offers/${offer.name}`);
      continue;
    }
    const operatorId = reviewIds[offer.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")];
    await payload.create({
      collection: "bonus-offers",
      data: {
        name: offer.name,
        operator: operatorId,
        isPrimaryDomain: offer.isPrimaryDomain,
        headline: required(offer.headline, `bonus offer ${offer.name} headline`),
        code: offer.code,
        benefits: (offer.benefits ?? []).map((benefit) => ({ benefit })),
        ...(offer.isPrimaryDomain
          ? { primaryDomainLink: offer.primaryDomainLink }
          : { operatorLink: offer.operatorLink }),
        active: true,
      } as never,
    });
    note("created", `bonus-offers/${offer.name}`);
  }
}

// --- 5. Articles ------------------------------------------------------------
const ARTICLE_TYPE: Record<string, string> = {
  Guides: "guide",
  Guide: "guide",
  Analysis: "analysis",
  Research: "research",
  Blog: "blog",
};

async function seedArticles(authorId: number, reviewIds: Record<string, number>) {
  // All three fixtures are sports-betting explainers, so sportsbooks is the
  // best fit rather than an arbitrary default.
  const vertical = await requireBySlug("verticals", "sportsbooks");

  for (const post of blogPosts) {
    if (await findBySlug("articles", post.slug)) {
      note("skipped", `articles/${post.slug}`);
      continue;
    }
    // One seeded body carries an internal link, so internalDocToHref is
    // exercised against a real record rather than only in tests.
    const extra =
      post.slug === "parlays-vs-straight-bets" && reviewIds["peakwager"]
        ? [
            paragraph(
              text("For a worked example, see "),
              internalLink("reviews", reviewIds["peakwager"], "our PeakWager review"),
              text("."),
            ),
          ]
        : [];

    await payload.create({
      collection: "articles",
      data: {
        title: required(post.title, `article ${post.slug} title`),
        slug: post.slug,
        type: required(
          ARTICLE_TYPE[post.kicker],
          `article ${post.slug} type for kicker "${post.kicker}"`,
        ),
        vertical: vertical.id,
        author: authorId,
        publishedAt: isoDate(post.publishedAt, `article ${post.slug} publishedAt`),
        excerpt: required(post.excerpt, `article ${post.slug} excerpt`),
        body: placeholderBody(post.title, extra),
        // No heroImage: the frontend renders a labelled skeleton when absent,
        // which is honest about an asset nobody has supplied yet.
        takeaways: [
          { takeaway: "Placeholder takeaway — replace with the piece's real conclusion." },
        ],
        _status: "published",
        seo: { metaTitle: post.title, metaDescription: post.excerpt },
      } as never,
    });
    note("created", `articles/${post.slug}`);
  }
}

// --- 6. News ----------------------------------------------------------------
const BEAT: Record<string, string> = {
  Football: "sports",
  Basketball: "sports",
  Soccer: "sports",
  Esports: "esports",
  Industry: "business",
};

/** One seeded body carries a link that resolves, so internalDocToHref has a
 * demonstrated success path in real rendered output — not only in tests. Its
 * counterpart is the deliberately unresolvable link in the parlays article,
 * which exercises the failure path. */
const LINKED_STORY = "placeholder-headline-football";

async function seedNews(authorId: number) {
  const sportsbooks = await requireBySlug("verticals", "sportsbooks");

  for (const section of newsSections) {
    const sectionDoc = await requireBySlug("news-sections", section.slug);
    for (const story of section.stories) {
      if (await findBySlug("news", story.slug)) {
        note("skipped", `news/${story.slug}`);
        continue;
      }
      const extra =
        story.slug === LINKED_STORY
          ? [
              paragraph(
                text("Placeholder cross-reference awaiting editorial — see our "),
                internalLink("verticals", sportsbooks.id, "Sportsbooks category"),
                text(" for related coverage."),
              ),
            ]
          : [];
      await payload.create({
        collection: "news",
        data: {
          title: required(story.title, `news ${story.slug} title`),
          slug: story.slug,
          section: sectionDoc.id,
          beat: required(BEAT[section.category], `news beat for section "${section.category}"`),
          author: authorId,
          publishedAt: isoDate(story.publishedAt, `news ${story.slug} publishedAt`),
          excerpt: required(story.excerpt, `news ${story.slug} excerpt`),
          body: placeholderBody(story.title, extra),
          // No heroImage — see seedArticles.
          takeaways: [
            { takeaway: "Placeholder takeaway — replace with the story's real conclusion." },
          ],
          _status: "published",
          seo: { metaTitle: story.title, metaDescription: story.excerpt },
        } as never,
      });
      note("created", `news/${story.slug}`);
    }
  }
}

// --- 7. HelpDirectoryEntries ------------------------------------------------
const REGION: Record<string, string> = {
  "North America": "north-america",
  "UK & Ireland": "uk-ireland",
  Europe: "europe",
  "Asia-Pacific": "asia-pacific",
  "Latin America": "latin-america",
  "Middle East and Africa": "middle-east-africa",
};

async function seedHelpDirectory() {
  for (const group of helpDirectory) {
    const region = required(
      REGION[group.region],
      `help-directory region mapping for "${group.region}"`,
    );
    for (const entry of group.entries) {
      const { docs } = await payload.find({
        collection: "help-directory-entries",
        where: { name: { equals: entry.name }, country: { equals: entry.country } },
        limit: 1,
        depth: 0,
        overrideAccess: false,
      });
      if (docs[0]) {
        note("skipped", `help-directory-entries/${entry.name}`);
        continue;
      }
      await payload.create({
        collection: "help-directory-entries",
        data: {
          name: entry.name,
          country: entry.country,
          region,
          description: required(entry.desc, `help entry ${entry.name} description`),
          // lib calls this "site"; the schema calls it "website".
          contacts: {
            phone: entry.contacts.phone || undefined,
            website: entry.contacts.site || undefined,
            chat: entry.contacts.chat || undefined,
          },
          verified: true,
          verifiedAt: new Date().toISOString(),
          isCrisisLine: Boolean(entry.isCrisisLine),
        } as never,
      });
      note("created", `help-directory-entries/${entry.name}`);
    }
  }
}

// --- 8. Globals -------------------------------------------------------------
async function seedGlobals() {
  const faq = await payload.findGlobal({ slug: "faq", depth: 0, overrideAccess: false });
  if ((faq as { entries?: unknown[] }).entries?.length) {
    note("skipped", "global/faq");
  } else {
    await payload.updateGlobal({
      slug: "faq",
      data: {
        entries: siteFaqs.map((entry) => ({
          question: entry.q,
          answer: entry.a,
          status: "published",
          sourceLink: entry.link ? { label: entry.link.label, href: entry.link.href } : undefined,
        })),
      } as never,
    });
    note("created", `global/faq (${siteFaqs.length} entries)`);
  }

  const legal = await payload.findGlobal({
    slug: "legal-documents",
    depth: 0,
    overrideAccess: false,
  });
  if ((legal as { documents?: unknown[] }).documents?.length) {
    note("skipped", "global/legal-documents");
  } else {
    await payload.updateGlobal({
      slug: "legal-documents",
      data: {
        documents: Object.entries(legalDocs).map(([slug, doc]) => ({
          slug,
          title: doc.title,
          intro: doc.intro,
          summary: doc.summary,
          sections: doc.sections.map((section) => ({
            heading: section.title,
            body: richText(paragraph(text(section.body))),
          })),
          // No version history in lib, and a legal document's version is a
          // claim — bracketed so it cannot ship as if it were real.
          currentVersion: "[TO WRITE]",
        })),
      } as never,
    });
    note("created", `global/legal-documents (${Object.keys(legalDocs).length} documents)`);
  }

  const stats = await payload.findGlobal({ slug: "market-stats", depth: 0, overrideAccess: false });
  if ((stats as { stats?: unknown[] }).stats?.length) {
    note("skipped", "global/market-stats");
  } else {
    await payload.updateGlobal({
      slug: "market-stats",
      data: {
        stats: marketStats.map((stat) => ({
          value: stat.value,
          label: stat.label,
          // lib prefixes these for display; the schema stores them bare.
          source: stat.source.replace(/^Source:\s*/, ""),
          period: stat.period.replace(/^Period:\s*/, ""),
        })),
      } as never,
    });
    note("created", `global/market-stats (${marketStats.length} stats)`);
  }
}

// --- run --------------------------------------------------------------------
console.log("\nauthors");
const authorIds = await seedAuthors();
const primaryAuthor = authorIds[mockAuthor.slug];
console.log("\nreviews");
const reviewIds = await seedReviews(primaryAuthor);
console.log("\nbonus-offers");
await seedBonusOffers(reviewIds);
console.log("\narticles");
await seedArticles(primaryAuthor, reviewIds);
console.log("\nnews");
await seedNews(authorIds["jane-placeholder"] ?? primaryAuthor);
console.log("\nhelp-directory-entries");
await seedHelpDirectory();
console.log("\nglobals");
await seedGlobals();

// getPayload() does not push with push: false, but rls:apply is cheap and the
// seed should never be the reason the database is left open. See STRUCTURE.md.
const rls = await applyRls();
if (rls.missing.length > 0) {
  throw new Error(
    `Seed data was written, but RLS is missing on ${rls.missing.length} table(s): ` +
      `${rls.missing.join(", ")}. Run \`npm run rls:apply\`.`,
  );
}

console.log(`\nsummary`);
console.log(`  created: ${created.length}`);
console.log(`  skipped: ${skipped.length}`);
console.log(`  RLS:     ${rls.enabled}/${rls.total} public tables`);
process.exit(0);
