export const measurePerformance = (target: any, methodName: string) => {
    const original = target[methodName];
    
    target[methodName] = function(...args: any[]) {
        const start = performance.now();
        const result = original.apply(this, args);
        const end = performance.now();
        
        const executionTime = end - start;
        if (executionTime > 100) {
            console.warn(`Slow operation detected: ${methodName} took ${executionTime.toFixed(2)}ms`);
        }
        
        return result;
    };
};