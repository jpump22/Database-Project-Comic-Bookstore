import type { CollectionConfig } from 'payload'

export const ProductType: CollectionConfig = {
  slug: 'product-type',
  dbName: 'a_product_type',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'updatedAt'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}
