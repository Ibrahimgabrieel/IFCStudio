// src/components/controls/IFCControls.js
export class IFCControls {
    constructor(viewer) {
        this.viewer = viewer;
        this.setupControls();
    }

    setupControls() {
        console.log("setup Control")
        // Create controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'ifc-controls';
        document.body.appendChild(controlsContainer);

        // Add file input
        this.createFileInput(controlsContainer);
        
        // Add buttons
        this.createButton(controlsContainer, 'Reset View', () => this.viewer.resetView());
        this.createButton(controlsContainer, 'Toggle Wireframe', () => this.viewer.toggleWireframe());
        this.createButton(controlsContainer, 'Toggle Edges', () => this.viewer.toggleEdges());
    }

    createFileInput(container) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.ifc';
        fileInput.className = 'ifc-file-input';
        
        const fileLabel = document.createElement('label');
        fileLabel.className = 'ifc-file-label';
        fileLabel.innerHTML = 'Load IFC File';
        fileLabel.appendChild(fileInput);
        
        container.appendChild(fileLabel);

        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                await this.viewer.loadIFC(file);
            }
        });
    }

    createButton(container, text, onClick) {
        const button = document.createElement('button');
        button.className = 'ifc-button';
        button.textContent = text;
        button.addEventListener('click', onClick);
        container.appendChild(button);
    }
}