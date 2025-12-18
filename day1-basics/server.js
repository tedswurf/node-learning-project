import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoadFile, ViewRows } from './operations/csv-loader.js';
import { LogAggregator } from './operations/log-aggregator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const logFilePath = path.join(__dirname, 'logs', 'app.log');
const logAggregator = new LogAggregator(logFilePath).SetupDefaultHandlers();

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    res.setHeader('Content-Type', 'text/html');

    // Route handling
    if (req.url === '/') {
        res.statusCode = 200;
        res.end("<h1>Welcome to the simple-server</h1><p>This is the home page.</p>");
    }
    else if (req.url === '/favicon.ico') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'image/x-icon');
        const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
        fs.createReadStream(faviconPath).pipe(res);
    }
    else if (req.url === '/api/data') { 
        const dataPath = path.join(__dirname, 'DATA', 'sample.txt');

        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Failed to read data file." }));
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ content: data }));
        });
    }
    else if (req.url === '/api/records/view') {
        const filePath = path.join(__dirname, 'DATA', 'RecordAccounting.csv');

        try {
            const fileContent = await LoadFile(filePath);

            const view = await ViewRows(fileContent);
            const html = ConvertRowsToHTMLTable(view);

            res.setHeader('Content-Type', 'text/html');
            res.end(html);

            logAggregator.addLog('info', 'CSV data viewed successfully via /api/records/view');
        } catch (error) {
            res.statusCode = 500;
            res.end("<h1>500 Internal Server Error</h1><p>Failed to load CSV data.</p>");
            return;
        }
    }
    else if (req.url === '/api/logs/save') {
        try {
            await logAggregator.saveLogs();

            res.statusCode = 200;
            res.end("<h1>Logs saved successfully.</h1>");
        } catch (error) {
            res.statusCode = 500;
            res.end("<h1>500 Internal Server Error</h1><p>Failed to save logs.</p>");
            return;
        }
    }
    else if (req.url === '/api/logs') {
        try {
            const logs = await logAggregator.getLogs();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(logs.join('\n'));
        } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/html');
            res.end("<h1>500 Internal Server Error</h1><p>Failed to get logs.</p>");
            return;
        }
    }
    else if (req.url === '/api/logs/stats') {
        try {
            const stats = logAggregator.getStats();

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(stats));
        } catch (error) {
            res.statusCode = 500;
            res.end("<h1>500 Internal Server Error</h1><p>Failed to get stats.</p>");
            return;
        }
    }
    else {
        res.statusCode = 404;
        res.end("<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>");
    }
});


server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})



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