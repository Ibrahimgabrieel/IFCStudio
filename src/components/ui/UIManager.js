// components/ui/UIManager.js  
import * as BUI from "@thatopen/ui";  
import { Panel } from './Panel';  
import { MenuButton } from './MobileButton';  
import { ClassificationsTreePanel } from './ClassificationsTreePanel';  
import { ClassificationsManager } from "@/services/classification/ClassificationsManager";  
import * as OBC from "@thatopen/components";
export class UIManager {  
    constructor(world) {  
        this.world = world;  
        this.classificationsManager = new ClassificationsManager(world.getComponents());  
        this.init();  
    }  

    init() {  
        BUI.Manager.init();  

        // Create UI components  
        this.panel = new Panel(this.world);  
        this.classificationsPanel = new ClassificationsTreePanel(  
            this.world,   
            this.classificationsManager  
        );  
        this.menuButton = new MenuButton(this.panel);  

        // Setup model loading handlers  
        this.setupModelHandlers();  

        // Create layout  
        this.createLayout();  
    }  

    setupModelHandlers() {  
        const fragmentsManager = this.world.getComponents().get(OBC.FragmentsManager);  

        fragmentsManager.onFragmentsLoaded.add(async (model) => {  
            const classifications = await this.classificationsManager.classifyModel(model);  
            this.classificationsPanel.updateClassifications(classifications);  

            if (this.world.scene) {  
                this.world.scene.three.add(model);  
            }  
        });  
    }  

    createLayout() {  
        const app = document.createElement("bim-grid");  
        app.layouts = {  
            main: {  
                template: `  
                    "tree panel viewport"  
                    / 23rem 23rem 1fr  
                `,  
                elements: {  
                    tree: this.classificationsPanel.getElement(),  
                    panel: this.panel.getElement(),  
                    viewport: this.world.container  
                },  
            },  
        };  

        app.layout = "main";  
        document.body.append(app);  
    }  
}  