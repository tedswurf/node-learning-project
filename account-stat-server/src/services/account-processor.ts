import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Account } from '../models/account.js';
import { RecordType } from '../models/record-type.js';
import { MapAccountRecord, CleanseCsvNumber } from '../helpers.ts/account-csv-mapper.js';
import { LogAggregator } from './log-aggregator.js';

export class AccountProcessor {
    private dirPath: string;
    private logger: LogAggregator;
    private Accounts: Account[] = [];

    constructor(dirPath: string, logger: LogAggregator) {
        this.dirPath = dirPath;
        this.logger = logger;
    }

    public getAccounts(): Account[] {
        return this.Accounts;
    }

    public async processAllAccounts(): Promise<Account[]> {
        // Find all CSV files in the directory
        const files = fs.readdirSync(this.dirPath).filter(file => file.endsWith('.csv'));

        if (files.length === 0) {
            this.logger.logError(`No CSV files found in directory: ${this.dirPath}`);
            throw new Error(`No CSV files found in directory: ${this.dirPath}`);
        }

        this.logger.logInfo(`Found ${files.length} CSV file(s) to process`);

        // Process each file and wait for completion
        for (const file of files) {
            const fullPath = path.join(this.dirPath, file);
            try {
                await this.processAccount(fullPath);
            } catch (error) {
                this.logger.logError(`Failed to process file ${file}: ${error}`);
                // Continue processing other files even if one fails
            }
        }

        return this.Accounts;
    }

    public async processAccount(filePath: string): Promise<Account> {
        // Verify the file exists
        if (!fs.existsSync(filePath)) {
            this.logger.logError(`File not found: ${filePath}`);
            throw new Error(`File not found: ${filePath}`);
        }

        const name = path.basename(filePath, '.csv');
        const yearMatch = name.match(/\d{4}$/);
        const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

        this.logger.logInfo(`Processing account file: ${filePath} for year ${year}`);

        return new Promise<Account>((resolve, reject) => {
            let account: Account = new Account(name, year);

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => {
                    let category = '';
                    let type: RecordType = RecordType.unknown;

                    try {
                        category = data['Category'].toLowerCase().trim();
                        type = data['Type'].toLowerCase().trim() as RecordType;
                    } catch (error) {
                        // Log and skip malformed rows
                        this.logger.logWarn(`Skipping malformed row in file ${filePath}: ${JSON.stringify(data)}`);
                        return;
                    }

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
                    this.Accounts.push(account);
                    resolve(account);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }
}