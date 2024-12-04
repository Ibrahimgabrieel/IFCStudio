// components/IFC/IfcRelationsManager.js
import * as OBC from "@thatopen/components";
import * as CUI from "@thatopen/components-front";

export class IfcRelationsManager {
    constructor(components) {
        this.components = components;
        this.indexer = this.components.get(OBC.IfcRelationsIndexer);
        this.fragments = this.components.get(OBC.FragmentsManager);
        this.setupFragmentsHandler();
    }

    setupFragmentsHandler() {
        this.fragments.onFragmentsLoaded.add(async (model) => {
            if (model.hasProperties) {
                await this.indexer.process(model);
            }
        });
    }

    createRelationsTree() {
        const [relationsTree] = CUI.tables.relationsTree({
            components: this.components,
            models: [],
        });
        relationsTree.preserveStructureOnFilter = true;
        return relationsTree;
    }
}