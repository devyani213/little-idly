const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_DIR = '/Users/mac/.gemini/antigravity/scratch/little-idly';
const RESEARCH_DIR = path.join(BASE_DIR, 'research');

const sites = [
  { name: 'littleidly_home', url: 'https://www.littleidly.ae/' },
  { name: 'littleidly_menu', url: 'https://www.littleidly.ae/menus' },
  { name: 'gourou', url: 'https://www.gourouindianfood.fr/' },
  { name: 'sambarcafe', url: 'https://sambarcafe.com/' },
  { name: 'mrspring', url: 'https://mrspringmrsfresh.com/' },
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 250;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 15000) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          setTimeout(resolve, 1000);
        }
      }, 150);
    });
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) return resolve(null);
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      resolve(null);
    });
  });
}

async function run() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  for (const site of sites) {
    console.log(`\n--- Visiting ${site.name}: ${site.url} ---`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    try {
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 45000 });
      console.log(`Page loaded. Waiting 3s...`);
      await new Promise(r => setTimeout(r, 3000));

      // Scroll slowly
      console.log('Scrolling page...');
      await autoScroll(page);
      await new Promise(r => setTimeout(r, 2000));

      // Capture full screenshot
      const ssPath = path.join(RESEARCH_DIR, `${site.name}_1440.png`);
      await page.screenshot({ path: ssPath, fullPage: true });
      console.log(`Saved screenshot to ${ssPath}`);

      // Extract site specific data
      const data = await page.evaluate(() => {
        const title = document.title;
        const text = document.body.innerText;
        const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          class: img.className
        }));
        
        // Find colors
        const elements = Array.from(document.querySelectorAll('*')).slice(0, 300);
        const colors = new Set();
        const bgColors = new Set();
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.color) colors.add(style.color);
          if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') bgColors.add(style.backgroundColor);
        });

        // Collect fonts
        const fontFamilies = new Set();
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.fontFamily) fontFamilies.add(style.fontFamily);
        });

        return {
          title,
          textLength: text.length,
          snippet: text.slice(0, 2000),
          fullText: text,
          images,
          colors: Array.from(colors),
          bgColors: Array.from(bgColors),
          fontFamilies: Array.from(fontFamilies)
        };
      });

      fs.writeFileSync(path.join(RESEARCH_DIR, `${site.name}_data.json`), JSON.stringify(data, null, 2));
      console.log(`Extracted ${data.images.length} images, saved text and colors.`);

      // If little idly, let's also download all images
      if (site.name.startsWith('littleidly')) {
        console.log(`Downloading Little Idly images...`);
        const imgDir = path.join(BASE_DIR, 'assets', 'downloaded');
        if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
        
        let count = 0;
        for (const img of data.images) {
          if (!img.src || img.src.startsWith('data:') || !img.src.includes('wixstatic.com')) continue;
          // Filter out tiny tracking pixels or icons if needed
          const ext = img.src.split('?')[0].split('.').pop() || 'png';
          const filename = `img_${count}_${path.basename(img.src.split('?')[0]).slice(-25)}`;
          const dest = path.join(imgDir, filename);
          await downloadFile(img.src, dest);
          count++;
        }
        console.log(`Downloaded ${count} images.`);
      }

    } catch (err) {
      console.error(`Error processing ${site.url}:`, err.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\nAll research scraping complete!');
}

run().catch(console.error);
