// services/scene/SceneManager.js  
export class SceneManager {  
    constructor(scene) {  
        this.scene = scene;  
    }  

    setBackgroundColor(color) {  
        if (this.scene && this.scene.config) {  
            this.scene.config.backgroundColor = new THREE.Color(color);  
        }  
    }  

    getBackgroundColor() {  
        return this.scene?.config?.backgroundColor ?? new THREE.Color("#202932");  
    }  
}  