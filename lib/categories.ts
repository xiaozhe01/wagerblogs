import { categories as categoryTaxonomy } from "@/lib/site-data";
import { chipSlug } from "@/lib/utils";

export type Category = {
  slug: string;
  href: string;
  name: string;
  desc: string;
};

// Each vertical gets its own route, resolved from the taxonomy in site-data.
// TODO(cms): the taxonomy comes from the CMS, and each record carries its own
// article list — today the body content below a category is shared placeholder.
export const categories: Category[] = categoryTaxonomy.map((category) => ({
  slug: chipSlug(category.name),
  href: `/categories/${chipSlug(category.name)}`,
  name: category.name,
  desc: category.desc,
}));

export function findCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export const categoryParams = categories.map((category) => ({
  slug: category.slug,
}));
