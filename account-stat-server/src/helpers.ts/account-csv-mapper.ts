import { AccountCell } from "../models/account-cell.js";
import { AccountRecord } from "../models/account-record.js";
import { RecordType } from "../models/record-type.js";

export function MapAccountRecord(
        category: string,
        recordType: RecordType,
        total: number,
        mean: number,
        median: number,
        ...monthly: Array<[string, number]>): AccountRecord {

    return new AccountRecord()
    .Category(category)
    .Type(recordType)
    .Monthly(monthly
        .map(([monthName, amount]) => new AccountCell(monthName, amount)))
    .Total(total)
    .Mean(mean)
    .Median(median);
}


export function CleanseCsvNumber(value: string): number {
    // Remove any commas or currency symbols and convert to number
    if (value === undefined || value === null || value.trim() === '') {
        return 0;
    }

    const cleanedValue = value.replace(/[$,]/g, '');
    return parseFloat(cleanedValue);
}