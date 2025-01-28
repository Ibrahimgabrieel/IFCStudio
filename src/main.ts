// main.ts
import * as BUI from "@thatopen/ui";
import * as THREE from "three";
import { World } from './components/viewer/world';
import { Grid } from "./components/viewer/Rendring/grid";
import { UIManager } from './components/ui/UIManager';
import { IfcLoaderFactory } from "./services/ifc/factories/IfcLoaderFactory";
import { IFCObject } from "./components/IFC/IFCObject";
import { Logger } from './utils/logger';
import './styles/main.css';

class App {
    private world: World;
    private ui: UIManager;
    private ifcLoader: ReturnType<typeof IfcLoaderFactory.create>;
    private readonly container: HTMLElement;

    constructor() {
        const container = document.getElementById("container");
        if (!container) {
            throw new Error("Container element not found");
        }
        this.container = container;
    }

    public async initialize(): Promise<void> {
        try {
            await this.setupWorld();
            await this.setupUI();
            await this.setupGrid();
            await this.loadIFCModel();

            this.setupEventListeners();
            
            Logger.debug('Application initialized successfully', {
                world: this.world,
                ui: this.ui
            });
        } catch (error) {
            Logger.error('Failed to initialize application', error);
            throw error;
        }
    }

    private async setupWorld(): Promise<void> {
        try {
            this.world = new World(this.container);
            Logger.debug('World setup complete', this.world);
        } catch (error) {
            Logger.error('Failed to setup world', error);
            throw error;
        }
    }

    private async setupUI(): Promise<void> {
        try {
            this.ui = new UIManager(this.world);
            Logger.debug('UI setup complete', this.ui);
        } catch (error) {
            Logger.error('Failed to setup UI', error);
            throw error;
        }
    }

    private async setupGrid(): Promise<void> {
        try {
            const grid = new Grid(this.world.getComponents(), this.world.getWorld());
            grid.create();
            Logger.debug('Grid setup complete', grid);
        } catch (error) {
            Logger.error('Failed to setup grid', error);
            throw error;
        }
    }

    private async loadIFCModel(): Promise<void> {
        try {
            this.ifcLoader = IfcLoaderFactory.create(this.world.getComponents());
            await this.ifcLoader.setup();

            const model = await this.ifcLoader.load(
                '/ifc/racbasicsampleproject.ifc',
                this.handleLoadProgress
            );

            const ifcObject = new IFCObject(model);
            await this.world.addObject("ifc_model", ifcObject);

            // Search for properties after model is loaded
            const propertiesManager = this.ui.getPropertiesManager();
            const searchResults = propertiesManager.searchProperties('Basic Wall');
            Logger.debug('Property search results', searchResults);

            Logger.debug('IFC model loaded successfully', {
                model,
                ifcObject
            });
        } catch (error) {
            Logger.error('Failed to load IFC model', error);
            throw error;
        }
    }

    private handleLoadProgress = (progress: number): void => {
        Logger.debug('Loading IFC model', {
            progress: `${progress}%`
        });
    };

    private setupEventListeners(): void {
        window.addEventListener('beforeunload', this.cleanup);
        Logger.debug('Event listeners setup complete');
    }

    private cleanup = (): void => {
        try {
            if (this.ifcLoader) {
                this.ifcLoader.dispose();
            }
            Logger.debug('Cleanup complete');
        } catch (error) {
            Logger.error('Error during cleanup', error);
        }
    };
}

// Application entry point
async function startApplication(): Promise<void> {
    try {
        const app = new App();
        await app.initialize();
        Logger.debug('Application started successfully', app);
    } catch (error) {
        Logger.error('Failed to start application', error);
        // You might want to show an error message to the user here
    }
}

// Start the application
startApplication().catch((error) => {
    Logger.error('Critical application error', error);
    // Handle critical errors (e.g., show error page)
});