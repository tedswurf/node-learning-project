import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Arguments: action (read/write), fileName
const action = process.argv[2].toLocaleLowerCase();
const writeContent = process.argv[3] || "Default content written to file.";
const fileName = 'sample.txt';

// Determine paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = "DATA";
const fileDirPath = path.join(__dirname, dataPath);
const localPath = path.join(fileDirPath, fileName);

// Validation
if (!action || (action !== 'read' && action !== 'write')) {
    console.error("Please provide a valid action: 'read' or 'write'.");
    process.exit(1);
}

// Execute action
try {
    VerifyFilePath(__dirname, localPath);

    if (action === 'read') {
        await ReadFileAsync(localPath);
    }

    if (action === 'write') {
        await WriteFileAsync(localPath, writeContent);
    }
} catch (error) {
    console.log("Error reading file:", error.message);
}


function WriteFileAsync(localPath, content) {
    // Asynchronous file write
    fs.writeFile(localPath, content, 'utf8', (err) => {
        if (err) {
            console.log("Error writing file asynchronously:", err.message);
            return;
        }
        console.log("Async file write completed.");
    });
}


async function ReadFileAsync(localPath) {
    // Asynchronous file read - returns a Promise
    // Uses the built-in fs.promises API
    const data = await fs.promises.readFile(localPath, 'utf8');
    console.log("Asynchronous file read:", data);
    return data;
}


// Unused, but here for demonstration
function ReadFile(localPath) {
    // Synchronous file read
    const data = fs.readFileSync(localPath, 'utf8');

    if (!data || data.length === 0) {
        console.log("File is empty.");
        process.exit(0);
    }

    console.log("Synchronous file read:", data);
}


function VerifyFilePath(dirPath, localPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created at: ${dirPath}`);
    }

    if (!fs.existsSync(localPath)) {
        throw new Error(`File does not exist at path: ${localPath}`);
    }

    console.log(`File Exists: ${localPath}`)
}

// Can be used by including modules
// e.g., import { ReadFileAsync } from './file-operations.js';
export { ReadFileAsync };