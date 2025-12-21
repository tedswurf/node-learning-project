# Account Statistics Server

A TypeScript-based Express server for processing and viewing personal accounting data from CSV files.

## Features

- **CSV Processing**: Automatically loads and processes accounting CSV files from multiple years
- **Account Statistics**: Calculates totals, means, and medians for income, expenses, and cash flow
- **Web Interface**: View account data in formatted HTML tables
- **Logging System**: Comprehensive request and error logging with automatic flushing
- **RESTful API**: JSON and HTML endpoints for accessing account data

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher

## Project Structure

```
account-stat-server/
├── DATA/                    # CSV files (gitignored)
│   ├── Accounting2021.csv
│   ├── Accounting2022.csv
│   └── ...
├── LOGS/                    # Application logs (gitignored)
│   └── app.log
├── src/
│   ├── models/             # Data models
│   ├── routes/             # Express route handlers
│   ├── services/           # Business logic
│   ├── helpers.ts/         # Helper functions
│   └── server.ts           # Main server entry point
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd node-learning-project/account-stat-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create required directories:**
   ```bash
   mkdir -p DATA LOGS
   ```

4. **Add your CSV files:**
   Place your accounting CSV files in the `DATA/` directory. Files should be named like `AccountingYYYY.csv` (e.g., `Accounting2024.csv`).

## CSV File Format

Your CSV files must have the following structure:

```csv
Category,Type,January,February,March,...,December,,Total,Median,Mean
Income,income,"$5,000","$5,000",...
Mortgage,needs,"$1,500","$1,500",...
Restaurants,wants,"$200","$250",...
```

**Required columns:**
- `Category`: The name of the income/expense category
- `Type`: One of: `income`, `spenditure`, `cashflow`, `needs`, `wants`, `investments`, or `N/A`
- Monthly columns: `January` through `December` (amounts can include $ and commas)
- `Total`: Annual total
- `Median`: Median monthly amount
- `Mean`: Average monthly amount

## Running the Server

### Development Mode

**Option 1: Using npx (recommended):**
```bash
npx tsx src/server.ts
```

**Option 2: Using npm script (if configured):**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Production Mode

1. **Build the project:**
   ```bash
   npx tsc
   ```

2. **Run the compiled JavaScript:**
   ```bash
   node dist/server.js
   ```

## API Endpoints

### View Accounts (HTML)
```
GET /api/accounts/view
```
Returns all account data as formatted HTML tables, one per year.

**Example:**
```bash
curl http://localhost:3000/api/accounts/view
```

### View Logs (Plain Text)
```
GET /api/logs
```
Returns application logs in plain text format.

**Query parameters:**
- `fromTime`: Filter logs from this timestamp (ISO 8601)
- `toTime`: Filter logs until this timestamp (ISO 8601)
- `level`: Filter by log level (`INFO`, `WARN`, `ERROR`)
- `pageSize`: Limit number of logs returned (default: 100)

**Example:**
```bash
curl http://localhost:3000/api/logs
```

### Health Check
```
GET /health
```
Returns `200 OK` if the server is running.

## Debugging with VSCode

This project includes VSCode debug configurations in `.vscode/launch.json`.

### Debug Configurations:

1. **Debug Server** - Runs the full server with debugging
2. **Debug Current File** - Debugs the currently open TypeScript file
3. **Attach to Running Server** - Attaches debugger to an already running server

### How to Debug:

1. **Open VSCode** at the `node-learning-project` directory
2. **Set breakpoints** by clicking in the left margin of any `.ts` file
3. **Press F5** or go to Run & Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
4. **Select "Debug Server"** from the dropdown
5. **Start debugging** by pressing F5 or clicking the green play button

The debugger will pause at your breakpoints, allowing you to:
- Inspect variables
- Step through code (F10 = step over, F11 = step into)
- Evaluate expressions in the Debug Console
- View the call stack

## Configuration

### Server Settings

Edit `src/server.ts` to modify:

- **Port**: Change `const port = 3000` (line 29)
- **Directories**: Modify `serverContext` object (lines 13-17)
  ```typescript
  const serverContext = {
      dataDir: path.join(baseDir, '../DATA'),
      logDir: path.join(baseDir, '../LOGS'),
      logPath: path.join(baseDir, '../LOGS', 'app.log'),
  }
  ```

### Logging Configuration

Edit `src/services/log-aggregator.ts`:

- **Auto-flush interval**: Change `autoFlushIntervalMs = 5000` (line 11) - time in milliseconds
- **Log format**: Modify `timestampLength` and `levelLength` properties

### TypeScript Configuration

Edit `tsconfig.json` to customize TypeScript compiler options:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

## Environment Variables

Currently, the server uses hardcoded paths. To use environment variables:

1. **Install dotenv:**
   ```bash
   npm install dotenv
   ```

2. **Create `.env` file:**
   ```bash
   PORT=3000
   DATA_DIR=./DATA
   LOG_DIR=./LOGS
   ```

3. **Update `src/server.ts`:**
   ```typescript
   import dotenv from 'dotenv';
   dotenv.config();

   const port = process.env.PORT || 3000;
   ```

## Troubleshooting

### CSV File Not Loading

**Error:** `Failed to process file Accounting2022.csv: TypeError: Cannot read properties of undefined (reading 'toLowerCase')`

**Solution:** Check that your CSV file has a `Type` column in the header row:
```csv
Category,Type,January,February,...
```

### Server Won't Start

**Error:** `EADDRINUSE: address already in use`

**Solution:** Another process is using port 3000. Either:
- Kill the existing process: `lsof -ti:3000 | xargs kill -9`
- Or change the port in `src/server.ts`

### Module Not Found Errors

**Error:** `Cannot find module './services/log-aggregator.js'`

**Solution:** Ensure all imports use `.js` extensions (even in TypeScript files):
```typescript
import { LogAggregator } from './services/log-aggregator.js';
```

### Empty Log Output

**Problem:** `/api/logs` returns empty or incomplete logs

**Solution:** Logs are flushed every 5 seconds automatically. Wait a moment or trigger a flush by hitting the `/health` endpoint.

## Development

### Adding New Routes

1. Create a new route file in `src/routes/`:
   ```typescript
   // src/routes/my-route.ts
   import express from 'express';

   export function createMyRouter() {
       const router = express.Router();

       router.get('/', (req, res) => {
           res.json({ message: 'Hello!' });
       });

       return router;
   }
   ```

2. Register the route in `src/server.ts`:
   ```typescript
   import { createMyRouter } from './routes/my-route.js';

   app.use('/api/my-route', createMyRouter());
   ```

### Adding New Models

Create model files in `src/models/`:
```typescript
// src/models/my-model.ts
export class MyModel {
    public id: string;
    public name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Commit with descriptive messages
5. Push and create a pull request

## License

This project is for educational purposes.

## Support

For issues or questions, please create an issue in the repository.
