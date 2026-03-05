import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'tatesHero',
    featuredProduct: 1, // The Amazing Spider-Man #300 - HOT badge, CGC 9.2
  },
  meta: {
    description: 'Premium comic books, rare collectibles, and epic stories await at Tates Trading Post.',
    title: 'Tates Trading Post | Comic Books & Collectibles',
  },
  title: 'Home',
  layout: [
    {
      blockType: 'bentoGrid',
      products: [5, 9, 16], // X-Men #1 (NEW), Saga #1 (HOT), Invincible #1 (SALE)
    },
    {
      blockType: 'vintageSection',
      vintageProducts: [1, 7, 11, 18], // Spider-Man #300, Walking Dead #1, Watchmen #1, Sandman #1
    },
    {
      blockType: 'eventsSection',
      events: [1, 2, 3], // Mike Mignola Signing, Vintage Appraisal Day, Cosplay Contest
    },
  ],
}
