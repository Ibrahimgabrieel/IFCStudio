import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import { BaseObject } from "../../components/IFC/baseobject";

export class IfcObject extends BaseObject {
    constructor(components) {
        super();
        this.components = components;
        this.fragments = this.components.get(OBC.FragmentsManager);
        this.fragmentIfcLoader = this.components.get(OBC.IfcLoader);
    }

    async setup() {
        await this.fragmentIfcLoader.setup();

        // Configure excluded categories if needed
        const excludedCats = [
            WEBIFC.IFCTENDONANCHOR,
            WEBIFC.IFCREINFORCINGBAR,
            WEBIFC.IFCREINFORCINGELEMENT,
        ];

        for (const cat of excludedCats) {
            this.fragmentIfcLoader.settings.excludedCategories.add(cat);
        }

        // Configure IFC settings
        this.fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;
    }

    async load(url) {
        try {
            const file = await fetch(url);
            const data = await file.arrayBuffer();
            const buffer = new Uint8Array(data);
            this.mesh = await this.fragmentIfcLoader.load(buffer);
            this.mesh.name = "ifc_model";
            return this.mesh;
        } catch (error) {
            console.error("Error loading IFC:", error);
            throw error;
        }
    }

    dispose() {
        if (this.fragments) {
            this.fragments.dispose();
        }
    }

    exportFragments() {
        if (!this.fragments.groups.size) {
            return;
        }
        const group = Array.from(this.fragments.groups.values())[0];
        const data = this.fragments.export(group);
        this.download(new File([new Blob([data])], "model.frag"));

        const properties = group.getLocalProperties();
        if (properties) {
            this.download(new File([JSON.stringify(properties)], "model.json"));
        }
    }

     download(file) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}