import { AccountRecord } from "./account-record.js";
import { RecordType } from "./record-type.js";

export class Account {
    public name: string;
    public year: number;
    public records: AccountRecord[];

    constructor(Name: string, Year: number)
    {
        this.name = Name;
        this.year = Year;
        this.records = [];
    }


    InsertRecord(record: AccountRecord): void {
        this.records.push(record);
    }

    GetIncomeForMonth(month: string): number {
        const incomeForMonth = this.records
            .filter(record => record.type === RecordType.income)
            .flatMap(record => record.monthly
                .filter(cell => cell.month === month)
                .map(cell => cell.amount));

        return incomeForMonth.reduce((total, amount) => total + amount, 0);
    }

    GetTotalIncome(): number {
        return this.records.reduce((sum, record) => {
            if (record.type === RecordType.income) {
                return sum + record.total;
            }
            return sum;
        }, 0);
    }


    GetSpenditureForMonth(month: string): number {
        const expenseForMonth = this.records
            .filter(record => record.type === RecordType.spenditure)
            .flatMap(record => record.monthly
                .filter(cell => cell.month === month)
                .map(cell => cell.amount));

        return expenseForMonth.reduce((total, amount) => total + amount, 0);
    }


    GetTotalSpenditure(): number {
        return this.records.reduce((sum, record) => {
            if (record.type === RecordType.spenditure) {
                return sum + record.total;
            }
            return sum;
        }, 0);
    }

    GetCashFlowForMonth(month: string): number {
        const cashFlowForMonth = this.records
            .filter(record => record.type === RecordType.cashflow)
            .flatMap(record => record.monthly
                .filter(cell => cell.month === month)
                .map(cell => cell.amount));

        return cashFlowForMonth.reduce((total, amount) => total + amount, 0);
    }

    GetTotalCashFlow(): number {
        return this.records.reduce((sum, record) => {
            if (record.type === RecordType.cashflow) {
                return sum + record.total;
            }
            return sum;
        }, 0);
    }

    /**
     * Get the total cost of wants for a specific month.
     * @param month The month for which to get the wants expense
     * @returns The total wants expense for the specified month
     */
    GetWantsExpenseForMonth(month: string): number {
        const expenseForMonth = this.records
            .filter(record => record.type === RecordType.wants)
            .flatMap(record => record.monthly
                .filter(cell => cell.month === month)
                .map(cell => cell.amount));

        return expenseForMonth.reduce((total, amount) => total + amount, 0);
    }

    /**
     * Get the total cost of wants for the entire year.
     * @returns The total wants expense for the yearå
     */
    GetTotalWantsExpense(): number {
        return this.records.reduce((sum, record) => {
            if (record.type === RecordType.wants) {
                return sum + record.total;
            }
            return sum;
        }, 0);
    }

    /**
     * Get the total cost of needs for a specific month.
     * @param month The month for which to get the needs expense
     * @returns The total needs expense for the specific month
     */
    GetNeedsExpenseForMonth(month: string): number {
        const expenseForMonth = this.records
            .filter(record => record.type === RecordType.needs)
            .flatMap(record => record.monthly
                .filter(cell => cell.month === month)
                .map(cell => cell.amount));

        return expenseForMonth.reduce((total, amount) => total + amount, 0);
    }

    /**
     * Get the total cost of needs for the entire year.
     * @returns The total needs expense for the year
     */
    GetTotalNeedsExpense(): number {
        return this.records.reduce((sum, record) => {
            if (record.type === RecordType.needs) {
                return sum + record.total;
            }
            return sum;
        }, 0);
    }


    PrintSummary(): void {
        console.log("\n==================================================================================");
        console.log(`Account Summary for ${this.name} (${this.year})`);
        console.log(`Total Income: `.padEnd(21) + `$${this.GetTotalIncome().toFixed(2)}`);
        console.log(`Total Needs Expense: `.padEnd(21) + `$${this.GetTotalNeedsExpense().toFixed(2)}`);
        console.log(`Total Wants Expense: `.padEnd(21) + `$${this.GetTotalWantsExpense().toFixed(2)}`);
        console.log(`Total Spenditure: `.padEnd(21) + `$${this.GetTotalSpenditure().toFixed(2)}`);
        console.log(`Total Cash Flow: `.padEnd(21) + `$${this.GetTotalCashFlow().toFixed(2)}`);
        console.log("==================================================================================\n");
        this.records.forEach(record => {
            console.log(`  - ${record.category}[${record.type}]:`.padEnd(60) + `$${record?.total?.toFixed(2) ?? 'N/A'}`);
        })
    }
}