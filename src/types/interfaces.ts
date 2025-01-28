export interface PropertyTableColumn {
    name: string;
    width: string;
}

export interface PropertyData {
    Name: string;
    [key: string]: any;
}

export interface PropertyNode {
    data: PropertyData;
    children: PropertyNode[];
}

export interface PropertiesTable {
    _data: PropertyNode[];
    _columns: PropertyTableColumn[];
    _hiddenColumns: string[];
    _queryString: string | null;
    isUpdatePending: boolean;
    hasUpdated: boolean;
    preserveStructureOnFilter: boolean;
    indentationInText: boolean;
    enableUpdating: () => void;
    loadFunction: () => void;
    queryString: string | null;
    filtered: any[];
    expanded: boolean;
}

export interface World {
    getComponents: () => any;
    getWorld: () => any;
    container: any;
    scene?: {
        three: {
            add: (model: any) => void;
        };
    };
}
export interface EntityRelations {
    [key: string]: any[];
}

export interface Highlighter {
    setup: (config: { world: any }) => void;
    events: {
        select: {
            onHighlight: {
                add: (callback: (fragmentIdMap: FragmentIdMap) => void) => void;
            };
            onClear: {
                add: (callback: () => void) => void;
            };
        };
    };
}

export interface IfcRelationsIndexer {
    getEntityRelations: (
        modelID: string,
        expressID: number,
        relationType: "IsDefinedBy" | "ContainedInStructure" | "HasAssociations"
    ) => any[];
}

export interface FragmentIdMap {
    [modelID: string]: number[];
}