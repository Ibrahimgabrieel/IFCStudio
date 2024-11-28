import * as OBC from "@thatopen/components";

export class Grid {
    constructor(components, world) {
        console.log(components);
        console.log(world);
        this.components = components;
        this.world = world;
        this.grid = null;
    }

    create() {
        const grids = this.components.get(OBC.Grids);
        this.grid = grids.create(this.world);
        return this.grid;
    }

    remove() {
        if (this.grid) {
            // Remove grid logic here
            this.grid = null;
        }
    }
}