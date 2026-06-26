const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  page.setDefaultTimeout(10000);
  page.on('console', (msg) => { if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text()); });
  page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'e2e_1_empty.png' });

  await page.click('text=+ New Scenario');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e2e_2_scenario_created.png' });

  // Set budget
  const budgetInput = page.locator('input[type=number]').first();
  await budgetInput.fill('10000');
  await page.waitForTimeout(200);

  // Pick DACH market group
  await page.click('text=+ DACH');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e2e_3_markets_picked.png' });

  // Expand the first market and pick goals
  await page.click('text=Awareness');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'e2e_4_goal_picked.png' });

  // Pick a channel
  await page.click('text=YouTube');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'e2e_5_channel_picked.png', fullPage: true });

  console.log('DONE');
  await browser.close();
})();
