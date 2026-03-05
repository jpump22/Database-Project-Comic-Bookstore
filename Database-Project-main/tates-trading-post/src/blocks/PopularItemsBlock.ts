import type { Block } from 'payload'

export const PopularItemsBlock: Block = {
  slug: 'popularItems',
  labels: {
    singular: 'Popular Items Block',
    plural: 'Popular Items Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Trending Now',
    },
    {
      name: 'timeWindow',
      type: 'select',
      required: true,
      options: [
        { label: 'All Time', value: 'ALL_TIME' },
        { label: 'Last 30 Days', value: 'Y30D' },
        { label: 'Last 7 Days', value: 'Y7D' },
      ],
      defaultValue: 'Y7D',
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 20,
      defaultValue: 6,
    },
  ],
}
