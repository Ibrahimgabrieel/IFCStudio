import * as THREE from "three";

export class BaseObject {
    constructor() {
        this.mesh = null;
    }

    create() {
        // To be implemented by child classes
        throw new Error("Create method must be implemented");
    }

    getMesh() {
        return this.mesh;
    }

    setPosition(x, y, z) {
        if (this.mesh) {
            this.mesh.position.set(x, y, z);
        }
    }

    setRotation(x, y, z) {
        if (this.mesh) {
            this.mesh.rotation.set(x, y, z);
        }
    }

    setScale(x, y, z) {
        if (this.mesh) {
            this.mesh.scale.set(x, y, z);
        }
    }
}