// services/model/ModelManager.ts  
import * as OBC from "@thatopen/components";  

export class ModelManager {  
    private components: any;  
    private fragmentsManager: any;  

    constructor(components: any) {  
        this.components = components;  
        this.fragmentsManager = components.get(OBC.FragmentsManager);  
    }  

    async processModel(model: any) {  
        try {  
            // Add to fragments manager  
            await this.fragmentsManager.add(model);  

            // Return processed model  
            return model;  
        } catch (error) {  
            console.error('Error processing model:', error);  
            throw error;  
        }  
    }  

    async loadModel(url: string, onProgress?: (progress: number) => void) {  
        const ifcLoader = this.components.get(OBC.IfcLoader);  

        try {  
            const model = await ifcLoader.load(url, onProgress);  
            return await this.processModel(model);  
        } catch (error) {  
            console.error('Error loading model:', error);  
            throw error;  
        }  
    }  
}  