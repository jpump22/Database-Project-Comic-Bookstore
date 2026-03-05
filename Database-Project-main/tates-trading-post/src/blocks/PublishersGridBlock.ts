import type { Block } from 'payload'

export const PublishersGridBlock: Block = {
  slug: 'publishersGrid',
  labels: {
    singular: 'Publishers Grid',
    plural: 'Publishers Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Our Publishers',
    },
    {
      name: 'publishers',
      type: 'relationship',
      relationTo: 'publishers',
      hasMany: true,
      admin: {
        description: 'Leave empty to show all',
      },
    },
  ],
}
