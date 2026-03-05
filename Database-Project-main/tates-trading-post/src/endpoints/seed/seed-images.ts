import type { PayloadHandler } from 'payload'
import { uploadProductImages } from './upload-product-images'

export const seedImagesHandler: PayloadHandler = async (req, res) => {
  try {
    console.log('🚀 Starting image seed process...')

    await uploadProductImages(req.payload)

    res.json({
      success: true,
      message: 'Product images uploaded successfully',
    })
  } catch (error) {
    console.error('Error seeding images:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
