/**
 * Generate placeholder SVG comic cover images
 * Run with: node generate-placeholders.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const comics = [
  { name: 'crimson-knight', title: 'CRIMSON\nKNIGHT', issue: '#47', color: '#DC143C' },
  { name: 'astro-force', title: 'ASTRO\nFORCE', issue: '#12', color: '#4169E1' },
  { name: 'golden-age', title: 'GOLDEN\nAGE', issue: '#1', color: '#FFD700' },
  { name: 'spider-verse', title: 'SPIDER\nVERSE', issue: '#1', color: '#FF1744' },
  { name: 'amazing-fantasy', title: 'AMAZING\nFANTASY', issue: '#15', color: '#FF6B35' },
  { name: 'detective-comics', title: 'DETECTIVE\nCOMICS', issue: '#27', color: '#1E3A8A' },
  { name: 'x-men', title: 'X-MEN', issue: '#1', color: '#FCD34D' },
  { name: 'dark-phoenix', title: 'DARK\nPHOENIX', issue: '#137', color: '#B91C1C' },
  { name: 'infinity-gauntlet', title: 'INFINITY\nGAUNTLET', issue: '#1', color: '#7C3AED' },
  { name: 'watchmen', title: 'WATCHMEN', issue: '#1', color: '#FBBF24' }
];

function generateSVG(comic) {
  const lines = comic.title.split('\n');
  const yOffset = lines.length === 1 ? 200 : 180;

  return `<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="600" fill="${comic.color}"/>

  <!-- Halftone pattern overlay -->
  <defs>
    <pattern id="dots-${comic.name}" patternUnits="userSpaceOnUse" width="8" height="8">
      <circle cx="4" cy="4" r="2" fill="rgba(0,0,0,0.1)"/>
    </pattern>
  </defs>
  <rect width="400" height="600" fill="url(#dots-${comic.name})"/>

  <!-- Border -->
  <rect x="20" y="20" width="360" height="560" fill="none" stroke="#fff" stroke-width="4"/>

  <!-- Title -->
  ${lines.map((line, i) =>
    `<text x="200" y="${yOffset + (i * 60)}" font-family="Arial Black, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="2">${line}</text>`
  ).join('\n  ')}

  <!-- Issue number -->
  <text x="200" y="${yOffset + (lines.length * 60) + 40}" font-family="Arial, sans-serif" font-size="32" text-anchor="middle" fill="#fff">${comic.issue}</text>

  <!-- Bottom accent -->
  <rect x="40" y="520" width="320" height="60" fill="rgba(0,0,0,0.3)"/>
  <text x="200" y="560" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#fff">COLLECTOR'S EDITION</text>
</svg>`;
}

// Generate all placeholder SVGs
comics.forEach(comic => {
  const svg = generateSVG(comic);
  const filename = `${comic.name}.svg`;
  fs.writeFileSync(path.join(__dirname, filename), svg);
  console.log(`Generated ${filename}`);
});

console.log('\nAll placeholder comic covers generated successfully!');
console.log('You can now upload these to PayloadCMS or reference them directly.');
