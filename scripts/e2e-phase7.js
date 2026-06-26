const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, acceptDownloads: true });
  page.on('console', (msg) => { if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text()); });
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Apply a template
  await page.click('text=+ New Scenario');
  await page.waitForTimeout(300);
  await page.selectOption('text=— Choose a template — >> xpath=.', { label: 'DACH Awareness Launch' }).catch(async () => {
    const selects = await page.locator('select').all();
    for (const sel of selects) {
      const opts = await sel.locator('option').allTextContents();
      if (opts.includes('DACH Awareness Launch')) { await sel.selectOption({ label: 'DACH Awareness Launch' }); break; }
    }
  });
  await page.click('text=Apply');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'e2e_template.png', fullPage: true });

  // Save plan JSON
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('text=💾 Save plan'),
  ]);
  const path = await download.path();
  console.log('Downloaded:', download.suggestedFilename(), path ? 'ok' : 'MISSING');

  // Mobile drawer
  await page.setViewportSize({ width: 500, height: 900 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e2e_mobile_closed.png' });
  await page.click('text=☰ Menu');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e2e_mobile_open.png' });

  console.log('DONE');
  await browser.close();
})();
