import path from 'path';
import fs from 'fs';
import express from 'express';
import { fileURLToPath } from 'url';
import { LogAggregator } from './services/log-aggregator.js';
import { AccountProcessor } from './services/account-processor.js';
import { createLogRouter } from './routes/logs.js';
import { createAccountsRouter } from './routes/accounts.js';

const contextPath = fileURLToPath(import.meta.url);
const baseDir = path.dirname(contextPath);

const serverContext = {
    dataDir: path.join(baseDir, '../DATA'),
    logDir: path.join(baseDir, '../LOGS'),
    logPath: path.join(baseDir, '../LOGS', 'app.log'),
}

await VerifyDirectories();

const logger = new LogAggregator(serverContext.logPath);

try {
    const accountProcessor = new AccountProcessor(serverContext.dataDir, logger);
    await accountProcessor.processAllAccounts();


    const app = express();
    const port = 3000;

    // Middleware to log all requests
    app.use((req, res, next) => {
        logger.logInfo(`${req.method} ${req.path}`);
        next();
    });

    app.get('/', (req, res) => {
        res.sendStatus(200);
    });

    app.get('/health', (req, res) => {
        res.sendStatus(200);
    });

    app.use('/api/logs', createLogRouter(logger));
    app.use('/api/accounts', createAccountsRouter(accountProcessor, logger));

    // Global error handler middleware (must be after all routes)
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        logger.logError(`Unhandled error: ${err.message}\nStack: ${err.stack}`);
        res.status(500).json({ error: 'Internal server error' });
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    // Graceful shutdown handler
    const gracefulShutdown = async (signal: string) => {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        logger.stopAutoFlush();
        await logger.flush();
        console.log('Logs flushed. Exiting.');
        process.exit(0);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
} catch (error) {
    console.error(`Failed to initialize server: ${error}`);
    logger.stopAutoFlush();
    await logger.flush();
    process.exit(1);
}

function VerifyDirectories() {
    if (!fs.existsSync(serverContext.dataDir)) {
        console.log(`DATA directory does not exist. Creating DATA directory at: ${serverContext.dataDir}`);
        fs.mkdirSync(serverContext.dataDir);
    }
    console.log(`DATA directory found at: ${serverContext.dataDir}`);

    if (!fs.existsSync(serverContext.logDir)) {
        console.log(`logs directory does not exist. Creating logs directory at: ${serverContext.logDir}`);
        fs.mkdirSync(serverContext.logDir);
    }
    console.log(`logs directory found at: ${serverContext.logDir}`);
}