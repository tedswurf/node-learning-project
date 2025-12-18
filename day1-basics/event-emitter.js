import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileName = process.argv[2] || 'Events.txt';

if (!fileName) {
    console.error("Please provide a file name to process.");
    process.exit(1);
}

class FileProcessor extends EventEmitter {
    constructor() {
        super();
    }

    async processFile(filePath) {
        this.emit('start', {filePath});

        this.emit('status', { stage: 'reading', percent: 100 });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}


const fileProcessor = new FileProcessor();

fileProcessor.on('start', (data) => {
    console.log(`Starting processing for file: ${data.filePath}`);
})

fileProcessor.on('status', async(data) => {
    console.log(`Status Update - Stage: ${data.stage}, Percent: ${data.percent}%`);
})

const pathToFile = path.join(__dirname, 'DATA', fileName);

fileProcessor.processFile(pathToFile);