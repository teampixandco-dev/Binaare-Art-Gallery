import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = './public/Binaare';
const outputDir = './public/artworks';

const slugMap = {
  "1": "together-we-bloom",
  "2": "beauty-in-simplicity",
  "3": "fields-of-quiet-gold",
  "4": "blooming-from-broken-pieces",
  "5": "unfolding-in-gold",
  "6": "between-light-and-darkness",
  "7": "reflections-of-a-golden-city",
  "8": "a-new-dawn",
  "9": "whispers-in-bloom",
  "10": "blooming-in-grace",
  "11": "whispers-of-serenity",
  "12": "different-hearts-one-friendship",
  "13": "petals-of-tender-strength",
  "14": "blossoms-of-the-heart",
  "15": "a-heart-that-endures",
  "24": "wings-of-golden-courage",
  "25": "rhythm-of-the-city",
  "26": "beauty-beyond-colour",
  "27": "strength-in-motion",
  "28": "the-crimson-queen",
  "29": "still-she-shines",
  "30": "path-of-natures-embrace",
  "31": "flow-of-inner-strength",
  "32": "the-courage-to-stand-alone"
};

async function processImages() {
  await fs.mkdir(outputDir, { recursive: true });
  const files = await fs.readdir(inputDir);
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const id = file.replace('.jpg', '').replace('.jpeg', '');
      const slug = slugMap[id] || id;
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, `${slug}.webp`);
      console.log(`Processing ${inputPath} -> ${outputPath}`);
      await sharp(inputPath)
        .resize({ width: 1440, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
    }
  }
}

processImages().catch(console.error);
