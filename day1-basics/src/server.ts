import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { processAccount } from './services/account-processor.js';

console.log(`LOADING Account Name: 2024 Account`);
const account2025 = await processAccount(path.join(__dirname, '../DATA/Accounting2024.csv'), '2024 Account', 2024);