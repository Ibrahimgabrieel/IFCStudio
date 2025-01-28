// services/classifications/ClassificationsManager.js  
import * as OBC from "@thatopen/components";
export class ClassificationsManager {  
    constructor(components) {  
        this.components = components;  
        this.classifier = components.get(OBC.Classifier);  
        this.classifications = [];  
    }  

    async classifyModel(model) {  
        this.classifier.byEntity(model);  
        await this.classifier.byPredefinedType(model);  
            
        this.classifications = [  
            { system: "entities", label: "Entities" },  
            { system: "predefinedTypes", label: "Predefined Types" }  
        ];  
        // console.log(this.classifications);
      
        return this.classifications;  
    }  

    getClassifications() {  
        return this.classifications;  
    }  
}  