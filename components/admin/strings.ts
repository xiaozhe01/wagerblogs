// Dashboard copy. Same contract as collections/i18n-labels.ts: one dictionary,
// English required, every other language optional. A new panel adds entries
// here and renders in English until someone translates it — never blocked.

const STRINGS = {
  newsroom: { en: "Newsroom", zh: "新闻编辑室" },
  awaitingPublication: { en: "Awaiting publication", zh: "待发布" },
  publishedRecords: { en: "Published records", zh: "已发布内容" },
  carryingPlaceholder: { en: "Carrying placeholder copy", zh: "含占位文案" },
  allPublished: { en: "Every editorial record is published.", zh: "所有内容均已发布。" },
  recentlyEdited: { en: "Recently edited", zh: "最近编辑" },
  byCollection: { en: "By collection", zh: "按集合统计" },
  collection: { en: "Collection", zh: "集合" },
  live: { en: "Live", zh: "已发布" },
  draft: { en: "Draft", zh: "草稿" },
  placeholder: { en: "Placeholder", zh: "占位" },
  awaitingModeration: { en: "Awaiting moderation", zh: "待审核" },
  nothingHeld: {
    en: "Nothing is held for review. Reader comments and forum posts appear here once site accounts can sign in.",
    zh: "暂无待审核内容。站点账号开放登录后，读者评论与论坛帖子会显示在此。",
  },
  editingNow: { en: "Editing now", zh: "正在编辑" },
  nobodyEditing: { en: "Nobody has a record open.", zh: "当前无人打开任何内容。" },
  coverage: { en: "Coverage by vertical", zh: "各垂直领域覆盖情况" },
  covered: { en: "covered", zh: "已覆盖" },
  emptyIndex: { en: "Empty index", zh: "空索引页" },
  reviewsShort: { en: "rev", zh: "测评" },
  articlesShort: { en: "art", zh: "文章" },
  justNow: { en: "just now", zh: "刚刚" },
  minutesAgo: { en: "{n}m ago", zh: "{n} 分钟前" },
  hoursAgo: { en: "{n}h ago", zh: "{n} 小时前" },
  today: { en: "today", zh: "今天" },
  yesterday: { en: "yesterday", zh: "昨天" },
  daysAgo: { en: "{n}d ago", zh: "{n} 天前" },
  noText: { en: "(no text)", zh: "（无正文）" },
  unknownUser: { en: "Unknown user", zh: "未知用户" },
} as const;

export type StringKey = keyof typeof STRINGS;

/** Falls back to English for any language without an entry. */
export function t(key: StringKey, language?: string, n?: number): string {
  const entry = STRINGS[key] as Record<string, string>;
  const value = (language && entry[language]) || entry.en;
  return n === undefined ? value : value.replace("{n}", String(n));
}

/** Dates follow the admin language, not the server's locale. */
export const dateLocale = (language?: string) => (language === "zh" ? "zh-CN" : "en-GB");
