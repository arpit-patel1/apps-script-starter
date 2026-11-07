import {
  DEFAULT_MULTIPLICATION_RANGES,
  GRADES,
  SHEET_NAMES,
  SPREADSHEET_ID,
} from './config.js';

export const getSpreadsheet = () => {
  // Prefer openById so web app (no "active" spreadsheet) and editor runs hit the same DB.
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (error) {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) {
      return active;
    }
    throw error;
  }
};

const rowsToObjects = (values) => {
  if (!values || values.length < 2) {
    return [];
  }

  const [headers, ...rows] = values;
  const keys = headers.map((header) => String(header).trim().toLowerCase());

  return rows
    .filter((row) => row.some((cell) => cell !== '' && cell !== null && cell !== undefined))
    .map((row) => {
      const item = {};
      keys.forEach((key, index) => {
        item[key] = row[index];
      });
      return item;
    });
};

const isActive = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  const text = String(value ?? '')
    .trim()
    .toUpperCase();
  return text === 'TRUE' || text === 'YES' || text === '1';
};

export const getWordProblems = () => {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.wordProblems);
  if (!sheet) {
    return [];
  }

  const values = sheet.getDataRange().getValues();
  return rowsToObjects(values)
    .map((row) => ({
      id: String(row.id ?? '').trim(),
      grade: Number(row.grade),
      type: String(row.type ?? '').trim(),
      prompt: String(row.prompt ?? '').trim(),
      answer: row.answer,
      answerUnit: String(row.answer_unit ?? row.answerunit ?? '').trim(),
      difficulty: String(row.difficulty ?? 'easy').trim().toLowerCase(),
      active: isActive(row.active),
    }))
    .filter((row) => row.id && row.prompt && row.active && GRADES.includes(row.grade));
};

export const getQuotes = () => {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.quotes);
  if (!sheet) {
    return [];
  }

  const values = sheet.getDataRange().getValues();
  return rowsToObjects(values)
    .map((row) => ({
      id: String(row.id ?? '').trim(),
      quote: String(row.quote ?? '').trim(),
      author: String(row.author ?? '').trim(),
      theme: String(row.theme ?? 'general').trim().toLowerCase(),
      active: isActive(row.active),
    }))
    .filter((row) => row.id && row.quote && row.active);
};

/** Active playground users for username + PIN login. */
export const getUsers = () => {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.users);
  if (!sheet) {
    return [];
  }

  const values = sheet.getDataRange().getValues();
  return rowsToObjects(values)
    .map((row) => ({
      username: String(row.username ?? '')
        .trim()
        .toLowerCase(),
      password: String(row.password ?? row.pin ?? '').trim(),
      displayName: String(row.display_name ?? row.displayname ?? row.username ?? '').trim(),
      active: isActive(row.active),
    }))
    .filter((row) => row.username && row.password && row.active);
};

export const getConfigMap = () => {
  const sheet = getSpreadsheet().getSheetByName(SHEET_NAMES.config);
  if (!sheet) {
    return {};
  }

  const values = sheet.getDataRange().getValues();
  const map = {};
  values.slice(1).forEach(([key, value]) => {
    if (key !== '' && key !== null && key !== undefined) {
      map[String(key).trim()] = value;
    }
  });
  return map;
};

export const getMultiplicationRange = (grade) => {
  const config = getConfigMap();
  const minKey = `mult_grade_${grade}_min`;
  const maxKey = `mult_grade_${grade}_max`;
  const fallback = DEFAULT_MULTIPLICATION_RANGES[grade] || DEFAULT_MULTIPLICATION_RANGES[3];

  const min = Number(config[minKey]);
  const max = Number(config[maxKey]);

  if (Number.isFinite(min) && Number.isFinite(max) && min <= max) {
    return { min, max };
  }

  return fallback;
};
