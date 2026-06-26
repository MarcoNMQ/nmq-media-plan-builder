import { calcRow } from '../src/lib/calc';

function approx(a: number, b: number, tol = 0.01): boolean {
  return Math.abs(a - b) <= tol;
}

let failed = 0;
function check(name: string, actual: number | undefined, expected: number) {
  if (actual === undefined || !approx(actual, expected)) {
    console.log(`FAIL ${name}: got ${actual}, expected ${expected}`);
    failed++;
  } else {
    console.log(`ok   ${name}: ${actual.toFixed(4)}`);
  }
}

// Case 1: Search, Conversion
{
  const r = calcRow(1000, { cpc: 2.0, ctr: 0.03, click_to_session: 0.85, lead_to_mql: 0.20, mql_to_sql: 0.30 }, 'Conversion', 'Search', 0.02);
  check('search.clicks', r.clicks, 500);
  check('search.impressions', r.impressions, 16666.667);
  check('search.sessions', r.sessions, 425);
  check('search.conversions', r.conversions, 8.5);
  check('search.cpa', r.cpa, 117.647);
  check('search.cvr', r.cvr, 0.017);
  check('search.mql', r.mql, 1.7);
  check('search.cost_per_mql', r.cost_per_mql, 588.235);
  check('search.sql', r.sql, 0.51);
  check('search.cost_per_sql', r.cost_per_sql, 1960.78);
  check('search.eff_cpm', r.eff_cpm, 60.0);
}

// Case 2: YouTube, Awareness
{
  const r = calcRow(5000, { cpm: 11, view_rate: 0.31, ctr: 0.0035, frequency: 3.0 }, 'Awareness', 'YouTube', 0.02);
  check('yt.impressions', r.impressions, 454545.45);
  check('yt.reach', r.reach, 151515.15);
  check('yt.clicks', r.clicks, 1590.91);
  check('yt.views', r.views, 140909.09);
  check('yt.cpv', r.cpv, 0.0355);
  check('yt.cpc', r.cpc, 3.1429);
  check('yt.eff_cpm', r.eff_cpm, 11.0);
}

// Case 3: LinkedIn Sponsored Message, Conversion
{
  const r = calcRow(2000, { cpm: 0.5, open_rate: 0.30, ctr: 0.10, conv_rate: 0.05, lead_to_mql: 0.20, mql_to_sql: 0.30 }, 'Conversion', 'LinkedIn', 0.05, 'Sponsored Message / Conversational Ad');
  check('li_sm.sends', r.sends, 4000);
  check('li_sm.opens', r.opens, 1200);
  check('li_sm.cta_clicks', r.cta_clicks, 120);
  check('li_sm.cost_per_open', r.cost_per_open, 1.6667);
  check('li_sm.conversions', r.conversions, 6);
  check('li_sm.cpa', r.cpa, 333.33);
  check('li_sm.mql', r.mql, 1.2);
  check('li_sm.cost_per_mql', r.cost_per_mql, 1666.67);
  check('li_sm.sql', r.sql, 0.36);
  check('li_sm.cost_per_sql', r.cost_per_sql, 5555.56);
}

console.log(failed === 0 ? '\nALL PASSED' : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
