import * as BUI from "@thatopen/ui";

export class MenuButton {
    constructor(panel) {
        this.panel = panel;
        this.element = this.createButton();
        this.init();
    }

    createButton() {
        return BUI.Component.create(() => {
            return BUI.html`
                <bim-button 
                    class="phone-menu-toggler" 
                    icon="solar:settings-bold"
                    @click="${() => this.panel.toggleVisibility()}">
                </bim-button>
            `;
        });
    }

    init() {
        document.body.append(this.element);
    }
}