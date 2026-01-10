import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { HIRAGANA, KATAKANA } from '../src/data/kana.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define audio directory
const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Combine and filter unique items based on romaji
const allKana = [...HIRAGANA, ...KATAKANA];
const uniqueItems = allKana
  .filter(item => item !== null && item.romaji)
  .reduce((acc, current) => {
    if (!acc.find(item => item.romaji === current.romaji)) {
      acc.push(current);
    }
    return acc;
  }, []);

// Helper to download a single file
const downloadFile = (char, romaji) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(AUDIO_DIR, `${romaji}.mp3`);

    // Check if file exists to skip
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${romaji} (already exists)`);
      resolve();
      return;
    }

    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(char)}&tl=ja&client=tw-ob`;
    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${char} (${romaji}): Status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`Downloaded ${romaji}.mp3`);
          resolve();
        });
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => { }); // Delete partial file
      reject(err);
    });
  });
};

// Main execution with delay to avoid rate limiting
const main = async () => {
  if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
  }

  console.log(`Starting download for ${uniqueItems.length} items using data from src/data/kana.js...`);

  for (const item of uniqueItems) {
    try {
      await downloadFile(item.char, item.romaji);
      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error downloading ${item.romaji}:`, error.message);
    }
  }

  console.log('Download complete!');
};

main();
