const SHEET_NAME = 'Responses';

function doPost(event) {
  const data = JSON.parse(event.postData.contents);
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Received at', 'Plan', 'Requested date', 'Requested time']);
  }

  sheet.appendRow([
    new Date(data.submittedAt || new Date()),
    data.plan || '',
    data.date || '',
    data.time || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
