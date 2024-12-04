import { IFragmentManager } from '../interfaces/IFragmentManager';
import { IFileDownloader } from '../interfaces/IFileDownloader';
import * as OBC from "@thatopen/components";

export class FragmentManager implements IFragmentManager {
        constructor(
            private fragments: OBC.FragmentsManager,
            private fileDownloader: IFileDownloader
        ) {}
    
        export(): void {
            if (!this.fragments.groups.size) return;
    
            const group = Array.from(this.fragments.groups.values())[0];
            const data = this.fragments.export(group);
            this.fileDownloader.download(
                new File([new Blob([data])], "model.frag")
            );
    
            const properties = group.getLocalProperties();
            if (properties) {
                this.fileDownloader.download(
                    new File([JSON.stringify(properties)], "model.json")
                );
            }
        }
    
        dispose(): void {
            this.fragments.dispose();
        }
    }

    export class ProgressTracker {
            private progress: number = 0;
        
            constructor(private onProgress?: (progress: number) => void) {}
        
            updateProgress(loaded: number, total: number): void {
                this.progress = (loaded / total) * 100;
                if (this.onProgress) {
                    this.onProgress(this.progress);
                }
            }
        
            getProgress(): number {
                return this.progress;
            }
        }