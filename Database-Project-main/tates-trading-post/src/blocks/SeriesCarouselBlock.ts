import type { Block } from 'payload'

export const SeriesCarouselBlock: Block = {
  slug: 'seriesCarousel',
  labels: {
    singular: 'Series Carousel',
    plural: 'Series Carousels',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Popular Series',
    },
    {
      name: 'publisher',
      type: 'relationship',
      relationTo: 'publishers',
      admin: {
        description: 'Filter by publisher (leave empty for all)',
      },
    },
    {
      name: 'featuredOnly',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'limit',
      type: 'number',
      min: 1,
      max: 20,
      defaultValue: 8,
    },
  ],
}
