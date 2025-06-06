import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicon() {
  try {
    const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/logo.svg'));
    
    // Generate favicon.ico
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 