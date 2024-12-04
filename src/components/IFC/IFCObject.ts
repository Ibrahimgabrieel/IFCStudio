// IFCObject.ts
import { BaseObject } from './baseobject';
import * as THREE from "three";

export class IFCObject extends BaseObject {
    constructor(model: THREE.Object3D) {
        super();
        this.mesh = model; // Using this.mesh instead of this._mesh to match BaseObject
    }

    create() {
        // Since the model is already created, we can just return it
        return this.mesh;
    }

    // No need to override getMesh() as it's already implemented in BaseObject
}