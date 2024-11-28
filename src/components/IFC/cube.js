import * as THREE from "three";
import { BaseObject } from "./baseobject";

export class Cube extends BaseObject {
    constructor(options = {}) {
        super();
        this.options = {
            color: "#6528D7",
            size: 1,
            ...options
        };
        this.create();
    }

    create() {
        const geometry = new THREE.BoxGeometry(
            this.options.size,
            this.options.size,
            this.options.size
        );
        const material = new THREE.MeshLambertMaterial({ 
            color: this.options.color 
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}