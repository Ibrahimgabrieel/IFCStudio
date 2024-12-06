// config/PanelConfig.js  
export class PanelConfig {  
    static get DEFAULT_BACKGROUND_COLOR() { return "#202932"; }  
    static get DEFAULT_DIRECTIONAL_LIGHT_INTENSITY() { return 1.5; }  
    static get DEFAULT_AMBIENT_LIGHT_INTENSITY() { return 1.0; }  

    static get LIGHT_INTENSITY_LIMITS() {  
        return {  
            directional: { min: 0.1, max: 10, step: 0.1 },  
            ambient: { min: 0.1, max: 5, step: 0.1 }  
        };  
    }  
}  