import GoogleSheetsAPI from './index.js';
import dotenv from 'dotenv';

dotenv.config();

const sheetId = '1TIgldgk2HKNEaP0PrHw05Hm-44ZF15yO25RX_AUhzpo';
const tabName = 'Sheet1';
const range = 'A:E';

(async function() {
  // Generating google sheet client
  const googleSheetClient = new GoogleSheetsAPI({
    keyFile: process.env.KEY_FILE_BASE64,
  })

  // Reading Google Sheet from a specific range
  const data = await googleSheetClient.read(sheetId, tabName, range);

  console.log('Found data', data);

  // Adding a new row to Google Sheet
  const dataToBeInserted = [
     ['11', 'rohith', 'Rohith', 'Sharma', 'Active'],
     ['12', 'virat', 'Virat', 'Kohli', 'Active']
  ]

  const result = await googleSheetClient.write(sheetId, tabName, range, dataToBeInserted);

  console.log('Inserted data result', result)
})()
