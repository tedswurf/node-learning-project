import fs from 'fs';
import { EventEmitter } from 'events';

class LogAggregator extends EventEmitter {
    constructor(filePath) {
        super();
        this.logs = [];
        this.filePath = filePath;
        this.stats = {
            info: 0,
            warning: 0,
            error: 0
        }
    }

    addLog(level, message) {
        const logEntry = {
            level,
            message,
            timestamp: new Date().toISOString()
        }
        
        this.logs.push(logEntry)
        this.stats[level]++;

        this.emit('log', logEntry);

        if (level === 'error') {
            this.emit('error-log', logEntry);
        }
    }

    getStats() {
        return {
            total: this.logs.length,
            ...this.stats
        };
    }

    async saveLogs() {
        let content = '\n' + this.logs
            .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
            .join('\n');

        const dirPath = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Directory created at: ${dirPath}`);
        }

        if (!fs.existsSync(this.filePath)) {
            console.log(`Log file path does not exist: ${filePath}`);

            await fs.promises.writeFile(this.filePath, content, 'utf-8');

            console.log(`Log file path created at: ${this.filePath}`);
        }
        else
        {
            await fs.promises.appendFile(this.filePath, content, 'utf-8');
        }
        
        this.emit('saved-log', { filePath: this.filePath, level: 'info', timestamp: new Date().toISOString() });
    }


    async getLogs() {
        const dirPath = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Directory created at: ${dirPath}`);
        }

        if (!fs.existsSync(this.filePath)) {
            throw new Error(`Log file path does not exist: ${this.filePath}`);
        }

        const content = await fs.promises.readFile(this.filePath, 'utf-8');
        return content.split('\n').filter(line => line.trim().length > 0);
    }


    SetupDefaultHandlers() {
        this.on('log', (data) => {
            console.log(`[LOG][${data.level}}][${data.timestamp}] ${data.message}`);
        });

        this.on('error-log', (data) => {
            console.error(`[ERROR][${data.level}}][${data.timestamp}] ${data.message}`);
        });

        this.on('saved-log', (data) => {
            console.log(`[SAVED][${data.level}}][${data.timestamp}] Log saved to file: ${data.filePath}`);
        });

        return this;
    }
}


export { LogAggregator };