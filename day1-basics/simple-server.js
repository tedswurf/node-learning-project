import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoadFile, ViewRows } from './operations/csv-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const server = http.createServer((req, res) => {
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

        LoadFile(filePath)
            .then(async (rows) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/html');
                const view = await ViewRows(rows);
                const html = ConvertRowsToHTMLTable(view);
                res.end(html);
            })
            .catch((error) => {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Failed to load records." }));
            });
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