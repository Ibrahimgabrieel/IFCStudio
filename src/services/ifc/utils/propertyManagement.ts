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
}