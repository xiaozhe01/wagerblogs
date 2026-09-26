import type { CollectionConfig, GlobalConfig } from "payload";

// Every Chinese string for the admin's own vocabulary lives here, not inlined
// across nineteen collection files. Adding a collection later costs one entry;
// forgetting to add one costs nothing, because `localise` leaves an untranslated
// entity exactly as Payload would have rendered it.

const GROUPS: Record<string, Record<string, string>> = {
  Editorial: { en: "Editorial", zh: "编辑" },
  Taxonomy: { en: "Taxonomy", zh: "分类" },
  Community: { en: "Community", zh: "社区" },
  Reference: { en: "Reference", zh: "参考资料" },
  Access: { en: "Access", zh: "权限" },
  Site: { en: "Site", zh: "站点" },
};

type Labels = { singular: Record<string, string>; plural: Record<string, string> };

/** Keyed by slug. Chinese has no plural form, so both entries repeat it. */
const LABELS: Record<string, Labels> = {
  articles: { singular: { en: "Article", zh: "文章" }, plural: { en: "Articles", zh: "文章" } },
  news: { singular: { en: "News story", zh: "新闻" }, plural: { en: "News", zh: "新闻" } },
  reviews: { singular: { en: "Review", zh: "测评" }, plural: { en: "Reviews", zh: "测评" } },
  authors: { singular: { en: "Author", zh: "作者" }, plural: { en: "Authors", zh: "作者" } },
  verticals: {
    singular: { en: "Vertical", zh: "垂直领域" },
    plural: { en: "Verticals", zh: "垂直领域" },
  },
  "news-sections": {
    singular: { en: "News section", zh: "新闻栏目" },
    plural: { en: "News sections", zh: "新闻栏目" },
  },
  comments: { singular: { en: "Comment", zh: "评论" }, plural: { en: "Comments", zh: "评论" } },
  "reader-reviews": {
    singular: { en: "Reader review", zh: "读者评价" },
    plural: { en: "Reader reviews", zh: "读者评价" },
  },
  "forum-threads": {
    singular: { en: "Forum thread", zh: "论坛主题" },
    plural: { en: "Forum threads", zh: "论坛主题" },
  },
  "forum-replies": {
    singular: { en: "Forum reply", zh: "论坛回复" },
    plural: { en: "Forum replies", zh: "论坛回复" },
  },
  notifications: {
    singular: { en: "Notification", zh: "通知" },
    plural: { en: "Notifications", zh: "通知" },
  },
  "bonus-offers": {
    singular: { en: "Bonus offer", zh: "优惠活动" },
    plural: { en: "Bonus offers", zh: "优惠活动" },
  },
  "help-directory-entries": {
    singular: { en: "Help directory entry", zh: "求助机构" },
    plural: { en: "Help directory entries", zh: "求助机构" },
  },
  media: { singular: { en: "Media", zh: "媒体文件" }, plural: { en: "Media", zh: "媒体文件" } },
  "site-users": {
    singular: { en: "Site user", zh: "站点用户" },
    plural: { en: "Site users", zh: "站点用户" },
  },
  users: { singular: { en: "User", zh: "后台用户" }, plural: { en: "Users", zh: "后台用户" } },
  faq: { singular: { en: "FAQ", zh: "常见问题" }, plural: { en: "FAQ", zh: "常见问题" } },
  "legal-documents": {
    singular: { en: "Legal document", zh: "法律文件" },
    plural: { en: "Legal documents", zh: "法律文件" },
  },
  "market-stats": {
    singular: { en: "Market stat", zh: "市场数据" },
    plural: { en: "Market stats", zh: "市场数据" },
  },
};

// Field labels, keyed by field name. Names repeat heavily across collections
// (slug x8, body x8, name x7), so one entry usually covers several editors.
// Payload derives a label from the field name when none is given, so an
// untranslated field still reads correctly in English.
const FIELDS: Record<string, Record<string, string>> = {
  // identity and routing
  name: { en: "Name", zh: "名称" },
  title: { en: "Title", zh: "标题" },
  slug: { en: "Slug", zh: "链接标识" },
  label: { en: "Label", zh: "标签" },
  value: { en: "Value", zh: "值" },
  url: { en: "URL", zh: "链接" },
  order: { en: "Order", zh: "排序" },
  type: { en: "Type", zh: "类型" },
  active: { en: "Active", zh: "启用" },

  // editorial body
  body: { en: "Body", zh: "正文" },
  excerpt: { en: "Excerpt", zh: "摘要" },
  description: { en: "Description", zh: "描述" },
  publishedAt: { en: "Published at", zh: "发布时间" },
  updatedAt: { en: "Updated at", zh: "更新时间" },
  heroImage: { en: "Hero image", zh: "题图" },
  heroImageCredit: { en: "Hero image credit", zh: "题图署名" },
  takeaways: { en: "Takeaways", zh: "要点" },
  takeaway: { en: "Takeaway", zh: "要点" },
  sources: { en: "Sources", zh: "信息来源" },
  related: { en: "Related", zh: "相关内容" },
  section: { en: "Section", zh: "栏目" },
  beat: { en: "Beat", zh: "报道领域" },
  beats: { en: "Beats", zh: "报道领域" },
  vertical: { en: "Vertical", zh: "垂直领域" },
  noun: { en: "Noun", zh: "名词" },
  crumb: { en: "Breadcrumb", zh: "面包屑" },
  hasReviews: { en: "Has reviews", zh: "包含测评" },

  // people
  author: { en: "Author", zh: "作者" },
  photo: { en: "Photo", zh: "照片" },
  bio: { en: "Bio", zh: "简介" },
  credentialLine: { en: "Credential line", zh: "职衔" },
  standards: { en: "Standards", zh: "工作准则" },
  standard: { en: "Standard", zh: "准则" },
  sameAs: { en: "Profile links", zh: "外部主页" },

  // reviews
  score: { en: "Score", zh: "评分" },
  categoryScores: { en: "Category scores", zh: "分项评分" },
  advantages: { en: "Advantages", zh: "亮点" },
  advantage: { en: "Advantage", zh: "亮点" },
  pros: { en: "Pros", zh: "优点" },
  pro: { en: "Pro", zh: "优点" },
  cons: { en: "Cons", zh: "缺点" },
  con: { en: "Con", zh: "缺点" },
  lastVerified: { en: "Last verified", zh: "最后核实" },
  needsReverification: { en: "Needs re-verification", zh: "需重新核实" },
  fundedAccountConfirmed: { en: "Funded account confirmed", zh: "已确认真实入金" },
  payoutSpeedText: { en: "Payout speed", zh: "出款速度" },
  bonusTerms: { en: "Bonus terms", zh: "优惠条款" },
  isPrimaryDomain: { en: "Is primary domain", zh: "为主域名" },
  primaryDomainLink: { en: "Primary domain link", zh: "主域名链接" },
  operatorLink: { en: "Operator link", zh: "运营商链接" },
  anchorText: { en: "Anchor text", zh: "锚文本" },
  relAttribute: { en: "Rel attribute", zh: "Rel 属性" },
  reviewBody: { en: "Review body", zh: "测评正文" },

  // seo group
  seo: { en: "SEO", zh: "SEO" },
  metaTitle: { en: "Meta title", zh: "Meta 标题" },
  metaDescription: { en: "Meta description", zh: "Meta 描述" },
  canonicalUrl: { en: "Canonical URL", zh: "规范链接" },
  ogImage: { en: "OG image", zh: "社交分享图" },

  // moderation
  status: { en: "Status", zh: "状态" },
  flagged: { en: "Flagged", zh: "已举报" },
};

/** The dashboard panels label rows by collection; reusing this dictionary
 * keeps those labels from drifting from the sidebar's. */
export function collectionLabel(
  slug: string,
  language?: string,
  form: "singular" | "plural" = "singular",
): string {
  const entry = LABELS[slug]?.[form];
  if (!entry) return slug;
  return (language && entry[language]) || entry.en;
}

type WithFields = { fields?: unknown[]; tabs?: Array<{ fields: unknown[] }> };

/** Rewrites labels in place and nothing else. The field tree's shape is an
 * invariant — tests/admin-labels.test.ts fails if this changes it. */
function localiseFields(fields: unknown[]): unknown[] {
  return fields.map((raw) => {
    const field = { ...(raw as Record<string, unknown>) };
    const name = typeof field.name === "string" ? field.name : undefined;

    if (name && FIELDS[name] && field.label === undefined) {
      field.label = FIELDS[name];
    }

    const nested = field as WithFields;
    if (Array.isArray(nested.fields)) field.fields = localiseFields(nested.fields);
    if (Array.isArray(nested.tabs)) {
      field.tabs = nested.tabs.map((tab) => ({ ...tab, fields: localiseFields(tab.fields) }));
    }

    return field;
  });
}

/**
 * Applies the dictionary to a collection or global without touching its own
 * file. An entity with no entry keeps whatever it already declared, so a new
 * collection ships working and can be translated whenever it suits.
 */
export function localise<T extends CollectionConfig | GlobalConfig>(entity: T): T {
  const labels = LABELS[entity.slug];
  const currentGroup = entity.admin?.group;
  const group = typeof currentGroup === "string" ? GROUPS[currentGroup] : undefined;

  return {
    ...entity,
    ...(labels
      ? "labels" in entity
        ? { labels: { singular: labels.singular, plural: labels.plural } }
        : { label: labels.singular }
      : {}),
    admin: {
      ...entity.admin,
      ...(group ? { group } : {}),
    },
    fields: localiseFields(entity.fields ?? []),
  } as T;
}
