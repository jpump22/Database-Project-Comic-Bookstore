import type { Media, User, Category } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
  categories: Category[]
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
  categories,
}) => {
  // Find category IDs: Superhero (0), Vintage (5)
  const postCategories = [categories[0].id, categories[5].id]

  return {
    slug: 'amazing-spider-man-300',
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
                text: 'A legendary issue featuring the first full appearance of Venom, one of Marvel\'s most iconic antiheroes.',
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
                text: 'About This Issue',
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
                text: 'The Amazing Spider-Man #300, published in May 1988, marks a pivotal moment in Marvel Comics history. This issue introduces Venom in his full glory, a symbiotic villain who would become one of Spider-Man\'s greatest adversaries. Written by David Michelinie and illustrated by Todd McFarlane, this comic represents peak late-80s Marvel storytelling.',
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
                text: 'Condition & Grading',
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
                text: 'This particular copy is in Near Mint condition with sharp corners, vibrant colors, and minimal spine stress. The black cover with the iconic web pattern remains glossy and shows no significant wear. A true collector\'s piece that would make an excellent addition to any serious Spider-Man collection.',
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
                text: 'Investment Value',
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
                text: 'With Venom\'s continued popularity in both comics and film, Amazing Spider-Man #300 has seen steady appreciation in value over the years. High-grade copies command premium prices, and this issue remains one of the most sought-after modern-age comics. Whether you\'re a longtime collector or just starting out, this is a key issue you don\'t want to miss.',
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
        'The Amazing Spider-Man #300 featuring the first full appearance of Venom. Near Mint condition. A must-have for any serious Spider-Man collector.',
      image: heroImage.id,
      title: 'The Amazing Spider-Man #300 - First Venom Appearance',
    },
    relatedPosts: [], // this is populated by the seed script
    title: 'The Amazing Spider-Man #300 - First Venom Appearance',
  }
}
