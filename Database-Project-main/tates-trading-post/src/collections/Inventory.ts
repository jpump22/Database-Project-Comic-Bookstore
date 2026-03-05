import type { CollectionConfig } from 'payload'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  dbName: 'a_inventory',
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['product', 'location', 'quantity', 'cost', 'updatedAt'],
    defaultSort: '-updatedAt',
    group: 'Inventory',
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
      name: 'location',
      type: 'text',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'cost',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
  ],
}
