// services/scene/LightingManager.js  
export class LightingManager {  
    constructor(scene) {  
        this.scene = scene;  
    }  

    setDirectionalLightIntensity(intensity) {  
        if (this.scene && this.scene.config) {  
            this.scene.config.directionalLight.intensity = intensity;  
        }  
    }  

    setAmbientLightIntensity(intensity) {  
        if (this.scene && this.scene.config) {  
            this.scene.config.ambientLight.intensity = intensity;  
        }  
    }  

    getDirectionalLightIntensity() {  
        return this.scene?.config?.directionalLight?.intensity ?? 1.5;  
    }  

    getAmbientLightIntensity() {  
        return this.scene?.config?.ambientLight?.intensity ?? 1.0;  
    }  
}  