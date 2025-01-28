// components/ui/PropertiesPanel.ts
import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as CUI from "@thatopen/ui-obc";
import * as OBF from "@thatopen/components-front";
import { debugLog } from '../../utils/debug';

interface PropertyTableColumn {
    name: string;
    width: string;
}

interface PropertyData {
    Name: string;
    [key: string]: any;
}

interface PropertyNode {
    data: PropertyData;
    children: PropertyNode[];
}

interface PropertiesTable {
    _data: PropertyNode[];
    _columns: PropertyTableColumn[];
    _hiddenColumns: string[];
    _queryString: string | null;
    isUpdatePending: boolean;
    hasUpdated: boolean;
    preserveStructureOnFilter: boolean;
    indentationInText: boolean;
    queryString: string | null;
    filtered: any[];
    expanded: boolean;
}

export class PropertiesPanel {
    private propertiesTable: PropertiesTable;
    private panel: any;
    private propertyStructureCache: Map<string, any>;

    constructor(components: any) {
        this.propertyStructureCache = new Map();
        this.setupPropertiesTable(components);
    }

    private setupPropertiesTable(components: any) {
        const [propertiesTable, updatePropertiesTable] = CUI.tables.elementProperties({
            components,
            fragmentIdMap: {},
        });

        this.propertiesTable = propertiesTable;
        this.propertiesTable.preserveStructureOnFilter = true;
        this.propertiesTable.indentationInText = false;

        this.setupHighlighter(components, updatePropertiesTable);
        this.createPanel();
    }

    private setupHighlighter(components: any, updatePropertiesTable: Function) {
        const highlighter = components.get(OBF.Highlighter);
        const indexer = components.get(OBC.IfcRelationsIndexer);

        highlighter.setup({ world: components.get('world') });

        highlighter.events.select.onHighlight.add((fragmentIdMap: any) => {
            this.handleHighlight(fragmentIdMap, indexer, updatePropertiesTable);
        });

        highlighter.events.select.onClear.add(() => {
            updatePropertiesTable({ fragmentIdMap: {} });
        });
    }

    private handleHighlight(fragmentIdMap: any, indexer: any, updatePropertiesTable: Function) {
        updatePropertiesTable({ fragmentIdMap });

        if (Object.keys(fragmentIdMap).length > 0) {
            const [modelID, fragments] = Object.entries(fragmentIdMap)[0];
            const expressID = fragments[0];

            if (expressID) {
                this.processElementRelations(modelID, expressID, indexer);
            }
        }
    }

    private processElementRelations(modelID: string, expressID: string, indexer: any) {
        const relations = {
            IsDefinedBy: indexer.getEntityRelations(modelID, expressID, "IsDefinedBy"),
            ContainedIn: indexer.getEntityRelations(modelID, expressID, "ContainedInStructure"),
            HasAssociations: indexer.getEntityRelations(modelID, expressID, "HasAssociations")
        };

        debugLog('Element Relations', { modelID, expressID, ...relations });
    }

    private createPanel() {
        this.panel = BUI.Component.create(() => {
            return BUI.html`
                <bim-panel label="Properties">
                    <bim-panel-section label="Element Data">
                        <bim-text-input 
                            @input=${(e: any) => this.handleTextInput(e)} 
                            placeholder="Search Property" 
                            debounce="250">
                        </bim-text-input>
                        ${this.propertiesTable}
                    </bim-panel-section>
                </bim-panel>
            `;
        });
    }

    private handleTextInput(e: any) {
        const input = e.target;
        this.propertiesTable.queryString = input.value !== "" ? input.value : null;
    }

    public getSnapshot(): any {
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

    public searchProperties(term: string): PropertyNode[] {
        if (!this.propertiesTable || !term) return [];

        const results: PropertyNode[] = [];
        const searchTerm = term.toLowerCase();

        const searchNode = (node: PropertyNode) => {
            if (node.data.Name.toLowerCase().includes(searchTerm)) {
                results.push(node);
            }
            node.children?.forEach(searchNode);
        };

        this.propertiesTable._data.forEach(searchNode);
        return results;
    }

    public getPropertyValue(path: string[]): any {
        if (!this.propertiesTable || !path.length) return null;

        let current = this.propertiesTable._data[0];
        for (const segment of path) {
            if (!current) return null;
            current = current.children?.find(child => child.data.Name === segment);
        }

        return current?.data;
    }

    public getPanel() {
        return this.panel;
    }

    public exportData() {
        return {
            structure: this.getSnapshot(),
            cache: Object.fromEntries(this.propertyStructureCache),
            currentState: {
                data: this.propertiesTable._data,
                columns: this.propertiesTable._columns,
                hiddenColumns: this.propertiesTable._hiddenColumns
            }
        };
    }
}