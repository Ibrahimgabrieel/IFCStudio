import * as WEBIFC from "web-ifc";
import * as OBC from "@thatopen/components";
import { BaseObject } from "../../components/IFC/baseobject";
import { ProgressTracker } from "./managers/FragmentManager";
import { IIfcLoader } from "./interfaces/IIfcLoader";
import { IIfcConfiguration } from "./interfaces/IIfcConfiguration";
import { IFragmentManager } from "./interfaces/IFragmentManager";

export class IfcLoader implements IIfcLoader {
        private isLoading: boolean = false;
    
        constructor(
            private fragmentIfcLoader: OBC.IfcLoader,
            private configuration: IIfcConfiguration,
            private fragmentManager: IFragmentManager
        ) {}
    
        async setup(): Promise<void> {
            await this.fragmentIfcLoader.setup();
    
            this.configuration.excludedCategories.forEach(cat => 
                this.fragmentIfcLoader.settings.excludedCategories.add(cat)
            );
    
            this.fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = 
                this.configuration.coordinateToOrigin;
        }
    
        async load(
            url: string, 
            onProgress?: (progress: number) => void
        ): Promise<THREE.Object3D> {
            if (this.isLoading) {
                throw new Error('Already loading an IFC model');
            }
    
            const progressTracker = new ProgressTracker(onProgress);
            this.isLoading = true;
    
            try {
                const buffer = await this.fetchModelData(url, progressTracker);
                const mesh = await this.fragmentIfcLoader.load(buffer);
                mesh.name = "ifc_model";
                return mesh;
            } finally {
                this.isLoading = false;
            }
        }
    
        private async fetchModelData(
            url: string, 
            progressTracker: ProgressTracker
        ): Promise<Uint8Array> {
            const response = await fetch(url);
            const contentLength = Number(response.headers.get('content-length'));
            const reader = response.body!.getReader();
            const chunks: Uint8Array[] = [];
            let loaded = 0;
    
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
    
                chunks.push(value);
                loaded += value.length;
                progressTracker.updateProgress(loaded, contentLength);
            }
    
            return this.concatenateChunks(chunks, loaded);
        }
    
        private concatenateChunks(chunks: Uint8Array[], totalLength: number): Uint8Array {
            const buffer = new Uint8Array(totalLength);
            let position = 0;
            for (const chunk of chunks) {
                buffer.set(chunk, position);
                position += chunk.length;
            }
            return buffer;
        }
    
        dispose(): void {
            this.fragmentManager.dispose();
        }
    }
    