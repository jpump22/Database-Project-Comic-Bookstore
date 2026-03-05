import type { CollectionConfig } from 'payload'

export const Series: CollectionConfig = {
  slug: 'series',
  dbName: 'a_series',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'startYear', 'endYear', 'primaryPublisher', 'updatedAt'],
    group: 'Catalog',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'startYear',
      type: 'number',
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 5,
    },
    {
      name: 'endYear',
      type: 'number',
      min: 1900,
      validate: (val, { data }) => {
        if (val && data?.startYear && val < data.startYear) {
          return 'End year must be after start year'
        }
        return true
      },
    },
    {
      name: 'primaryPublisher',
      type: 'relationship',
      relationTo: 'publishers',
      required: true,
      index: true,
    },
  ],
}
