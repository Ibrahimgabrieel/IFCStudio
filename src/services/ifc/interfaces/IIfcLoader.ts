import { Object3D } from 'three';

export interface IIfcLoader {
    load(url: string, onProgress?: (progress: number) => void): Promise<Object3D>;
    setup(): Promise<void>;
    dispose(): void;
}