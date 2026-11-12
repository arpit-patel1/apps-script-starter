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
  return HtmlService.createHtmlOutputFromFile(fileName)
    .setTitle(title)
    .setFaviconUrl(FAVICON_URL)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .addMetaTag('apple-mobile-web-app-capable', 'yes')
    .addMetaTag('mobile-web-app-capable', 'yes')
    .addMetaTag('apple-mobile-web-app-title', 'Playground')
    .addMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent')
    .addMetaTag('theme-color', '#1F6B56');
};
