import { useMediaPlanStore } from '../src/lib/store';
import { marketBudget, goalBudget, channelBudget, marketPctSum } from '../src/lib/budgets';

let failed = 0;
function assert(cond: boolean, msg: string) {
  if (!cond) { console.log(`FAIL: ${msg}`); failed++; } else { console.log(`ok: ${msg}`); }
}

const store = useMediaPlanStore.getState();
const sid = store.addScenario();
useMediaPlanStore.getState().setScenarioBudget(sid, 10000);
useMediaPlanStore.getState().addMarket(sid, 'DE');
useMediaPlanStore.getState().addMarket(sid, 'FR');

let scenario = useMediaPlanStore.getState().scenarios.find((s) => s.id === sid)!;
assert(scenario.markets.length === 2, 'two markets added');
assert(marketPctSum(scenario) === 100, `markets even-split to 100% (got ${marketPctSum(scenario)})`);
assert(Math.abs(marketBudget(scenario, scenario.markets[0]) - 5000) < 0.01, 'DE budget = 5000 (even split of 10000)');

// Edit DE's % directly — FR's pct should NOT auto-rebalance (matches
// Python: market split only warns if off 100%, never auto-normalizes).
useMediaPlanStore.getState().setMarketPct(sid, 'DE', 90);
scenario = useMediaPlanStore.getState().scenarios.find((s) => s.id === sid)!;
assert(Math.abs(marketBudget(scenario, scenario.markets[0]) - 9000) < 0.01, 'DE budget = 9000 after setting pct=90');
assert(marketPctSum(scenario) === 140, `pct sum is 140 (90 DE + 50 FR unchanged from its even-split default), NOT auto-renormalized to 100 (got ${marketPctSum(scenario)})`);
useMediaPlanStore.getState().setMarketPct(sid, 'DE', 70);

// Edit DE's € directly (back-solve pct)
useMediaPlanStore.getState().setMarketBudgetEuros(sid, 'DE', 4000);
scenario = useMediaPlanStore.getState().scenarios.find((s) => s.id === sid)!;
assert(Math.abs(scenario.markets[0].pct - 40) < 0.01, `DE pct back-solved to 40 from €4000/€10000 (got ${scenario.markets[0].pct})`);

// Goals
useMediaPlanStore.getState().setMarketGoals(sid, 'DE', ['Awareness', 'Conversion']);
scenario = useMediaPlanStore.getState().scenarios.find((s) => s.id === sid)!;
const deMarket = scenario.markets.find((m) => m.market === 'DE')!;
assert(deMarket.goals.length === 2, 'DE has 2 goals');
assert(deMarket.goals.every((g) => g.goalPct === 50), 'goals even-split to 50%');
assert(Math.abs(goalBudget(scenario, deMarket, deMarket.goals[0]) - 2000) < 0.01, `Awareness goal budget = half of DE's 4000 = 2000 (got ${goalBudget(scenario, deMarket, deMarket.goals[0])})`);

// Channels
useMediaPlanStore.getState().setGoalChannels(sid, 'DE', 'Awareness', ['YouTube', 'Display']);
scenario = useMediaPlanStore.getState().scenarios.find((s) => s.id === sid)!;
const awarenessGoal = scenario.markets.find((m) => m.market === 'DE')!.goals.find((g) => g.goal === 'Awareness')!;
assert(awarenessGoal.channels.length === 2, 'Awareness has 2 channels');
assert(awarenessGoal.channels[0].benchmark.cpm !== undefined, 'YouTube channel got a default CPM benchmark from BENCH.DE');
useMediaPlanStore.getState().setChannelSplitPct(sid, 'DE', 'Awareness', 'YouTube', 80);
useMediaPlanStore.getState().setChannelSplitPct(sid, 'DE', 'Awareness', 'Display', 20);
scenario = useMediaPlanStore.getState().scenarios.find((s) => s.id === sid)!;
const awarenessGoal2 = scenario.markets.find((m) => m.market === 'DE')!.goals.find((g) => g.goal === 'Awareness')!;
const deMarket2 = scenario.markets.find((m) => m.market === 'DE')!;
assert(Math.abs(channelBudget(scenario, deMarket2, awarenessGoal2, 80) - 1600) < 0.01, `YouTube channel budget = 80% of 2000 = 1600 (got ${channelBudget(scenario, deMarket2, awarenessGoal2, 80)})`);

// Benchmark preset
useMediaPlanStore.getState().applyBenchPreset(sid, 'DE', 'Awareness', 'YouTube', 'Conservative');
scenario = useMediaPlanStore.getState().scenarios.find((s) => s.id === sid)!;
const ytChannel = scenario.markets.find((m) => m.market === 'DE')!.goals.find((g) => g.goal === 'Awareness')!.channels.find((c) => c.channel === 'YouTube')!;
assert(Math.abs((ytChannel.benchmark.cpm ?? 0) - 11.0 * 1.15) < 0.01, `Conservative preset applied 1.15x to CPM (got ${ytChannel.benchmark.cpm})`);

console.log(failed === 0 ? '\nALL PASSED' : `\n${failed} FAILED`);
process.exit(failed === 0 ? 0 : 1);
