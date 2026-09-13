import type { CollectionConfig } from "payload";

// Payload's admin auth collection, declared rather than injected.
//
// sanitize.js picks the first collection with `auth` as admin.user; only when
// none exists does it push its own defaultUserCollection, which carries no
// admin.group and so cannot be placed in the sidebar. Declaring it here is
// what lets it be grouped.
//
// Deliberately identical to that default — slug, useAsTitle, tokenExpiration
// and an empty fields array. No name, role or group-membership fields: those
// are the deferred auth-strategy work, not this.
export const AdminUsers: CollectionConfig = {
  slug: "users",
  admin: {
    group: "Admin",
    useAsTitle: "email",
  },
  auth: {
    tokenExpiration: 7200,
  },
  fields: [],
};
