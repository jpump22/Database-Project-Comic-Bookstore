import type { Block } from 'payload'

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: {
    singular: 'Product Grid',
    plural: 'Product Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'sourceMode',
      type: 'radio',
      required: true,
      options: [
        { label: 'Manual Selection', value: 'MANUAL' },
        { label: 'Dynamic Query', value: 'QUERY' },
      ],
      defaultValue: 'MANUAL',
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.sourceMode === 'MANUAL',
      },
    },
    {
      name: 'query',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.sourceMode === 'QUERY',
      },
      fields: [
        {
          name: 'productType',
          type: 'relationship',
          relationTo: 'product-type',
        },
        {
          name: 'series',
          type: 'relationship',
          relationTo: 'series',
        },
        {
          name: 'publisher',
          type: 'relationship',
          relationTo: 'publishers',
        },
        {
          name: 'minPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'maxPrice',
          type: 'number',
          min: 0,
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
        },
        {
          name: 'sort',
          type: 'select',
          options: [
            { label: 'Newest First', value: '-createdAt' },
            { label: 'Price: Low to High', value: 'price' },
            { label: 'Price: High to Low', value: '-price' },
            { label: 'Title A-Z', value: 'title' },
          ],
          defaultValue: '-createdAt',
        },
        {
          name: 'limit',
          type: 'number',
          min: 1,
          max: 50,
          defaultValue: 12,
        },
      ],
    },
  ],
}
