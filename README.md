# Week 1: Node.js Fundamentals & Async Programming - Detailed Instructions

## Setup & Prerequisites

### Installation Checklist
1. **Install Node.js**
   ```bash
   # Visit nodejs.org and download LTS version (v18+)
   # Verify installation:
   node --version
   npm --version
   ```

2. **Install VS Code Extensions**
   - ESLint
   - Prettier - Code formatter
   - JavaScript (ES6) code snippets
   - npm Intellisense
   - Path Intellisense

3. **Create Project Directory**
   ```bash
   mkdir nodejs-learning
   cd nodejs-learning
   ```

---

## Day 1-2: Node.js Basics

### Session 1: Understanding Node.js Runtime (2 hours)

**Theory:**
- Node.js is a JavaScript runtime built on Chrome's V8 engine
- Single-threaded but uses event loop for non-blocking I/O
- Different from browser JavaScript (no DOM, has file system access)

**Compare to Python:**
```python
# Python
import sys
print(sys.version)

# Node.js equivalent
console.log(process.version);
console.log(process.platform);
```

**Hands-on Exercise 1.1: Hello Node**
```bash
mkdir day1-basics
cd day1-basics
```

Create `hello.js`:
```javascript
// hello.js
console.log('Hello from Node.js!');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);
console.log('Platform:', process.platform);

// Command line arguments (like sys.argv in Python)
console.log('Arguments:', process.argv);
```

Run it:
```bash
node hello.js arg1 arg2
```

### Session 2: Module System (2 hours)

**Theory:**
- CommonJS (older): `require()` and `module.exports`
- ES Modules (modern): `import` and `export`
- Node.js now supports both

**Exercise 1.2: Creating Modules**

Create `math-utils.js`:
```javascript
// math-utils.js - CommonJS style
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Export multiple functions
module.exports = {
  add,
  multiply,
  divide
};
```

Create `main.js`:
```javascript
// main.js
const math = require('./math-utils');

console.log('5 + 3 =', math.add(5, 3));
console.log('5 * 3 =', math.multiply(5, 3));
console.log('10 / 2 =', math.divide(10, 2));

try {
  math.divide(5, 0);
} catch (error) {
  console.error('Error:', error.message);
}
```

**Exercise 1.3: ES Modules**

Create `package.json`:
```json
{
  "name": "day1-basics",
  "version": "1.0.0",
  "type": "module"
}
```

Create `string-utils.mjs`:
```javascript
// string-utils.mjs - ES Module style
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverse(str) {
  return str.split('').reverse().join('');
}

export default function toSnakeCase(str) {
  return str.toLowerCase().replace(/\s+/g, '_');
}
```

Create `main-esm.js`:
```javascript
// main-esm.js
import toSnakeCase, { capitalize, reverse } from './string-utils.mjs';

console.log(capitalize('hello world'));
console.log(reverse('hello'));
console.log(toSnakeCase('Hello World Example'));
```

Run: `node main-esm.js`

### Session 3: File System Module (2 hours)

**Exercise 1.4: Reading and Writing Files**

Create `file-operations.js`:
```javascript
// file-operations.js
import fs from 'fs';
import path from 'path';

// Synchronous read (blocking - avoid in production)
try {
  const data = fs.readFileSync('input.txt', 'utf8');
  console.log('File contents:', data);
} catch (error) {
  console.error('Error reading file:', error.message);
}

// Asynchronous read (callback style)
fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Async read:', data);
});

// Write file
const content = 'Hello from Node.js!\nThis is line 2.\n';
fs.writeFile('output.txt', content, 'utf8', (err) => {
  if (err) {
    console.error('Error writing:', err.message);
    return;
  }
  console.log('File written successfully');
});

// Working with paths
const filePath = path.join(__dirname, 'data', 'file.txt');
console.log('Full path:', filePath);
console.log('Directory:', path.dirname(filePath));
console.log('Filename:', path.basename(filePath));
console.log('Extension:', path.extname(filePath));
```

Create `input.txt`:
```
This is a test file.
Node.js can read this!
```

**Exercise 1.5: Directory Operations**

Create `directory-ops.js`:
```javascript
// directory-ops.js
import fs from 'fs';
import path from 'path';

// Create directory
const dirPath = './test-dir';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
  console.log('Directory created');
}

// List files in directory
fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Error:', err.message);
    return;
  }
  console.log('Files in current directory:');
  files.forEach(file => {
    const stats = fs.statSync(file);
    const type = stats.isDirectory() ? 'DIR' : 'FILE';
    console.log(`  [${type}] ${file}`);
  });
});
```

### Session 4: Building an HTTP Server (2-3 hours)

**Exercise 1.6: Basic HTTP Server**

Create `simple-server.js`:
```javascript
// simple-server.js
import http from 'http';

const PORT = 3000;

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Set response headers
  res.setHeader('Content-Type', 'text/html');

  // Route handling
  if (req.url === '/') {
    res.statusCode = 200;
    res.end('<h1>Welcome to Node.js Server</h1>');
  } else if (req.url === '/about') {
    res.statusCode = 200;
    res.end('<h1>About Page</h1>');
  } else if (req.url === '/api/data') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Hello from API', timestamp: Date.now() }));
  } else {
    res.statusCode = 404;
    res.end('<h1>404 - Page Not Found</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

Run and test:
```bash
node simple-server.js
# Visit http://localhost:3000 in browser
```

**Day 1-2 Project: Command-Line File Processor**

Create `file-processor.js`:
```javascript
// file-processor.js
import fs from 'fs';
import path from 'path';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node file-processor.js <command> <filepath>');
  console.log('Commands: count, upper, reverse');
  process.exit(1);
}

const [command, filepath] = args;

// Check if file exists
if (!fs.existsSync(filepath)) {
  console.error(`File not found: ${filepath}`);
  process.exit(1);
}

// Read file
fs.readFile(filepath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    process.exit(1);
  }

  let result;

  switch (command) {
    case 'count':
      const lines = data.split('\n').length;
      const words = data.split(/\s+/).filter(w => w.length > 0).length;
      const chars = data.length;
      result = `Lines: ${lines}\nWords: ${words}\nCharacters: ${chars}`;
      break;

    case 'upper':
      result = data.toUpperCase();
      break;

    case 'reverse':
      result = data.split('\n').reverse().join('\n');
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }

  console.log(result);

  // Optional: Save to output file
  const outputPath = filepath.replace(path.extname(filepath), '.out.txt');
  fs.writeFile(outputPath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing output:', err.message);
      return;
    }
    console.log(`\nOutput saved to: ${outputPath}`);
  });
});
```

Test it:
```bash
node file-processor.js count input.txt
node file-processor.js upper input.txt
node file-processor.js reverse input.txt
```

---

## Day 3-4: Asynchronous JavaScript

### Session 1: Understanding Callbacks (2 hours)

**Theory:**
Callbacks are functions passed as arguments to be executed later.

**Compare to Python:**
```python
# Python callback-like pattern
def process_data(data, callback):
    result = data * 2
    callback(result)

process_data(5, lambda x: print(x))

# Node.js callback pattern (more common)
function processData(data, callback) {
  const result = data * 2;
  callback(null, result); // (error, result) convention
}

processData(5, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(result);
});
```

**Exercise 2.1: Callback Hell Example**

Create `callback-hell.js`:
```javascript
// callback-hell.js - Example of callback pyramid
import fs from 'fs';

// This is BAD - callback hell
fs.readFile('file1.txt', 'utf8', (err1, data1) => {
  if (err1) {
    console.error(err1);
    return;
  }
  console.log('File 1:', data1);

  fs.readFile('file2.txt', 'utf8', (err2, data2) => {
    if (err2) {
      console.error(err2);
      return;
    }
    console.log('File 2:', data2);

    fs.readFile('file3.txt', 'utf8', (err3, data3) => {
      if (err3) {
        console.error(err3);
        return;
      }
      console.log('File 3:', data3);

      // Imagine more nesting...
      const combined = data1 + data2 + data3;
      fs.writeFile('combined.txt', combined, (err4) => {
        if (err4) {
          console.error(err4);
          return;
        }
        console.log('Combined file written');
      });
    });
  });
});
```

### Session 2: Promises (3 hours)

**Theory:**
Promises represent eventual completion (or failure) of async operations.

**Exercise 2.2: Creating Promises**

Create `promises-basic.js`:
```javascript
// promises-basic.js

// Creating a promise
function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error('Delay cannot be negative'));
    } else {
      setTimeout(() => {
        resolve(`Waited ${ms}ms`);
      }, ms);
    }
  });
}

// Using promises
delay(1000)
  .then(result => {
    console.log(result);
    return delay(500);
  })
  .then(result => {
    console.log(result);
    return delay(200);
  })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error.message);
  })
  .finally(() => {
    console.log('All delays completed');
  });
```

**Exercise 2.3: Promisify File Operations**

Create `promises-fs.js`:
```javascript
// promises-fs.js
import fs from 'fs/promises'; // Promise-based fs API

async function readMultipleFiles() {
  try {
    // Sequential reads
    const file1 = await fs.readFile('file1.txt', 'utf8');
    console.log('File 1:', file1);

    const file2 = await fs.readFile('file2.txt', 'utf8');
    console.log('File 2:', file2);

    const file3 = await fs.readFile('file3.txt', 'utf8');
    console.log('File 3:', file3);

    // Write combined
    const combined = file1 + file2 + file3;
    await fs.writeFile('combined.txt', combined);
    console.log('Combined file written');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

readMultipleFiles();
```

**Exercise 2.4: Parallel Operations**

Create `promises-parallel.js`:
```javascript
// promises-parallel.js
import fs from 'fs/promises';

async function readFilesParallel() {
  try {
    // Read all files in parallel
    const [file1, file2, file3] = await Promise.all([
      fs.readFile('file1.txt', 'utf8'),
      fs.readFile('file2.txt', 'utf8'),
      fs.readFile('file3.txt', 'utf8')
    ]);

    console.log('All files read!');
    console.log('File 1:', file1);
    console.log('File 2:', file2);
    console.log('File 3:', file3);

    return file1 + file2 + file3;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

readFilesParallel();
```

**Exercise 2.5: Promise.race and Promise.allSettled**

Create `promises-advanced.js`:
```javascript
// promises-advanced.js

function fetchData(url, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve({ url, data: `Data from ${url}` });
      } else {
        reject(new Error(`Failed to fetch ${url}`));
      }
    }, delay);
  });
}

// Promise.race - first to complete wins
async function raceExample() {
  console.log('=== Promise.race ===');
  try {
    const result = await Promise.race([
      fetchData('api1', 1000),
      fetchData('api2', 500),
      fetchData('api3', 800)
    ]);
    console.log('Winner:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Promise.allSettled - wait for all, get all results
async function allSettledExample() {
  console.log('\n=== Promise.allSettled ===');
  const results = await Promise.allSettled([
    fetchData('api1', 500),
    fetchData('api2', 300),
    fetchData('api3', 400)
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Result ${index + 1}:`, result.value);
    } else {
      console.log(`Result ${index + 1} failed:`, result.reason.message);
    }
  });
}

// Run examples
(async () => {
  await raceExample();
  await allSettledExample();
})();
```

### Session 3: Async/Await (2 hours)

**Compare to Python:**
```python
# Python async/await
import asyncio

async def fetch_data():
    await asyncio.sleep(1)
    return "Data"

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
```

```javascript
// Node.js async/await (very similar!)
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data"), 1000);
  });
}

async function main() {
  const result = await fetchData();
  console.log(result);
}

main();
```

**Exercise 2.6: Converting to Async/Await**

Create `async-await.js`:
```javascript
// async-await.js
import fs from 'fs/promises';

// Traditional promise chain
function traditionalWay() {
  return fs.readFile('input.txt', 'utf8')
    .then(data => {
      console.log('Read file:', data.length, 'bytes');
      const upper = data.toUpperCase();
      return fs.writeFile('output-upper.txt', upper);
    })
    .then(() => {
      console.log('Written uppercase version');
      return fs.readFile('input.txt', 'utf8');
    })
    .then(data => {
      const reverse = data.split('\n').reverse().join('\n');
      return fs.writeFile('output-reverse.txt', reverse);
    })
    .then(() => {
      console.log('Written reversed version');
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}

// Modern async/await way
async function modernWay() {
  try {
    const data = await fs.readFile('input.txt', 'utf8');
    console.log('Read file:', data.length, 'bytes');

    const upper = data.toUpperCase();
    await fs.writeFile('output-upper.txt', upper);
    console.log('Written uppercase version');

    const reverse = data.split('\n').reverse().join('\n');
    await fs.writeFile('output-reverse.txt', reverse);
    console.log('Written reversed version');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run both
(async () => {
  console.log('=== Traditional Way ===');
  await traditionalWay();

  console.log('\n=== Modern Way ===');
  await modernWay();
})();
```

### Session 4: Event Emitters (2 hours)

**Exercise 2.7: Using EventEmitter**

Create `event-emitter.js`:
```javascript
// event-emitter.js
import { EventEmitter } from 'events';

class FileProcessor extends EventEmitter {
  constructor() {
    super();
  }

  async processFile(filepath) {
    this.emit('start', { filepath });

    try {
      // Simulate reading
      this.emit('progress', { stage: 'reading', percent: 0 });
      await this.delay(500);

      this.emit('progress', { stage: 'reading', percent: 100 });

      // Simulate processing
      this.emit('progress', { stage: 'processing', percent: 0 });
      await this.delay(1000);

      this.emit('progress', { stage: 'processing', percent: 100 });

      // Simulate writing
      this.emit('progress', { stage: 'writing', percent: 0 });
      await this.delay(500);

      this.emit('progress', { stage: 'writing', percent: 100 });

      this.emit('complete', { filepath, success: true });

    } catch (error) {
      this.emit('error', error);
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Usage
const processor = new FileProcessor();

processor.on('start', (data) => {
  console.log(`Started processing: ${data.filepath}`);
});

processor.on('progress', (data) => {
  console.log(`  ${data.stage}: ${data.percent}%`);
});

processor.on('complete', (data) => {
  console.log(`Completed: ${data.filepath}`);
});

processor.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

processor.processFile('example.txt');
```

**Day 3-4 Project: Event-Driven Log Aggregator**

Create `log-aggregator.js`:
```javascript
// log-aggregator.js
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import { watch } from 'fs';

class LogAggregator extends EventEmitter {
  constructor() {
    super();
    this.logs = [];
    this.stats = {
      info: 0,
      warning: 0,
      error: 0
    };
  }

  addLog(level, message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message
    };

    this.logs.push(logEntry);
    this.stats[level]++;

    this.emit('log', logEntry);

    if (level === 'error') {
      this.emit('error-logged', logEntry);
    }
  }

  getStats() {
    return {
      total: this.logs.length,
      ...this.stats
    };
  }

  async saveLogs(filepath) {
    const content = this.logs
      .map(log => `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`)
      .join('\n');

    await fs.writeFile(filepath, content);
    this.emit('saved', { filepath, count: this.logs.length });
  }
}

// Usage
const aggregator = new LogAggregator();

aggregator.on('log', (log) => {
  console.log(`[${log.level.toUpperCase()}] ${log.message}`);
});

aggregator.on('error-logged', (log) => {
  console.error(`!!! ERROR DETECTED: ${log.message}`);
});

aggregator.on('saved', (data) => {
  console.log(`Saved ${data.count} logs to ${data.filepath}`);
});

// Simulate logging
aggregator.addLog('info', 'Application started');
aggregator.addLog('info', 'Connected to database');
aggregator.addLog('warning', 'High memory usage detected');
aggregator.addLog('error', 'Failed to connect to external API');
aggregator.addLog('info', 'Request processed successfully');

console.log('\nStats:', aggregator.getStats());

await aggregator.saveLogs('application.log');
```

---

## Day 5-7: Modern JavaScript & TypeScript

### Session 1: ES6+ Features (3 hours)

**Exercise 3.1: Destructuring and Spread**

Create `modern-js.js`:
```javascript
// modern-js.js

// Array destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log('First:', first);
console.log('Second:', second);
console.log('Rest:', rest);

// Object destructuring
const user = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
  city: 'New York'
};

const { name, email, ...otherInfo } = user;
console.log('Name:', name);
console.log('Email:', email);
console.log('Other:', otherInfo);

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log('Combined:', combined);

const defaults = { theme: 'dark', fontSize: 14 };
const userSettings = { fontSize: 16, language: 'en' };
const finalSettings = { ...defaults, ...userSettings };
console.log('Settings:', finalSettings);

// Arrow functions
const traditional = function(x) {
  return x * 2;
};

const arrow = (x) => x * 2;
const arrowMultiLine = (x, y) => {
  const sum = x + y;
  return sum * 2;
};

console.log('Arrow function:', arrow(5));

// Template literals
const name = 'Bob';
const age = 25;
const message = `Hello, my name is ${name} and I am ${age} years old.
This is a multi-line string!
Today is ${new Date().toLocaleDateString()}.`;
console.log(message);
```

**Exercise 3.2: Array Methods**

Create `array-methods.js`:
```javascript
// array-methods.js

const products = [
  { id: 1, name: 'Laptop', price: 1200, category: 'electronics' },
  { id: 2, name: 'Phone', price: 800, category: 'electronics' },
  { id: 3, name: 'Desk', price: 300, category: 'furniture' },
  { id: 4, name: 'Chair', price: 150, category: 'furniture' },
  { id: 5, name: 'Monitor', price: 400, category: 'electronics' }
];

// map - transform each element
const productNames = products.map(p => p.name);
console.log('Names:', productNames);

// filter - select elements matching condition
const electronics = products.filter(p => p.category === 'electronics');
console.log('Electronics:', electronics);

// find - get first match
const phone = products.find(p => p.name === 'Phone');
console.log('Phone:', phone);

// reduce - accumulate to single value
const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
console.log('Total price:', totalPrice);

// some - check if any element matches
const hasExpensive = products.some(p => p.price > 1000);
console.log('Has expensive item:', hasExpensive);

// every - check if all elements match
const allAffordable = products.every(p => p.price < 2000);
console.log('All affordable:', allAffordable);

// Chaining methods
const expensiveElectronics = products
  .filter(p => p.category === 'electronics')
  .filter(p => p.price > 500)
  .map(p => p.name);
console.log('Expensive electronics:', expensiveElectronics);
```

### Session 2: Introduction to TypeScript (4 hours)

**Setup:**
```bash
npm install -g typescript
npm install --save-dev @types/node

# Create tsconfig.json
npx tsc --init
```

Edit `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Exercise 3.3: Basic Types**

Create `src/types-basic.ts`:
```typescript
// types-basic.ts

// Primitive types
let name: string = 'Alice';
let age: number = 30;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ['a', 'b', 'c'];

// Tuples
let person: [string, number] = ['Bob', 25];

// Enums
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

let userStatus: Status = Status.Active;

// Any (avoid when possible)
let anything: any = 'hello';
anything = 42;
anything = true;

// Unknown (safer than any)
let userInput: unknown = getUserInput();
if (typeof userInput === 'string') {
  console.log(userInput.toUpperCase());
}

// Functions
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}!`;
}

// Default parameters
function createUser(name: string, role: string = 'user'): void {
  console.log(`Created ${role}: ${name}`);
}

// Function types
type MathOperation = (a: number, b: number) => number;

const divide: MathOperation = (a, b) => {
  if (b === 0) throw new Error('Division by zero');
  return a / b;
};

function getUserInput(): string {
  return 'test';
}
```

**Exercise 3.4: Interfaces and Types**

Create `src/interfaces.ts`:
```typescript
// interfaces.ts

// Interface for object shape
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // optional
  readonly createdAt: Date; // readonly
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date()
};

// user.createdAt = new Date(); // Error: readonly property

// Extending interfaces
interface Admin extends User {
  permissions: string[];
  level: number;
}

const admin: Admin = {
  id: 2,
  name: 'Bob',
  email: 'bob@example.com',
  createdAt: new Date(),
  permissions: ['read', 'write', 'delete'],
  level: 5
};

// Type aliases
type ID = string | number;
type Status = 'active' | 'inactive' | 'pending'; // Union type

interface Product {
  id: ID;
  name: string;
  price: number;
  status: Status;
}

// Generic interfaces
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: user,
  status: 200,
  message: 'Success'
};

const productsResponse: ApiResponse<Product[]> = {
  data: [],
  status: 200,
  message: 'Success'
};

// Function interfaces
interface Logger {
  log(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }

  error(message: string): void {
    console.error(`[ERROR] ${message}`);
  }

  warn(message: string): void {
    console.warn(`[WARN] ${message}`);
  }
}

// Using the logger
const logger: Logger = new ConsoleLogger();
logger.log('Application started');
logger.warn('High memory usage');
logger.error('Connection failed');
```

**Exercise 3.5: Generics**

Create `src/generics.ts`:
```typescript
// generics.ts

// Generic function
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = firstElement([1, 2, 3]); // number
const firstStr = firstElement(['a', 'b', 'c']); // string

// Generic class
class Box<T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const numberBox = new Box<number>(42);
const stringBox = new Box<string>('hello');

// Generic constraints
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(`Length: ${item.length}`);
}

logLength('hello'); // string has length
logLength([1, 2, 3]); // array has length
// logLength(42); // Error: number doesn't have length

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'Alice' }, { age: 30 });
console.log(merged.name, merged.age);
```

### Session 3: TypeScript with File Operations (3 hours)

**Exercise 3.6: TypeScript File Processor**

Create `src/file-processor.ts`:
```typescript
// file-processor.ts
import fs from 'fs/promises';
import path from 'path';
import { EventEmitter } from 'events';

interface FileStats {
  lines: number;
  words: number;
  characters: number;
}

interface ProcessingResult {
  filepath: string;
  stats: FileStats;
  processingTime: number;
}

type ProcessingCommand = 'stats' | 'uppercase' | 'lowercase' | 'reverse';

class FileProcessor extends EventEmitter {
  async processFile(
    filepath: string,
    command: ProcessingCommand
  ): Promise<ProcessingResult> {
    const startTime = Date.now();

    this.emit('start', { filepath, command });

    try {
      const content = await fs.readFile(filepath, 'utf8');
      this.emit('read', { filepath, size: content.length });

      let result: string;

      switch (command) {
        case 'stats':
          result = this.generateStats(content);
          break;
        case 'uppercase':
          result = content.toUpperCase();
          break;
        case 'lowercase':
          result = content.toLowerCase();
          break;
        case 'reverse':
          result = content.split('\n').reverse().join('\n');
          break;
        default:
          throw new Error(`Unknown command: ${command}`);
      }

      const outputPath = this.generateOutputPath(filepath, command);
      await fs.writeFile(outputPath, result);

      this.emit('complete', { filepath, outputPath });

      const processingTime = Date.now() - startTime;

      return {
        filepath,
        stats: this.calculateStats(content),
        processingTime
      };

    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  private calculateStats(content: string): FileStats {
    const lines = content.split('\n').length;
    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    const characters = content.length;

    return { lines, words, characters };
  }

  private generateStats(content: string): string {
    const stats = this.calculateStats(content);
    return `Lines: ${stats.lines}\nWords: ${stats.words}\nCharacters: ${stats.characters}`;
  }

  private generateOutputPath(filepath: string, command: ProcessingCommand): string {
    const ext = path.extname(filepath);
    const base = path.basename(filepath, ext);
    const dir = path.dirname(filepath);
    return path.join(dir, `${base}.${command}${ext}`);
  }
}

// Usage
const processor = new FileProcessor();

processor.on('start', (data) => {
  console.log(`Starting ${data.command} on ${data.filepath}`);
});

processor.on('read', (data) => {
  console.log(`Read ${data.size} bytes from ${data.filepath}`);
});

processor.on('complete', (data) => {
  console.log(`Saved result to ${data.outputPath}`);
});

processor.on('error', (error) => {
  console.error('Error:', (error as Error).message);
});

// Process file
const filepath = process.argv[2] || 'input.txt';
const command = (process.argv[3] as ProcessingCommand) || 'stats';

processor.processFile(filepath, command)
  .then(result => {
    console.log('\nResult:', result);
  })
  .catch(error => {
    console.error('Failed:', error.message);
    process.exit(1);
  });
```

Compile and run:
```bash
npx tsc
node dist/file-processor.js input.txt stats
```

---

## Week 1 Mini-Project: Directory Monitor with TypeScript

Create `src/directory-monitor.ts`:
```typescript
// directory-monitor.ts
import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

interface FileChange {
  filename: string;
  filepath: string;
  changeType: 'added' | 'modified' | 'removed';
  timestamp: Date;
}

interface ProcessingOptions {
  uppercase?: boolean;
  lowercase?: boolean;
  prefix?: string;
  suffix?: string;
}

class DirectoryMonitor extends EventEmitter {
  private watchPath: string;
  private outputPath: string;
  private options: ProcessingOptions;
  private knownFiles: Set<string>;

  constructor(
    watchPath: string,
    outputPath: string,
    options: ProcessingOptions = {}
  ) {
    super();
    this.watchPath = watchPath;
    this.outputPath = outputPath;
    this.options = options;
    this.knownFiles = new Set();
  }

  async start(): Promise<void> {
    // Ensure output directory exists
    await fs.mkdir(this.outputPath, { recursive: true });

    // Scan initial files
    await this.scanDirectory();

    // Start watching
    console.log(`Monitoring: ${this.watchPath}`);
    console.log(`Output: ${this.outputPath}\n`);

    const watcher = watch(this.watchPath, async (eventType, filename) => {
      if (!filename) return;

      const filepath = path.join(this.watchPath, filename);

      try {
        const exists = await this.fileExists(filepath);

        if (exists) {
          const isNew = !this.knownFiles.has(filename);
          this.knownFiles.add(filename);

          const change: FileChange = {
            filename,
            filepath,
            changeType: isNew ? 'added' : 'modified',
            timestamp: new Date()
          };

          this.emit('change', change);
          await this.processFile(filepath);

        } else {
          this.knownFiles.delete(filename);

          const change: FileChange = {
            filename,
            filepath,
            changeType: 'removed',
            timestamp: new Date()
          };

          this.emit('change', change);
        }

      } catch (error) {
        this.emit('error', error);
      }
    });

    // Handle Ctrl+C
    process.on('SIGINT', () => {
      console.log('\nStopping monitor...');
      watcher.close();
      process.exit(0);
    });
  }

  private async scanDirectory(): Promise<void> {
    try {
      const files = await fs.readdir(this.watchPath);
      for (const file of files) {
        const filepath = path.join(this.watchPath, file);
        const stats = await fs.stat(filepath);
        if (stats.isFile()) {
          this.knownFiles.add(file);
        }
      }
      console.log(`Found ${this.knownFiles.size} existing files`);
    } catch (error) {
      console.error('Error scanning directory:', (error as Error).message);
    }
  }

  private async fileExists(filepath: string): Promise<boolean> {
    try {
      await fs.access(filepath);
      return true;
    } catch {
      return false;
    }
  }

  private async processFile(filepath: string): Promise<void> {
    try {
      let content = await fs.readFile(filepath, 'utf8');

      // Apply transformations
      if (this.options.uppercase) {
        content = content.toUpperCase();
      }
      if (this.options.lowercase) {
        content = content.toLowerCase();
      }
      if (this.options.prefix) {
        content = this.options.prefix + content;
      }
      if (this.options.suffix) {
        content = content + this.options.suffix;
      }

      // Generate output filename
      const filename = path.basename(filepath);
      const outputFilepath = path.join(
        this.outputPath,
        `processed_${filename}`
      );

      await fs.writeFile(outputFilepath, content);
      this.emit('processed', { filepath, outputFilepath });

    } catch (error) {
      this.emit('error', error);
    }
  }
}

// Usage
const watchDir = process.argv[2] || './watch';
const outputDir = process.argv[3] || './output';

const monitor = new DirectoryMonitor(watchDir, outputDir, {
  uppercase: false,
  prefix: '=== PROCESSED FILE ===\n\n',
  suffix: '\n\n=== END ==='
});

monitor.on('change', (change) => {
  const time = change.timestamp.toLocaleTimeString();
  console.log(`[${time}] ${change.changeType.toUpperCase()}: ${change.filename}`);
});

monitor.on('processed', (data) => {
  console.log(`  ✓ Processed: ${data.outputFilepath}`);
});

monitor.on('error', (error) => {
  console.error('  ✗ Error:', (error as Error).message);
});

// Start monitoring
monitor.start().catch(error => {
  console.error('Failed to start monitor:', error.message);
  process.exit(1);
});
```

Setup and test:
```bash
# Compile TypeScript
npx tsc

# Create watch directory
mkdir watch

# Run monitor (in one terminal)
node dist/directory-monitor.js watch output

# In another terminal, create test files
echo "Hello World" > watch/test1.txt
echo "Another file" > watch/test2.txt

# Check output directory
ls output/
cat output/processed_test1.txt
```

---

## Week 1 Wrap-up

### Review Checklist
- [ ] Understand Node.js event loop
- [ ] Comfortable with both CommonJS and ES modules
- [ ] Can work with file system operations
- [ ] Understand callbacks, promises, and async/await
- [ ] Can use EventEmitter for event-driven code
- [ ] Familiar with modern JavaScript features (destructuring, spread, arrow functions)
- [ ] Can write basic TypeScript with types and interfaces
- [ ] Completed mini-project successfully

### Next Steps
Prepare for Week 2 by:
1. Review any concepts you found challenging
2. Practice more with async/await patterns
3. Read up on REST vs GraphQL basics
4. Install GraphQL Playground or Insomnia

### Additional Practice Ideas
1. Build a CLI tool that fetches data from a public API
2. Create a file backup system with progress tracking
3. Build a simple task queue with event emitters
4. Convert more JavaScript code to TypeScript
