// src/features/sale/sale-order/utils/exportSaleOrderToExcel.ts
//
// Builds a formatted .xlsx for a single T Bill from the already-loaded
// API response (no extra API call) and triggers a browser download.
//
// Requires: exceljs  (npm i exceljs)  -- loaded lazily so it stays out of the main bundle.

import type { Workbook, Worksheet } from 'exceljs';

/* ------------------------------------------------------------------ */
/* Types (all optional so missing fields never crash the export)       */
/* ------------------------------------------------------------------ */

export interface SaleOrderItemDetail {
  sl?: number | null;
  pcategorynm?: string | null;
  productnm?: string | null;
  qty1?: number | null;
  rate?: number | null;
  value?: number | null;
  unit?: string | null;
}

export interface SaleOrderDetail {
  id?: number | null;
  orderno?: string | null;
  orderdt?: string | null;
  customerid?: number | null;
  customernm?: string | null;
  partyordno?: string | null;
  partyorddt?: string | null;
  rem1?: string | null;
  rem2?: string | null;
  qty1?: number | null;
  ordamt?: number | null;
  godownnm?: string | null;
  aprvstatus?: string | null;
  entryby?: string | null;
  entrydt?: string | null;
  updateby?: string | null;
  updatedt?: string | null;
  itemdtl?: SaleOrderItemDetail[] | null;
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const NUM_FMT = '#,##0.00'; // quantities
const AMOUNT_FMT = '#,##0.00'; // change to e.g. '"₹" #,##0.00' for a currency symbol
const RATE_FMT = '#,##0.00####'; // rates can carry up to 6 decimals
const DATE_FMT = 'dd/mm/yyyy';

const COLUMN_WIDTHS = [8, 24, 34, 14, 14, 16, 10]; // Sl, Category, Product, Qty, Rate, Value, Unit
const LAST_COL = COLUMN_WIDTHS.length;

const COLORS = {
  title: 'FF1F3864',
  headerFill: 'FF1F3864',
  headerText: 'FFFFFFFF',
  labelFill: 'FFF2F2F2',
  totalFill: 'FFE7EEF8',
  border: 'FFBFBFBF',
};

const APPROVAL_LABELS: Record<string, string> = {
  A: 'Approved',
  P: 'Pending',
};

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

const str = (v: unknown): string =>
  v === null || v === undefined ? '' : String(v).trim();

const orDash = (v: unknown): string => str(v) || '-';

const toNumber = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * ISO date strings like "2026-09-26T00:00:00" -> Excel date.
 * Built as UTC midnight so Excel shows the same calendar day regardless of
 * the user's time zone (exceljs serialises Dates as UTC).
 */
const toExcelDate = (v: unknown): Date | null => {
  const s = str(v);
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
};

const approvalLabel = (v: unknown): string => {
  const code = str(v);
  if (!code) return '-';
  return APPROVAL_LABELS[code.toUpperCase()] ?? code;
};

/** "T09/00007/2627" -> "Order_T09-00007-2627.xlsx" */
export const buildFileName = (order: SaleOrderDetail): string => {
  const base = str(order.orderno)
    .replace(/[\\/]+/g, '-')
    .replace(/[:*?"<>|]+/g, '')
    .replace(/\s+/g, '_');
  return `Order_${base || order.id || 'Export'}.xlsx`;
};

/** Accepts the order object, the `data` array, or the full { data: [...] } response. */
const normalizeOrder = (input: unknown): SaleOrderDetail | null => {
  if (!input) return null;
  if (Array.isArray(input)) return (input[0] as SaleOrderDetail) ?? null;
  const obj = input as { data?: unknown };
  if (obj && typeof obj === 'object' && 'data' in obj && obj.data) {
    return normalizeOrder(obj.data);
  }
  return input as SaleOrderDetail;
};

/* ------------------------------------------------------------------ */
/* Styling helpers                                                     */
/* ------------------------------------------------------------------ */

const thinBorder = {
  top: { style: 'thin' as const, color: { argb: COLORS.border } },
  left: { style: 'thin' as const, color: { argb: COLORS.border } },
  bottom: { style: 'thin' as const, color: { argb: COLORS.border } },
  right: { style: 'thin' as const, color: { argb: COLORS.border } },
};

function borderRange(ws: Worksheet, row: number, c1: number, c2: number) {
  for (let c = c1; c <= c2; c++) ws.getCell(row, c).border = thinBorder;
}

function mergeIfNeeded(ws: Worksheet, row: number, c1: number, c2: number) {
  if (c2 > c1) ws.mergeCells(row, c1, row, c2);
}

type InfoValue = string | number | Date | null;

function writeInfo(
  ws: Worksheet,
  row: number,
  labelCols: [number, number],
  valueCols: [number, number],
  label: string,
  value: InfoValue,
  numFmt?: string,
) {
  // label
  mergeIfNeeded(ws, row, labelCols[0], labelCols[1]);
  const labelCell = ws.getCell(row, labelCols[0]);
  labelCell.value = label;
  labelCell.font = { bold: true };
  labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.labelFill } };
  labelCell.alignment = { vertical: 'middle', horizontal: 'left' };
  borderRange(ws, row, labelCols[0], labelCols[1]);

  // value
  mergeIfNeeded(ws, row, valueCols[0], valueCols[1]);
  const valueCell = ws.getCell(row, valueCols[0]);
  valueCell.value = value === null || value === '' ? '-' : value;
  if (numFmt && (typeof value === 'number' || value instanceof Date)) valueCell.numFmt = numFmt;
  valueCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  borderRange(ws, row, valueCols[0], valueCols[1]);
}

/* ------------------------------------------------------------------ */
/* Workbook builder (pure - no DOM, easy to test)                      */
/* ------------------------------------------------------------------ */

export async function buildSaleOrderWorkbook(input: unknown): Promise<{
  workbook: Workbook;
  fileName: string;
}> {
  const order = normalizeOrder(input);
  if (!order) throw new Error('No order data available to export.');

  const mod: any = await import('exceljs');
  const ExcelJS = mod.default ?? mod;
  const workbook: Workbook = new ExcelJS.Workbook();
  workbook.created = new Date();

  const ws = workbook.addWorksheet('T Bill', {
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9, // A4
    },
    views: [{ showGridLines: false }],
  });
  COLUMN_WIDTHS.forEach((w, i) => (ws.getColumn(i + 1).width = w));

  let r = 1;

  /* ---- Title ---- */
  ws.mergeCells(r, 1, r, LAST_COL);
  const title = ws.getCell(r, 1);
  title.value = str(order.orderno) ? `T Bill - ${str(order.orderno)}` : 'T Bill';
  title.font = { bold: true, size: 16, color: { argb: COLORS.title } };
  title.alignment = { vertical: 'middle', horizontal: 'left' };
  ws.getRow(r).height = 28;
  r += 2;

  /* ---- Order information (two label/value pairs per row) ---- */
  const L_LABEL: [number, number] = [1, 2]; // A:B
  const L_VALUE: [number, number] = [3, 3]; // C
  const R_LABEL: [number, number] = [4, 5]; // D:E
  const R_VALUE: [number, number] = [6, 7]; // F:G

  const left: Array<[string, InfoValue, string?]> = [
    ['Order No.', orDash(order.orderno)],
    ['Order Date', toExcelDate(order.orderdt) ?? '-', DATE_FMT],
    ['Customer', orDash(order.customernm)],
    // ['Customer ID', toNumber(order.customerid) ?? '-'],
    ['Party Order No.', orDash(order.partyordno)],
    ['Party Order Date', toExcelDate(order.partyorddt) ?? '-', DATE_FMT],
  ];
  const right: Array<[string, InfoValue, string?]> = [
    ['Godown', orDash(order.godownnm)],
    // ['Approval Status', approvalLabel(order.aprvstatus)],
    ['Total Quantity', toNumber(order.qty1), NUM_FMT],
    ['Order Amount', toNumber(order.ordamt), AMOUNT_FMT],
    ['Entry By', orDash(order.entryby)],
    ['Entry Date', orDash(order.entrydt)],
  ];

  const infoRows = Math.max(left.length, right.length);
  for (let i = 0; i < infoRows; i++) {
    if (left[i]) writeInfo(ws, r, L_LABEL, L_VALUE, left[i][0], left[i][1], left[i][2]);
    if (right[i]) writeInfo(ws, r, R_LABEL, R_VALUE, right[i][0], right[i][1], right[i][2]);
    r++;
  }

  // Remarks (only when present)
  const remarks = [str(order.rem1), str(order.rem2)].filter(Boolean).join(' | ');
  if (remarks) {
    writeInfo(ws, r, L_LABEL, [3, LAST_COL], 'Remarks', remarks);
    r++;
  }

  r++; // spacer

  /* ---- Items table ---- */
  const headers = ['Sl.', 'Product Category', 'Product', 'Quantity', 'Rate', 'Value', 'Unit'];
  headers.forEach((h, i) => {
    const cell = ws.getCell(r, i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: COLORS.headerText } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.headerFill } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: i >= 3 && i <= 5 ? 'right' : i === 0 || i === 6 ? 'center' : 'left',
    };
    cell.border = thinBorder;
  });
  ws.getRow(r).height = 22;
  r++;

  const items = [...(order.itemdtl ?? [])].sort(
    (a, b) => (toNumber(a?.sl) ?? Number.MAX_SAFE_INTEGER) - (toNumber(b?.sl) ?? Number.MAX_SAFE_INTEGER),
  );

  const firstItemRow = r;

  if (items.length === 0) {
    ws.mergeCells(r, 1, r, LAST_COL);
    const empty = ws.getCell(r, 1);
    empty.value = 'No items in this order';
    empty.font = { italic: true, color: { argb: 'FF7F7F7F' } };
    empty.alignment = { horizontal: 'center', vertical: 'middle' };
    borderRange(ws, r, 1, LAST_COL);
    r++;
  } else {
    items.forEach((it, idx) => {
      const values: Array<[string | number, string | undefined, 'left' | 'right' | 'center']> = [
        [toNumber(it.sl) ?? idx + 1, undefined, 'center'],
        [orDash(it.pcategorynm), undefined, 'left'],
        [orDash(it.productnm), undefined, 'left'],
        [toNumber(it.qty1) ?? 0, NUM_FMT, 'right'],
        [toNumber(it.rate) ?? 0, RATE_FMT, 'right'],
        [toNumber(it.value) ?? 0, AMOUNT_FMT, 'right'],
        [orDash(it.unit), undefined, 'center'],
      ];
      values.forEach(([v, fmt, align], i) => {
        const cell = ws.getCell(r, i + 1);
        cell.value = v;
        if (fmt) cell.numFmt = fmt;
        cell.alignment = { vertical: 'middle', horizontal: align, wrapText: i === 2 };
        cell.border = thinBorder;
      });
      r++;
    });
  }

  /* ---- Totals row (live SUM formulas, with cached results) ---- */
  const lastItemRow = r - 1;
  const sumQty = items.reduce((s, it) => s + (toNumber(it.qty1) ?? 0), 0);
  const sumVal = items.reduce((s, it) => s + (toNumber(it.value) ?? 0), 0);

  ws.mergeCells(r, 1, r, 3);
  ws.getCell(r, 1).value = 'Total';
  ws.getCell(r, 1).alignment = { horizontal: 'right', vertical: 'middle' };

  const hasItems = items.length > 0;
  ws.getCell(r, 4).value = hasItems
    ? { formula: `SUM(D${firstItemRow}:D${lastItemRow})`, result: sumQty }
    : 0;
  ws.getCell(r, 4).numFmt = NUM_FMT;
  ws.getCell(r, 6).value = hasItems
    ? { formula: `SUM(F${firstItemRow}:F${lastItemRow})`, result: sumVal }
    : 0;
  ws.getCell(r, 6).numFmt = AMOUNT_FMT;

  for (let c = 1; c <= LAST_COL; c++) {
    const cell = ws.getCell(r, c);
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.totalFill } };
    cell.border = thinBorder;
    if (c === 4 || c === 6) cell.alignment = { horizontal: 'right', vertical: 'middle' };
  }
  r += 2;

  /* ---- Footer ---- */
  const updated = [str(order.updateby), str(order.updatedt)].filter(Boolean).join(' on ');
  if (updated) {
    ws.mergeCells(r, 1, r, LAST_COL);
    const f = ws.getCell(r, 1);
    f.value = `Last updated by ${updated}`;
    f.font = { italic: true, size: 9, color: { argb: 'FF7F7F7F' } };
  }

  return { workbook, fileName: buildFileName(order) };
}

/* ------------------------------------------------------------------ */
/* Public API: build + download in the browser                         */
/* ------------------------------------------------------------------ */

export async function exportSaleOrderToExcel(input: unknown): Promise<void> {
  const { workbook, fileName } = await buildSaleOrderWorkbook(input);
  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}