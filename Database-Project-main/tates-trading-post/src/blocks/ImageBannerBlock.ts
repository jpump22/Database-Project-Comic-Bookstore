import type { Block } from 'payload'

export const ImageBannerBlock: Block = {
  slug: 'imageBanner',
  labels: {
    singular: 'Image Banner',
    plural: 'Image Banners',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Optional link URL',
      },
    },
  ],
}
