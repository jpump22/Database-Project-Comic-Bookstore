import type { CollectionConfig } from 'payload'

export const PurchaseHistory: CollectionConfig = {
  slug: 'a_purchase_history',
  admin: {
    useAsTitle: 'product',
    defaultColumns: ['product', 'customer', 'unitPrice', 'quantity', 'updatedAt'],
    defaultSort: '-updatedAt',
    group: 'Sales',
  },
  access: {
    read: () => true,
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
      name: 'customer',
      type: 'relationship',
      relationTo: 'a_customers',
      required: true,
      index: true,
    },
    {
      name: 'unitPrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 1,
    },
  ],
}
