export class Logger {
    private static getTime(): string {
        return new Date().toLocaleString();
    }

    static info(message: string) {
        console.log(`\x1b[37m[${this.getTime()}] INFO: ${message}\x1b[0m`);
    }

    static success(message: string) {
        console.log(`\x1b[32m[${this.getTime()}] SUCCESS: ${message}\x1b[0m`);
    }

    static warn(message: string) {
        console.log(`\x1b[33m[${this.getTime()}] WARN: ${message}\x1b[0m`);
    }

    static error(message: string) {
        console.log(`\x1b[31m[${this.getTime()}] ERROR: ${message}\x1b[0m`);
    }

    static debug(message: string) {
        console.log(`\x1b[36m[${this.getTime()}] DEBUG: ${message}\x1b[0m`);
    }
}
