import { buildExcelAll } from '../src/lib/excelExport';
import { buildGadsCsv } from '../src/lib/gadsExport';
import type { Scenario, PlanConfig } from '../src/lib/types';
import { BENCH } from '../src/lib/constants';
import * as fs from 'fs';

const plan: PlanConfig = {
  campaignName: 'Test Campaign', audience: 'B2B', industry: 'Fintech',
  startDate: '2026-07-01', endDate: '2026-07-28', breakdown: 'Weekly',
};

const scenario: Scenario = {
  id: 's1', name: 'Scenario 1', totalBudget: 10000,
  markets: [
    {
      market: 'DE', pct: 100, expanded: true,
      goals: [
        {
          goal: 'Conversion', goalPct: 100,
          channels: [
            { channel: 'YouTube', splitPct: 100, benchmark: { ...BENCH.DE.YouTube } },
          ],
        },
      ],
    },
  ],
};

(async () => {
  const buf = await buildExcelAll([scenario], plan);
  fs.writeFileSync('test_export.xlsx', buf);
  console.log('Excel written, bytes:', buf.length);

  const csv = buildGadsCsv(scenario, plan);
  fs.writeFileSync('test_export_gads.csv', csv);
  console.log('CSV:\n', csv);
})();
