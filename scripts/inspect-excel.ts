import ExcelJS from 'exceljs';

(async () => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile('test_export.xlsx');
  const ws = wb.worksheets[0];
  console.log('Sheet:', ws.name);
  for (let r = 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const cells: string[] = [];
    for (let c = 1; c <= 10; c++) {
      const cell = row.getCell(c);
      if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
        const v = typeof cell.value === 'object' && 'formula' in (cell.value as object)
          ? `=${(cell.value as { formula: string }).formula}`
          : cell.value;
        cells.push(`${cell.address}:${v}`);
      }
    }
    if (cells.length) console.log(`Row ${r}:`, cells.join(' | '));
  }
})();
