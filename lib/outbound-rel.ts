// Every outbound rel the site emits, decided here rather than at each call
// site. Two separate questions live in this one attribute:
//
//   follow  — link equity. Governed by CLAUDE.md rules 2 and 5 and never
//             CMS-editable, except Review/BonusOffer primaryDomainLink, whose
//             relAttribute select is the one place an editor picks it.
//   referrer — whether the destination learns the reader came from us. Not an
//             SEO decision, and no rule covers it, so it is set per surface.
//
// `noreferrer` implies `noopener`, so a surface that sends a referrer must
// still name `noopener` or it reintroduces tabnabbing.

export type OutboundSurface =
  | "bodyLink"
  | "helpDirectory"
  | "authorProfile"
  | "faqSource"
  | "newsSource"
  | "operatorLink"
  | "ugc";

const SEND_REFERRER: Record<OutboundSurface, boolean> = {
  // Curated citation fields. The destination seeing the traffic is the point —
  // it is how a regulator or an author's profile knows the coverage exists.
  authorProfile: true,
  faqSource: true,
  newsSource: true,

  // Body copy is not a curated surface: an editor can paste any href into it,
  // including an operator's. tests/rich-text guards this value.
  bodyLink: false,

  // A gambling-harm charity should not be told its visitor arrived from an
  // affiliate site. The reader's route here is nobody else's business.
  helpDirectory: false,
  // Commercial. Nothing is owed to the operator beyond the click.
  operatorLink: false,
  // Rule 2: hardcoded at the render layer, not CMS-editable.
  ugc: false,
};

const FOLLOW: Record<OutboundSurface, string[]> = {
  bodyLink: ["nofollow"],
  helpDirectory: ["nofollow"],
  authorProfile: ["nofollow"],
  faqSource: ["nofollow"],
  newsSource: ["nofollow"],
  operatorLink: ["nofollow", "sponsored"],
  ugc: ["ugc", "nofollow"],
};

export function outboundRel(surface: OutboundSurface): string {
  const parts = [...FOLLOW[surface], "noopener"];
  if (!SEND_REFERRER[surface]) parts.push("noreferrer");
  return parts.join(" ");
}
