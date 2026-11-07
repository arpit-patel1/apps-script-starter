/** Spreadsheet menu so you can seed tabs from Extensions / Playground. */
export const onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('Playground')
    .addItem('Seed / repair database', 'seedDatabase')
    .addToUi();
};
