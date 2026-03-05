import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'status', 'updatedAt'],
    defaultSort: 'date',
    group: 'Content',
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
      admin: {
        description: 'Event name (e.g., "Mike Mignola Signing")',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        description: 'Event date',
      },
    },
    {
      name: 'timeStart',
      type: 'text',
      admin: {
        description: 'Start time (e.g., "2:00 PM")',
        placeholder: '2:00 PM',
      },
    },
    {
      name: 'timeEnd',
      type: 'text',
      admin: {
        description: 'End time (e.g., "5:00 PM")',
        placeholder: '5:00 PM',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief event description',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional event image',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
            }
            return value
          },
        ],
      },
    },
  ],
}
