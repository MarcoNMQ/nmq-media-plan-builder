const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 500, height: 900 } });
  page.setDefaultTimeout(8000);
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'e2e_mobile_closed.png' });
  await page.locator('button:has-text("Menu")').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e2e_mobile_open.png' });
  console.log('DONE');
  await browser.close();
})();
