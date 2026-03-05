# Placeholder Comic Cover Images

This directory contains placeholder SVG images for testing the Tates Trading Post dynamic content system.

## Generated Images

10 placeholder comic cover SVGs have been generated:

1. **crimson-knight.svg** - Red themed (#DC143C)
2. **astro-force.svg** - Blue themed (#4169E1)
3. **golden-age.svg** - Gold themed (#FFD700)
4. **spider-verse.svg** - Red accent (#FF1744)
5. **amazing-fantasy.svg** - Orange (#FF6B35)
6. **detective-comics.svg** - Dark blue (#1E3A8A)
7. **x-men.svg** - Yellow (#FCD34D)
8. **dark-phoenix.svg** - Dark red (#B91C1C)
9. **infinity-gauntlet.svg** - Purple (#7C3AED)
10. **watchmen.svg** - Yellow accent (#FBBF24)

## Usage

### Option 1: Upload to PayloadCMS (Recommended)

1. Navigate to http://localhost:3000/admin/collections/media
2. Click "Create New"
3. Upload each SVG file
4. Use the uploaded media when creating Products

### Option 2: Direct Reference (For Testing)

Reference these images directly in your code:
```typescript
const imageUrl = '/placeholders/crimson-knight.svg'
```

## Regenerating Placeholders

To regenerate or modify the placeholders:

```bash
cd public/placeholders
node generate-placeholders.js
```

Edit `generate-placeholders.js` to change colors, titles, or add new comics.

## Features

Each placeholder includes:
- Comic book style layout
- Halftone dot pattern overlay
- Bold title text with stroke
- Issue number
- "COLLECTOR'S EDITION" label
- Color-coded themes
- 400x600px dimensions (standard comic cover ratio)

## Next Steps

1. Upload these SVGs to PayloadCMS Media collection
2. Create Products and link to these images
3. Test dynamic rendering on homepage
4. Replace with real comic cover images when available
