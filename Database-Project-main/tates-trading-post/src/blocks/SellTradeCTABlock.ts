import type { Block } from 'payload'

export const SellTradeCTABlock: Block = {
  slug: 'sellTradeCTA',
  labels: {
    singular: 'Sell/Trade CTA',
    plural: 'Sell/Trade CTAs',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main content about selling/trading',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Get a Quote',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/sell-trade',
    },
  ],
}
