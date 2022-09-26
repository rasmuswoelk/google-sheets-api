import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export default class GoogleSheetsAPI {
  constructor({
    keyFile,
    scopes,
  }) {
    this.keyFile = keyFile;
    this.scopes = scopes;
  }

  getKeyFile = () => {
    try {
      // Check if key file is bassed as a path and return if the file exists
      if (fs.existsSync(this.keyFile)) {
        return this.keyFile;
      }
        // Create temporary credentials.json file
        const filePath = path.join(path.resolve(), './credentials.json');

        // Write the file with the decoded base64 string which contains the credentials
        fs.writeFileSync(
          filePath,
          Buffer.from(this.keyFile, 'base64').toString('utf8'),
        );

        this.keyFileCreated = true;

        return filePath;
    } catch (error) {
      throw new Error(`Error while reading key file: ${error}`);
    }
  }

  client = async () => {
    if (!this.googleAuth) {
      this.googleAuth = new google.auth.GoogleAuth({
        keyFile: this.getKeyFile(),
        scopes: this.scopes || ['https://www.googleapis.com/auth/spreadsheets'],
      });
    }

    const auth = await this.googleAuth.getClient();

    // Remove the temporary credentials file
    if (this.keyFileCreated) {
      fs.unlinkSync(this.getKeyFile());
    }

    return google.sheets({
      version: 'v4',
      auth,
    });;
  }
  
  read = async (sheetId, tabName, range) => {
    const client = await this.client();

    const res = await client.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
    });
  
    return res.data.values;
  }
  
  write = async (sheetId, tabName, range, data) => {
    const client = await this.client();

    const res = await client.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        "majorDimension": "ROWS",
        "values": data
      },
    })
  
    return res;
  }
}
