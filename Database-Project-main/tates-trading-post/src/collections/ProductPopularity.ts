import type { CollectionConfig } from 'payload'

export const ProductPopularity: CollectionConfig = {
  slug: 'product-popularity',
  dbName: 'a_product_popularity',
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['product', 'views', 'addToCarts', 'purchases', 'updatedAt'],
    defaultSort: '-purchases',
    group: 'Analytics',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      name: 'views',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'addToCarts',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'purchases',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
    },
  ],
}
