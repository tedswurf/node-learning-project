import express from 'express';
import { LogAggregator } from '../services/log-aggregator.js';
import { AccountProcessor } from '../services/account-processor.js';

const router = express.Router();

// Helper function to escape HTML special characters
function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

// Helper function to convert rows to HTML table
function ConvertRowsToHTMLTable(rows: string[][]): string {
    if (!rows || rows.length === 0) {
        return '<p>No data available</p>';
    }

    let html = '<table border="1" cellpadding="5" cellspacing="0">';

    rows.forEach((columns, rowIndex) => {
        html += '<tr>';
        columns.forEach((col) => {
            const escapedCol = escapeHtml(col);
            if (rowIndex === 0) {
                html += `<th>${escapedCol}</th>`;
            } else {
                html += `<td>${escapedCol}</td>`;
            }
        });
        html += '</tr>';
    });

    html += '</table>';
    return html;
}

// Export a function to create the router with dependencies
export function createAccountsRouter(accountProcessor: AccountProcessor, logAggregator: LogAggregator) {

    // GET /api/accounts/view - View accounts as HTML table
    router.get('/view', async (req, res) => {
        try {
            const accounts = accountProcessor.getAccounts();

            if (!accounts || accounts.length === 0) {
                res.type('text/html').send('<h1>No Accounts Found</h1><p>No account data is available.</p>');
                return;
            }

            // Build HTML with tables for each account
            let html = '<html><head><title>Account Data</title><style>table { margin-bottom: 30px; } th { background-color: #4CAF50; color: white; }</style></head><body>';
            html += '<h1>Account Data</h1>';

            accounts.forEach(account => {
                html += `<h2>${escapeHtml(account.name)} (${account.year})</h2>`;

                // Check if account has records
                if (!account.records || account.records.length === 0) {
                    html += '<p>No records available for this account.</p>';
                    return;
                }

                // Create table rows
                const rows: string[][] = [];

                // Header row
                const months = account.records[0]?.monthly.map(cell => cell.month) || [];
                rows.push(['Category', 'Type', ...months, 'Total', 'Mean', 'Median']);

                // Data rows
                account.records.forEach(record => {
                    const monthlyValues = record.monthly.map(cell => `$${cell.amount.toFixed(2)}`);
                    rows.push([
                        record.category,
                        record.type,
                        ...monthlyValues,
                        `$${record.total.toFixed(2)}`,
                        `$${record.mean.toFixed(2)}`,
                        `$${record.median.toFixed(2)}`
                    ]);
                });

                html += ConvertRowsToHTMLTable(rows);
            });

            html += '</body></html>';

            res.type('text/html').send(html);

            logAggregator.logInfo('Account data viewed successfully via /api/accounts/view');
        } catch (error) {
            logAggregator.logError(`Error viewing accounts: ${error}`);
            res.status(500).send('<h1>500 Internal Server Error</h1><p>Failed to load account data.</p>');
        }
    });

    return router;
}
