// Shared Components and Utilities
class SharedComponents {
    // Common slider component with performance optimization
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

// Performance optimization utilities
class PerformanceOptimizer {
    // Debounce function for slider updates
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for frequent updates
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Efficient DOM query caching
    static createElementCache() {
        const cache = new Map();
        return {
            get: (selector) => {
                if (!cache.has(selector)) {
                    cache.set(selector, document.querySelector(selector));
                }
                return cache.get(selector);
            },
            clear: () => cache.clear()
        };
    }
    
    // Memory-efficient event listener management
    static createEventListenerManager() {
        const listeners = new Map();
        return {
            add: (element, event, handler, options = {}) => {
                const key = `${element.id || 'anonymous'}-${event}`;
                if (listeners.has(key)) {
                    element.removeEventListener(event, listeners.get(key), options);
                }
                listeners.set(key, handler);
                element.addEventListener(event, handler, options);
            },
            remove: (element, event) => {
                const key = `${element.id || 'anonymous'}-${event}`;
                const handler = listeners.get(key);
                if (handler) {
                    element.removeEventListener(event, handler);
                    listeners.delete(key);
                }
            },
            clear: () => {
                listeners.clear();
            }
        };
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
                    valueElementId: 'speed-value',
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
                    valueElementId: 'termite-speed-value',
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
                    valueElementId: 'termites-value',
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
                    valueElementId: 'langton-speed-value',
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
        this.elementCache = PerformanceOptimizer.createElementCache();
        this.eventManager = PerformanceOptimizer.createEventListenerManager();
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
    
    // Setup slider control with performance optimization
    setupSlider(config, handlers) {
        const slider = this.elementCache.get(`#${config.id}`);
        const valueElement = this.elementCache.get(`#${config.valueElementId}`);
        
        if (slider) {
            // Debounced input handler for smooth performance
            const debouncedInputHandler = PerformanceOptimizer.debounce((e) => {
                const value = config.format ? config.format(e.target.value) : e.target.value;
                if (valueElement) {
                    valueElement.textContent = value;
                }
                
                if (config.id.includes('speed')) {
                    handlers.speedChange(parseFloat(e.target.value));
                } else if (config.id.includes('termites')) {
                    this.app.handleTermiteCountChange(parseInt(e.target.value));
                }
            }, 16); // ~60fps debounce
            
            // Immediate visual feedback for value display
            const immediateValueHandler = (e) => {
                const value = config.format ? config.format(e.target.value) : e.target.value;
                if (valueElement) {
                    valueElement.textContent = value;
                }
            };
            
            this.eventManager.add(slider, 'input', immediateValueHandler);
            this.eventManager.add(slider, 'change', debouncedInputHandler);
        }
    }
    
    // Setup button control
    setupButton(config, handlers) {
        const button = this.elementCache.get(`#${config.id}`);
        
        if (button) {
            this.eventManager.add(button, 'click', () => {
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
    
    // Cleanup method for memory management
    cleanup() {
        this.eventManager.clear();
        this.elementCache.clear();
        this.handlers.clear();
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
        
        // Show termites container for termite simulation
        const termitesContainer = document.getElementById('termites-container');
        if (termitesContainer) {
            termitesContainer.style.display = simType === 'termite' ? 'block' : 'none';
            // Reposition elements when termites container visibility changes
            if (window.layoutManager) {
                setTimeout(() => window.layoutManager.repositionElements(), 0);
            }
        }
        
        // Show/hide action buttons based on simulation type
        this.showActionButtons(simType);
    }
    
    // Hide all simulation controls
    hideAllControls() {
        Object.keys(ConfigurationManager.getAllConfigs()).forEach(simType => {
            const controlsElement = document.getElementById(`${simType}-controls`);
            if (controlsElement) {
                controlsElement.style.display = 'none';
            }
        });
        
        // Hide termites container
        const termitesContainer = document.getElementById('termites-container');
        if (termitesContainer) {
            termitesContainer.style.display = 'none';
        }
        
        this.activeControls = null;
    }
    
    // Show/hide action buttons based on simulation type
    showActionButtons(simType) {
        // Hide all action buttons first
        const actionButtons = [
            'random-btn',
            'termite-random-btn', 
            'langton-random-btn',
            'add-ant-btn'
        ];
        
        actionButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.style.display = 'none';
            }
        });
        
        // Show buttons for current simulation
        const config = ConfigurationManager.getConfig(simType);
        if (config) {
            Object.entries(config.controls).forEach(([controlName, controlConfig]) => {
                if (controlConfig.type === 'button' && controlConfig.id) {
                    const button = document.getElementById(controlConfig.id);
                    if (button) {
                        button.style.display = 'inline-block';
                    }
                }
            });
        }
    }
    
    // Update control values
    updateControlValues(simType, values) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        Object.entries(values).forEach(([controlName, value]) => {
            const controlConfig = config.controls[controlName];
            if (controlConfig && controlConfig.type === 'slider') {
                const slider = document.getElementById(controlConfig.id);
                const valueElement = document.getElementById(controlConfig.valueElementId);
                
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

// Modal Manager for handling all modals with performance optimization
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.modals = new Map();
        this.elementCache = PerformanceOptimizer.createElementCache();
        this.renderQueue = new Set();
        this.isRendering = false;
        this.init();
    }
    
    init() {
        // Set up global modal event listeners with throttling
        const throttledKeydown = PerformanceOptimizer.throttle((e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.hide(this.activeModal);
            }
        }, 100);
        
        const throttledClick = PerformanceOptimizer.throttle((e) => {
            if (this.activeModal && e.target.classList.contains('modal')) {
                this.hide(this.activeModal);
            }
        }, 100);
        
        document.addEventListener('keydown', throttledKeydown);
        document.addEventListener('click', throttledClick);
    }
    
    register(modalId, config = {}) {
        const modal = this.elementCache.get(`#${modalId}`);
        if (!modal) {
            console.warn(`Modal with ID '${modalId}' not found`);
            return;
        }
        
        const modalConfig = {
            id: modalId,
            element: modal,
            closeBtn: modal.querySelector('.modal-close'),
            isVisible: false,
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
        
        // Queue modal for rendering to prevent layout thrashing
        this.queueModalRender(modalConfig, true);
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
        
        // Queue modal for hiding
        this.queueModalRender(modalConfig, false);
        
        if (this.activeModal === modalId) {
            this.activeModal = null;
        }
        
        // Trigger custom hide callback
        if (modalConfig.onHide) {
            modalConfig.onHide();
        }
    }
    
    // Queue modal rendering to prevent layout thrashing
    queueModalRender(modalConfig, show) {
        this.renderQueue.add({ modalConfig, show });
        
        if (!this.isRendering) {
            this.processRenderQueue();
        }
    }
    
    // Process render queue efficiently
    processRenderQueue() {
        this.isRendering = true;
        
        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            this.renderQueue.forEach(({ modalConfig, show }) => {
                if (show) {
                    modalConfig.element.classList.add('show');
                    modalConfig.isVisible = true;
                } else {
                    modalConfig.element.classList.remove('show');
                    modalConfig.isVisible = false;
                }
            });
            
            this.renderQueue.clear();
            this.isRendering = false;
        });
    }
    
    hideAll() {
        this.modals.forEach((config, id) => {
            this.hide(id);
        });
    }
    
    isVisible(modalId) {
        const modalConfig = this.modals.get(modalId);
        return modalConfig ? modalConfig.isVisible : false;
    }
    
    // Cleanup method for memory management
    cleanup() {
        this.modals.clear();
        this.renderQueue.clear();
        this.elementCache.clear();
        this.activeModal = null;
    }
}

// Main application class with performance optimization
class AlgorithmicPatternGenerator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentSimulation = null;
        this.currentType = 'conway';
        this.isImmersive = false;
        this.brightness = 1.0; // Default brightness
        
        // Performance optimization properties
        this.elementCache = PerformanceOptimizer.createElementCache();
        this.updateQueue = new Set();
        this.isUpdating = false;
        this.lastUIUpdate = 0;
        this.uiUpdateThrottle = 100; // ms between UI updates
        
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
        
        // Handle window resize with throttling
        const throttledResize = PerformanceOptimizer.throttle(() => {
            if (this.currentSimulation) {
                this.currentSimulation.resizePreserveState();
                this.currentSimulation.draw();
            }
        }, 250);
        
        window.addEventListener('resize', throttledResize);
        
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
        const simulationSelect = this.elementCache.get('#simulation-select');
        if (simulationSelect) {
            simulationSelect.addEventListener('change', (e) => {
                this.switchSimulation(e.target.value);
            });
        }
        
        // Control buttons with element caching
        const startPauseBtn = this.elementCache.get('#start-pause-btn');
        const resetBtn = this.elementCache.get('#reset-btn');
        const clearBtn = this.elementCache.get('#clear-btn');
        const immersiveBtn = this.elementCache.get('#immersive-btn');
        
        if (startPauseBtn) {
            startPauseBtn.addEventListener('click', () => this.toggleSimulation());
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetSimulation());
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSimulation());
        }
        if (immersiveBtn) {
            immersiveBtn.addEventListener('click', () => this.toggleImmersiveMode());
        }
        
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
        const brightnessSlider = this.elementCache.get('#brightness-slider');
        const brightnessValue = this.elementCache.get('#brightness-value');
        
        // Brightness slider with debounced updates
        if (brightnessSlider) {
            const debouncedBrightnessHandler = PerformanceOptimizer.debounce((e) => {
                this.setBrightness(parseFloat(e.target.value));
            }, 16); // ~60fps debounce
            
            const immediateValueHandler = (e) => {
                const value = parseFloat(e.target.value);
                const percentage = Math.round(value * 100);
                if (brightnessValue) {
                    brightnessValue.textContent = `${percentage}%`;
                }
            };
            
            brightnessSlider.addEventListener('input', immediateValueHandler);
            brightnessSlider.addEventListener('change', debouncedBrightnessHandler);
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
        const appElement = this.elementCache.get('#app');
        if (appElement) {
            appElement.classList.toggle('immersive', this.isImmersive);
        }
        
        const btn = this.elementCache.get('#immersive-btn');
        if (this.isImmersive) {
            if (btn) btn.textContent = 'Exit Immersive';
            this.showImmersiveHint();
        } else {
            if (btn) btn.textContent = i18n.t('immersive-btn');
            this.hideImmersiveHint();
        }
        
        // Resize canvas when toggling immersive mode with delay
        setTimeout(() => {
            if (this.currentSimulation) {
                this.currentSimulation.resizePreserveState();
                this.currentSimulation.draw();
            }
        }, 300);
    }
    
    showImmersiveHint() {
        const hint = this.elementCache.get('#immersive-hint');
        if (hint) {
            hint.classList.add('show');
            
            // Hide hint after 3 seconds
            setTimeout(() => {
                this.hideImmersiveHint();
            }, 3000);
        }
    }
    
    hideImmersiveHint() {
        const hint = this.elementCache.get('#immersive-hint');
        if (hint) {
            hint.classList.remove('show');
        }
    }
    
    startTitleFade() {
        // Start fade animation after 5 seconds
        setTimeout(() => {
            const title = this.elementCache.get('#title');
            if (title) {
                title.classList.add('fade-out');
            }
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
    
    // Throttled UI update for better performance
    updateUI() {
        const now = Date.now();
        if (now - this.lastUIUpdate < this.uiUpdateThrottle) {
            this.updateQueue.add('ui');
            if (!this.isUpdating) {
                this.processUpdateQueue();
            }
            return;
        }
        
        this.performUIUpdate();
        this.lastUIUpdate = now;
    }
    
    performUIUpdate() {
        if (!this.currentSimulation) return;
        
        const stats = this.currentSimulation.getStats();
        const isRunning = this.currentSimulation.isRunning;
        
        // Update button states
        const startPauseBtn = this.elementCache.get('#start-pause-btn');
        
        if (startPauseBtn) {
            startPauseBtn.textContent = isRunning ? 'Pause' : 'Start';
            startPauseBtn.disabled = false;
        }
        
        // Update stats
        const generationCount = this.elementCache.get('#generation-count');
        const cellCount = this.elementCache.get('#cell-count');
        const fps = this.elementCache.get('#fps');
        
        if (generationCount) generationCount.textContent = stats.generation;
        if (cellCount) cellCount.textContent = stats.cellCount;
        if (fps) fps.textContent = stats.fps;
        
        // Update simulation selector
        const simulationSelect = this.elementCache.get('#simulation-select');
        if (simulationSelect) simulationSelect.value = this.currentType;
        
        // Show/hide simulation-specific controls
        this.controlManager.showControls(this.currentType);
    }
    
    processUpdateQueue() {
        this.isUpdating = true;
        
        requestAnimationFrame(() => {
            if (this.updateQueue.has('ui')) {
                this.performUIUpdate();
                this.updateQueue.delete('ui');
            }
            
            this.isUpdating = false;
            
            // Process any remaining updates
            if (this.updateQueue.size > 0) {
                this.processUpdateQueue();
            }
        });
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
            const valueElement = this.elementCache.get(`#${speedControl.valueElementId}`);
            if (valueElement && speedControl.format) {
                const formattedValue = speedControl.format(parsedValue);
                valueElement.textContent = formattedValue;
            }
        }
    }
    
    // Generic speed adjustment handler
    adjustSpeed(simType, direction) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        const speedControl = config.controls.speed;
        if (!speedControl) return;
        
        const slider = this.elementCache.get(`#${speedControl.id}`);
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
                const valueElement = this.elementCache.get(`#${termiteControl.valueElementId}`);
                if (valueElement && termiteControl.format) {
                    valueElement.textContent = termiteControl.format(count);
                }
            }
        }
        
        // Force a redraw to show termite count changes immediately, even when paused
        if (this.currentSimulation.draw) {
            this.currentSimulation.draw();
        }
    }
    
    // Brightness control methods with performance optimization
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
        const brightnessSlider = this.elementCache.get('#brightness-slider');
        if (brightnessSlider) {
            brightnessSlider.value = 1.0;
        }
    }
    
    adjustBrightness(delta) {
        const brightnessSlider = this.elementCache.get('#brightness-slider');
        if (brightnessSlider) {
            const currentValue = parseFloat(brightnessSlider.value);
            const newValue = Math.max(0.1, Math.min(2.0, currentValue + delta));
            brightnessSlider.value = newValue;
            this.setBrightness(newValue);
        }
    }
    
    updateBrightnessDisplay() {
        const brightnessValue = this.elementCache.get('#brightness-value');
        if (brightnessValue) {
            const percentage = Math.round(this.brightness * 100);
            brightnessValue.textContent = `${percentage}%`;
        }
    }
    
    // Update stats continuously with throttling
    startStatsUpdate() {
        const throttledUpdate = PerformanceOptimizer.throttle(() => {
            this.updateUI();
        }, 100);
        
        setInterval(throttledUpdate, 100);
    }
    
    // Cleanup method for memory management
    cleanup() {
        this.eventHandler.cleanup();
        this.modalManager.cleanup();
        this.elementCache.clear();
        this.updateQueue.clear();
        
        if (this.currentSimulation) {
            this.currentSimulation.pause();
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AlgorithmicPatternGenerator();
    app.startStatsUpdate();
    
    // Make app globally accessible for debugging
    window.app = app;
    
    // Performance monitoring
    PerformanceOptimizer.startMonitoring();
});

// Performance monitoring utility
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: [],
            memory: [],
            renderTime: [],
            updateTime: []
        };
        this.isMonitoring = false;
        this.maxSamples = 100;
    }
    
    start() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.monitorFPS();
        this.monitorMemory();
        
        console.log('Performance monitoring started');
    }
    
    stop() {
        this.isMonitoring = false;
        console.log('Performance monitoring stopped');
    }
    
    monitorFPS() {
        if (!this.isMonitoring) return;
        
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                this.addMetric('fps', fps);
                
                frameCount = 0;
                lastTime = currentTime;
            }
            
            if (this.isMonitoring) {
                requestAnimationFrame(measureFPS);
            }
        };
        
        requestAnimationFrame(measureFPS);
    }
    
    monitorMemory() {
        if (!this.isMonitoring) return;
        
        const measureMemory = () => {
            if (performance.memory) {
                const usedMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
                this.addMetric('memory', usedMB);
            }
            
            if (this.isMonitoring) {
                setTimeout(measureMemory, 2000); // Check every 2 seconds
            }
        };
        
        measureMemory();
    }
    
    addMetric(type, value) {
        if (!this.metrics[type]) return;
        
        this.metrics[type].push({
            value,
            timestamp: Date.now()
        });
        
        // Keep only recent samples
        if (this.metrics[type].length > this.maxSamples) {
            this.metrics[type].shift();
        }
    }
    
    getAverageMetric(type) {
        if (!this.metrics[type] || this.metrics[type].length === 0) return 0;
        
        const values = this.metrics[type].map(m => m.value);
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    
    getMetrics() {
        return {
            averageFPS: this.getAverageMetric('fps'),
            averageMemory: this.getAverageMetric('memory'),
            samples: this.metrics
        };
    }
    
    logMetrics() {
        const metrics = this.getMetrics();
        console.log('Performance Metrics:', {
            'Average FPS': Math.round(metrics.averageFPS),
            'Average Memory (MB)': Math.round(metrics.averageMemory),
            'Sample Count': Object.keys(metrics.samples).map(key => ({
                [key]: metrics.samples[key].length
            }))
        });
    }
}

// Extend PerformanceOptimizer with monitoring
PerformanceOptimizer.monitor = new PerformanceMonitor();

PerformanceOptimizer.startMonitoring = () => {
    PerformanceOptimizer.monitor.start();
    
    // Log metrics every 10 seconds
    setInterval(() => {
        PerformanceOptimizer.monitor.logMetrics();
    }, 10000);
};

PerformanceOptimizer.stopMonitoring = () => {
    PerformanceOptimizer.monitor.stop();
}; 