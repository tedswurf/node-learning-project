import { AccountCell } from "./account-cell.js";
import { RecordType } from "./record-type.js";

export class AccountRecord {
    // Name of the accounting category
    public category: string;

    // Monthly breakdown of amounts
    public monthly: AccountCell[];

    // Type of expense
    public type: RecordType;

    // The total for the year
    public total: number;

    // The average for the year
    public mean: number;

    // The median for the year
    public median: number;

    constructor() {
        this.category = "";
        this.monthly = [];
        this.type = RecordType.unknown;
        this.total = 0;
        this.mean = 0;
        this.median = 0;
    }

    Category(value: string) {
        this.category = value;

        return this;
    }

    Type(value: RecordType) {
        this.type = value;

        return this;
    }

    Monthly(value: AccountCell[]) {
        this.monthly = value;

        return this;
    }

    Total(value: number) {
        this.total = value;

        return this;
    }

    Mean(value: number) {
        this.mean = value;

        return this;
    }

    Median(value: number) {
        this.median = value;

        return this;
    }


    PrintSummary() {
        console.log("\n");
        console.log(`Category (${this.type}): ${this.category}`);

        let headerLine = ""
        let valueLine = ""
        this.monthly.forEach(cell => {
            headerLine += `${cell.month.padEnd(10)}`;
            valueLine += `$${cell.amount.toFixed(2)}`.padEnd(10);
        });


        headerLine += "|";
        valueLine += "|";

        headerLine += `Total`.padEnd(12);
        headerLine += `Mean`.padEnd(12);
        headerLine += `Median`.padEnd(12);

        valueLine += `$${this.total.toFixed(2)}`.padEnd(12);
        valueLine += `$${this.mean.toFixed(2)}`.padEnd(12);
        valueLine += `$${this.median.toFixed(2)}`.padEnd(12);

        console.log(headerLine);
        console.log(valueLine);
    }
}