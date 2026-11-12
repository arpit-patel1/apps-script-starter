import { ensureDatabase } from './seed.js';

const FAVICON_URL =
  'https://cdn.jsdelivr.net/gh/arpit-patel1/apps-script-starter@master/icons/favicon-32.png';

export const doGet = () => {
  // Seed missing tabs (Quotes, WordProblems, Config) as soon as the web app loads.
  try {
    ensureDatabase();
  } catch (error) {
    console.error('ensureDatabase failed in doGet', error);
  }

  const title = 'Kids Homework Playground';
  const fileName = 'index.html';
  // HtmlService.addMetaTag only allows a small whitelist (e.g. viewport).
  // Apple web-app meta tags live in index.html + installAppIcons() instead.
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setFaviconUrl(FAVICON_URL)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
};
