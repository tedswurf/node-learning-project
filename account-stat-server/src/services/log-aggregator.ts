import fs from 'fs';
import { LogLevel } from '../models/log-level.js';
import { Log } from '../models/log.js';

export class LogAggregator {
    private logFilePath: string;
    private buffer: string[];
    private timestampLength = 30;
    private levelLength = 10;
    private flushInterval: NodeJS.Timeout | null = null;
    private autoFlushIntervalMs = 5000; // Flush every 5 seconds

    constructor(logFilePath: string) {
        if (!fs.existsSync(logFilePath)) {
            console.log(`Log file does not exist. Creating new log file at: ${logFilePath}`);
            try {
                fs.writeFileSync(logFilePath, '');
            } catch (error) {
                throw new Error(`Failed to create log file: ${error}`);
            }
        }

        this.logFilePath = logFilePath;
        this.buffer = [];

        // Start automatic flushing
        this.startAutoFlush();
    }

    /**
     * Start automatic periodic flushing of logs
     */
    private startAutoFlush(): void {
        if (this.flushInterval) {
            return; // Already started
        }

        this.flushInterval = setInterval(async () => {
            if (this.buffer.length > 0) {
                try {
                    await this.flush();
                } catch (error) {
                    console.error(`Auto-flush failed: ${error}`);
                }
            }
        }, this.autoFlushIntervalMs);
    }

    /**
     * Stop automatic flushing (useful for cleanup)
     */
    public stopAutoFlush(): void {
        if (this.flushInterval) {
            clearInterval(this.flushInterval);
            this.flushInterval = null;
        }
    }

    public logInfo(message: string): void {
        const logEntry = this.serializeLog(new Log(new Date(), LogLevel.INFO, message));
        this.buffer.push(logEntry);
    }

    public logWarn(message: string): void {
        const logEntry = this.serializeLog(new Log(new Date(), LogLevel.WARN, message));
        this.buffer.push(logEntry);
    }

    public logError(message: string): void {
        const logEntry = this.serializeLog(new Log(new Date(), LogLevel.ERROR, message));
        this.buffer.push(logEntry);
    }


    public async flush() {
        return new Promise<void>((res, rej) => {
            fs.appendFile(this.logFilePath, this.buffer.join('\n') + '\n', (err) => {
                if (err) {
                    rej(err);
                } else {
                    this.buffer = [];
                    res();
                }
            });
        })
    }


    public async getLogs(fromTime?: Date, toTime?: Date, pageSize: number = 100, level?: LogLevel): Promise<Log[]> {
        // Read logs from file
        const fileContent = fs.readFileSync(this.logFilePath, 'utf-8');
        const fileLogs = fileContent.split('\n').filter(line => line.trim() !== '');

        // Combine file logs with buffered logs (not yet written to disk)
        const allLogs = [...fileLogs, ...this.buffer];

        let filteredDeserializedLogs = allLogs.map(log => this.deserializeLog(log));

        if (fromTime || toTime || level) {
            filteredDeserializedLogs = filteredDeserializedLogs.filter(deserialized => {
                const logTime = new Date(deserialized.timestamp);
                const logLevel = deserialized.level as LogLevel;

                const timeMatch = (!fromTime || logTime >= fromTime) && (!toTime || logTime < toTime);
                const levelMatch = (!level || logLevel === level);

                return timeMatch && levelMatch;
            });
        }

        return filteredDeserializedLogs.slice(0, pageSize);
    }


    public async print(fromTime: Date, toTime: Date, pageSize: number, level: LogLevel) {
        const filteredLogs = await this.getLogs(fromTime, toTime, pageSize, level);

        filteredLogs.forEach(log => console.log(log));
    }
 
    
    private serializeLog(log: Log): string {
        const logEntry = `[${log.timestamp.toISOString()}]`.padEnd(this.timestampLength) + `[${log.level}]`.padEnd(this.levelLength) + `${log.message}`;
        return logEntry;
    }


    private deserializeLog(log: string): Log {
        try
        {
            // Extract timestamp: get first timestampLength chars, trim, remove brackets
            const timestampPart = log.substring(0, this.timestampLength).trim();
            const timestampStr = timestampPart.replace(/[\[\]]/g, '').trim();
            const timeStamp = new Date(timestampStr);

            // Extract log level
            const logLevel = log.substring(this.timestampLength, this.timestampLength + this.levelLength).trim().replace(/[\[\]]/g, '') as LogLevel;

            // Extract message
            const message = log.substring(this.timestampLength + this.levelLength).trim();

            return new Log(timeStamp, logLevel, message);
        } catch (error) {
            throw new Error(`Failed to deserialize log: ${error}`);
        }
    }
}