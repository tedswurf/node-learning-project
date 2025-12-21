import express from 'express';
import { LogAggregator } from '../services/log-aggregator.js';
import { Log } from '../models/log.js';

const router = express.Router();

// Export a function to set dependencies
export function createLogRouter(logAggregator: LogAggregator) {

    // GET /api/logs - Get all logs as plain text
    router.get('/', async (req, res) => {
        try {
            const logs = await logAggregator.getLogs();
            res.type('text/plain').send(logs.map(log => `[${log.timestamp.toISOString()}] [${log.level}] ${log.message}`).join('\n'));
        } catch (error) {
            console.error('Error in /api/logs route:', error);
            logAggregator.logError(`Error getting logs: ${error}`);
            res.status(500).type('text/html').send('<h1>500 Internal Server Error</h1><p>Failed to get logs.</p>');
        }
    });

    return router;
}