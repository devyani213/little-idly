const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VERIFY_DIR = '/Users/mac/.gemini/antigravity/scratch/little-idly/research/verification';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8888', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2600));

  const sections = [
    { id: '#story', name: 'section_story_metrics.png' },
    { id: '#made-fresh', name: 'section_made_fresh.png' },
    { id: '#see-whats-cooking', name: 'section_see_whats_cooking.png' },
    { id: '#family-time', name: 'section_family_time.png' },
    { id: '#updates', name: 'section_updates.png' }
  ];

  for (const sec of sections) {
    const el = await page.$(sec.id);
    if (el) {
      await el.scrollIntoView();
      await new Promise(r => setTimeout(r, 600));
      await el.screenshot({ path: path.join(VERIFY_DIR, sec.name) });
      console.log(`Captured ${sec.name}`);
    }
  }

  // Also capture social strip & polaroid cards
  const socialEl = await page.$('.polaroid-card');
  if (socialEl) {
    await socialEl.scrollIntoView();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(VERIFY_DIR, 'section_social_polaroid.png') });
    console.log('Captured section_social_polaroid.png');
  }

  await browser.close();
}

run();
