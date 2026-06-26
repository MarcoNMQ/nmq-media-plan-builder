const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  page.on('console', (msg) => { if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text()); });
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Scenario 1
  await page.click('text=+ New Scenario');
  await page.locator('input[type=number]').first().fill('10000');
  await page.click('text=+ DACH');
  await page.waitForTimeout(300);
  await page.click('text=Conversion');
  await page.click('text=Search');
  await page.waitForTimeout(500);

  // Scenario 2
  await page.click('text=+ New Scenario');
  await page.waitForTimeout(300);
  await page.locator('input[type=number]').first().fill('10000');
  await page.click('text=+ Nordics');
  await page.waitForTimeout(300);
  await page.click('text=Conversion');
  await page.click('text=YouTube');
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'e2e_scenario2.png' });

  // Compare tab
  await page.click('text=⚖ Compare');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'e2e_compare.png', fullPage: true });

  console.log('DONE');
  await browser.close();
})();
