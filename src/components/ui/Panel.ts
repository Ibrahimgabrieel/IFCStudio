// components/ui/Panel.js  
import * as BUI from "@thatopen/ui";  
import * as THREE from "three";  
import { BaseUIComponent } from "./BaseUIComponent";   
import { FragmentService } from "@/services/ifc/managers/FragmentService";
import { FragmentIdMap } from "@thatopen/fragments";

export class Panel extends BaseUIComponent {  
    public element: any;
    private currentFragmentMap: any = null;
    private fragmentService: FragmentService;
    private moveValues = { x: 0, y: 0, z: 0 };

    constructor(world, fragmentService: FragmentService) {  
        super(world);  
        this.element = this.createPanel();
        this.fragmentService = fragmentService;  
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
                    <bim-panel-section collapsed label="Fragment Controls">
                        ${this.createFragmentControls()}
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
    updateFragments(fragmentMap: FragmentIdMap | null) {
        this.currentFragmentMap = fragmentMap;
        
        // Optionally disable/enable controls based on selection
        const controls = this.element.querySelectorAll('bim-button, bim-number-input, bim-color-input');
        controls.forEach((control: HTMLElement) => {
            if (fragmentMap && Object.keys(fragmentMap).length > 0) {
                control.removeAttribute('disabled');
            } else {
                control.setAttribute('disabled', '');
            }
        });
    } 

    createFragmentControls() {
        return BUI.html`
            <div class="control-group">
                <div class="control-row">
                    <bim-color-input
                        label="Fragment Color"
                        color="#ffffff"
                        @input="${this.handleFragmentColorChange.bind(this)}">
                    </bim-color-input>
                    <bim-button
                        label="Reset Color"
                        @click="${this.handleResetColor.bind(this)}">
                    </bim-button>
                </div>

                <div class="control-row">
                    <bim-number-input
                        slider
                        step="0.1"
                        label="Scale Factor"
                        value="1"
                        min="0.1"
                        max="5"
                        @change="${this.handleScaleChange.bind(this)}">
                    </bim-number-input>
                    <bim-button
                        label="Reset Scale"
                        @click="${this.handleResetScale.bind(this)}">
                    </bim-button>
                </div>

                <div class="control-group">
                    <div class="control-row">
                        <bim-number-input
                            slider
                            step="0.1"
                            label="Move X"
                            value="0"
                            min="-10"
                            max="10"
                            @change="${(e) => this.handleMoveChange(e, 'x')}">
                        </bim-number-input>
                    </div>
                    <div class="control-row">
                        <bim-number-input
                            slider
                            step="0.1"
                            label="Move Y"
                            value="0"
                            min="-10"
                            max="10"
                            @change="${(e) => this.handleMoveChange(e, 'y')}">
                        </bim-number-input>
                    </div>
                    <div class="control-row">
                        <bim-number-input
                            slider
                            step="0.1"
                            label="Move Z"
                            value="0"
                            min="-10"
                            max="10"
                            @change="${(e) => this.handleMoveChange(e, 'z')}">
                        </bim-number-input>
                    </div>
                    <bim-button
                        label="Reset Position"
                        @click="${this.handleResetPosition.bind(this)}">
                    </bim-button>
                </div>
            </div>
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

    // Fragment control handlers
    handleFragmentColorChange({ target }) {
        if (!this.currentFragmentMap) {
            console.warn('No fragments selected');
            return;
        }
        const color = new THREE.Color(target.color);
        this.fragmentService.changeColor(this.currentFragmentMap, color);
    }

    handleScaleChange({ target }) {
        if (!this.currentFragmentMap) {
            console.warn('No fragments selected');
            return;
        }
        const scale = target.value;
        this.fragmentService.scaleFragments(this.currentFragmentMap, scale);
    }

    handleMoveChange({ target }, axis: 'x' | 'y' | 'z') {
        if (!this.currentFragmentMap) {
            console.warn('No fragments selected');
            return;
        }
        this.moveValues[axis] = target.value;
        const translation = new THREE.Vector3(
            this.moveValues.x,
            this.moveValues.y,
            this.moveValues.z
        );
        this.fragmentService.moveFragments(this.currentFragmentMap, translation);
    }

    handleResetColor() {
        if (!this.currentFragmentMap) {
            console.warn('No fragments selected');
            return;
        }
        this.fragmentService.resetColors(this.currentFragmentMap);
    }

    handleResetScale() {
        if (!this.currentFragmentMap) {
            console.warn('No fragments selected');
            return;
        }
        this.fragmentService.scaleFragments(this.currentFragmentMap, 1);
    }

    handleResetPosition() {
        if (!this.currentFragmentMap) {
            console.warn('No fragments selected');
            return;
        }
        this.moveValues = { x: 0, y: 0, z: 0 };
        this.fragmentService.moveFragments(
            this.currentFragmentMap,
            new THREE.Vector3(0, 0, 0)
        );
        
        // Reset the input values
        const inputs = this.element.querySelectorAll('bim-number-input');
        inputs.forEach(input => {
            if (input.label.includes('Move')) {
                input.value = 0;
            }
        });
    }

    // Method to update selected fragments
    updateFragments(fragmentMap: any) {
        this.currentFragmentMap = fragmentMap;
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

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
    .control-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
    }

    .control-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    bim-button {
        min-width: 100px;
    }

    .options-menu {
        position: absolute;
        z-index: 1000;
        pointer-events: auto;
    }
`;
document.head.appendChild(style);