import type { Block } from 'payload'

export const VintageSection: Block = {
  slug: 'vintageSection',
  interfaceName: 'VintageSectionBlock',
  fields: [
    {
      name: 'blockName',
      type: 'text',
      admin: {
        description: 'Internal name for this block',
      },
    },
    {
      name: 'titleOutline',
      type: 'text',
      defaultValue: 'RARE',
      admin: {
        description: 'First part of the title (outlined style)',
      },
    },
    {
      name: 'titleSolid',
      type: 'text',
      defaultValue: 'COLLECTIBLES',
      admin: {
        description: 'Second part of the title (solid style)',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      defaultValue: 'Investment-grade comics & vintage treasures',
    },
    {
      name: 'vintageProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 4,
      admin: {
        description: 'Select 3-4 rare/vintage products. First 3 are comic cards, 4th becomes an info card.',
      },
    },
    {
      name: 'infoCardTitle',
      type: 'text',
      defaultValue: 'CGC Certified',
      admin: {
        description: 'Title for the info card (shown if less than 4 products selected)',
      },
    },
    {
      name: 'infoCardText',
      type: 'textarea',
      defaultValue: 'All vintage items are professionally graded and authenticated',
      admin: {
        description: 'Description for the info card',
      },
    },
    {
      name: 'infoCardLink',
      type: 'text',
      defaultValue: '#',
      admin: {
        description: 'Link for "Learn More" button',
      },
    },
  ],
}
