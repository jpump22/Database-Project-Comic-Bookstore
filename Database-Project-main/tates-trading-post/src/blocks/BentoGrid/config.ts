import type { Block } from 'payload'

export const BentoGrid: Block = {
  slug: 'bentoGrid',
  interfaceName: 'BentoGridBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'blockName',
          type: 'text',
          admin: {
            description: 'Internal name for this block',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Featured Collection',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'featuredTitle',
          type: 'text',
          defaultValue: 'Winter Collection 2025',
          admin: {
            description: 'Title for the large featured card',
          },
        },
        {
          name: 'featuredDescription',
          type: 'textarea',
          defaultValue: 'Exclusive variants and limited editions from Marvel, DC, and indie publishers',
        },
        {
          name: 'featuredLabel',
          type: 'text',
          defaultValue: 'Featured Drop',
        },
        {
          name: 'featuredLink',
          type: 'text',
          defaultValue: '#',
        },
        {
          name: 'featuredCtaText',
          type: 'text',
          defaultValue: 'View Collection →',
        },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'Select up to 3 products to feature in the bento grid',
      },
    },
  ],
}
