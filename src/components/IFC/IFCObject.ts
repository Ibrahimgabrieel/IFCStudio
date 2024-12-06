// IFCObject.ts
import { BaseObject } from './baseobject';
import * as THREE from "three";

export class IFCObject extends BaseObject {
    constructor(model: THREE.Object3D) {
        super();
        this.mesh = model; 
    }
    create() {
        return this.mesh;
    }
}