const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1200 } });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.click('text=Generate Plan Insights');
  await page.waitForTimeout(15000);
  await page.screenshot({ path: 'e2e_ai_insights2.png', fullPage: true });
  console.log('DONE');
  await browser.close();
})();
