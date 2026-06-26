import { generatePeriods } from '../src/lib/calc';

const weekly = generatePeriods('2026-06-01', '2026-06-15', 'Weekly');
console.log('Weekly:', JSON.stringify(weekly));
const totalDays = weekly.reduce((n, p) => n + p.days, 0);
console.log('Total days:', totalDays, totalDays === 15 ? 'OK' : 'FAIL');

const monthly = generatePeriods('2026-01-15', '2026-03-10', 'Monthly');
console.log('Monthly:', JSON.stringify(monthly));

const daily = generatePeriods('2026-06-01', '2026-06-03', 'Daily');
console.log('Daily:', JSON.stringify(daily));
