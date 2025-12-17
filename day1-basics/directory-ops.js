import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const action = process.argv[2].toLowerCase() || 'list';
const directoryName = process.argv[3];

// Obtain relative paths to this file
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

if (action !== 'list' && action !== 'create') {
    console.error("Please provide a valid action: 'list' or 'create'.");
    process.exit(1);
}

if (!directoryName) {
    console.error("Please provide a directory name.");
    process.exit(1);
}


// Execute action
try {
    switch (action) {
        case 'create':
            CreateDirectory(directoryName);
            break;
        case 'list':
        default:
            await ListFilesAsync(directoryName);
            break;
    }
} catch (error) {
    console.log("Error performing directory operation:", error.message);
    process.exit(1);
}


// Check if the directory exists
function CheckDirectoryExists(dirName) {
    const dirPath = path.join(__dirName, dirName);

    if (!fs.existsSync(dirPath)) {
        console.log("Directory does not exist:", dirPath);
        return false;
    }

    console.log("Directory exists:", dirPath);
    return true;
}


// List files in Directory
function ListFilesAsync(dirName) {
    const dirPath = path.join(__dirName, dirName);

    if (CheckDirectoryExists(dirName)) {
        fs.readdir(dirPath, (error, files) => {
            if (error) {
                console.log("Error reading directory:\n", error.message);
                return;
            }

            console.log("Files in directory:");

            files.forEach(file => {
                const stats = fs.statSync(path.join(dirPath, file));

                const type = stats.isDirectory() ? 'DIR ' : 'FILE';
                console.log(`-(${type}) ${file}`);
            })
        })
    }
}

// Create Directory
function CreateDirectory(dirName) {
    const dirPath = path.join(__dirName, dirName);

    if (CheckDirectoryExists(dirName)) {
        fs.mkdirSync(dirPath);
        console.log("Directory created:", dirPath);
    }
}