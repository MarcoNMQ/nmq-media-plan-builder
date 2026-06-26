import { buildExcelAll } from '../src/lib/excelExport';
import type { Scenario, PlanConfig } from '../src/lib/types';
import { BENCH } from '../src/lib/constants';

const plan: PlanConfig = {
  campaignName: 'LI Test', audience: 'B2B', industry: 'SaaS',
  startDate: '2026-07-01', endDate: '2026-07-28', breakdown: 'Weekly',
};

const scenario: Scenario = {
  id: 's1', name: 'LI Scenario', totalBudget: 8000,
  markets: [
    {
      market: 'FR', pct: 50, expanded: true,
      goals: [{
        goal: 'Conversion', goalPct: 100,
        channels: [
          { channel: 'LinkedIn', splitPct: 50, liFormat: 'Sponsored Message / Conversational Ad', benchmark: { cpm: 0.5, open_rate: 0.3, ctr: 0.1, conv_rate: 0.05, lead_to_mql: 0.2, mql_to_sql: 0.3 } },
          { channel: 'LinkedIn', splitPct: 50, liFormat: 'Lead Gen Form', benchmark: { ...BENCH.FR.LinkedIn, form_completion_rate: 0.1 } },
        ],
      }],
    },
    {
      market: 'NL', pct: 50, expanded: true,
      goals: [{
        goal: 'Conversion', goalPct: 100,
        channels: [
          { channel: 'LinkedIn', splitPct: 50, liFormat: 'Sponsored Message / Conversational Ad', benchmark: { cpm: 0.5, open_rate: 0.3, ctr: 0.1, conv_rate: 0.05, lead_to_mql: 0.2, mql_to_sql: 0.3 } },
          { channel: 'LinkedIn', splitPct: 50, liFormat: 'Lead Gen Form', benchmark: { ...BENCH.NL.LinkedIn, form_completion_rate: 0.1 } },
        ],
      }],
    },
  ],
};

(async () => {
  try {
    const buf = await buildExcelAll([scenario], plan);
    console.log('OK, bytes:', buf.length);
  } catch (e) {
    console.error('FAILED:', e);
    process.exit(1);
  }
})();
