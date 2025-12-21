import express from 'express';
import { LogAggregator } from '../services/log-aggregator.js';
import { AccountProcessor } from '../services/account-processor.js';

const router = express.Router();

// Export a function to create the router with dependencies
export function createAccountsRouter(accountProcessor: AccountProcessor, logAggregator: LogAggregator) {

    // GET /api/accounts/view - View accounts as HTML table
    router.get('/view', async (req, res) => {
        try {
            const accounts = accountProcessor.getAccounts();

            // Render the accounts view with the data
            res.render('accounts', { accounts });

            logAggregator.logInfo('Account data viewed successfully via /api/accounts/view');
        } catch (error) {
            logAggregator.logError(`Error viewing accounts: ${error}`);
            res.status(500).render('error', {
                message: 'Failed to load account data',
                error: error
            });
        }
    });

    return router;
}
