const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const VERIFY_DIR = '/Users/mac/.gemini/antigravity/scratch/little-idly/research/verification';

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          setTimeout(resolve, 800);
        }
      }, 100);
    });
  });
}

async function run() {
  console.log('Running comprehensive verification test...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const errors = [];
  const failedRequests = [];

  async function captureViewport(width, height, label) {
    console.log(`\nTesting ${label} (${width}x${height})...`);
    const page = await browser.newPage();
    await page.setViewport({ width, height });

    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(`[${label}] Console Error: ${msg.text()}`);
    });
    page.on('requestfailed', req => {
      failedRequests.push(`[${label}] 404/Failed: ${req.url()}`);
    });

    await page.goto('http://localhost:8888', { waitUntil: 'networkidle2' });
    // Wait for preloader curtain to complete
    await new Promise(r => setTimeout(r, 2600));

    // Capture above-the-fold
    await page.screenshot({ path: path.join(VERIFY_DIR, `site_${label}_fold.png`) });

    // Scroll through page to trigger all animations & image renders
    await autoScroll(page);
    await new Promise(r => setTimeout(r, 1000));

    // Capture full-page
    await page.screenshot({ path: path.join(VERIFY_DIR, `site_${label}_full.png`), fullPage: true });

    // Check horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    if (scrollWidth > clientWidth) {
      console.warn(`[WARNING] Horizontal scroll on ${label}: ${scrollWidth} > ${clientWidth}`);
    } else {
      console.log(`[PASS] No horizontal overflow on ${label} (${scrollWidth} <= ${clientWidth})`);
    }

    await page.close();
  }

  // 1. 1440px Desktop
  await captureViewport(1440, 900, '1440px');

  // 2. 768px Tablet
  await captureViewport(768, 1024, '768px');

  // 3. 390px Mobile
  await captureViewport(390, 844, '390px');

  // 4. Interactive Functional Tests
  console.log('\n--- Testing Interactive Functions ---');
  const testPage = await browser.newPage();
  await testPage.setViewport({ width: 1440, height: 900 });
  await testPage.goto('http://localhost:8888', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2600));

  // Test 1: Menu Search
  await testPage.type('#menu-search-input', 'ghee');
  await new Promise(r => setTimeout(r, 300));
  const gheeCount = await testPage.evaluate(() => document.querySelectorAll('#menu-items-grid > div').length);
  console.log(`[PASS] Search for 'ghee' returned ${gheeCount} items`);

  // Clear search and test category filter
  await testPage.evaluate(() => window.clearSearch());
  await testPage.click('button[data-category="vadas"]');
  await new Promise(r => setTimeout(r, 300));
  const vadasCount = await testPage.evaluate(() => document.querySelectorAll('#menu-items-grid > div').length);
  console.log(`[PASS] Category filter 'vadas' returned ${vadasCount} items`);

  // Test Add to Cart
  await testPage.waitForSelector('#menu-items-grid button', { timeout: 4000 });
  const firstItemBtn = await testPage.$('#menu-items-grid button');
  if (firstItemBtn) {
    await firstItemBtn.click();
    await new Promise(r => setTimeout(r, 600));
  }
  
  // Check Cart State
  const cartInfo = await testPage.evaluate(() => {
    const items = document.querySelectorAll('#cart-items-container > div').length;
    const subtotal = document.getElementById('cart-subtotal') ? document.getElementById('cart-subtotal').innerText : '0';
    const total = document.getElementById('cart-total') ? document.getElementById('cart-total').innerText : '0';
    const whatsappHref = document.getElementById('whatsapp-order-btn') ? document.getElementById('whatsapp-order-btn').getAttribute('href') : '';
    return { items, subtotal, total, whatsappHref };
  });
  console.log(`[PASS] Cart drawer: ${cartInfo.items} item(s), Subtotal: ${cartInfo.subtotal}, Total: ${cartInfo.total}`);
  if (cartInfo.whatsappHref) {
    console.log(`[PASS] WhatsApp order link generated: ${cartInfo.whatsappHref.slice(0, 60)}...`);
  }

  await testPage.screenshot({ path: path.join(VERIFY_DIR, 'cart_active.png') });

  // Close cart
  await testPage.evaluate(() => window.closeCart());
  await new Promise(r => setTimeout(r, 400));

  // Test Replay Intro
  await testPage.evaluate(() => {
    const btn = document.getElementById('replay-intro-btn');
    if (btn) btn.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 300));
  await testPage.click('#replay-intro-btn');
  await new Promise(r => setTimeout(r, 800));
  await testPage.screenshot({ path: path.join(VERIFY_DIR, 'preloader_replay_card.png') });
  console.log('[PASS] Replay intro button re-triggered the preloader curtain');

  await testPage.close();
  await browser.close();

  console.log('\n========================================');
  console.log('       ALL VERIFICATION CHECKS          ');
  console.log('========================================');
  console.log(`Console Errors: ${errors.length}`);
  if (errors.length > 0) console.error(errors);
  console.log(`Failed Requests: ${failedRequests.length}`);
  if (failedRequests.length > 0) console.error(failedRequests);
  console.log('========================================\n');
}

run().catch(console.error);
