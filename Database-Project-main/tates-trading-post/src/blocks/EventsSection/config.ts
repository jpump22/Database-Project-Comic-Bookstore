import type { Block } from 'payload'

export const EventsSection: Block = {
  slug: 'eventsSection',
  interfaceName: 'EventsSectionBlock',
  fields: [
    {
      name: 'blockName',
      type: 'text',
      admin: {
        description: 'Internal name for this block',
      },
    },
    {
      name: 'events',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'Select up to 3 upcoming events to display',
      },
    },
  ],
}
