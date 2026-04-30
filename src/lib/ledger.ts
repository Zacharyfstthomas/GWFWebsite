import fs from 'node:fs';
import path from 'node:path';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  date: string; // ISO yyyy-mm-dd
  description: string;
  category: string;
  type: TransactionType;
  amount: number; // always positive; use `type` to determine direction
  method: string;
  notes: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
}

/**
 * Parse a single CSV line, respecting double-quoted fields that may
 * contain commas. Escape double quotes inside a quoted field with "".
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result.map((s) => s.trim());
}

/**
 * Read and parse the ledger CSV at build time.
 * Returns newest-first by date.
 */
export function loadLedger(): Transaction[] {
  const csvPath = path.join(process.cwd(), 'public', 'data', 'ledger.csv');
  const raw = fs.readFileSync(csvPath, 'utf-8');
  const lines = raw.trim().split(/\r?\n/);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());

  const rows: Transaction[] = lines.slice(1).map((line: string, idx: number) => {
    const values = parseCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? '';
    });

    const type = row.type === 'income' ? 'income' : 'expense';
    const amount = Number.parseFloat(row.amount || '0');

    if (Number.isNaN(amount)) {
      throw new Error(
        `Ledger row ${idx + 2}: amount "${row.amount}" is not a number.`,
      );
    }

    return {
      date: row.date,
      description: row.description,
      category: row.category,
      type,
      amount,
      method: row.method,
      notes: row.notes,
    };
  });

  rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return rows;
}

export function loadCategories(): Category[] {
  const jsonPath = path.join(process.cwd(), 'public', 'data', 'categories.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw) as { categories: Category[] };
  return data.categories;
}

export interface LedgerSummary {
  totalIncome: number;
  totalExpense: number;
  net: number;
  byCategory: Record<string, { income: number; expense: number; net: number; count: number }>;
}

export function summarize(rows: Transaction[]): LedgerSummary {
  const summary: LedgerSummary = {
    totalIncome: 0,
    totalExpense: 0,
    net: 0,
    byCategory: {},
  };

  for (const r of rows) {
    const bucket = (summary.byCategory[r.category] ??= {
      income: 0,
      expense: 0,
      net: 0,
      count: 0,
    });
    bucket.count++;

    if (r.type === 'income') {
      summary.totalIncome += r.amount;
      bucket.income += r.amount;
    } else {
      summary.totalExpense += r.amount;
      bucket.expense += r.amount;
    }
    bucket.net = bucket.income - bucket.expense;
  }

  summary.net = summary.totalIncome - summary.totalExpense;
  return summary;
}

export function formatUSD(n: number): string {
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

export function formatDate(iso: string): string {
  // "2026-04-10" -> "Apr 10, 2026"
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return dt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
