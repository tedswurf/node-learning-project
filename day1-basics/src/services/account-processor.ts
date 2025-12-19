import fs from 'fs';
import csv from 'csv-parser';
import { Account } from '../models/account.js';
import { RecordType } from '../models/record-type.js';
import { MapAccountRecord, CleanseCsvNumber } from '../helpers.ts/account-csv-mapper.js';

export async function processAccount(filePath: string, name: string, year: number): Promise<Account> {

    // Verify the file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    return new Promise<Account>((resolve, reject) => {
        let account: Account = new Account(name, year);

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const category = data['Category'].toLowerCase().trim();
                const type = data['Type'].toLowerCase().trim() as RecordType;

                if (category === undefined || category === null || category === '' || !Object.values(RecordType).includes(type) ) {
                    // Skip empty category rows, also skip rows meant to sole signify expense type breakers
                    return;
                }

                // Process each row of CSV data here
                const record = MapAccountRecord(
                    data['Category'],
                    data['Type'].toLowerCase().trim() as RecordType,
                    CleanseCsvNumber(data['Total']),
                    CleanseCsvNumber(data['Mean']),
                    CleanseCsvNumber(data['Median']), 
                    ['January', CleanseCsvNumber(data['January'])],
                    ['February', CleanseCsvNumber(data['February'])],
                    ['March', CleanseCsvNumber(data['March'])],
                    ['April', CleanseCsvNumber(data['April'])],
                    ['May', CleanseCsvNumber(data['May'])],
                    ['June', CleanseCsvNumber(data['June'])],
                    ['July', CleanseCsvNumber(data['July'])],
                    ['August', CleanseCsvNumber(data['August'])],
                    ['September', CleanseCsvNumber(data['September'])],
                    ['October', CleanseCsvNumber(data['October'])],
                    ['November', CleanseCsvNumber(data['November'])],
                    ['December', CleanseCsvNumber(data['December'])]
                );

                account.InsertRecord(record);
            })
            .on('end', () => {
                account.PrintSummary();
                resolve(account);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}