import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  dbName: 'a_products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'images', 'price', 'category', 'productType', 'publisher'],
    defaultSort: '-updatedAt',
    group: 'Inventory',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Comics', value: 'comics' },
        { label: 'Collectibles', value: 'collectibles' },
      ],
      required: true,
      defaultValue: 'comics',
      index: true,
      admin: {
        description: 'Main category: Comics (books/issues) or Collectibles (toys/figures/graded items)',
      },
    },
    {
      name: 'productType',
      type: 'relationship',
      relationTo: 'product-type',
      required: true,
      index: true,
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      index: true,
    },
    {
      name: 'badge',
      type: 'select',
      options: [
        { label: 'None', value: 'NONE' },
        { label: 'New', value: 'NEW' },
        { label: 'Hot', value: 'HOT' },
        { label: 'Sale', value: 'SALE' },
        { label: 'Exclusive', value: 'EXCLUSIVE' },
      ],
      required: true,
      defaultValue: 'NONE',
      admin: {
        description: 'Display badge on product cards',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
      ],
      admin: {
        description: 'Upload product images here. The first image will be the primary cover image displayed on shop pages.',
        initCollapsed: false,
      },
    },
    {
      name: 'grade',
      type: 'text',
      required: true,
      defaultValue: 'NONE',
      admin: {
        description: 'CGC grade for vintage comics (e.g., "CGC 9.2") or "NONE" if not graded',
        placeholder: 'NONE',
      },
    },
  ],
}
