// components/ui/ClassificationsTreePanel.js  
import { ClassificationsManager } from "@/services/classification/ClassificationsManager";
import { BaseUIComponent } from "./BaseUIComponent";  
import * as BUI from "@thatopen/ui";  
import * as CUI from "@thatopen/ui-obc";  

export class ClassificationsTreePanel extends BaseUIComponent {  
    constructor(world, classificationsManager) {  
        super(world);  
        this.classificationsManager = classificationsManager;  
        this.element = this.createPanel();  
    }  

    createPanel() {  
        const [classificationsTree, updateClassificationsTree] =   
            CUI.tables.classificationTree({  
                components: this.world.getComponents(),  
                classifications: this.classificationsManager.getClassifications()  
            });  
         
        this.updateTree = updateClassificationsTree;  

        return BUI.Component.create(() => {   

            return BUI.html`  
                <bim-panel label="Classifications Tree">   
                    <bim-panel-section label="Classifications">  
                        ${classificationsTree}  
                    </bim-panel-section>  
                </bim-panel>  
            `;  
        });  
    }  

    updateClassifications(classifications) {  
        this.updateTree({ classifications });  
    }  
}  