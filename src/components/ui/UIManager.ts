// components/ui/UIManager.ts

import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as CUI from "@thatopen/ui-obc";
import * as OBF from "@thatopen/components-front";
import { Panel } from './Panel';
import { MenuButton } from './MobileButton';
import { ClassificationsTreePanel } from './ClassificationsTreePanel';
import { ClassificationsManager } from "@/services/classification/ClassificationsManager";
import { PropertiesManager } from "./PropertiesManager";
import { Logger } from "../../utils/logger";
import { World, PropertiesTable, FragmentIdMap, IfcRelationsIndexer, Highlighter } from "../../types/interfaces";
import { FragmentService } from "@/services/ifc/managers/FragmentService";
import { Color, Vector3, Matrix4 } from "three";

export class UIManager {
    private readonly world: World;
    private readonly classificationsManager: ClassificationsManager;
    private readonly propertiesManager: PropertiesManager;
    private panel!: Panel;
    private classificationsPanel!: ClassificationsTreePanel;
    private menuButton!: MenuButton;
    private propertiesPanel: any;
    private fragmentService: FragmentService;
    constructor(world: World) {
        Logger.debug('UIManager Constructor', { world });
        
        if (!world) {
            throw new Error('World instance is required');
        }

        this.world = world;
        this.classificationsManager = new ClassificationsManager(world.getComponents());
        this.propertiesManager = new PropertiesManager();
        this.fragmentService= new FragmentService(world.getComponents());
        this.init();
    }

    private init(): void {
        Logger.debug('Initializing UIManager');
        
        try {
            BUI.Manager.init();
            this.initializeUIComponents();
            this.setupPropertiesComponents();
            this.setupModelHandlers();
            this.createLayout();
        } catch (error) {
            Logger.error('Error in UIManager initialization', error);
            throw error;
        }
    }

    private initializeUIComponents(): void {
        try {
            this.panel = new Panel(this.world,this.fragmentService);
            this.classificationsPanel = new ClassificationsTreePanel(
                this.world,
                this.classificationsManager
            );
            this.menuButton = new MenuButton(this.panel);
            
            Logger.debug('UI Components Initialized');
        } catch (error) {
            Logger.error('Error initializing UI components', error);
            throw error;
        }
    }

    private setupPropertiesComponents(): void {
        try {
            const components = this.world.getComponents();
            const [propertiesTable, updatePropertiesTable] = 
                this.propertiesManager.initializeTable(components);
    
            this.setupHighlighter(components, updatePropertiesTable);
            this.createPropertiesPanel(propertiesTable);
    
            Logger.debug('Properties Components Setup Complete');
        } catch (error) {
            Logger.error('Error in setupPropertiesComponents', error);
            throw error;
        }
    }

    private setupHighlighter(
        components: {
            get(key: any): Highlighter | IfcRelationsIndexer;
        },
        updatePropertiesTable: (props: { fragmentIdMap: FragmentIdMap }) => void
    ): void {
        try {
            const highlighter = components.get(OBF.Highlighter) as Highlighter;
            const indexer = components.get(OBC.IfcRelationsIndexer) as IfcRelationsIndexer;
    
            if (!highlighter || !indexer) {
                throw new Error('Required components not found');
            }
    
            highlighter.setup({ world: this.world.getWorld() });
            this.setupHighlighterEvents(highlighter, indexer, updatePropertiesTable);
            
            Logger.debug('Highlighter Setup Complete');
        } catch (error) {
            Logger.error('Error setting up highlighter', error);
            throw error;
        }
    }
    
    private setupHighlighterEvents(
        highlighter: Highlighter,
        indexer: IfcRelationsIndexer,
        updatePropertiesTable: (props: { fragmentIdMap: FragmentIdMap }) => void
    ): void {
        highlighter.events.select.onHighlight.add((fragmentIdMap: FragmentIdMap) => {
            Logger.debug('Highlighter Selection Event', { fragmentIdMap });
    
            updatePropertiesTable({ fragmentIdMap });
          //  const highlightColor = new Color(0xff0000);
            // Change color of selected fragments
    //         this.fragmentService.changeColor(fragmentIdMap, highlightColor, true);
            
            // Update the Panel with selected fragments
            this.panel.updateFragments(fragmentIdMap);

            const entries = Object.entries(fragmentIdMap);
            if (entries.length > 0) {
                const [modelID, fragments] = entries[0];
                
                if (Array.isArray(fragments) && fragments.length > 0) {
                    const expressID = fragments[0];
    
                    const relations: Record<string, any[]> = {
                        IsDefinedBy: indexer.getEntityRelations(modelID, expressID, "IsDefinedBy"),
                        ContainedIn: indexer.getEntityRelations(modelID, expressID, "ContainedInStructure"),
                        HasAssociations: indexer.getEntityRelations(modelID, expressID, "HasAssociations")
                    };
    
                    Logger.debug('Element Relations', {
                        modelID,
                        expressID,
                        relations
                    });
                }
            }
        });
    
        highlighter.events.select.onClear.add(() => {
            Logger.debug('Clearing Properties Table');
            updatePropertiesTable({ fragmentIdMap: {} });
            
            // Clear the Panel's selected fragments
            this.panel.updateFragments(null);
        });
    }

    

    private createPropertiesPanel(propertiesTable: PropertiesTable): void {
        try {
            this.propertiesPanel = BUI.Component.create(() => {
                const onTextInput = (e: Event) => {
                    const input = e.target as HTMLInputElement;
                    Logger.debug('Text Input Change', {
                        previousQuery: propertiesTable.queryString,
                        newQuery: input.value
                    });

                    propertiesTable.queryString = input.value !== "" ? input.value : null;

                    Logger.debug('Properties Table After Query Update', {
                        currentQuery: propertiesTable.queryString,
                        filteredResults: propertiesTable.filtered
                    });
                };

                return BUI.html`
                    <bim-panel label="Properties">
                        <bim-panel-section label="Element Data">
                            <bim-text-input 
                                @input=${onTextInput} 
                                placeholder="Search Property" 
                                debounce="250">
                            </bim-text-input>
                            ${propertiesTable}
                        </bim-panel-section>
                    </bim-panel>
                `;
            });
            
            Logger.debug('Properties Panel Created');
        } catch (error) {
            Logger.error('Error creating properties panel', error);
            throw error;
        }
    }

    private setupModelHandlers(): void {
        try {
            const components = this.world.getComponents();
            const fragmentsManager = components.get(OBC.FragmentsManager);
            const indexer = components.get(OBC.IfcRelationsIndexer);

            if (!fragmentsManager || !indexer) {
                throw new Error('Required model handlers not found');
            }

            fragmentsManager.onFragmentsLoaded.add(async (model: any) => {
                try {
                    Logger.debug('Processing Model', { model });

                    await indexer.process(model);
                    Logger.debug('Model relations processed successfully');

                    const classifications = await this.classificationsManager.classifyModel(model);
                    Logger.debug('Classifications Updated', { classifications });
                    this.classificationsPanel.updateClassifications(classifications);

                    if (this.world.scene) {
                        this.world.scene.three.add(model);
                        Logger.debug('Model added to scene');
                    }
                } catch (error) {
                    Logger.error('Error processing model', error);
                    throw error;
                }
            });
            
            Logger.debug('Model Handlers Setup Complete');
        } catch (error) {
            Logger.error('Error setting up model handlers', error);
            throw error;
        }
    }

    private createLayout(): void {
        try {
            const app = document.createElement("bim-grid");
            
            // Create a container for the panel
            const controlsContainer = document.createElement('div');
            controlsContainer.style.position = 'absolute';
            controlsContainer.style.top = '0';
            controlsContainer.style.left = '0';
            controlsContainer.style.zIndex = '1000';
            controlsContainer.appendChild(this.panel.element);
            
            app.layouts = {
                main: {
                    template: `
                        "properties viewport"
                        / 25rem 1fr
                    `,
                    elements: {
                        properties: this.propertiesPanel,
                        viewport: this.world.container
                    },
                },
            };
    
            app.layout = "main";
            document.body.append(app);
            document.body.append(controlsContainer); // Add panel outside the grid
            
            Logger.debug('Layout Created Successfully');
        } catch (error) {
            Logger.error('Error creating layout', error);
            throw error;
        }
    }

    // Public methods for external interaction
    public getPropertiesManager(): PropertiesManager {
        return this.propertiesManager;
    }

    public getClassificationsManager(): ClassificationsManager {
        return this.classificationsManager;
    }

    public refreshUI(): void {
        try {
            if (this.propertiesPanel) {
                this.propertiesPanel.requestUpdate();
            }
            Logger.debug('UI Refresh Completed');
        } catch (error) {
            Logger.error('Error refreshing UI', error);
        }
    }

    public dispose(): void {
        try {
            // Cleanup code here
            this.propertiesManager.clearCache();
            // Additional cleanup as needed
            
            Logger.debug('UIManager Disposed');
        } catch (error) {
            Logger.error('Error disposing UIManager', error);
        }
    }
}