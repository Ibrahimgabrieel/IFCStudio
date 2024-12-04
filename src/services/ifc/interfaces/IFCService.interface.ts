import { IIFCObject } from "@/components/IFC/interfaces/IFCObject.interface";
import { IFCModelConfig } from "@/types/ifc.types";

export interface IIFCService {
        initialize(): Promise<void>;
        loadModel(config: IFCModelConfig): Promise<IIFCObject>;
        unloadModel(modelId: string): void;
        getModel(modelId: string): IIFCObject | undefined;
        getAllModels(): IIFCObject[];
        exportModel(modelId: string): Promise<void>;
    }