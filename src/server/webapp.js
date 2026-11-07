import { ensureDatabase } from './seed.js';

export const doGet = () => {
  // Seed missing tabs (Quotes, WordProblems, Config) as soon as the web app loads.
  try {
    ensureDatabase();
  } catch (error) {
    console.error('ensureDatabase failed in doGet', error);
  }

  const title = 'Kids Homework Playground';
  const fileName = 'index.html';
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
};
