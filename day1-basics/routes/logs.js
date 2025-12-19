import express from 'express';

const router = express.Router();

// Export a function to set dependencies
export function createLogRouter(logAggregator) {

    // GET /api/logs - Get all logs as plain text
    router.get('/', async (req, res) => {
        try {
            const logs = await logAggregator.getLogs();
            res.type('text/plain').send(logs.join('\n'));
        } catch (error) {
            res.status(500).type('text/html').send('<h1>500 Internal Server Error</h1><p>Failed to get logs.</p>');
        }
    });

    // GET /api/logs/stats - Get log statistics as JSON
    router.get('/stats', (req, res) => {
        try {
            const stats = logAggregator.getStats();
            res.json(stats);
        } catch (error) {
            res.status(500).send('<h1>500 Internal Server Error</h1><p>Failed to get stats.</p>');
        }
    });

    // GET /api/logs/save - Save logs to file
    router.get('/save', async (req, res) => {
        try {
            await logAggregator.saveLogs();
            res.send('<h1>Logs saved successfully.</h1>');
        } catch (error) {
            res.status(500).send('<h1>500 Internal Server Error</h1><p>Failed to save logs.</p>');
        }
    });

    return router;
}