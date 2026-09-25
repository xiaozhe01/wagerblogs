import type { Access, Where } from "payload";

// Payload does not filter _status or a moderation field on its own, so
// `read: () => true` served drafts and unmoderated content over /api/<slug>.
//
// req.user.collection is the slug of the auth collection a session came from.
// AdminUsers declares "users"; site accounts live in "site-users". Keying off
// that survives site-user auth landing without a role model, and fails closed:
// an unrecognised session falls through to the anonymous filter.
const isEditor = (user: { collection?: string } | null) => user?.collection === "users";

const editorOr =
  (visible: Where): Access =>
  ({ req }) =>
    isEditor(req.user) || visible;

export const readPublished = editorOr({ _status: { equals: "published" } });

/** "edited" is Approved with Edits — approved content rendering editedBody. */
export const readPublicComments = editorOr({ status: { in: ["approved", "edited"] } });

export const readApproved = editorOr({ status: { equals: "approved" } });

/** No "approved" value here. A locked thread is readable, just not repliable. */
export const readOpenThreads = editorOr({ status: { in: ["open", "locked"] } });

/** No status field — visible until flagged. Inverse of the queue model above. */
export const readUnflagged = editorOr({ flagged: { not_equals: true } });

/** PII and per-user records: the whole record is sensitive, so no filter. */
export const readEditorsOnly: Access = ({ req }) => isEditor(req.user);
