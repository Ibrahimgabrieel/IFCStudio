// components/ui/Panel.js  
import * as BUI from "@thatopen/ui";  
import * as THREE from "three";  
import { BaseUIComponent } from "./BaseUIComponent";   

export class Panel extends BaseUIComponent {  
    constructor(world) {  
        super(world);  
        this.element = this.createPanel();  
        this.init();  
    }  

    init() {  
        document.body.append(this.element);  
    }  

    createPanel() {  
        return BUI.Component.create(() => {  
            return BUI.html`  
                <bim-panel label="IFC Studio" class="options-menu">  
                    <bim-panel-section collapsed label="Scene Controls">  
                        ${this.createSceneControls()}  
                    </bim-panel-section>  
                    <bim-panel-section collapsed label="Lighting">  
                        ${this.createLightingControls()}  
                    </bim-panel-section>  
                </bim-panel>  
            `;  
        });  
    }  

    createSceneControls() {  
        return BUI.html`  
            ${this.createColorInput()}  
        `;  
    }  

    createLightingControls() {  
        return BUI.html`  
            ${this.createDirectionalLightInput()}  
            ${this.createAmbientLightInput()}  
        `;  
    }  

    createColorInput() {  
        return BUI.html`  
            <bim-color-input   
                label="Background Color"   
                color="#202932"   
                @input="${this.handleBackgroundColorChange.bind(this)}">  
            </bim-color-input>  
        `;  
    }  

    createDirectionalLightInput() {  
        return BUI.html`  
            <bim-number-input   
                slider   
                step="0.1"   
                label="Directional lights intensity"   
                value="1.5"   
                min="0.1"   
                max="10"  
                @change="${this.handleDirectionalLightChange.bind(this)}">  
            </bim-number-input>  
        `;  
    }  

    createAmbientLightInput() {  
        return BUI.html`  
            <bim-number-input   
                slider   
                step="0.1"   
                label="Ambient light intensity"   
                value="1"   
                min="0.1"   
                max="5"  
                @change="${this.handleAmbientLightChange.bind(this)}">  
            </bim-number-input>  
        `;  
    }  

    handleBackgroundColorChange({ target }) {  
        const scene = this.world.getScene();  
        if (scene && scene.config) {  
            scene.config.backgroundColor = new THREE.Color(target.color);  
        }  
    }  

    handleDirectionalLightChange({ target }) {  
        const scene = this.world.getScene();  
        if (scene && scene.config) {  
            scene.config.directionalLight.intensity = target.value;  
        }  
    }  

    handleAmbientLightChange({ target }) {  
        const scene = this.world.getScene();  
        if (scene && scene.config) {  
            scene.config.ambientLight.intensity = target.value;  
        }  
    }  

    toggleVisibility() {  
        this.element.classList.toggle('options-menu-visible');  
    }  
}  

// Optional: Create a SceneConfig class to manage scene configuration  
export class SceneConfig {  
    constructor() {  
        this.backgroundColor = new THREE.Color("#202932");  
        this.directionalLight = {  
            intensity: 1.5  
        };  
        this.ambientLight = {  
            intensity: 1.0  
        };  
    }  
}  