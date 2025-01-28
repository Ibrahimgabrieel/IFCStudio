export const debugLog = (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🔍 ${message}`);
        if (data) console.log(data);
        console.groupEnd();
    }
};