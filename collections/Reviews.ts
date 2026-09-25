import type { CollectionConfig } from "payload";
import { seoFields } from "./fields/seo";
import { revalidateSearch } from "./hooks/revalidate-search";
import { readPublished } from "./access/read-rules";
import { previewFor } from "../lib/preview";

// Operator reviews. Renders on /reviews/[vertical-slug]/[review-slug]/.
// Vertical relationship replaces the ReviewGroup wrapper — the group
// concept is now just Verticals filtered by hasReviews: true.
//
// Two structural safety properties preserved from the existing frontend:
//
// 1. Primary domain vs operator link asymmetry. The frontend defines
//    RelAttribute only on PrimaryDomainLinkData (lib/types.ts:6), not on
//    OperatorLinkData — deliberately so link equity cannot accidentally
//    leak to a competitor. Schema mirrors this: primaryDomainLink and
//    operatorLink are separate fields with different shapes, and
//    operatorLink has no configurable rel — it's forced to
//    "nofollow sponsored" at the render layer.
//
// 2. isPrimaryDomain exclusivity is a list-level constraint, not a
//    record-level flag. Only one review per rendered list may set this.
//    Enforcement is at the render/query layer, not the schema — a
//    per-record boolean cannot express "at most one per list."

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    group: "Editorial",
    useAsTitle: "name",
    defaultColumns: ["name", "vertical", "score", "needsReverification", "lastVerified"],
    preview: previewFor("reviews"),
  },
  access: {
    read: readPublished,
  },
  versions: {
    drafts: {
      autosave: false,
    },
  },
  hooks: {
    afterChange: revalidateSearch,
    afterDelete: revalidateSearch,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "Operator name as displayed.",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "vertical",
      type: "relationship",
      relationTo: "verticals",
      required: true,
      admin: {
        description:
          "Which vertical this operator belongs to. Only verticals with hasReviews: true should be selectable — enforce with a filterOptions callback.",
      },
      filterOptions: () => ({
        hasReviews: { equals: true },
      }),
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
      admin: {
        description:
          "The analyst who authored this review. Byline is derived from this relationship at render, never stored as a formatted string.",
      },
    },
    {
      name: "needsReverification",
      type: "checkbox",
      required: true,
      defaultValue: false,
      admin: {
        description:
          "Re-test cadence flag, orthogonal to the publish lifecycle. Set once the retest window passes; clear when lastVerified is updated.",
      },
    },
    {
      name: "score",
      type: "number",
      required: true,
      min: 0,
      max: 10,
      admin: {
        description:
          "Overall score. See categoryScores below for the breakdown that makes this up.",
      },
    },
    {
      name: "fundedAccountConfirmed",
      type: "checkbox",
      required: true,
      defaultValue: false,
      admin: {
        description:
          'D1: must be checked before publishing. This is the data-layer enforcement of "we test with real money" — the editorial promise becomes a schema constraint. A beforeChange hook (later handoff) should block publishing while this is false. The publish button in the admin UI can also gate on it.',
      },
    },
    {
      name: "categoryScores",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description:
          "Per-criterion score breakdown. Currently the frontend stores label as free text (lib/types.ts) — this schema replaces that with a required label field per row. If we later introduce a shared RubricCriteria collection, this becomes a relationship instead. For now, freeform label with a strict schema is the honest incremental step.",
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "score",
          type: "number",
          required: true,
          min: 0,
          max: 10,
        },
      ],
    },
    {
      name: "advantages",
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        description:
          "Short bullets displayed on ranked rows and used as the search excerpt fallback.",
      },
      fields: [
        {
          name: "advantage",
          type: "text",
          required: true,
          maxLength: 120,
        },
      ],
    },
    {
      name: "pros",
      type: "array",
      admin: {
        description: "Optional. Rendered on the full review page in ProsConsSection.",
      },
      fields: [
        {
          name: "pro",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "cons",
      type: "array",
      admin: {
        description: "Optional. Rendered on the full review page in ProsConsSection.",
      },
      fields: [
        {
          name: "con",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "lastVerified",
      type: "date",
      required: true,
      admin: {
        description:
          "Real Date, not a display string. Frontend formats for display. The bracketed placeholder in the current frontend was a symptom of this being a string field.",
      },
    },
    {
      name: "payoutSpeedText",
      type: "text",
      admin: {
        description:
          'Short duration string for the at-a-glance rail, e.g. "1-3 days". Optional — left empty when not yet measured rather than filled with an estimate.',
      },
    },
    {
      name: "bonusTerms",
      type: "array",
      admin: {
        description:
          'Attribute pairs for the "Bonus detail" definition list on the review page — minimum deposit, wagering requirement, expiry, eligible states. Distinct from the bonus-offers collection, which holds the offer records themselves.',
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "isPrimaryDomain",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "When true, this review renders a PrimaryDomainLink instead of an operator link. Enforcement that only one review per rendered list has this true is at the query/render layer, not the schema — flag for the frontend audit.",
      },
    },
    {
      name: "primaryDomainLink",
      type: "group",
      admin: {
        condition: (data) => data?.isPrimaryDomain === true,
        description:
          "Only populated when isPrimaryDomain is true. This is the only outbound link on the site where relAttribute is editable.",
      },
      fields: [
        {
          name: "anchorText",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
        {
          name: "relAttribute",
          type: "select",
          required: true,
          defaultValue: "nofollow",
          options: [
            { label: "Nofollow", value: "nofollow" },
            { label: "Sponsored", value: "sponsored" },
            { label: "Dofollow (editorially earned)", value: "dofollow" },
          ],
          admin: {
            description:
              "Only editable on primary domain links. Operator links never have this field — the asymmetry is structural. Dofollow should be a deliberate editorial decision, never a default.",
          },
        },
      ],
    },
    {
      name: "operatorLink",
      type: "group",
      admin: {
        condition: (data) => data?.isPrimaryDomain !== true,
        description:
          'The outbound link to the operator being reviewed. Never has a relAttribute field — rel is forced to "nofollow sponsored" at the render layer. Making this a structural absence rather than a default preserves the safety property from lib/types.ts.',
      },
      fields: [
        {
          name: "anchorText",
          type: "text",
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "reviewBody",
      type: "richText",
      required: true,
    },
    seoFields,
  ],
};
