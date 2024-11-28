import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import { World } from './components/viewer/world';
import './styles/main.css';
import {Cube}from'./components/IFC/cube';
import { Grid } from "./components/viewer/Rendring/grid";
import { IfcObject } from "./services/ifc/IFCLoader";


import { UIManager } from './components/ui/UIManager';


const container = document.getElementById("container");
const world = new World(container);
console.log(world.getComponents());
const grid = new Grid(world.getComponents(), world.getWorld());
grid.create();
const cube = new Cube({ color: "#6528D7", size: 1.5 });
world.addObject("cube1", cube);
cube.setPosition(3, 3, 3);
const ifcObject = new IfcObject(world.getComponents());
await ifcObject.setup();

// Load IFC file
try {
 await ifcObject.load("https://thatopen.github.io/engine_components/resources/small.ifc");
 await world.addObject("mainModel", ifcObject);
} catch (error) {
 console.error("Failed to load IFC model:", error);
}
const ui = new UIManager(world);



