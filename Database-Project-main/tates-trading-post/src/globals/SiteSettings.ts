import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'storeName',
              type: 'text',
              required: true,
              defaultValue: 'Tates Trading Post',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'tagline',
              type: 'text',
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'email',
              type: 'email',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street1', type: 'text' },
                { name: 'street2', type: 'text' },
                { name: 'city', type: 'text' },
                { name: 'state', type: 'text' },
                { name: 'postalCode', type: 'text' },
                { name: 'country', type: 'text', defaultValue: 'USA' },
              ],
            },
          ],
        },
        {
          label: 'Hours',
          fields: [
            {
              name: 'storeHours',
              type: 'array',
              fields: [
                {
                  name: 'day',
                  type: 'select',
                  options: [
                    { label: 'Monday', value: 'monday' },
                    { label: 'Tuesday', value: 'tuesday' },
                    { label: 'Wednesday', value: 'wednesday' },
                    { label: 'Thursday', value: 'thursday' },
                    { label: 'Friday', value: 'friday' },
                    { label: 'Saturday', value: 'saturday' },
                    { label: 'Sunday', value: 'sunday' },
                  ],
                  required: true,
                },
                {
                  name: 'open',
                  type: 'text',
                  admin: {
                    description: 'e.g., "10:00 AM"',
                  },
                },
                {
                  name: 'close',
                  type: 'text',
                  admin: {
                    description: 'e.g., "8:00 PM"',
                  },
                },
                {
                  name: 'closed',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Stats',
          fields: [
            {
              name: 'stats',
              type: 'group',
              fields: [
                {
                  name: 'totalComics',
                  type: 'number',
                  defaultValue: 5000,
                  admin: {
                    description: 'Total number of comics in inventory',
                  },
                },
                {
                  name: 'rareItems',
                  type: 'number',
                  defaultValue: 500,
                  admin: {
                    description: 'Number of rare/collectible items',
                  },
                },
                {
                  name: 'testimonialQuote',
                  type: 'text',
                  defaultValue: 'Best comic shop in the city!',
                  admin: {
                    description: 'Customer testimonial for homepage',
                  },
                },
                {
                  name: 'testimonialAuthor',
                  type: 'text',
                  defaultValue: 'Comic Book Resources',
                  admin: {
                    description: 'Attribution for testimonial',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Policies',
          fields: [
            {
              name: 'sellTradePolicy',
              type: 'richText',
              admin: {
                description: 'Policy for buying/trading collectibles',
              },
            },
            {
              name: 'returnPolicy',
              type: 'richText',
            },
            {
              name: 'privacyPolicy',
              type: 'richText',
            },
          ],
        },
      ],
    },
  ],
}
