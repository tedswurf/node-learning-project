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
















# Week 2: GraphQL Fundamentals & API Development - Detailed Instructions

## Prerequisites
- Completed Week 1 (Node.js fundamentals)
- Node.js and npm installed
- Basic understanding of APIs
- VS Code with TypeScript support

## Setup

### Install Required Tools
```bash
# Create Week 2 project directory
mkdir week2-graphql
cd week2-graphql

# Initialize npm project
npm init -y

# Install dependencies
npm install @apollo/server graphql
npm install typescript @types/node --save-dev

# Initialize TypeScript
npx tsc --init
```

Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

Update `package.json`:
```json
{
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc && node dist/index.js"
  }
}
```

---

## Day 1-2: GraphQL Basics

### Session 1: Understanding GraphQL (2 hours)

**Theory: REST vs GraphQL**

REST API:
```
GET /users/1
GET /users/1/posts
GET /users/1/posts/5/comments
```

GraphQL (single request):
```graphql
query {
  user(id: 1) {
    name
    email
    posts {
      title
      comments {
        text
        author
      }
    }
  }
}
```

**Key Concepts:**
1. **Schema**: Defines data structure and capabilities
2. **Queries**: Read data (like GET in REST)
3. **Mutations**: Modify data (like POST/PUT/DELETE in REST)
4. **Resolvers**: Functions that fetch the data
5. **Types**: Define shape of data

### Session 2: Schema Definition Language (SDL) (2 hours)

**Exercise 1.1: Basic Schema Design**

Create `src/schema-basics.ts`:
```typescript
// schema-basics.ts
export const typeDefs = `#graphql
  # Scalar types: String, Int, Float, Boolean, ID

  # Object type
  type Book {
    id: ID!           # ! means required/non-null
    title: String!
    author: String!
    pages: Int
    published: Boolean!
  }

  # Query type (entry point for reads)
  type Query {
    # Get all books
    books: [Book!]!   # Array of non-null Books, array itself is non-null

    # Get single book by ID
    book(id: ID!): Book

    # Search books by title
    searchBooks(title: String!): [Book!]!
  }

  # Mutation type (entry point for writes)
  type Mutation {
    # Add a new book
    addBook(title: String!, author: String!, pages: Int): Book!

    # Delete a book
    deleteBook(id: ID!): Boolean!

    # Update a book
    updateBook(id: ID!, title: String, author: String, pages: Int): Book
  }
`;
```

**Exercise 1.2: More Complex Schema**

Create `src/schema-library.ts`:
```typescript
// schema-library.ts
export const libraryTypeDefs = `#graphql
  # Enum type
  enum Genre {
    FICTION
    NON_FICTION
    SCIENCE_FICTION
    MYSTERY
    BIOGRAPHY
  }

  # Custom scalar (for demonstration)
  scalar Date

  # Author type
  type Author {
    id: ID!
    name: String!
    bio: String
    books: [Book!]!     # Author can have many books
  }

  # Book type with relationships
  type Book {
    id: ID!
    title: String!
    author: Author!     # Book has one author
    genre: Genre
    pages: Int
    publishedDate: Date
    isbn: String
  }

  # Input type for creating/updating
  input BookInput {
    title: String!
    authorId: ID!
    genre: Genre
    pages: Int
    publishedDate: String
    isbn: String
  }

  input AuthorInput {
    name: String!
    bio: String
  }

  # Queries
  type Query {
    # Books
    books(genre: Genre, authorId: ID): [Book!]!
    book(id: ID!): Book
    searchBooks(query: String!): [Book!]!

    # Authors
    authors: [Author!]!
    author(id: ID!): Author
  }

  # Mutations
  type Mutation {
    # Books
    addBook(input: BookInput!): Book!
    updateBook(id: ID!, input: BookInput!): Book
    deleteBook(id: ID!): Boolean!

    # Authors
    addAuthor(input: AuthorInput!): Author!
    updateAuthor(id: ID!, input: AuthorInput!): Author
    deleteAuthor(id: ID!): Boolean!
  }
`;
```

### Session 3: Writing GraphQL Queries (2 hours)

**Exercise 1.3: Query Examples**

Create `queries-examples.graphql`:
```graphql
# queries-examples.graphql

# Simple query
query GetAllBooks {
  books {
    id
    title
    author
  }
}

# Query with arguments
query GetBook {
  book(id: "1") {
    id
    title
    author
    pages
  }
}

# Query with variables (more flexible)
query GetBookById($bookId: ID!) {
  book(id: $bookId) {
    id
    title
    author
    pages
  }
}

# Variables for above query:
# {
#   "bookId": "1"
# }

# Nested query
query GetAuthorWithBooks {
  author(id: "1") {
    name
    bio
    books {
      title
      pages
      genre
    }
  }
}

# Multiple queries in one request
query GetBooksAndAuthors {
  books {
    id
    title
  }
  authors {
    id
    name
  }
}

# Query with alias (rename fields)
query GetMultipleBooks {
  firstBook: book(id: "1") {
    title
    author
  }
  secondBook: book(id: "2") {
    title
    author
  }
}

# Fragments (reusable field selections)
query GetBooksWithFragment {
  book(id: "1") {
    ...BookDetails
  }
}

fragment BookDetails on Book {
  id
  title
  author
  pages
  genre
}

# Filtering with arguments
query GetScienceFictionBooks {
  books(genre: SCIENCE_FICTION) {
    title
    author {
      name
    }
  }
}
```

**Exercise 1.4: Mutation Examples**

Create `mutations-examples.graphql`:
```graphql
# mutations-examples.graphql

# Simple mutation
mutation AddBook {
  addBook(
    title: "The Great Gatsby"
    author: "F. Scott Fitzgerald"
    pages: 180
  ) {
    id
    title
    author
  }
}

# Mutation with input type
mutation AddBookWithInput {
  addBook(input: {
    title: "1984"
    authorId: "1"
    genre: SCIENCE_FICTION
    pages: 328
    isbn: "978-0451524935"
  }) {
    id
    title
    author {
      name
    }
    genre
  }
}

# Mutation with variables
mutation AddBookWithVariables($input: BookInput!) {
  addBook(input: $input) {
    id
    title
    author {
      name
    }
  }
}

# Variables:
# {
#   "input": {
#     "title": "Dune",
#     "authorId": "2",
#     "genre": "SCIENCE_FICTION",
#     "pages": 688
#   }
# }

# Update mutation
mutation UpdateBook($id: ID!, $input: BookInput!) {
  updateBook(id: $id, input: $input) {
    id
    title
    author {
      name
    }
  }
}

# Delete mutation
mutation DeleteBook($id: ID!) {
  deleteBook(id: $id)
}

# Multiple mutations (executed sequentially)
mutation AddAuthorAndBook {
  newAuthor: addAuthor(input: {
    name: "Isaac Asimov"
    bio: "Science fiction writer"
  }) {
    id
    name
  }

  newBook: addBook(input: {
    title: "Foundation"
    authorId: "3"
    genre: SCIENCE_FICTION
  }) {
    id
    title
  }
}
```

### Session 4: Exploring Public GraphQL APIs (2 hours)

**Exercise 1.5: GitHub GraphQL API**

Install GraphQL client:
```bash
npm install graphql-request
```

Create `src/github-api-test.ts`:
```typescript
// github-api-test.ts
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'https://api.github.com/graphql';

// You'll need a GitHub personal access token
const token = process.env.GITHUB_TOKEN || 'YOUR_TOKEN_HERE';

const client = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${token}`,
  },
});

// Query to get repository information
const query = gql`
  query GetRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      description
      stargazerCount
      forkCount
      issues(first: 5, states: OPEN) {
        nodes {
          title
          createdAt
          author {
            login
          }
        }
      }
    }
  }
`;

const variables = {
  owner: 'facebook',
  name: 'react'
};

async function fetchGitHubData() {
  try {
    const data = await client.request(query, variables);
    console.log('Repository:', data.repository.name);
    console.log('Stars:', data.repository.stargazerCount);
    console.log('\nRecent issues:');
    data.repository.issues.nodes.forEach((issue: any) => {
      console.log(`- ${issue.title} by ${issue.author.login}`);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchGitHubData();
```

---

## Day 3-4: Building GraphQL APIs with Node.js

### Session 1: Setting Up Apollo Server (2 hours)

**Exercise 2.1: Basic Apollo Server**

Create `src/basic-server.ts`:
```typescript
// basic-server.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Define schema
const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
  }
`;

// In-memory data store
const books = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: '2', title: '1984', author: 'George Orwell' },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
];

let nextId = 4;

// Resolvers - functions that return data
const resolvers = {
  Query: {
    books: () => books,
    book: (_: any, { id }: { id: string }) => {
      return books.find(book => book.id === id);
    },
  },
  Mutation: {
    addBook: (_: any, { title, author }: { title: string; author: string }) => {
      const newBook = {
        id: String(nextId++),
        title,
        author,
      };
      books.push(newBook);
      return newBook;
    },
  },
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
console.log(`Try this query:`);
console.log(`
{
  books {
    id
    title
    author
  }
}
`);
```

Run the server:
```bash
npm run dev
```

Visit `http://localhost:4000` to access Apollo Sandbox.

### Session 2: Implementing Complex Resolvers (3 hours)

**Exercise 2.2: Library API with Relationships**

Create `src/library-server.ts`:
```typescript
// library-server.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Types
interface Author {
  id: string;
  name: string;
  bio?: string;
}

interface Book {
  id: string;
  title: string;
  authorId: string;
  genre?: string;
  pages?: number;
}

// In-memory database
const authors: Author[] = [
  { id: '1', name: 'George Orwell', bio: 'English novelist and essayist' },
  { id: '2', name: 'Isaac Asimov', bio: 'Science fiction author' },
];

const books: Book[] = [
  { id: '1', title: '1984', authorId: '1', genre: 'DYSTOPIAN', pages: 328 },
  { id: '2', title: 'Animal Farm', authorId: '1', genre: 'SATIRE', pages: 112 },
  { id: '3', title: 'Foundation', authorId: '2', genre: 'SCIENCE_FICTION', pages: 255 },
];

let nextAuthorId = 3;
let nextBookId = 4;

// Schema
const typeDefs = `#graphql
  enum Genre {
    FICTION
    NON_FICTION
    SCIENCE_FICTION
    DYSTOPIAN
    SATIRE
  }

  type Author {
    id: ID!
    name: String!
    bio: String
    books: [Book!]!
    bookCount: Int!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    genre: Genre
    pages: Int
  }

  input BookInput {
    title: String!
    authorId: ID!
    genre: Genre
    pages: Int
  }

  input AuthorInput {
    name: String!
    bio: String
  }

  type Query {
    books(genre: Genre, authorId: ID): [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author
  }

  type Mutation {
    addBook(input: BookInput!): Book!
    addAuthor(input: AuthorInput!): Author!
    deleteBook(id: ID!): Boolean!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    books: (_: any, { genre, authorId }: { genre?: string; authorId?: string }) => {
      let filteredBooks = books;

      if (genre) {
        filteredBooks = filteredBooks.filter(book => book.genre === genre);
      }

      if (authorId) {
        filteredBooks = filteredBooks.filter(book => book.authorId === authorId);
      }

      return filteredBooks;
    },

    book: (_: any, { id }: { id: string }) => {
      return books.find(book => book.id === id);
    },

    authors: () => authors,

    author: (_: any, { id }: { id: string }) => {
      return authors.find(author => author.id === id);
    },
  },

  Mutation: {
    addBook: (_: any, { input }: { input: Omit<Book, 'id'> }) => {
      const newBook: Book = {
        id: String(nextBookId++),
        ...input,
      };
      books.push(newBook);
      return newBook;
    },

    addAuthor: (_: any, { input }: { input: Omit<Author, 'id'> }) => {
      const newAuthor: Author = {
        id: String(nextAuthorId++),
        ...input,
      };
      authors.push(newAuthor);
      return newAuthor;
    },

    deleteBook: (_: any, { id }: { id: string }) => {
      const index = books.findIndex(book => book.id === id);
      if (index === -1) return false;
      books.splice(index, 1);
      return true;
    },
  },

  // Field resolvers - resolve relationships
  Book: {
    author: (book: Book) => {
      return authors.find(author => author.id === book.authorId);
    },
  },

  Author: {
    books: (author: Author) => {
      return books.filter(book => book.authorId === author.id);
    },

    bookCount: (author: Author) => {
      return books.filter(book => book.authorId === author.id).length;
    },
  },
};

// Create and start server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
```

Test queries in Apollo Sandbox:
```graphql
# Get author with all their books
query {
  author(id: "1") {
    name
    bio
    bookCount
    books {
      title
      genre
      pages
    }
  }
}

# Get book with author info
query {
  book(id: "1") {
    title
    pages
    author {
      name
      bio
    }
  }
}

# Filter books by genre
query {
  books(genre: SCIENCE_FICTION) {
    title
    author {
      name
    }
  }
}

# Add new author and book
mutation {
  newAuthor: addAuthor(input: {
    name: "Frank Herbert"
    bio: "American science fiction author"
  }) {
    id
    name
  }

  newBook: addBook(input: {
    title: "Dune"
    authorId: "3"
    genre: SCIENCE_FICTION
    pages: 688
  }) {
    id
    title
    author {
      name
    }
  }
}
```

### Session 3: Error Handling and Validation (2 hours)

**Exercise 2.3: Adding Error Handling**

Create `src/error-handling-server.ts`:
```typescript
// error-handling-server.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';

// Custom error class
class NotFoundError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'NOT_FOUND',
      },
    });
  }
}

class ValidationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'VALIDATION_ERROR',
      },
    });
  }
}

interface Book {
  id: string;
  title: string;
  author: string;
  pages?: number;
}

const books: Book[] = [
  { id: '1', title: '1984', author: 'George Orwell', pages: 328 },
];

let nextId = 2;

const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
    pages: Int
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book!
  }

  type Mutation {
    addBook(title: String!, author: String!, pages: Int): Book!
    updateBook(id: ID!, title: String, author: String, pages: Int): Book!
    deleteBook(id: ID!): Boolean!
  }
`;

const resolvers = {
  Query: {
    books: () => books,

    book: (_: any, { id }: { id: string }) => {
      const book = books.find(b => b.id === id);
      if (!book) {
        throw new NotFoundError(`Book with ID ${id} not found`);
      }
      return book;
    },
  },

  Mutation: {
    addBook: (
      _: any,
      { title, author, pages }: { title: string; author: string; pages?: number }
    ) => {
      // Validation
      if (title.trim().length === 0) {
        throw new ValidationError('Title cannot be empty');
      }
      if (author.trim().length === 0) {
        throw new ValidationError('Author cannot be empty');
      }
      if (pages !== undefined && pages < 1) {
        throw new ValidationError('Pages must be positive');
      }

      const newBook: Book = {
        id: String(nextId++),
        title: title.trim(),
        author: author.trim(),
        pages,
      };

      books.push(newBook);
      return newBook;
    },

    updateBook: (
      _: any,
      { id, title, author, pages }: {
        id: string;
        title?: string;
        author?: string;
        pages?: number;
      }
    ) => {
      const book = books.find(b => b.id === id);
      if (!book) {
        throw new NotFoundError(`Book with ID ${id} not found`);
      }

      // Validate updates
      if (title !== undefined) {
        if (title.trim().length === 0) {
          throw new ValidationError('Title cannot be empty');
        }
        book.title = title.trim();
      }

      if (author !== undefined) {
        if (author.trim().length === 0) {
          throw new ValidationError('Author cannot be empty');
        }
        book.author = author.trim();
      }

      if (pages !== undefined) {
        if (pages < 1) {
          throw new ValidationError('Pages must be positive');
        }
        book.pages = pages;
      }

      return book;
    },

    deleteBook: (_: any, { id }: { id: string }) => {
      const index = books.findIndex(b => b.id === id);
      if (index === -1) {
        throw new NotFoundError(`Book with ID ${id} not found`);
      }
      books.splice(index, 1);
      return true;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
```

Test error handling:
```graphql
# Should throw NOT_FOUND error
query {
  book(id: "999") {
    title
  }
}

# Should throw VALIDATION_ERROR
mutation {
  addBook(title: "", author: "Test") {
    id
  }
}

# Should throw VALIDATION_ERROR
mutation {
  addBook(title: "Test", author: "Author", pages: -5) {
    id
  }
}
```

### Session 4: Context and Authentication (2 hours)

**Exercise 2.4: Adding Authentication Context**

Create `src/auth-server.ts`:
```typescript
// auth-server.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from 'graphql';

// Simple user database
interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

const users: User[] = [
  { id: '1', username: 'alice', email: 'alice@example.com', role: 'ADMIN' },
  { id: '2', username: 'bob', email: 'bob@example.com', role: 'USER' },
];

// Simple auth tokens (in production, use JWT)
const authTokens = new Map<string, User>([
  ['admin-token', users[0]],
  ['user-token', users[1]],
]);

// Context type
interface Context {
  user?: User;
}

// Schema
const typeDefs = `#graphql
  enum Role {
    USER
    ADMIN
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: Role!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    createdBy: User!
  }

  type Query {
    me: User
    books: [Book!]!
    users: [User!]!  # Admin only
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
    deleteBook(id: ID!): Boolean!  # Admin only
  }
`;

interface Book {
  id: string;
  title: string;
  author: string;
  createdById: string;
}

const books: Book[] = [
  { id: '1', title: '1984', author: 'George Orwell', createdById: '1' },
];

let nextId = 2;

// Helper functions
function requireAuth(context: Context): User {
  if (!context.user) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
}

function requireAdmin(context: Context): User {
  const user = requireAuth(context);
  if (user.role !== 'ADMIN') {
    throw new GraphQLError('Not authorized', {
      extensions: { code: 'FORBIDDEN' },
    });
  }
  return user;
}

// Resolvers
const resolvers = {
  Query: {
    me: (_: any, __: any, context: Context) => {
      return requireAuth(context);
    },

    books: () => books,

    users: (_: any, __: any, context: Context) => {
      requireAdmin(context);
      return users;
    },
  },

  Mutation: {
    addBook: (
      _: any,
      { title, author }: { title: string; author: string },
      context: Context
    ) => {
      const user = requireAuth(context);

      const newBook: Book = {
        id: String(nextId++),
        title,
        author,
        createdById: user.id,
      };

      books.push(newBook);
      return newBook;
    },

    deleteBook: (_: any, { id }: { id: string }, context: Context) => {
      requireAdmin(context);

      const index = books.findIndex(b => b.id === id);
      if (index === -1) return false;

      books.splice(index, 1);
      return true;
    },
  },

  Book: {
    createdBy: (book: Book) => {
      return users.find(u => u.id === book.createdById);
    },
  },
};

// Create server
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

// Start server with context
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    // Get token from Authorization header
    const token = req.headers.authorization || '';
    const user = authTokens.get(token);

    return { user };
  },
});

console.log(`🚀 Server ready at: ${url}`);
console.log(`\nTest with these headers:`);
console.log(`Admin: { "Authorization": "admin-token" }`);
console.log(`User: { "Authorization": "user-token" }`);
```

Test with authentication (in Apollo Sandbox, set HTTP Headers):
```graphql
# Without auth - should fail
query {
  me {
    username
  }
}

# With auth header: { "Authorization": "user-token" }
query {
  me {
    username
    email
    role
  }
}

# Add book (requires auth)
mutation {
  addBook(title: "New Book", author: "Author") {
    id
    title
    createdBy {
      username
    }
  }
}

# View users (requires admin)
# Try with user-token (should fail)
# Try with admin-token (should succeed)
query {
  users {
    username
    role
  }
}

# Delete book (requires admin)
mutation {
  deleteBook(id: "1")
}
```

---

## Day 5-7: Advanced GraphQL & Real-time Features

### Session 1: DataLoader for N+1 Problem (3 hours)

**Exercise 3.1: Understanding N+1 Problem**

Install DataLoader:
```bash
npm install dataloader
npm install --save-dev @types/dataloader
```

Create `src/dataloader-example.ts`:
```typescript
// dataloader-example.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import DataLoader from 'dataloader';

// Simulated database
interface Author {
  id: string;
  name: string;
}

interface Book {
  id: string;
  title: string;
  authorId: string;
}

const authors: Author[] = [
  { id: '1', name: 'George Orwell' },
  { id: '2', name: 'Isaac Asimov' },
  { id: '3', name: 'Frank Herbert' },
];

const books: Book[] = [
  { id: '1', title: '1984', authorId: '1' },
  { id: '2', title: 'Animal Farm', authorId: '1' },
  { id: '3', title: 'Foundation', authorId: '2' },
  { id: '4', title: 'I, Robot', authorId: '2' },
  { id: '5', title: 'Dune', authorId: '3' },
];

// Simulated database queries (with logging)
function getAuthorById(id: string): Author | undefined {
  console.log(`  📚 DB Query: getAuthorById(${id})`);
  return authors.find(a => a.id === id);
}

function getAuthorsByIds(ids: string[]): (Author | undefined)[] {
  console.log(`  📚 BATCHED DB Query: getAuthorsByIds([${ids.join(', ')}])`);
  return ids.map(id => authors.find(a => a.id === id));
}

// DataLoader factory
function createAuthorLoader() {
  return new DataLoader<string, Author | undefined>(async (ids) => {
    // This is called once per tick with batched IDs
    return getAuthorsByIds([...ids]);
  });
}

// Context type
interface Context {
  authorLoader: DataLoader<string, Author | undefined>;
}

// Schema
const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
  }

  type Query {
    books: [Book!]!
  }
`;

// Resolvers WITHOUT DataLoader (N+1 problem)
const resolversWithoutDataLoader = {
  Query: {
    books: () => books,
  },
  Book: {
    author: (book: Book) => {
      // This is called once for EACH book - N+1 problem!
      return getAuthorById(book.authorId);
    },
  },
};

// Resolvers WITH DataLoader (solution)
const resolversWithDataLoader = {
  Query: {
    books: () => books,
  },
  Book: {
    author: (book: Book, _: any, context: Context) => {
      // DataLoader batches these calls!
      return context.authorLoader.load(book.authorId);
    },
  },
};

// Create server
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers: resolversWithDataLoader, // Change this to see the difference
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => ({
    authorLoader: createAuthorLoader(),
  }),
});

console.log(`🚀 Server ready at: ${url}`);
console.log(`\nTry this query and watch the console:`);
console.log(`
{
  books {
    title
    author {
      name
    }
  }
}
`);
console.log(`\nWithout DataLoader: 5 separate DB queries (N+1)`);
console.log(`With DataLoader: 1 batched DB query`);
```

### Session 2: GraphQL Subscriptions (3 hours)

Install subscription dependencies:
```bash
npm install graphql-ws ws @graphql-tools/schema
npm install --save-dev @types/ws
```

**Exercise 3.2: Real-time Subscriptions**

Create `src/subscription-server.ts`:
```typescript
// subscription-server.ts
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import cors from 'cors';
import bodyParser from 'body-parser';

// Install additional dependencies
// npm install express cors body-parser graphql-subscriptions

// PubSub for publishing events
const pubsub = new PubSub();

// Event names
const MESSAGE_ADDED = 'MESSAGE_ADDED';
const USER_JOINED = 'USER_JOINED';

// Data
interface Message {
  id: string;
  text: string;
  username: string;
  timestamp: string;
}

const messages: Message[] = [];
let nextId = 1;

// Schema
const typeDefs = `#graphql
  type Message {
    id: ID!
    text: String!
    username: String!
    timestamp: String!
  }

  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(text: String!, username: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
    userJoined: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    messages: () => messages,
  },

  Mutation: {
    sendMessage: (_: any, { text, username }: { text: string; username: string }) => {
      const message: Message = {
        id: String(nextId++),
        text,
        username,
        timestamp: new Date().toISOString(),
      };

      messages.push(message);

      // Publish to subscribers
      pubsub.publish(MESSAGE_ADDED, { messageAdded: message });

      return message;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED]),
    },

    userJoined: {
      subscribe: () => pubsub.asyncIterator([USER_JOINED]),
    },
  },
};

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Express app
const app = express();
const httpServer = createServer(app);

// WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

// Apollo Server
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server)
);

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`🔌 Subscriptions ready at ws://localhost:${PORT}/graphql`);
});
```

Test subscriptions:
```graphql
# In one tab: Subscribe to new messages
subscription {
  messageAdded {
    id
    text
    username
    timestamp
  }
}

# In another tab: Send messages
mutation {
  sendMessage(text: "Hello World!", username: "Alice") {
    id
    text
  }
}

mutation {
  sendMessage(text: "Hi everyone!", username: "Bob") {
    id
    text
  }
}

# Watch the subscription tab update in real-time!
```

### Session 3: Modular Schema Organization (2 hours)

**Exercise 3.3: Organizing Large Schemas**

Create this file structure:
```
src/
  modules/
    users/
      types.ts
      resolvers.ts
    books/
      types.ts
      resolvers.ts
    authors/
      types.ts
      resolvers.ts
  index.ts
```

Create `src/modules/users/types.ts`:
```typescript
// modules/users/types.ts
export const userTypeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
  }

  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    createUser(username: String!, email: String!): User!
  }
`;
```

Create `src/modules/users/resolvers.ts`:
```typescript
// modules/users/resolvers.ts
interface User {
  id: string;
  username: string;
  email: string;
}

const users: User[] = [
  { id: '1', username: 'alice', email: 'alice@example.com' },
];

let nextId = 2;

export const userResolvers = {
  Query: {
    users: () => users,
    user: (_: any, { id }: { id: string }) => users.find(u => u.id === id),
  },

  Mutation: {
    createUser: (
      _: any,
      { username, email }: { username: string; email: string }
    ) => {
      const newUser: User = {
        id: String(nextId++),
        username,
        email,
      };
      users.push(newUser);
      return newUser;
    },
  },
};
```

Create similar files for books and authors, then combine in `src/index.ts`:
```typescript
// index.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { userTypeDefs } from './modules/users/types.js';
import { userResolvers } from './modules/users/resolvers.js';
// Import other modules...

// Base schema
const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// Combine all type definitions
const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  // bookTypeDefs,
  // authorTypeDefs,
];

// Merge resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    // ...bookResolvers.Query,
    // ...authorResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    // ...bookResolvers.Mutation,
    // ...authorResolvers.Mutation,
  },
  // ...userResolvers.User,
  // ...bookResolvers.Book,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at: ${url}`);
```

---

## Week 2 Mini-Project: Real-time Chat API

Create a complete chat application with:
- User authentication
- Channels/rooms
- Real-time message subscriptions
- User presence (online/offline)
- Typing indicators

Create `src/chat-project.ts`:
```typescript
// chat-project.ts - Complete implementation
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { PubSub } from 'graphql-subscriptions';
import cors from 'cors';
import bodyParser from 'body-parser';

const pubsub = new PubSub();

// Event names
const MESSAGE_SENT = 'MESSAGE_SENT';
const USER_TYPING = 'USER_TYPING';
const USER_ONLINE = 'USER_ONLINE';

// Types
interface User {
  id: string;
  username: string;
  online: boolean;
}

interface Channel {
  id: string;
  name: string;
}

interface Message {
  id: string;
  channelId: string;
  userId: string;
  text: string;
  timestamp: string;
}

// Data
const users: User[] = [
  { id: '1', username: 'Alice', online: false },
  { id: '2', username: 'Bob', online: false },
];

const channels: Channel[] = [
  { id: '1', name: 'general' },
  { id: '2', name: 'random' },
];

const messages: Message[] = [];
let nextMessageId = 1;

// Schema
const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    online: Boolean!
  }

  type Channel {
    id: ID!
    name: String!
    messages: [Message!]!
  }

  type Message {
    id: ID!
    channel: Channel!
    user: User!
    text: String!
    timestamp: String!
  }

  type TypingIndicator {
    userId: ID!
    username: String!
    channelId: ID!
  }

  type Query {
    channels: [Channel!]!
    channel(id: ID!): Channel
    messages(channelId: ID!): [Message!]!
    users: [User!]!
  }

  type Mutation {
    sendMessage(channelId: ID!, userId: ID!, text: String!): Message!
    setUserOnline(userId: ID!, online: Boolean!): User!
    setTyping(channelId: ID!, userId: ID!, typing: Boolean!): Boolean!
  }

  type Subscription {
    messageSent(channelId: ID!): Message!
    userTyping(channelId: ID!): TypingIndicator!
    userOnline: User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    channels: () => channels,
    channel: (_: any, { id }: { id: string }) => channels.find(c => c.id === id),
    messages: (_: any, { channelId }: { channelId: string }) =>
      messages.filter(m => m.channelId === channelId),
    users: () => users,
  },

  Mutation: {
    sendMessage: (
      _: any,
      { channelId, userId, text }: { channelId: string; userId: string; text: string }
    ) => {
      const message: Message = {
        id: String(nextMessageId++),
        channelId,
        userId,
        text,
        timestamp: new Date().toISOString(),
      };

      messages.push(message);
      pubsub.publish(MESSAGE_SENT, { messageSent: message, channelId });

      return message;
    },

    setUserOnline: (_: any, { userId, online }: { userId: string; online: boolean }) => {
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      user.online = online;
      pubsub.publish(USER_ONLINE, { userOnline: user });

      return user;
    },

    setTyping: (
      _: any,
      { channelId, userId, typing }: { channelId: string; userId: string; typing: boolean }
    ) => {
      const user = users.find(u => u.id === userId);
      if (!user || !typing) return true;

      pubsub.publish(USER_TYPING, {
        userTyping: {
          userId,
          username: user.username,
          channelId,
        },
      });

      return true;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: (_: any, { channelId }: { channelId: string }) => {
        return pubsub.asyncIterator([MESSAGE_SENT]);
      },
      filter: (payload: any, variables: any) => {
        return payload.channelId === variables.channelId;
      },
    },

    userTyping: {
      subscribe: (_: any, { channelId }: { channelId: string }) => {
        return pubsub.asyncIterator([USER_TYPING]);
      },
    },

    userOnline: {
      subscribe: () => pubsub.asyncIterator([USER_ONLINE]),
    },
  },

  Channel: {
    messages: (channel: Channel) => messages.filter(m => m.channelId === channel.id),
  },

  Message: {
    channel: (message: Message) => channels.find(c => c.id === message.channelId),
    user: (message: Message) => users.find(u => u.id === message.userId),
  },
};

// Create schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Setup Express and WebSocket
const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server)
);

const PORT = 4000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Chat API ready at http://localhost:${PORT}/graphql`);
  console.log(`🔌 Subscriptions ready at ws://localhost:${PORT}/graphql`);
});
```

Test the complete chat API with various queries, mutations, and subscriptions!

---

## Week 2 Wrap-up

### Review Checklist
- [ ] Understand GraphQL schema and type system
- [ ] Can write queries and mutations
- [ ] Built GraphQL server with Apollo
- [ ] Implemented resolvers with relationships
- [ ] Added error handling and validation
- [ ] Understand authentication with context
- [ ] Used DataLoader to solve N+1 problem
- [ ] Implemented real-time subscriptions
- [ ] Organized schema modularly
- [ ] Completed chat API project

### Next Steps
Prepare for Week 3:
1. Review GraphQL concepts
2. Think about how agents could use APIs
3. Read up on Model Context Protocol basics
4. Familiarize yourself with LLM APIs (OpenAI/Anthropic)
