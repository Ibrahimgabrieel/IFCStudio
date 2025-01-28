// components/ui/PropertiesManager.ts

import * as CUI from "@thatopen/ui-obc";
import { Logger } from "../../utils/logger";
import { PropertyNode, PropertyData, PropertiesTable } from "../../types/interfaces";
// components/ui/PropertiesManager.ts

export class PropertiesManager {
    private propertiesTable!: PropertiesTable; // Using definite assignment assertion
    private readonly propertyStructureCache: Map<string, any>;
    private performanceThreshold: number;

    constructor(performanceThreshold: number = 100) {
        this.propertyStructureCache = new Map();
        this.performanceThreshold = performanceThreshold;
    }

    initializeTable(components: any): [PropertiesTable, (props: any) => void] {
        try {
            const [propertiesTable, updatePropertiesTable] = CUI.tables.elementProperties({
                components,
                fragmentIdMap: {},
            });

            if (!propertiesTable) {
                throw new Error('Failed to initialize properties table');
            }

            this.propertiesTable = propertiesTable;
            this.propertiesTable.preserveStructureOnFilter = true;
            this.propertiesTable.indentationInText = false;

            this.addPerformanceMonitoring();

            return [propertiesTable, this.wrapUpdateFunction(updatePropertiesTable)];
        } catch (error) {
            Logger.error('Failed to initialize properties table', error);
            throw error;
        }
    }

    private wrapUpdateFunction(updateFn: (props: any) => void): (props: any) => void {
        return (props: any) => {
            try {
                const previousState = this.getSnapshot();
                Logger.debug('Updating Properties Table', { previousState, updateProps: props });

                const startTime = performance.now();
                const result = updateFn(props);
                const endTime = performance.now();

                const executionTime = endTime - startTime;
                if (executionTime > this.performanceThreshold) {
                    Logger.debug('Performance Warning', {
                        operation: 'updateProperties',
                        executionTime: `${executionTime.toFixed(2)}ms`,
                        threshold: `${this.performanceThreshold}ms`
                    });
                }

                const newState = this.getSnapshot();
                Logger.debug('Properties Table Updated', { newState, updateResult: result });

                this.cachePropertyState(props, newState);
                return result;
            } catch (error) {
                Logger.error('Error in update function', error);
                throw error;
            }
        };
    }

    private cachePropertyState(props: any, state: any): void {
        if (props?.fragmentIdMap) {
            const key = Object.keys(props.fragmentIdMap)[0];
            if (key) {
                this.propertyStructureCache.set(key, state);
                this.cleanCache();
            }
        }
    }

    private cleanCache(): void {
        const maxCacheSize = 100;
        if (this.propertyStructureCache.size > maxCacheSize) {
            const entriesToDelete = Array.from(this.propertyStructureCache.keys())
                .slice(0, this.propertyStructureCache.size - maxCacheSize);
            entriesToDelete.forEach(key => this.propertyStructureCache.delete(key));
        }
    }

    private addPerformanceMonitoring(): void {
        if (!this.propertiesTable) return;

        const methods = Object.getOwnPropertyDescriptors(this.propertiesTable);
        for (const [key, descriptor] of Object.entries(methods)) {
            if (typeof descriptor.value === 'function') {
                this.wrapMethodWithPerformanceMonitoring(key, descriptor.value);
            }
        }
    }

    private wrapMethodWithPerformanceMonitoring(methodName: string, originalMethod: Function): void {
        Object.defineProperty(this.propertiesTable, methodName, {
            value: (...args: any[]) => {
                const start = performance.now();
                const result = originalMethod.apply(this.propertiesTable, args);
                const executionTime = performance.now() - start;

                if (executionTime > this.performanceThreshold) {
                    Logger.debug(`Slow Operation: ${methodName}`, {
                        executionTime: `${executionTime.toFixed(2)}ms`,
                        arguments: args
                    });
                }

                return result;
            }
        });
    }

    getSnapshot(): Record<string, any> | null {
        if (!this.propertiesTable) return null;
        
        return {
            columns: this.propertiesTable._columns,
            dataCount: this.propertiesTable._data.length,
            categories: this.propertiesTable._data[0]?.children.map(child => child.data.Name) || [],
            queryString: this.propertiesTable.queryString,
            filtered: this.propertiesTable.filtered?.length || 0,
            expanded: this.propertiesTable.expanded
        };
    }

    searchProperties(term: string): PropertyNode[] {
        if (!this.propertiesTable || !term) return [];

        const results: PropertyNode[] = [];
        const searchTerm = term.toUpperCase();

        const searchNode = (node: PropertyNode): void => {
            if (node.data.Name.toUpperCase().includes(searchTerm)) {
                results.push(node);
            }
            node.children?.forEach(searchNode);
        };

        this.propertiesTable._data.forEach(searchNode);
        return results;
    }

    getPropertyValue(path: string[]): PropertyData | null {
        if (!this.propertiesTable || !path.length) return null;

        let current = this.propertiesTable._data[0];
        for (const segment of path) {
            if (!current) return null;
            current = current.children?.find(child => child.data.Name === segment);
        }

        return current?.data || null;
    }

    setPropertyValue(path: string[], value: any): boolean {
        if (!this.propertiesTable || !path.length) return false;

        let current = this.propertiesTable._data[0];
        const pathLength = path.length;

        for (let i = 0; i < pathLength - 1; i++) {
            if (!current) return false;
            current = current.children?.find(child => child.data.Name === path[i]);
        }

        if (current?.children) {
            const targetNode = current.children.find(
                child => child.data.Name === path[pathLength - 1]
            );
            if (targetNode) {
                targetNode.data.Value = value;
                return true;
            }
        }

        return false;
    }

    exportData(): Record<string, any> {
        return {
            structure: this.getSnapshot(),
            cache: Object.fromEntries(this.propertyStructureCache),
            currentState: {
                data: this.propertiesTable?._data || [],
                columns: this.propertiesTable?._columns || [],
                hiddenColumns: this.propertiesTable?._hiddenColumns || []
            }
        };
    }

    getCachedProperty(key: string): any {
        return this.propertyStructureCache.get(key);
    }

    clearCache(): void {
        this.propertyStructureCache.clear();
    }

    setPerformanceThreshold(threshold: number): void {
        this.performanceThreshold = threshold;
    }

    getTableStatistics(): Record<string, any> {
        return {
            totalProperties: this.propertiesTable?._data.length || 0,
            visibleProperties: this.propertiesTable?.filtered.length || 0,
            cacheSize: this.propertyStructureCache.size,
            columnCount: this.propertiesTable?._columns.length || 0,
            hiddenColumnCount: this.propertiesTable?._hiddenColumns.length || 0,
            isFiltered: !!this.propertiesTable?.queryString,
            currentQuery: this.propertiesTable?.queryString || null
        };
    }

    isInitialized(): boolean {
        return !!this.propertiesTable;
    }
}