import { IIfcLoader } from '../interfaces/IIfcLoader';
import { IfcLoader } from '../IFCLoader';
import { IfcConfiguration } from '../config/IfcConfiguration';
import { FileDownloader } from '../utils/FileDownloader';
import { FragmentManager } from '../managers/FragmentManager';
import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

// IfcLoaderFactory.ts
export class IfcLoaderFactory {
    static create(components: OBC.Components): IIfcLoader {
        const fragmentIfcLoader = components.get(OBC.IfcLoader);
        const fragments = components.get(OBC.FragmentsManager);

        if (!fragmentIfcLoader || !fragments) {
            throw new Error("Required components not found in components");
        }

        const configuration = new IfcConfiguration(
            [WEBIFC.IFCTENDONANCHOR, WEBIFC.IFCREINFORCINGBAR],
            true,
            { OPTIMIZE_PROFILES: true }
        );

        const fileDownloader = new FileDownloader();
        const fragmentManager = new FragmentManager(fragments, fileDownloader);

        return new IfcLoader(fragmentIfcLoader, configuration, fragmentManager);
    }
}

