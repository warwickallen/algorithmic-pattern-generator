// Modal Manager for handling all modals
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.modals = new Map();
        this.init();
    }
    
    init() {
        // Set up global modal event listeners
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.hide(this.activeModal);
            }
        });
        
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeModal && e.target.classList.contains('modal')) {
                this.hide(this.activeModal);
            }
        });
    }
    
    register(modalId, config = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.warn(`Modal with ID '${modalId}' not found`);
            return;
        }
        
        const modalConfig = {
            id: modalId,
            element: modal,
            closeBtn: modal.querySelector('.modal-close'),
            ...config
        };
        
        // Set up close button event listener
        if (modalConfig.closeBtn) {
            modalConfig.closeBtn.addEventListener('click', () => {
                this.hide(modalId);
            });
        }
        
        this.modals.set(modalId, modalConfig);
        return modalConfig;
    }
    
    show(modalId) {
        const modalConfig = this.modals.get(modalId);
        if (!modalConfig) {
            console.warn(`Modal '${modalId}' not registered`);
            return;
        }
        
        // Hide any currently active modal
        if (this.activeModal) {
            this.hide(this.activeModal);
        }
        
        modalConfig.element.classList.add('show');
        this.activeModal = modalId;
        
        // Trigger custom show callback
        if (modalConfig.onShow) {
            modalConfig.onShow();
        }
    }
    
    hide(modalId) {
        const modalConfig = this.modals.get(modalId);
        if (!modalConfig) {
            console.warn(`Modal '${modalId}' not registered`);
            return;
        }
        
        modalConfig.element.classList.remove('show');
        
        if (this.activeModal === modalId) {
            this.activeModal = null;
        }
        
        // Trigger custom hide callback
        if (modalConfig.onHide) {
            modalConfig.onHide();
        }
    }
    
    hideAll() {
        this.modals.forEach((config, id) => {
            this.hide(id);
        });
    }
    
    isVisible(modalId) {
        const modalConfig = this.modals.get(modalId);
        return modalConfig ? modalConfig.element.classList.contains('show') : false;
    }
}

// Configuration Factory for simulation configs
class SimulationConfigFactory {
    static createConfig(simType, overrides = {}) {
        const baseConfig = {
            controlsId: `${simType}-controls`,
            speedSliderId: `${simType}-speed-slider`,
            speedValueId: `${simType}-speed-value`,
            randomBtnId: `${simType}-random-btn`,
            learnBtnId: `${simType}-learn-btn`,
            modalId: `${simType}-modal`,
            modalCloseId: `${simType}-modal-close`
        };
        
        return { ...baseConfig, ...overrides };
    }
    
    static getSimulationConfigs() {
        return {
            conway: this.createConfig('conway', {
                speedSliderId: 'speed-slider',
                speedValueId: 'speed-value',
                randomBtnId: 'random-btn',
                learnBtnId: 'learn-btn',
                speedFormat: (value) => `${value} FPS`,
                speedRange: { min: 1, max: 60, step: 1, default: 30 }
            }),
            termite: this.createConfig('termite', {
                speedFormat: (value) => `${value}x`,
                speedRange: { min: 0.5, max: 3, step: 0.1, default: 1 },
                additionalControls: {
                    termiteCountSliderId: 'termites-slider',
                    termiteCountValueId: 'termites-value'
                }
            }),
            langton: this.createConfig('langton', {
                speedFormat: (value) => `${value} steps/s`,
                speedRange: { min: 1, max: 60, step: 1, default: 30 },
                additionalControls: {
                    addAntBtnId: 'add-ant-btn'
                }
            })
        };
    }
}

// Event Listener Factory for setting up simulation controls
class EventListenerFactory {
    static setupSimulationControls(config, handlers) {
        const elements = {
            speedSlider: document.getElementById(config.speedSliderId),
            randomBtn: document.getElementById(config.randomBtnId),
            learnBtn: document.getElementById(config.learnBtnId)
        };
        
        // Speed slider
        if (elements.speedSlider) {
            elements.speedSlider.addEventListener('input', handlers.speedChange);
        }
        
        // Random button
        if (elements.randomBtn) {
            elements.randomBtn.addEventListener('click', handlers.randomPattern);
        }
        
        // Learn button
        if (elements.learnBtn) {
            elements.learnBtn.addEventListener('click', handlers.showLearnModal);
        }
        
        // Additional controls
        if (config.additionalControls) {
            Object.entries(config.additionalControls).forEach(([controlType, elementId]) => {
                const element = document.getElementById(elementId);
                if (element) {
                    if (element.tagName === 'INPUT') {
                        element.addEventListener('input', (e) => {
                            handlers.additionalControl(controlType, e.target.value);
                        });
                    } else if (element.tagName === 'BUTTON') {
                        element.addEventListener('click', () => {
                            handlers.additionalControl(controlType);
                        });
                    }
                }
            });
        }
    }
}

// HTML Generator for dynamic HTML generation
class HTMLGenerator {
    static generateSimulationControls(config) {
        const speedRange = config.speedRange;
        const speedValue = config.speedFormat ? config.speedFormat(speedRange.default) : speedRange.default;
        
        let additionalControlsHTML = '';
        
        if (config.additionalControls) {
            Object.entries(config.additionalControls).forEach(([controlType, elementId]) => {
                if (controlType.includes('Slider')) {
                    const label = this.getControlLabel(controlType);
                    const range = this.getControlRange(controlType);
                    additionalControlsHTML += `
                        <div class="control-group">
                            <label for="${elementId}">${label}:</label>
                            <input type="range" id="${elementId}" min="${range.min}" max="${range.max}" 
                                   step="${range.step}" value="${range.default}" class="slider">
                            <span id="${config.additionalControls[controlType.replace('SliderId', 'ValueId')]}">${range.default}</span>
                        </div>
                    `;
                } else if (controlType.includes('Btn')) {
                    const label = this.getControlLabel(controlType);
                    additionalControlsHTML += `
                        <div class="control-group">
                            <button id="${elementId}" class="btn secondary">${label}</button>
                        </div>
                    `;
                }
            });
        }
        
        return `
            <div id="${config.controlsId}" class="simulation-controls" style="display: none;">
                <div class="control-group">
                    <label for="${config.speedSliderId}">Speed:</label>
                    <input type="range" id="${config.speedSliderId}" 
                           min="${speedRange.min}" max="${speedRange.max}" 
                           step="${speedRange.step}" value="${speedRange.default}" class="slider">
                    <span id="${config.speedValueId}">${speedValue}</span>
                </div>
                ${additionalControlsHTML}
                <div class="control-group">
                    <button id="${config.randomBtnId}" class="btn secondary">Random</button>
                    <button id="${config.learnBtnId}" class="btn secondary">Learn</button>
                </div>
            </div>
        `;
    }
    
    static getControlLabel(controlType) {
        const labelMap = {
            'termiteCountSliderId': 'Termites',
            'addAntBtnId': 'Add Ant'
        };
        return labelMap[controlType] || controlType;
    }
    
    static getControlRange(controlType) {
        const rangeMap = {
            'termiteCountSliderId': { min: 10, max: 100, step: 1, default: 50 }
        };
        return rangeMap[controlType] || { min: 0, max: 100, step: 1, default: 50 };
    }
    
    static generateModalContent(config, content) {
        return `
            <div id="${config.modalId}" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${content.title}</h2>
                        <button class="modal-close" id="${config.modalCloseId}">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content.body}
                    </div>
                </div>
            </div>
        `;
    }
}

// Main application class
class AlgorithmicPatternGenerator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentSimulation = null;
        this.currentType = 'conway';
        this.isImmersive = false;
        
        // Initialize modal manager
        this.modalManager = new ModalManager();
        
        // Get simulation configs from factory
        this.simulationConfigs = SimulationConfigFactory.getSimulationConfigs();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupModals();
        this.createSimulation(this.currentType);
        this.updateUI();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.currentSimulation) {
                this.currentSimulation.resize();
                this.currentSimulation.draw();
            }
        });
        
        // Start title fade animation after 5 seconds
        this.startTitleFade();
    }
    
    setupModals() {
        // Register all modals with the modal manager
        Object.entries(this.simulationConfigs).forEach(([simType, config]) => {
            this.modalManager.register(config.modalId, {
                onShow: () => {
                    // Add any simulation-specific modal show logic here
                    console.log(`${simType} modal opened`);
                },
                onHide: () => {
                    // Add any simulation-specific modal hide logic here
                    console.log(`${simType} modal closed`);
                }
            });
        });
    }
    
    setupEventListeners() {
        // Simulation selector
        document.getElementById('simulation-select').addEventListener('change', (e) => {
            this.switchSimulation(e.target.value);
        });
        
        // Control buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startSimulation();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.pauseSimulation();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSimulation();
        });
        
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearSimulation();
        });
        
        // Immersive mode toggle
        document.getElementById('immersive-btn').addEventListener('click', () => {
            this.toggleImmersiveMode();
        });
        
        // Setup simulation-specific controls
        this.setupSimulationControls();
        
        // Canvas interactions
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    setupSimulationControls() {
        // Setup controls for each simulation type using the factory
        Object.entries(this.simulationConfigs).forEach(([simType, config]) => {
            const handlers = {
                speedChange: (e) => this.handleSpeedChange(simType, e.target.value),
                randomPattern: () => this.handleRandomPattern(simType),
                showLearnModal: () => this.showLearnModal(simType),
                additionalControl: (controlType, value) => this.handleAdditionalControl(simType, controlType, value)
            };
            
            EventListenerFactory.setupSimulationControls(config, handlers);
        });
    }
    
    createSimulation(type) {
        if (this.currentSimulation) {
            this.currentSimulation.pause();
        }
        
        this.currentType = type;
        this.currentSimulation = SimulationFactory.createSimulation(type, this.canvas, this.ctx);
        this.currentSimulation.init();
        this.updateUI();
    }
    
    switchSimulation(type) {
        this.createSimulation(type);
    }
    
    startSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.start();
            this.updateUI();
        }
    }
    
    pauseSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.pause();
            this.updateUI();
        }
    }
    
    resetSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.reset();
            this.updateUI();
        }
    }
    
    clearSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.clear();
            this.updateUI();
        }
    }
    
    toggleImmersiveMode() {
        this.isImmersive = !this.isImmersive;
        document.getElementById('app').classList.toggle('immersive', this.isImmersive);
        
        const btn = document.getElementById('immersive-btn');
        if (this.isImmersive) {
            btn.textContent = 'Exit Immersive';
            this.showImmersiveHint();
        } else {
            btn.textContent = i18n.t('immersive-btn');
            this.hideImmersiveHint();
        }
        
        // Resize canvas when toggling immersive mode
        setTimeout(() => {
            if (this.currentSimulation) {
                this.currentSimulation.resize();
                this.currentSimulation.draw();
            }
        }, 300);
    }
    
    showImmersiveHint() {
        const hint = document.getElementById('immersive-hint');
        hint.classList.add('show');
        
        // Hide hint after 3 seconds
        setTimeout(() => {
            this.hideImmersiveHint();
        }, 3000);
    }
    
    hideImmersiveHint() {
        const hint = document.getElementById('immersive-hint');
        hint.classList.remove('show');
    }
    
    startTitleFade() {
        // Start fade animation after 5 seconds
        setTimeout(() => {
            const title = document.getElementById('title');
            title.classList.add('fade-out');
        }, 5000);
    }
    
    handleCanvasClick(e) {
        if (!this.currentSimulation) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Only allow cell toggling for Conway's Game of Life
        if (this.currentType === 'conway' && this.currentSimulation.toggleCell) {
            this.currentSimulation.toggleCell(x, y);
            this.updateUI();
        }
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (this.currentSimulation?.isRunning) {
                    this.pauseSimulation();
                } else {
                    this.startSimulation();
                }
                break;
            case 'r':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.resetSimulation();
                }
                break;
            case 'c':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.clearSimulation();
                }
                break;
            case 'i':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleImmersiveMode();
                }
                break;
            case 'Escape':
                if (this.isImmersive) {
                    this.toggleImmersiveMode();
                } else {
                    // Close any open modal using modal manager
                    this.modalManager.hideAll();
                }
                break;
            case ',':
                e.preventDefault();
                this.adjustSpeed(this.currentType, -1);
                break;
            case '.':
                e.preventDefault();
                this.adjustSpeed(this.currentType, 1);
                break;
            case 'a':
                if (this.currentType === 'langton' && this.currentSimulation?.addAnt) {
                    e.preventDefault();
                    this.currentSimulation.addAnt();
                }
                break;
        }
    }
    
    updateUI() {
        if (!this.currentSimulation) return;
        
        const stats = this.currentSimulation.getStats();
        const isRunning = this.currentSimulation.isRunning;
        
        // Update button states
        document.getElementById('start-btn').disabled = isRunning;
        document.getElementById('pause-btn').disabled = !isRunning;
        
        // Update stats
        document.getElementById('generation-count').textContent = stats.generation;
        document.getElementById('cell-count').textContent = stats.cellCount;
        document.getElementById('fps').textContent = stats.fps;
        
        // Update simulation selector
        document.getElementById('simulation-select').value = this.currentType;
        
        // Show/hide simulation-specific controls
        this.updateSimulationControls();
    }
    
    updateSimulationControls() {
        // Hide all simulation controls first
        Object.values(this.simulationConfigs).forEach(config => {
            const controlsElement = document.getElementById(config.controlsId);
            if (controlsElement) {
                controlsElement.style.display = 'none';
            }
        });
        
        // Show controls for current simulation
        const currentConfig = this.simulationConfigs[this.currentType];
        if (currentConfig) {
            const controlsElement = document.getElementById(currentConfig.controlsId);
            if (controlsElement) {
                controlsElement.style.display = 'flex';
            }
        }
    }
    
    // Generic speed change handler
    handleSpeedChange(simType, value) {
        if (this.currentType !== simType || !this.currentSimulation) return;
        
        const config = this.simulationConfigs[simType];
        if (!config) return;
        
        // Parse value based on simulation type
        const parsedValue = simType === 'conway' ? parseInt(value) : parseFloat(value);
        
        // Set speed on simulation
        this.currentSimulation.setSpeed(parsedValue);
        
        // Update display
        const valueElement = document.getElementById(config.speedValueId);
        if (valueElement) {
            valueElement.textContent = config.speedFormat(parsedValue);
        }
    }
    
    // Generic speed adjustment handler
    adjustSpeed(simType, direction) {
        const config = this.simulationConfigs[simType];
        if (!config) return;
        
        const slider = document.getElementById(config.speedSliderId);
        if (!slider) return;
        
        const currentValue = parseFloat(slider.value);
        const step = config.speedRange.step;
        const newValue = Math.max(
            config.speedRange.min,
            Math.min(config.speedRange.max, currentValue + (direction * step))
        );
        
        slider.value = newValue;
        this.handleSpeedChange(simType, newValue);
    }
    
    // Generic random pattern handler
    handleRandomPattern(simType) {
        if (this.currentType !== simType || !this.currentSimulation) return;
        
        if (this.currentSimulation.randomize) {
            this.currentSimulation.randomize();
            this.updateUI();
        }
    }
    
    // Generic modal handlers using modal manager
    showLearnModal(simType) {
        const config = this.simulationConfigs[simType];
        if (!config) return;
        
        this.modalManager.show(config.modalId);
    }
    
    hideLearnModal(simType) {
        const config = this.simulationConfigs[simType];
        if (!config) return;
        
        this.modalManager.hide(config.modalId);
    }
    
    // Generic additional control handler
    handleAdditionalControl(simType, controlType, value) {
        if (this.currentType !== simType || !this.currentSimulation) return;
        
        const config = this.simulationConfigs[simType];
        if (!config || !config.additionalControls) return;
        
        const valueElementId = config.additionalControls[controlType];
        if (!valueElementId) return;
        
        // Handle specific control types
        switch (controlType) {
            case 'termiteCountSliderId':
                if (this.currentSimulation.setTermiteCount) {
                    this.currentSimulation.setTermiteCount(parseInt(value));
                }
                break;
            case 'addAntBtnId':
                if (this.currentSimulation.addAnt) {
                    this.currentSimulation.addAnt();
                }
                break;
        }
        
        // Update display for slider controls
        if (value && valueElementId) {
            const valueElement = document.getElementById(valueElementId);
            if (valueElement) {
                valueElement.textContent = value;
            }
        }
    }
    
    // Update stats continuously
    startStatsUpdate() {
        setInterval(() => {
            this.updateUI();
        }, 100);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AlgorithmicPatternGenerator();
    app.startStatsUpdate();
    
    // Make app globally accessible for debugging
    window.app = app;
}); 