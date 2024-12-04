import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";



export class RelationsTreePanel {
    private panel: any;
    private relationsTree: any;

    constructor(components: any) {
        this.setupRelationsTree(components);
    }

    private setupRelationsTree(components: any) {
        // Create relations tree
        const [relationsTree] = CUI.tables.relationsTree({
            components,
            models: [],
        });
        this.relationsTree = relationsTree;
        this.relationsTree.preserveStructureOnFilter = true;

        // Create panel
        this.panel = BUI.Component.create(() => {
            const [loadIfcBtn] = CUI.buttons.loadIfc({ components });

            const onSearch = (e: Event) => {
                const input = e.target as BUI.TextInput;
                this.relationsTree.queryString = input.value;
            };

            return BUI.html`
                <bim-panel label="Relations Tree">
                    <bim-panel-section label="Model Tree">
                        ${loadIfcBtn}
                        <bim-text-input @input=${onSearch} placeholder="Search..." debounce="200"></bim-text-input>
                        ${this.relationsTree}
                    </bim-panel-section>
                </bim-panel>
            `;
        });
    }

    getPanel() {
        return this.panel;
    }
}