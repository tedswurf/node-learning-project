import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { LogAggregator } from './operations/log-aggregator.js';
import { createLogRouter } from './routes/logs.js';
import { createRecordRouter } from './routes/records.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Initialize Express app
const app = express();

// Initialize LogAggregator
const logFilePath = path.join(__dirname, 'logs', 'app.log');
const logAggregator = new LogAggregator(logFilePath).SetupDefaultHandlers();

// Setup routers with dependencies
const logRouter = createLogRouter(logAggregator);
const recordRouter = createRecordRouter(logAggregator);

// Mount API routers
app.use('/api/logs', logRouter);
app.use('/api/records', recordRouter);

// Home route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the simple-server</h1><p>This is the home page.</p>');
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
    const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
    res.sendFile(faviconPath);
});

// GET /api/data - Read sample.txt file
app.get('/api/data', (req, res) => {
    const dataPath = path.join(__dirname, 'DATA', 'sample.txt');

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file.' });
        }
        res.json({ content: data });
    });
});

// 404 handler - must be last
app.use((req, res) => {
    res.status(404).send('<h1>404 Not Found</h1><p>The requested resource was not found on this server.</p>');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
