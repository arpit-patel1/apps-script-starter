import { SHEET_NAMES } from './config.js';
import {
  CONFIG_HEADERS,
  CONFIG_SEED,
  QUOTE_HEADERS,
  QUOTE_SEED,
  WORD_PROBLEM_HEADERS,
  WORD_PROBLEM_SEED,
} from './seed-data.js';
import { getSpreadsheet } from './sheets.js';

const writeSheet = (spreadsheet, name, headers, rows) => {
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
  } else {
    sheet.clear();
  }

  const data = [headers, ...rows];
  sheet.getRange(1, 1, data.length, headers.length).setValues(data);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, headers.length);
  return sheet;
};

const sheetNeedsSeed = (spreadsheet, name) => {
  const sheet = spreadsheet.getSheetByName(name);
  return !sheet || sheet.getLastRow() < 2;
};

/**
 * Creates WordProblems, Quotes, and Config tabs and loads seed data.
 * Safe to re-run; replaces sheet contents.
 */
export const seedDatabase = () => {
  const spreadsheet = getSpreadsheet();
  writeSheet(spreadsheet, SHEET_NAMES.wordProblems, WORD_PROBLEM_HEADERS, WORD_PROBLEM_SEED);
  writeSheet(spreadsheet, SHEET_NAMES.quotes, QUOTE_HEADERS, QUOTE_SEED);
  writeSheet(spreadsheet, SHEET_NAMES.config, CONFIG_HEADERS, CONFIG_SEED);

  return {
    ok: true,
    wordProblems: WORD_PROBLEM_SEED.length,
    quotes: QUOTE_SEED.length,
    configRows: CONFIG_SEED.length,
  };
};

/** Append seed word problems whose ids are not already in the Sheet. */
export const mergeWordProblemSeed = () => {
  const spreadsheet = getSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAMES.wordProblems);

  if (!sheet || sheet.getLastRow() < 2) {
    writeSheet(spreadsheet, SHEET_NAMES.wordProblems, WORD_PROBLEM_HEADERS, WORD_PROBLEM_SEED);
    return { created: true, added: WORD_PROBLEM_SEED.length };
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((header) => String(header).trim().toLowerCase());
  const idIndex = headers.indexOf('id');
  const existingIds = new Set(
    values
      .slice(1)
      .map((row) => String(idIndex >= 0 ? row[idIndex] : '').trim())
      .filter(Boolean),
  );

  const missing = WORD_PROBLEM_SEED.filter((row) => !existingIds.has(String(row[0])));
  if (missing.length === 0) {
    return { created: false, added: 0 };
  }

  sheet
    .getRange(sheet.getLastRow() + 1, 1, missing.length, WORD_PROBLEM_HEADERS.length)
    .setValues(missing);
  return { created: false, added: missing.length };
};

/** Seed any missing/empty tabs without wiping existing filled sheets. */
export const ensureDatabase = () => {
  const spreadsheet = getSpreadsheet();
  const seeded = [];

  if (sheetNeedsSeed(spreadsheet, SHEET_NAMES.wordProblems)) {
    writeSheet(spreadsheet, SHEET_NAMES.wordProblems, WORD_PROBLEM_HEADERS, WORD_PROBLEM_SEED);
    seeded.push(SHEET_NAMES.wordProblems);
  } else {
    const merged = mergeWordProblemSeed();
    if (merged.added > 0) {
      seeded.push(`${SHEET_NAMES.wordProblems}+${merged.added}`);
    }
  }
  if (sheetNeedsSeed(spreadsheet, SHEET_NAMES.quotes)) {
    writeSheet(spreadsheet, SHEET_NAMES.quotes, QUOTE_HEADERS, QUOTE_SEED);
    seeded.push(SHEET_NAMES.quotes);
  }
  if (sheetNeedsSeed(spreadsheet, SHEET_NAMES.config)) {
    writeSheet(spreadsheet, SHEET_NAMES.config, CONFIG_HEADERS, CONFIG_SEED);
    seeded.push(SHEET_NAMES.config);
  }

  return {
    ok: true,
    skipped: seeded.length === 0,
    seeded,
  };
};
