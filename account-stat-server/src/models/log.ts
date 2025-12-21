
export class Log {
    public timestamp: Date;
    public level: string;
    public message: string;

    constructor(timestamp: Date, level: string, message: string) {
        this.timestamp = timestamp;
        this.level = level;
        this.message = message;
    }
}