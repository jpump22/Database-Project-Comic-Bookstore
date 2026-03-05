import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
  categories,
}) => {
  // Find category IDs: Independent (2), Sci-Fi (4)
  const postCategories = [categories[2].id, categories[4].id]

  return {
    slug: 'saga-vol-1-signed-edition',
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
                text: 'A rare signed edition of the groundbreaking space opera from Brian K. Vaughan and Fiona Staples.',
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
                text: 'About Saga',
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
                text: 'Saga is a sweeping science fiction epic from the creative minds of writer Brian K. Vaughan (Y: The Last Man, Ex Machina) and artist Fiona Staples. This first volume introduces us to Alana and Marko, star-crossed lovers from warring species trying to raise their daughter Hazel while being hunted by both sides of a galactic war. Saga has won numerous Eisner Awards and is considered one of the most important comics of the modern era.',
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
                text: 'Signed by Brian K. Vaughan',
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
                text: 'This particular copy comes signed by writer Brian K. Vaughan on the title page. Obtained at a convention signing event, this copy includes a Certificate of Authenticity. The signature is clean and bold, adding significant value to an already collectible first volume. The book itself is in pristine condition with no visible wear, making it an exceptional piece for any serious comic collector.',
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
                text: 'Why Saga Matters',
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
                text: 'Saga broke new ground in comics by blending science fiction, fantasy, romance, and social commentary into a uniquely compelling narrative. Its success helped prove that creator-owned comics could compete with the biggest superhero titles. The series tackles mature themes with sophistication while maintaining accessibility, making it a perfect entry point for readers new to comics. This signed first volume represents the beginning of a modern masterpiece.',
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
      description: 'Saga Volume 1 signed by Brian K. Vaughan with Certificate of Authenticity. Pristine condition. A must-have for any Saga collector.',
      image: heroImage.id,
      title: 'Saga Vol. 1 - Signed by Brian K. Vaughan',
    },
    relatedPosts: [],
    title: 'Saga Vol. 1 - Signed by Brian K. Vaughan',
  }
}
