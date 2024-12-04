import { IIfcConfiguration } from '../interfaces/IIfcConfiguration';

export class IfcConfiguration implements IIfcConfiguration {
    constructor(
        public excludedCategories: number[] = [],
        public coordinateToOrigin: boolean = true,
        public webIfcSettings: any = {}
    ) {}
}