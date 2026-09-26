import assert from "node:assert/strict";
import test from "node:test";
import type { CollectionConfig, Field, GlobalConfig } from "payload";
import { localise } from "../collections/i18n-labels";

import { AdminUsers } from "../collections/AdminUsers";
import { Articles } from "../collections/Articles";
import { Authors } from "../collections/Authors";
import { BonusOffers } from "../collections/BonusOffers";
import { Comments } from "../collections/Comments";
import { FAQ } from "../collections/FAQ";
import { ForumReplies } from "../collections/ForumReplies";
import { ForumThreads } from "../collections/ForumThreads";
import { HelpDirectoryEntries } from "../collections/HelpDirectoryEntries";
import { LegalDocuments } from "../collections/LegalDocuments";
import { MarketStats } from "../collections/MarketStats";
import { Media } from "../collections/Media";
import { News } from "../collections/News";
import { NewsSections } from "../collections/NewsSections";
import { Notifications } from "../collections/Notifications";
import { ReaderReviews } from "../collections/ReaderReviews";
import { Reviews } from "../collections/Reviews";
import { Users } from "../collections/Users";
import { Verticals } from "../collections/Verticals";

const ENTITIES: Array<CollectionConfig | GlobalConfig> = [
  AdminUsers,
  Articles,
  Authors,
  BonusOffers,
  Comments,
  FAQ,
  ForumReplies,
  ForumThreads,
  HelpDirectoryEntries,
  LegalDocuments,
  MarketStats,
  Media,
  News,
  NewsSections,
  Notifications,
  ReaderReviews,
  Reviews,
  Users,
  Verticals,
];

/**
 * A structural signature of a field tree: every field's path and type, in
 * order. `localise` rewrites labels and descriptions in place, and a mistake
 * there could silently drop or reorder schema rather than merely leave a
 * string untranslated — which a migration would then act on.
 *
 * Labels are deliberately NOT part of the signature. Changing them is the
 * whole point; changing the shape is the accident this guards against.
 */
export function fingerprint(fields: Field[], prefix = ""): string[] {
  const out: string[] = [];

  for (const field of fields) {
    const named = field as { name?: string; type: string };
    const path = named.name ? `${prefix}${named.name}` : `${prefix}<${named.type}>`;
    out.push(`${path}:${named.type}`);

    const nested = field as { fields?: Field[]; tabs?: Array<{ name?: string; fields: Field[] }> };
    if (Array.isArray(nested.fields)) {
      out.push(...fingerprint(nested.fields, `${path}.`));
    }
    if (Array.isArray(nested.tabs)) {
      for (const tab of nested.tabs) {
        out.push(...fingerprint(tab.fields, `${path}.${tab.name ?? "<tab>"}.`));
      }
    }
  }

  return out;
}

test("localise preserves every field's path, type and order", () => {
  for (const entity of ENTITIES) {
    const before = fingerprint(entity.fields);
    const after = fingerprint(localise(entity).fields);
    assert.deepEqual(
      after,
      before,
      `${entity.slug}: localise changed the field tree. It may rewrite labels and descriptions, never structure.`,
    );
  }
});

test("localise preserves slug, access, hooks and versions", () => {
  for (const entity of ENTITIES) {
    const after = localise(entity) as Record<string, unknown>;
    const before = entity as unknown as Record<string, unknown>;
    for (const key of ["slug", "access", "hooks", "versions", "auth", "upload"]) {
      assert.deepEqual(after[key], before[key], `${entity.slug}: localise altered "${key}"`);
    }
  }
});

test("the fingerprint actually detects a dropped or renamed field", () => {
  const fields = Reviews.fields;
  const full = fingerprint(fields);

  assert.notDeepEqual(fingerprint(fields.slice(1)), full, "dropping a field went unnoticed");

  const renamed = fields.map((f, i) => (i === 0 ? ({ ...f, name: "renamed_field" } as Field) : f));
  assert.notDeepEqual(fingerprint(renamed), full, "renaming a field went unnoticed");
});

test("every collection contributes fields to the signature", () => {
  for (const entity of ENTITIES) {
    if (fingerprint(entity.fields).length > 0) continue;

    // An auth collection may legitimately declare none — Payload injects email
    // and password. Anything else with an empty tree would make the guard above
    // pass without having checked anything, so it must justify itself.
    assert.ok(
      "auth" in entity && Boolean(entity.auth),
      `${entity.slug}: empty field tree on a non-auth collection, so the guard would pass vacuously`,
    );
  }
});
