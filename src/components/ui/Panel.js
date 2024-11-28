import * as BUI from "@thatopen/ui";
import * as THREE from "three";

export class Panel {
    constructor(world) {
        this.world = world;
        this.element = this.createPanel();
        this.init();
    }

    createPanel() {
        return BUI.Component.create(() => {
            return BUI.html`
            <bim-panel label="Your Project" class="options-menu">
                <bim-panel-section collapsed label="Controls">
                    ${this.createColorInput()}
                    ${this.createDirectionalLightInput()}
                    ${this.createAmbientLightInput()}
                </bim-panel-section>
            </bim-panel>
            `;
        });
    }

    createColorInput() {
        return BUI.html`
            <bim-color-input 
                label="Background Color" 
                color="#202932" 
                @input="${({ target }) => {
                    this.world.getScene().config.backgroundColor = new THREE.Color(target.color);
                }}">
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
                @change="${({ target }) => {
                    this.world.getScene().config.directionalLight.intensity = target.value;
                }}">
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
                @change="${({ target }) => {
                    this.world.getScene().config.ambientLight.intensity = target.value;
                }}">
            </bim-number-input>
        `;
    }

    init() {
        document.body.append(this.element);
    }

    toggleVisibility() {
        if (this.element.classList.contains("options-menu-visible")) {
            this.element.classList.remove("options-menu-visible");
        } else {
            this.element.classList.add("options-menu-visible");
        }
    }
}