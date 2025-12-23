import express from 'express';
import { LogAggregator } from '../services/log-aggregator.js';
import { AccountService } from '../services/account-service.js';

const router = express.Router();

// Export a function to create the router with dependencies
export function createAccountsRouter(accountProcessor: AccountService, logAggregator: LogAggregator) {

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


    // GET /api/accounts/years - Get list of available years
    router.get('/years', (req, res) => {
        try {
            const accounts = accountProcessor.getAccounts();
            const years = Array.from(new Set(accounts.map(acc => acc.year))).sort();
            res.json({ years });
        } catch (error) {
            logAggregator.logError(`Error getting years: ${error}`);
            res.status(500).json({ error: 'Failed to get years' });
        }
    });


    // GET /api/accounts/years/:year - Get accounts for a specific year
    router.get('/years/:year', (req, res) => {
        const year = parseInt(req.params.year, 10);
        try {
            const accounts = accountProcessor.getAccountByYear(year);
            res.render('accounts', { accounts });
        } catch (error) {
            logAggregator.logError(`Error getting accounts for year ${year}: ${error}`);
            res.status(500).json({ error: `Failed to get accounts for year ${year}` });
        }
    });


    // GET /api/accounts/total/category/:category?years=2024,2025 - Get total amounts for a category across years
    // Ex http://localhost:3000/api/accounts/total/category/mortgage/?years=2024,2025
    router.get('/total/category/:category', (req, res) => {
        try {
            const category = req.params.category.toLowerCase();
            const yearsParam = req.query.years as string;

            // Parse comma-separated years or get all available years
            let years: number[];
            if (yearsParam) {
                years = yearsParam.split(',').map(y => {
                    const parsed = parseInt(y.trim(), 10);
                    if (isNaN(parsed)) {
                        throw new Error(`Invalid year: ${y.trim()}`);
                    }
                    return parsed;
                });
            } else {
                // If no years specified, get all available years
                const accounts = accountProcessor.getAccounts();
                years = Array.from(new Set(accounts.map(a => a.year))).sort();
            }

            const totals = accountProcessor.getTotalAmountForCategoryAcrossYears(category, years);

            // Convert Map to object for JSON response
            const totalsObj: { [key: number]: number | null } = {};
            totals.forEach((value, key) => {
                totalsObj[key] = value;
            });

            res.json({
                category,
                years,
                totals: totalsObj
            });

            logAggregator.logInfo(`Retrieved totals for category '${category}' across years: ${years.join(',')}`);
        } catch (error) {
            logAggregator.logError(`Error getting totals for category: ${error}`);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to get category totals' });
        }
    });


    // GET /api/accounts/category/:category/month/:month?years=2024,2025 - Get amount for a category in a specific month across years
    // Ex http://localhost:3000/api/accounts/category/mortgage/month/january?years=2024,2025
    router.get('/category/:category/month/:month', (req, res) => {
        try {
            const category = req.params.category.toLowerCase();
            const month = req.params.month.toLowerCase();
            const yearsParam = req.query.years as string;

            // Parse comma-separated years or get all available years
            let years: number[];
            if (yearsParam) {
                years = yearsParam.split(',').map(y => {
                    const parsed = parseInt(y.trim(), 10);
                    if (isNaN(parsed)) {
                        throw new Error(`Invalid year: ${y.trim()}`);
                    }
                    return parsed;
                });
            } else {
                // If no years specified, get all available years
                const accounts = accountProcessor.getAccounts();
                years = Array.from(new Set(accounts.map(a => a.year))).sort();
            }

            const amounts = accountProcessor.getAmountForCategoryInMonthAcrossYears(category, month, years);

            // Convert Map to object for JSON response
            const amountsObj: { [key: number]: number | null } = {};
            amounts.forEach((value, key) => {
                amountsObj[key] = value;
            });

            res.json({
                category,
                month,
                years,
                amounts: amountsObj
            });

            logAggregator.logInfo(`Retrieved amounts for category '${category}' in '${month}' across years: ${years.join(',')}`);
        } catch (error) {
            logAggregator.logError(`Error getting amounts for category in month: ${error}`);
            res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to get category amounts' });
        }
    });


    return router;
}
