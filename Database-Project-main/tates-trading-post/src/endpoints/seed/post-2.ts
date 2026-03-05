import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
  categories,
}) => {
  // Find category IDs: Manga (1), Horror (3)
  const postCategories = [categories[1].id, categories[3].id]

  return {
    slug: 'berserk-deluxe-edition-vol-1',
    _status: 'published',
    authors: [author],
    categories: postCategories,
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Experience Kentaro Miura\'s dark fantasy masterpiece in stunning deluxe format.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'About This Edition',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'The Berserk Deluxe Edition Volume 1 collects the first three volumes of the original manga in a premium oversized format. At 7" x 10", these hardcover editions showcase Miura\'s intricate artwork in unprecedented detail. This first volume introduces Guts, the Black Swordsman, and begins the epic tale of revenge, survival, and destiny that has captivated readers worldwide for over three decades.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Premium Quality',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'This deluxe edition features high-quality paper stock, durable binding, and includes a ribbon bookmark. The larger format does justice to Miura\'s incredibly detailed illustrations, from the haunting demons to the elaborate medieval settings. Each page is a work of art, making this edition essential for both longtime fans and newcomers to the series.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: '',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'A Dark Fantasy Classic',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Berserk is widely regarded as one of the greatest manga series ever created. Its influence can be seen across media, from Dark Souls to countless manga and anime that followed. This deluxe edition is the definitive way to experience Guts\' journey, offering readers the opportunity to own this legendary series in a format worthy of its status. Whether displayed on your shelf or read cover to cover, this is a treasure for any manga enthusiast.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description:
        'Berserk Deluxe Edition Volume 1 - Oversized hardcover collecting the first three volumes of Kentaro Miura\'s dark fantasy masterpiece.',
      image: heroImage.id,
      title: 'Berserk Deluxe Edition Vol. 1 - Hardcover',
    },
    relatedPosts: [],
    title: 'Berserk Deluxe Edition Vol. 1 - Hardcover',
  }
}
