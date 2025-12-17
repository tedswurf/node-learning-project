import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { LoadFile, ViewRows } from './operations/csv-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

const commands = ['view'];

if (args.length < 2) {
    console.log('USAGE: node file-processor.js <command> <filename>');
    console.log(`Commands: ${commands.join(', ')}`);
    process.exit(1);
}

const [command, fileName] = args;

if (!commands.includes(command)) {
    console.error("Invalid command:", command);
    console.log(`Commands: ${commands.join(', ')}`);
    process.exit(1);
}

const filePath = path.join(__dirname, 'DATA', fileName);

if (!fs.existsSync(filePath)) {
    console.error("File does not exist:", filePath);
    process.exit(1);
}

// Load the csv file into a structured rows array
const rows = await LoadFile(filePath);

switch (command) {
    case 'view':
    default:
        await ViewRows(rows);
        break;
}
