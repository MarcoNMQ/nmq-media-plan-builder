const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.click('text=+ New Scenario');
  await page.locator('input[type=number]').first().fill('10000');
  await page.click('text=+ DACH');
  await page.waitForTimeout(300);
  await page.click('text=Conversion');
  await page.click('text=Search');
  await page.waitForTimeout(500);

  await page.click('text=Generate Plan Insights');
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'e2e_ai_insights.png', fullPage: true });
  console.log('DONE');
  await browser.close();
})();
