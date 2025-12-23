import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Account } from '../models/account.js';
import { RecordType } from '../models/record-type.js';
import { MapAccountRecord, CleanseCsvNumber } from '../helpers.ts/account-csv-mapper.js';
import { LogAggregator } from './log-aggregator.js';

export class AccountService {
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


    public getAccountByName(name: string): Account | null {
        return this.Accounts.find(account => account.name === name) || null;
    }


    public getAccountByYear(year: number): Account[] {
        return this.Accounts.filter(account => account.year === year);
    }

    // Methods to get specific data points for a given account

    public getIncomeForMonthInYear(month: string, year: number): number | null {
        return this.Accounts.find(account => account.year === year)?.GetIncomeForMonth(month) || null;
    }


    public getExpenseForMonthInYear(month: string, year: number): number | null {
        return this.Accounts.find(account => account.year === year)?.GetSpenditureForMonth(month) || null;
    }


    public getCashFlowForMonthInYear(month: string, year: number): number | null {
        return this.Accounts.find(account => account.year === year)?.GetCashFlowForMonth(month) || null;
    }


    public getAmountForCategoryInMonthForYear(category: string, month: string, year: number): number | null {
        return this.Accounts.find(account => account.year === year)?.GetAmountForCategoryInMonth(category, month) || null;
    }


    public getTotalAmountForCategoryInYear(category: string, year: number): number | null {
        return this.Accounts.find(account => account.year === year)?.GetTotalAmountForCategory(category) || null;
    }


    public getMeanAmountForCategoryInYear(category: string, year: number): number | null {
        return this.Accounts.find(account => account.year === year)?.GetMeanAmountForCategory(category) || null;
    }


    public getMedianAmountForCategoryInYear(category: string, year: number): number | null {
        return this.Accounts.find(account => account.year === year)?.GetMedianAmountForCategory(category) || null;
    }


    // Methods to get multiple data points across multiple accounts.

    public getIncomeForMonthAcrossYears(month: string, years: number[]): Map<number, number | null> {
        const result = new Map<number, number | null>();

        years.forEach(year => {
            const income = this.getIncomeForMonthInYear(month, year);
            result.set(year, income);
        });

        return result;
    }


    public getExpenseForMonthAcrossYears(month: string, years: number[]): Map<number, number | null> {
        const result = new Map<number, number | null>();

        years.forEach(year => {
            const expense = this.getExpenseForMonthInYear(month, year);
            result.set(year, expense);
        });

        return result;
    }


    public getCashFlowForMonthAcrossYears(month: string, years: number[]): Map<number, number | null> {
        const result = new Map<number, number | null>();

        years.forEach(year => {
            const cashFlow = this.getCashFlowForMonthInYear(month, year);
            result.set(year, cashFlow);
        });

        return result;
    }


    public getAmountForCategoryInMonthAcrossYears(category: string, month: string, years: number[]): Map<number, number | null> {
        const result = new Map<number, number | null>();

        years.forEach(year => {
            const amount = this.getAmountForCategoryInMonthForYear(category, month, year);
            result.set(year, amount);
        });

        return result;
    }


    public getTotalAmountForCategoryAcrossYears(category: string, years: number[]): Map<number, number | null> {
        const result = new Map<number, number | null>();

        years.forEach(year => {
            const total = this.getTotalAmountForCategoryInYear(category, year);
            result.set(year, total);
        });

        return result;
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
                        category,
                        type,
                        CleanseCsvNumber(data['Total']),
                        CleanseCsvNumber(data['Mean']),
                        CleanseCsvNumber(data['Median']), 
                        ['january', CleanseCsvNumber(data['January'])],
                        ['february', CleanseCsvNumber(data['February'])],
                        ['march', CleanseCsvNumber(data['March'])],
                        ['april', CleanseCsvNumber(data['April'])],
                        ['may', CleanseCsvNumber(data['May'])],
                        ['june', CleanseCsvNumber(data['June'])],
                        ['july', CleanseCsvNumber(data['July'])],
                        ['august', CleanseCsvNumber(data['August'])],
                        ['september', CleanseCsvNumber(data['September'])],
                        ['october', CleanseCsvNumber(data['October'])],
                        ['november', CleanseCsvNumber(data['November'])],
                        ['december', CleanseCsvNumber(data['December'])]
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