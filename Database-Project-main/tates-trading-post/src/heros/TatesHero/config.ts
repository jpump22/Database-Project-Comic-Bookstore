import type { Field } from 'payload'

export const TatesHeroFields: Field[] = [
  {
    name: 'title',
    type: 'text',
    defaultValue: 'YOUR COMIC UNIVERSE',
    admin: {
      description: 'Main hero title (will be split into animated words)',
    },
  },
  {
    name: 'subtitle',
    type: 'text',
    defaultValue: 'Premium collectibles, rare finds, and epic stories await',
  },
  {
    name: 'ctaText',
    type: 'text',
    defaultValue: 'Explore Collection',
  },
  {
    name: 'ctaLink',
    type: 'text',
    defaultValue: '#new',
  },
  {
    type: 'collapsible',
    label: 'Accent Card (Featured Product)',
    admin: {
      initCollapsed: false,
    },
    fields: [
      {
        name: 'featuredProduct',
        type: 'relationship',
        relationTo: 'products',
        admin: {
          description: 'Product to feature in the accent card (This Week section)',
        },
      },
      {
        name: 'accentLabel',
        type: 'text',
        defaultValue: 'This Week',
        admin: {
          description: 'Label above the product name',
        },
      },
    ],
  },
]
