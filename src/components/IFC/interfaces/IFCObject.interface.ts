export interface IIFCObject {
        mesh: THREE.Object3D | null;
        properties: Map<string, any>;
        create(): void;
        dispose(): void;
        setProperties(props: Map<string, any>): void;
        getProperties(): Map<string, any>;
    }