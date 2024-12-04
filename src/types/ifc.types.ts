// types/ifc.types.ts
import { Vector3Like } from './geometry.types';

export interface IFCModelConfig {
    id: string;
    url: string;
    name?: string;
    position?: Vector3Like;
    rotation?: Vector3Like;
    scale?: Vector3Like;
}

export interface IFCLoadOptions {
        excludedCategories?: number[];
        coordinateToOrigin?: boolean;
        webIfcSettings?: any;
    }