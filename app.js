// Shared Components and Utilities
class SharedComponents {
    // Common slider component
    static createSlider(config) {
        const { id, min, max, step, value, label, format } = config;
        return {
            element: document.getElementById(id),
            valueElement: document.getElementById(`${id}-value`),
            label,
            format: format || ((val) => val.toString()),
            range: { min, max, step, default: value }
        };
    }
    
    // Common button component
    static createButton(id, label, className = 'btn secondary') {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = label;
            element.className = className;
        }
        return element;
    }
    
    // Common control group wrapper
    static createControlGroup(controls) {
        return controls.map(control => {
            if (control.type === 'slider') {
                return this.createSlider(control);
            } else if (control.type === 'button') {
                return this.createButton(control.id, control.label, control.className);
            }
            return null;
        }).filter(Boolean);
    }
}

// Unified Configuration Manager
class ConfigurationManager {
    static simulationConfigs = {
        conway: {
            name: "Conway's Game of Life",
            controls: {
                speed: {
                    type: 'slider',
                    id: 'speed-slider',
                    min: 1,
                    max: 60,
                    step: 1,
                    value: 30,
                    label: 'Speed',
                    format: (value) => `${value} steps/s`
                },
                random: {
                    type: 'button',
                    id: 'random-btn',
                    label: 'Random'
                },
                learn: {
                    type: 'button',
                    id: 'learn-btn',
                    label: 'Learn'
                }
            },
            modal: {
                id: 'conway-modal',
                closeId: 'conway-modal-close'
            }
        },
        termite: {
            name: 'Termite Algorithm',
            controls: {
                speed: {
                    type: 'slider',
                    id: 'termite-speed-slider',
                    min: 1,
                    max: 60,
                    step: 1,
                    value: 30,
                    label: 'Speed',
                    format: (value) => `${value} steps/s`
                },
                termiteCount: {
                    type: 'slider',
                    id: 'termites-slider',
                    min: 10,
                    max: 100,
                    step: 1,
                    value: 50,
                    label: 'Termites',
                    format: (value) => value.toString()
                },
                random: {
                    type: 'button',
                    id: 'termite-random-btn',
                    label: 'Random'
                },
                learn: {
                    type: 'button',
                    id: 'termite-learn-btn',
                    label: 'Learn'
                }
            },
            modal: {
                id: 'termite-modal',
                closeId: 'termite-modal-close'
            }
        },
        langton: {
            name: "Langton's Ant",
            controls: {
                speed: {
                    type: 'slider',
                    id: 'langton-speed-slider',
                    min: 1,
                    max: 60,
                    step: 1,
                    value: 30,
                    label: 'Speed',
                    format: (value) => `${value} steps/s`
                },
                addAnt: {
                    type: 'button',
                    id: 'add-ant-btn',
                    label: 'Add Ant'
                },
                random: {
                    type: 'button',
                    id: 'langton-random-btn',
                    label: 'Random'
                },
                learn: {
                    type: 'button',
                    id: 'langton-learn-btn',
                    label: 'Learn'
                }
            },
            modal: {
                id: 'langton-modal',
                closeId: 'langton-modal-close'
            }
        }
    };
    
    static getConfig(simType) {
        return this.simulationConfigs[simType];
    }
    
    static getAllConfigs() {
        return this.simulationConfigs;
    }
}

// Unified Event Handler
class EventHandler {
    constructor(app) {
        this.app = app;
        this.handlers = new Map();
    }
    
    // Register event handlers for a simulation type
    registerSimulationHandlers(simType) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        const handlers = {
            speedChange: (value) => this.app.handleSpeedChange(simType, value),
            randomPattern: () => this.app.handleRandomPattern(simType),
            showLearnModal: () => this.app.showLearnModal(simType),
            addAnt: () => this.app.handleAddAnt(simType)
        };
        
        this.handlers.set(simType, handlers);
        this.setupControls(simType, handlers);
    }
    
    // Setup controls for a simulation type
    setupControls(simType, handlers) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        Object.entries(config.controls).forEach(([controlName, controlConfig]) => {
            if (controlConfig.type === 'slider') {
                this.setupSlider(controlConfig, handlers);
            } else if (controlConfig.type === 'button') {
                this.setupButton(controlConfig, handlers);
            }
        });
    }
    
    // Setup slider control
    setupSlider(config, handlers) {
        const slider = document.getElementById(config.id);
        const valueElement = document.getElementById(`${config.id}-value`);
        
        if (slider) {
            slider.addEventListener('input', (e) => {
                const value = config.format ? config.format(e.target.value) : e.target.value;
                if (valueElement) {
                    valueElement.textContent = value;
                }
                
                if (config.id.includes('speed')) {
                    handlers.speedChange(parseFloat(e.target.value));
                } else if (config.id.includes('termites')) {
                    this.app.handleTermiteCountChange(parseInt(e.target.value));
                }
            });
        }
    }
    
    // Setup button control
    setupButton(config, handlers) {
        const button = document.getElementById(config.id);
        
        if (button) {
            button.addEventListener('click', () => {
                if (config.id.includes('random')) {
                    handlers.randomPattern();
                } else if (config.id.includes('learn')) {
                    handlers.showLearnModal();
                } else if (config.id.includes('add-ant')) {
                    handlers.addAnt();
                }
            });
        }
    }
    
    // Register all simulation handlers
    registerAllHandlers() {
        Object.keys(ConfigurationManager.getAllConfigs()).forEach(simType => {
            this.registerSimulationHandlers(simType);
        });
    }
}

// Unified Control Manager
class ControlManager {
    constructor() {
        this.activeControls = null;
    }
    
    // Show controls for a specific simulation type
    showControls(simType) {
        // Hide all simulation controls
        this.hideAllControls();
        
        // Show controls for current simulation
        const controlsElement = document.getElementById(`${simType}-controls`);
        if (controlsElement) {
            controlsElement.style.display = 'flex';
            this.activeControls = simType;
        }
    }
    
    // Hide all simulation controls
    hideAllControls() {
        Object.keys(ConfigurationManager.getAllConfigs()).forEach(simType => {
            const controlsElement = document.getElementById(`${simType}-controls`);
            if (controlsElement) {
                controlsElement.style.display = 'none';
            }
        });
        this.activeControls = null;
    }
    
    // Update control values
    updateControlValues(simType, values) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        Object.entries(values).forEach(([controlName, value]) => {
            const controlConfig = config.controls[controlName];
            if (controlConfig && controlConfig.type === 'slider') {
                const slider = document.getElementById(controlConfig.id);
                const valueElement = document.getElementById(`${controlConfig.id}-value`);
                
                if (slider) {
                    slider.value = value;
                }
                if (valueElement && controlConfig.format) {
                    valueElement.textContent = controlConfig.format(value);
                }
            }
        });
    }
}

// Unified Keyboard Handler
class KeyboardHandler {
    constructor(app) {
        this.app = app;
        this.shortcuts = new Map();
        this.setupShortcuts();
    }
    
    setupShortcuts() {
        this.shortcuts.set(' ', () => this.app.toggleSimulation());
        this.shortcuts.set('r', (e) => {
            if (e.ctrlKey || e.metaKey) {
                this.app.resetSimulation();
            } else {
                this.app.resetBrightness();
            }
        });
        this.shortcuts.set('c', (e) => {
            if (e.ctrlKey || e.metaKey) {
                this.app.clearSimulation();
            }
        });
        this.shortcuts.set('i', (e) => {
            if (e.ctrlKey || e.metaKey) {
                this.app.toggleImmersiveMode();
            }
        });
        this.shortcuts.set('Escape', () => this.app.handleEscape());
        this.shortcuts.set(',', () => this.app.adjustSpeed(this.app.currentType, -1));
        this.shortcuts.set('.', () => this.app.adjustSpeed(this.app.currentType, 1));
        this.shortcuts.set('a', () => this.app.handleAddAnt(this.app.currentType));
        this.shortcuts.set('[', () => this.app.adjustBrightness(-0.1));
        this.shortcuts.set(']', () => this.app.adjustBrightness(0.1));
    }
    
    handleKeydown(e) {
        const handler = this.shortcuts.get(e.key);
        if (handler) {
            e.preventDefault();
            handler(e);
        }
    }
}

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

// Main application class
class AlgorithmicPatternGenerator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentSimulation = null;
        this.currentType = 'conway';
        this.isImmersive = false;
        this.brightness = 1.0; // Default brightness
        
        // Initialize managers
        this.modalManager = new ModalManager();
        this.controlManager = new ControlManager();
        this.eventHandler = new EventHandler(this);
        this.keyboardHandler = new KeyboardHandler(this);
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupModals();
        this.eventHandler.registerAllHandlers();
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
        Object.entries(ConfigurationManager.getAllConfigs()).forEach(([simType, config]) => {
            this.modalManager.register(config.modal.id, {
                onShow: () => {
                    console.log(`${simType} modal opened`);
                },
                onHide: () => {
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
        
        // Setup brightness controls
        this.setupBrightnessControls();
        
        // Canvas interactions
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.keyboardHandler.handleKeydown(e);
        });
    }
    
    setupBrightnessControls() {
        const brightnessSlider = document.getElementById('brightness-slider');
        const brightnessValue = document.getElementById('brightness-value');
        const brightnessResetBtn = document.getElementById('brightness-reset-btn');
        
        // Brightness slider
        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', (e) => {
                this.setBrightness(parseFloat(e.target.value));
            });
        }
        
        // Brightness reset button
        if (brightnessResetBtn) {
            brightnessResetBtn.addEventListener('click', () => {
                this.resetBrightness();
            });
        }
        
        // Initialize brightness display
        this.updateBrightnessDisplay();
    }
    
    createSimulation(type) {
        if (this.currentSimulation) {
            this.currentSimulation.pause();
        }
        
        this.currentType = type;
        this.currentSimulation = SimulationFactory.createSimulation(type, this.canvas, this.ctx);
        this.currentSimulation.init();
        
        // Set brightness on the new simulation
        if (this.currentSimulation.setBrightness) {
            this.currentSimulation.setBrightness(this.brightness);
        }
        
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
    
    toggleSimulation() {
        if (this.currentSimulation?.isRunning) {
            this.pauseSimulation();
        } else {
            this.startSimulation();
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
    
    handleEscape() {
        if (this.isImmersive) {
            this.toggleImmersiveMode();
        } else {
            // Close any open modal using modal manager
            this.modalManager.hideAll();
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
        this.controlManager.showControls(this.currentType);
    }
    
    // Generic speed change handler
    handleSpeedChange(simType, value) {
        if (this.currentType !== simType || !this.currentSimulation) return;
        
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        // Parse value as integer for all simulations (steps per second)
        const parsedValue = parseInt(value);
        
        // Set speed on simulation
        this.currentSimulation.setSpeed(parsedValue);
        
        // Update the display value
        const speedControl = config.controls.speed;
        if (speedControl) {
            const valueElement = document.getElementById(`${speedControl.id}-value`);
            if (valueElement && speedControl.format) {
                valueElement.textContent = speedControl.format(parsedValue);
            }
        }
    }
    
    // Generic speed adjustment handler
    adjustSpeed(simType, direction) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        const speedControl = config.controls.speed;
        if (!speedControl) return;
        
        const slider = document.getElementById(speedControl.id);
        if (!slider) return;
        
        const currentValue = parseFloat(slider.value);
        const step = speedControl.step;
        const newValue = Math.max(
            speedControl.min,
            Math.min(speedControl.max, currentValue + (direction * step))
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
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        this.modalManager.show(config.modal.id);
    }
    
    hideLearnModal(simType) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        this.modalManager.hide(config.modal.id);
    }
    
    // Generic add ant handler
    handleAddAnt(simType) {
        if (this.currentType !== simType || !this.currentSimulation) return;
        
        if (this.currentSimulation.addAnt) {
            this.currentSimulation.addAnt();
        }
    }
    
    // Generic termite count change handler
    handleTermiteCountChange(count) {
        if (this.currentType !== 'termite' || !this.currentSimulation) return;
        
        if (this.currentSimulation.setTermiteCount) {
            this.currentSimulation.setTermiteCount(count);
        }
        
        // Update the display value
        const config = ConfigurationManager.getConfig('termite');
        if (config) {
            const termiteControl = config.controls.termiteCount;
            if (termiteControl) {
                const valueElement = document.getElementById(`${termiteControl.id}-value`);
                if (valueElement && termiteControl.format) {
                    valueElement.textContent = termiteControl.format(count);
                }
            }
        }
    }
    
    // Brightness control methods
    setBrightness(value) {
        this.brightness = Math.max(0.1, Math.min(2.0, value));
        this.updateBrightnessDisplay();
        
        // Update current simulation if it exists
        if (this.currentSimulation && this.currentSimulation.setBrightness) {
            this.currentSimulation.setBrightness(this.brightness);
            // Force a redraw to show brightness changes immediately, even when paused
            this.currentSimulation.draw();
        }
    }
    
    resetBrightness() {
        this.setBrightness(1.0);
        
        // Update slider position
        const brightnessSlider = document.getElementById('brightness-slider');
        if (brightnessSlider) {
            brightnessSlider.value = 1.0;
        }
    }
    
    adjustBrightness(delta) {
        const brightnessSlider = document.getElementById('brightness-slider');
        if (brightnessSlider) {
            const currentValue = parseFloat(brightnessSlider.value);
            const newValue = Math.max(0.1, Math.min(2.0, currentValue + delta));
            brightnessSlider.value = newValue;
            this.setBrightness(newValue);
        }
    }
    
    updateBrightnessDisplay() {
        const brightnessValue = document.getElementById('brightness-value');
        if (brightnessValue) {
            const percentage = Math.round(this.brightness * 100);
            brightnessValue.textContent = `${percentage}%`;
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