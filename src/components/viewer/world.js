import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { BaseObject } from "../IFC/baseobject";



export class World {
    constructor(container) {
        this.container = container;
        this.components = new OBC.Components();
        this.worlds = this.components.get(OBC.Worlds);
        this.objects = new Map();
        this.setup();
    }

    setup() {
        // Create world
        this.world = this.worlds.create();

        // Setup scene, renderer and camera
        this.world.scene = new OBC.SimpleScene(this.components);
        this.world.renderer = new OBC.SimpleRenderer(this.components, this.container);
        this.world.camera = new OBC.SimpleCamera(this.components);

        // Initialize components
        this.components.init();
        this.world.scene.setup();
        this.world.scene.three.background = null;

        // Set camera position
        this.world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
    }

    async addObject(name, object) {
        if (!(object instanceof BaseObject)) {
            throw new Error("Object must inherit from BaseObject");
        }

        const mesh = await object.getMesh();
        if (mesh) {
            this.objects.set(name, object);
            this.world.scene.three.add(mesh);
        }
    }

    removeObject(name) {
        const object = this.objects.get(name);
        if (object) {
            const mesh = object.getMesh();
            this.world.scene.three.remove(mesh);
            object.dispose();
            this.objects.delete(name);
        }
    }

    getObject(name) {
        return this.objects.get(name);
    }

    getComponents() {
        return this.components;
    }

    getWorld() {
        return this.world;
    }

    // Getter methods
    getScene() {
        return this.world.scene;
    }

    getCamera() {
        return this.world.camera;
    }

    getRenderer() {
        return this.world.renderer;
    }
}