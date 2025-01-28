// components/viewer/World.ts
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import { BaseObject } from "../IFC/baseobject";
import { debugLog } from "../../utils/debug";

interface WorldConfig {
    initialCameraPosition?: { x: number; y: number; z: number };
    lookAt?: { x: number; y: number; z: number };
    backgroundColor?: THREE.Color | null;
}

export class World {
    private container: HTMLElement;
    private components: OBC.Components;
    private worlds: any; // OBC.Worlds type
    private world: any; // OBC.World type
    private objects: Map<string, BaseObject>;

    constructor(
        container: HTMLElement,
        config: WorldConfig = {
            initialCameraPosition: { x: 12, y: 6, z: 8 },
            lookAt: { x: 0, y: 0, z: -10 },
            backgroundColor: null
        }
    ) {
        if (!container) {
            throw new Error("Container element is required");
        }

        this.container = container;
        this.components = new OBC.Components();
        this.worlds = this.components.get(OBC.Worlds);
        this.objects = new Map();

        this.setup(config);
    }

    private setup(config: WorldConfig): void {
        try {
            debugLog("Setting up World");

            // Create world
            this.world = this.worlds.create();
            
            // Setup core components
            this.setupScene();
            this.setupRenderer();
            this.setupCamera(config);

            // Initialize components
            this.initializeComponents();

            debugLog("World setup completed");
        } catch (error) {
            console.error("Error during World setup:", error);
            throw error;
        }
    }

    private setupScene(): void {
        this.world.scene = new OBC.SimpleScene(this.components);
        this.world.scene.setup();
        this.world.scene.three.background = null;
    }

    private setupRenderer(): void {
        this.world.renderer = new OBC.SimpleRenderer(
            this.components,
            this.container
        );
    }

    private setupCamera(config: WorldConfig): void {
        this.world.camera = new OBC.SimpleCamera(this.components);
        const { x: px, y: py, z: pz } = config.initialCameraPosition || { x: 12, y: 6, z: 8 };
        const { x: lx, y: ly, z: lz } = config.lookAt || { x: 0, y: 0, z: -10 };
        this.world.camera.controls.setLookAt(px, py, pz, lx, ly, lz);
    }

    private initializeComponents(): void {
        this.components.init();
    }

    public async addObject(name: string, object: BaseObject): Promise<void> {
        try {
            if (!(object instanceof BaseObject)) {
                throw new Error("Object must inherit from BaseObject");
            }

            if (this.objects.has(name)) {
                console.warn(`Object with name "${name}" already exists. Replacing...`);
                await this.removeObject(name);
            }

            const mesh = await object.getMesh();
            if (mesh) {
                this.objects.set(name, object);
                this.world.scene.three.add(mesh);
                debugLog(`Added object: ${name}`, { object, mesh });
            } else {
                throw new Error(`Failed to get mesh for object: ${name}`);
            }
        } catch (error) {
            console.error(`Error adding object ${name}:`, error);
            throw error;
        }
    }

    public async removeObject(name: string): Promise<boolean> {
        try {
            const object = this.objects.get(name);
            if (object) {
                const mesh = await object.getMesh();
                if (mesh) {
                    this.world.scene.three.remove(mesh);
                }
                object.dispose();
                this.objects.delete(name);
                debugLog(`Removed object: ${name}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error(`Error removing object ${name}:`, error);
            return false;
        }
    }

    public getObject(name: string): BaseObject | undefined {
        return this.objects.get(name);
    }

    public getAllObjects(): Map<string, BaseObject> {
        return new Map(this.objects);
    }

    // Core getters
    public getComponents(): OBC.Components {
        return this.components;
    }

    public getWorld(): any {
        return this.world;
    }

    public getScene(): any {
        return this.world.scene;
    }

    public getCamera(): any {
        return this.world.camera;
    }

    public getRenderer(): any {
        return this.world.renderer;
    }

    // Utility methods
    public resize(): void {
        if (this.world.camera && this.world.renderer) {
            this.world.camera.updateAspect();
            this.world.renderer.resize();
        }
    }

    public dispose(): void {
        try {
            // Check if objects exists and has items
            if (this.objects && this.objects.size > 0) {
                // Remove all objects using forEach
                this.objects.forEach(async (_, name) => {
                    await this.removeObject(name);
                });

                // Clear the map
                this.objects.clear();
            }

            // Dispose components if they exist
            if (this.components) {
                this.components.dispose();
            }

            debugLog("World disposed");
        } catch (error) {
            console.error("Error during World disposal:", error);
        }
    }

    // Event handlers
    public onWindowResize = (): void => {
        this.resize();
    }

    // Add window resize listener
    public enableResizeListener(): void {
        window.addEventListener('resize', this.onWindowResize);
    }

    // Remove window resize listener
    public disableResizeListener(): void {
        window.removeEventListener('resize', this.onWindowResize);
    }
}