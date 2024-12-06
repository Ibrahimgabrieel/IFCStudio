// TreePanel.ts  
import * as BUI from "@thatopen/ui";  
import * as OBC from "@thatopen/components";  
import { BasePanel } from "./BasePanel";  
  
export class TreePanel extends BasePanel {  
    private tree: BUI.Table | null;  
    private updateTree: ((data: any) => void) | null;  
  
    constructor(world: any) {  
        super(world);  
        this.tree = null;  
        this.updateTree = null;  
        this.init();  
    }  
  
    init() {  
        this.createClassificationTree();  
        this.setupFragmentManager();  
        this.createPanel();  
        this.setupModelTracking();  
    }  
  
    createClassificationTree() {  
        // Create table component using the correct API  
        const table = new BUI.Table({  
            columns: [  
                { header: 'Name', accessor: 'name' },  
                { header: 'Type', accessor: 'type' }  
            ],  
            data: [],  
            onRowClick: (row) => this.handleSelection([row])  
        });  
  
        // Store the table instance  
        this.tree = table;  
  
        // Create the table element  
        const tableElement = table.get();  
        tableElement.classList.add('classification-tree');  
  
        return tableElement;  
    }  
  
    handleSelection(selection: any[]) {  
        const fragmentManager = this.components.get(OBC.FragmentsManager);  
        if (!fragmentManager) return;  
  
        // Clear previous selections  
        fragmentManager.selectFragments([]);  
  
        if (selection && selection.length > 0) {  
            const selectedIds = selection  
                .filter(item => item && item.original)  
                .map(item => item.original.id)  
                .filter(id => id !== undefined);  
  
            if (selectedIds.length > 0) {  
                fragmentManager.selectFragments(selectedIds);  
            }  
        }  
    }  
  
    setupFragmentManager() {  
        const fragmentsManager = this.components.get(OBC.FragmentsManager);  
        const classifier = this.components.get(OBC.Classifier);  
  
        if (!fragmentsManager || !classifier) return;  
  
        fragmentsManager.onFragmentsLoaded.add(async (model: any) => {  
            try {  
                // Classify model  
                await classifier.byEntity(model);  
                await classifier.byPredefinedType(model);  
  
                // Get classifications  
                const entities = classifier.get("entities");  
                const types = classifier.get("predefinedTypes");  
  
                // Update tree data  
                const treeData = [  
                    ...this.formatClassifications(entities, "Entity"),  
                    ...this.formatClassifications(types, "Type")  
                ];  
  
                // Update table data  
                if (this.tree) {  
                    this.tree.setData(treeData);  
                }  
  
            } catch (error) {  
                console.error("Error processing model:", error);  
            }  
        });  
    }  
  
    formatClassifications(items: any[], category: string) {  
        return Object.entries(items || {}).map(([name, data]: [string, any]) => ({  
            name,  
            type: category,  
            id: data.id,  
            children: Array.isArray(data) ? this.formatClassifications(data, category) : []  
        }));  
    }  
  
    createPanel() {  
        this.panel = BUI.Component.create(() => {  
            const treeElement = this.createClassificationTree();  
  
            return BUI.html`  
                <bim-panel label="Model Browser">  
                    <bim-panel-section label="Model Structure">  
                        ${treeElement}  
                    </bim-panel-section>  
                    <bim-panel-section label="Properties">  
                        ${this.createPropertiesSection()}  
                    </bim-panel-section>  
                </bim-panel>  
            `;  
        });  
  
        // Add styles  
        const style = document.createElement('style');  
        style.textContent = `  
            .classification-tree {  
                width: 100%;  
                height: 400px;  
                overflow: auto;  
            }  
            .classification-tree table {  
                width: 100%;  
                border-collapse: collapse;  
            }  
            .classification-tree th,  
            .classification-tree td {  
                padding: 8px;  
                text-align: left;  
                border-bottom: 1px solid #ddd;  
            }  
            .classification-tree tr:hover {  
                background-color: #f5f5f5;  
                cursor: pointer;  
            }  
        `;  
        document.head.appendChild(style);  
    }  
  
    createPropertiesSection() {  
        return BUI.html`  
            <div class="properties-container">  
                <div id="properties-content"></div>  
            </div>  
        `;  
    }  
  
    setupModelTracking() {  
        const originalAddObject = this.world.addObject.bind(this.world);  
        this.world.addObject = async (name: string, object: any) => {  
            await originalAddObject(name, object);  
            this.onObjectAdded(name, object);  
        };  
    }  
  
    onObjectAdded(name: string, object: any) {  
        if (object.type === 'IFCObject') {  
            this.updateTreeWithIFCObject(object);  
        }  
    }  
  
    updateTreeWithIFCObject(ifcObject: any) {  
        if (this.tree && ifcObject) {  
            const currentData = this.tree.getData() || [];  
            const newData = [...currentData, {  
                name: ifcObject.name || 'Unnamed Object',  
                type: 'IFC Object',  
                id: ifcObject.id  
            }];  
            this.tree.setData(newData);  
        }  
    }  
  
    dispose() {  
        if (this.tree) {  
            this.tree.dispose();  
        }  
        this.tree = null;  
        this.updateTree = null;  
        super.dispose();  
    }  
}  