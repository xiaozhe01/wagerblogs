import type { CollectionConfig } from 'payload'
import { seoFields } from './fields/seo'
import { revalidateSearch } from './hooks/revalidate-search'

// The /news/[section] route level. Each section groups a set of News
// stories. Kept minimal — sections don't have their own bodies, they're
// filter/routing containers.

export const NewsSections: CollectionConfig = {
  slug: 'news-sections',
  admin: {
    group: 'Editorial',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: revalidateSearch,
    afterDelete: revalidateSearch,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'One or two sentences on what this section covers. Rendered on the /news/[section] landing page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
    },
    seoFields,
  ],
}
