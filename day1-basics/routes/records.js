import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoadFile, ViewRows } from '../operations/csv-loader.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to convert rows to HTML table
function ConvertRowsToHTMLTable(rows) {
    let html = '<table border="1" cellpadding="5" cellspacing="0">';

    rows.forEach((columns, rowIndex) => {
        html += '<tr>';
        columns.forEach((col) => {
            if (rowIndex === 0) {
                html += `<th>${col}</th>`;
            } else {
                html += `<td>${col}</td>`;
            }
        });
        html += '</tr>';
    });

    html += '</table>';
    return html;
}

// Export a function to create the router with dependencies
export function createRecordRouter(logAggregator) {

    // GET /api/records/view - View CSV as HTML table
    router.get('/view', async (req, res) => {
        const filePath = path.join(__dirname, '..', 'DATA', 'RecordAccounting.csv');

        try {
            const fileContent = await LoadFile(filePath);
            const view = await ViewRows(fileContent);
            const html = ConvertRowsToHTMLTable(view);

            res.type('text/html').send(html);

            logAggregator.addLog('info', 'CSV data viewed successfully via /api/records/view');
        } catch (error) {
            res.status(500).send('<h1>500 Internal Server Error</h1><p>Failed to load CSV data.</p>');
        }
    });

    return router;
}
