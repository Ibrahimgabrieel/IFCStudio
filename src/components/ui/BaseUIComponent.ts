// components/ui/base/BaseUIComponent.js  
export class BaseUIComponent {  
    constructor(world) {  
        this.world = world;  
        this.element = null;  
    }  

    init() {  
        throw new Error('Init method must be implemented');  
    }  

    getElement() {  
        return this.element;  
    }  
}  