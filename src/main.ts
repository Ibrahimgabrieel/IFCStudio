// main.ts
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import { World } from './components/viewer/world';
import './styles/main.css';
import { Grid } from "./components/viewer/Rendring/grid";
import { UIManager } from './components/ui/UIManager';
import { IfcLoaderFactory } from "./services/ifc/factories/IfcLoaderFactory";
import { IFCObject } from "./components/IFC/IFCObject";

async function init() {
    const container = document.getElementById("container");
    if (!container) throw new Error("Container not found");

    const world = new World(container);

    // Create grid
    const grid = new Grid(world.getComponents(), world.getWorld());
    grid.create();

    // Initialize IFC loader
    const ifcLoader = IfcLoaderFactory.create(world.getComponents());

    try {
        await ifcLoader.setup();
        const model = await ifcLoader.load(
            'https://thatopen.github.io/engine_components/resources/small.ifc',
            (progress) => console.log(`Loading: ${progress}%`)
        );


   const ifcObject = new IFCObject(model);
await world.addObject("ifc_model", ifcObject);

    } catch (error) {
        console.error('Failed to load IFC model:', error);
    }

    // Initialize UI
    const ui = new UIManager(world);

    // Cleanup function
    function cleanup() {
        ifcLoader.dispose();
    }

    // Add cleanup listener
    window.addEventListener('beforeunload', cleanup);
}

// Start the application
init().catch(console.error);