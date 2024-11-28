import * as BUI from "@thatopen/ui";
import { Panel } from './Panel';
import { MenuButton } from './MobileButton';

export class UIManager {
    constructor(world) {
        this.world = world;
        this.init();
    }

    init() {
        // Initialize BUI
        BUI.Manager.init();

        // Create UI components
        this.panel = new Panel(this.world);
        this.menuButton = new MenuButton(this.panel);
    }
}