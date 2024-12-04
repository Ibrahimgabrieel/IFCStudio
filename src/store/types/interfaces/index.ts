import { IIFCObject } from "@/components/IFC/interfaces/IFCObject.interface";

export interface IFCState {
        loadedModels: Map<string, IIFCObject>;
        activeModelId: string | null;
        isLoading: boolean;
        error: string | null;
    }