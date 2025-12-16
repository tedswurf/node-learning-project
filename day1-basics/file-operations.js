import fs from 'fs';
import path from 'path';

const dataPath = "DATA";

const fileName = process.argv[2] || 'sample.txt';

// Synchronous file read
try {
    const localPath = path.join(process.cwd(), dataPath, fileName);

    VerifyFilePath(dataPath, localPath);

    console.log(`Reading file from: ${localPath}`)

    const data = fs.readFileSync(localPath, 'utf8');

    if (!data || data.length === 0) {
        console.log("File is empty.");
        process.exit(0);
    }

    console.log("File Contents:", data);
} catch (error) {
    console.log("Error reading file:", error.message);
}


function SynchronousRead(filePath) {
    
}


function VerifyFilePath(dirPath, localPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created at: ${dirPath}`);
    } else {
        console.log(`Directory already exists at: ${dirPath}`);
    }

    if (!fs.existsSync(localPath)) {
        throw new Error(`File does not exist at path: ${localPath}`);
    }
}