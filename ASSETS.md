## Links
- [Sheets](https://docs.google.com/spreadsheets/d/13qL14Udew12EPWBIiSdrpAL1n7srYFSETsCYzqzwZrY/edit?gid=0#gid=0)

## Apps Script

```js

const sheetName = 'DICT SURVEY'
const scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost(e){
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    Logger.log(JSON.stringify(e.parameters)); 

    const doc = SpreadsheetApp.openById (scriptProp.getProperty('key'))
    const sheet = doc.getSheetByName(sheetName)

    const headers = sheet.getRange(1,1,1, sheet.getLastColumn()).getValues()[0]
    const nextRow = sheet.getLastRow() + 1

    const newRow = headers.map(function(header) {
      return header === 'Date' ? 
      new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

   return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}

function doGet(e) {
  const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
  const sheet = doc.getSheetByName(sheetName);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);
  const summary = {};
  const totalResponses = rows.length;

  headers.forEach((header, index) => {
    const columnData = rows.map(row => row[index]);
    const uniqueValues = [...new Set(columnData)];
    const averageLength = columnData.reduce((acc, val) => acc + (val ? val.toString().length : 0), 0) / columnData.length;

    summary[header] = {
      count: columnData.length,
      uniqueValues: uniqueValues.length,
      averageLength: Math.round(averageLength * 100) / 100,
      counts: uniqueValues.reduce((acc, value) => {
        acc[value] = columnData.filter(item => item === value).length;
        return acc;
      }, {})
    };
  });

  return ContentService
    .createTextOutput(JSON.stringify({
      totalResponses,
      columns: headers,
      summary
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

```