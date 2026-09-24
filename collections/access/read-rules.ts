import type { Access, Where } from "payload";

// Every collection shipped `read: () => true`. Payload does not filter `_status`
// or a moderation field on its own, so /api/<slug> served drafts and unmoderated
// content to anonymous callers. The frontend routes escaped it only because each
// one passes publishedFilter by hand; nothing guarded the REST API.
//
// Payload sets `req.user.collection` to the slug of the auth collection a
// session came from, server-side only — which is where access rules run.
// AdminUsers.ts declares slug "users"; site accounts live in "site-users".
// Keying off collection identity rather than a role field means the rule
// survives site-user auth landing: a logged-in reader is not an editor.
//
// The check fails closed. An unrecognised session falls through to the
// anonymous filter and sees less, never more.
const isEditor = (user: { collection?: string } | null) => user?.collection === "users";

const editorOr =
  (visible: Where): Access =>
  ({ req }) =>
    isEditor(req.user) || visible;

/** Editorial collections: a draft is invisible until it is published. */
export const readPublished = editorOr({ _status: { equals: "published" } });

/** Comments. "edited" is Approved with Edits — approved content that renders
 * editedBody in place of body, so omitting it would hide comments a moderator
 * actually cleared. */
export const readPublicComments = editorOr({ status: { in: ["approved", "edited"] } });

/** ReaderReviews. Only approved contributes to AggregateRating, so the visible
 * set and the rating set are the same set. */
export const readApproved = editorOr({ status: { equals: "approved" } });

/** ForumThreads has no "approved" value. A locked thread is still readable,
 * just not repliable, so both open and locked are public; pending, flagged and
 * spam are not. */
export const readOpenThreads = editorOr({ status: { in: ["open", "locked"] } });

/** ForumReplies carries no status field — visible until flagged. Inverse of the
 * moderation-queue model above, and a deliberate difference in visibility
 * model rather than a weaker guard. */
export const readUnflagged = editorOr({ flagged: { not_equals: true } });

/** PII and per-user records. No filter would be honest here — the whole record
 * is sensitive, so anonymous callers get nothing. */
export const readEditorsOnly: Access = ({ req }) => isEditor(req.user);
