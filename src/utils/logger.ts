export class Logger {
    static debug(message: string, data?: any) {
        if (process.env.NODE_ENV === 'development') {
            console.group(`🔍 ${message}`);
            if (data) console.log(data);
            console.groupEnd();
        }
    }

    static error(message: string, error: any) {
        console.error(`❌ ${message}:`, error);
    }
}