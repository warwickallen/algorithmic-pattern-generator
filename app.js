// UI Component Library (R3 Implementation)
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

// Enhanced UI Component Library with lifecycle management
class UIComponentLibrary {
    constructor() {
        this.components = new Map();
        this.lifecycleHooks = new Map();
    }
    
    // Create a standardized slider component
    createSlider(config) {
        const component = {
            type: 'slider',
            id: config.id,
            element: document.getElementById(config.id),
            valueElement: document.getElementById(config.valueElementId),
            config: config,
            state: {
                value: config.value || config.min,
                isEnabled: true
            },
            methods: {
                setValue: (value) => this.setSliderValue(component, value),
                enable: () => this.enableComponent(component),
                disable: () => this.disableComponent(component),
                update: (newConfig) => this.updateSlider(component, newConfig)
            }
        };
        
        this.components.set(config.id, component);
        this.initializeComponent(component);
        return component;
    }
    
    // Create a standardized button component
    createButton(config) {
        const component = {
            type: 'button',
            id: config.id,
            element: document.getElementById(config.id),
            config: config,
            state: {
                isEnabled: true,
                isPressed: false
            },
            methods: {
                setText: (text) => this.setButtonText(component, text),
                enable: () => this.enableComponent(component),
                disable: () => this.disableComponent(component),
                press: () => this.pressButton(component),
                release: () => this.releaseButton(component)
            }
        };
        
        this.components.set(config.id, component);
        this.initializeComponent(component);
        return component;
    }
    
    // Create a control group component
    createControlGroup(groupId, controls) {
        const component = {
            type: 'controlGroup',
            id: groupId,
            element: document.getElementById(groupId),
            controls: controls,
            state: {
                isVisible: true,
                isEnabled: true
            },
            methods: {
                show: () => this.showControlGroup(component),
                hide: () => this.hideControlGroup(component),
                enable: () => this.enableComponent(component),
                disable: () => this.disableComponent(component),
                updateControls: (newControls) => this.updateControlGroup(component, newControls)
            }
        };
        
        this.components.set(groupId, component);
        this.initializeComponent(component);
        return component;
    }
    
    // Component lifecycle management
    initializeComponent(component) {
        if (component.type === 'slider') {
            this.initializeSlider(component);
        } else if (component.type === 'button') {
            this.initializeButton(component);
        } else if (component.type === 'controlGroup') {
            this.initializeControlGroup(component);
        }
        
        // Register lifecycle hooks
        this.registerLifecycleHooks(component);
    }
    
    initializeSlider(component) {
        if (component.element) {
            component.element.min = component.config.min;
            component.element.max = component.config.max;
            component.element.step = component.config.step;
            component.element.value = component.state.value;
            
            if (component.valueElement) {
                component.valueElement.textContent = component.config.format(component.state.value);
            }
        }
    }
    
    initializeButton(component) {
        if (component.element) {
            component.element.textContent = component.config.label;
            component.element.className = component.config.className || 'btn secondary';
        }
    }
    
    initializeControlGroup(component) {
        if (component.element) {
            component.element.style.display = component.state.isVisible ? 'flex' : 'none';
        }
    }
    
    // Component state management
    setSliderValue(component, value) {
        if (component.element) {
            component.state.value = value;
            component.element.value = value;
            
            if (component.valueElement) {
                component.valueElement.textContent = component.config.format(value);
            }
        }
    }
    
    setButtonText(component, text) {
        if (component.element) {
            component.element.textContent = text;
        }
    }
    
    enableComponent(component) {
        component.state.isEnabled = true;
        if (component.element) {
            component.element.disabled = false;
        }
    }
    
    disableComponent(component) {
        component.state.isEnabled = false;
        if (component.element) {
            component.element.disabled = true;
        }
    }
    
    showControlGroup(component) {
        component.state.isVisible = true;
        if (component.element) {
            component.element.style.display = 'flex';
        }
    }
    
    hideControlGroup(component) {
        component.state.isVisible = false;
        if (component.element) {
            component.element.style.display = 'none';
        }
    }
    
    pressButton(component) {
        component.state.isPressed = true;
        if (component.element) {
            component.element.classList.add('pressed');
        }
    }
    
    releaseButton(component) {
        component.state.isPressed = false;
        if (component.element) {
            component.element.classList.remove('pressed');
        }
    }
    
    // Lifecycle hook management
    registerLifecycleHooks(component) {
        const hooks = {
            onMount: () => console.log(`Component ${component.id} mounted`),
            onUnmount: () => console.log(`Component ${component.id} unmounted`),
            onUpdate: () => console.log(`Component ${component.id} updated`)
        };
        
        this.lifecycleHooks.set(component.id, hooks);
    }
    
    // Component cleanup
    cleanup() {
        this.components.clear();
        this.lifecycleHooks.clear();
    }
    
    // Get component by ID
    getComponent(id) {
        return this.components.get(id);
    }
    
    // Update component configuration
    updateSlider(component, newConfig) {
        Object.assign(component.config, newConfig);
        this.initializeSlider(component);
    }
    
    updateControlGroup(component, newControls) {
        component.controls = newControls;
        this.initializeControlGroup(component);
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

// Control Template Manager for Simulation Control Configuration Consolidation
class ControlTemplateManager {
    // Base templates for common control types
    static baseTemplates = {
        speedSlider: {
            type: 'slider',
            min: 1,
            max: 60,
            step: 1,
            value: 30,
            label: 'Speed',
            format: (value) => `${value} steps/s`
        },
        randomButton: {
            type: 'button',
            label: 'Random'
        },
        learnButton: {
            type: 'button',
            label: 'Learn'
        },
        addAntButton: {
            type: 'button',
            label: 'Add Ant'
        },
        termiteCountSlider: {
            type: 'slider',
            min: 10,
            max: 100,
            step: 1,
            value: 50,
            label: 'Termites',
            format: (value) => value.toString()
        }
    };

    // Simulation-specific control configurations with overrides
    static simulationControlTemplates = {
        conway: {
            controls: {
                speed: {
                    template: 'speedSlider',
                    id: 'speed-slider',
                    valueElementId: 'speed-value'
                },
                random: {
                    template: 'randomButton',
                    id: 'random-btn'
                },
                learn: {
                    template: 'learnButton',
                    id: 'learn-btn'
                }
            }
        },
        termite: {
            controls: {
                speed: {
                    template: 'speedSlider',
                    id: 'termite-speed-slider',
                    valueElementId: 'termite-speed-value'
                },
                termiteCount: {
                    template: 'termiteCountSlider',
                    id: 'termites-slider',
                    valueElementId: 'termites-value'
                },
                random: {
                    template: 'randomButton',
                    id: 'termite-random-btn'
                },
                learn: {
                    template: 'learnButton',
                    id: 'learn-btn'
                }
            }
        },
        langton: {
            controls: {
                speed: {
                    template: 'speedSlider',
                    id: 'langton-speed-slider',
                    valueElementId: 'langton-speed-value'
                },
                addAnt: {
                    template: 'addAntButton',
                    id: 'add-ant-btn'
                },
                random: {
                    template: 'randomButton',
                    id: 'langton-random-btn'
                },
                learn: {
                    template: 'learnButton',
                    id: 'learn-btn'
                }
            }
        }
    };

    // Generate complete control configuration from templates
    static generateControlConfig(simType, controlName) {
        const simTemplate = this.simulationControlTemplates[simType];
        if (!simTemplate || !simTemplate.controls[controlName]) {
            throw new Error(`Control template not found for ${simType}.${controlName}`);
        }

        const controlTemplate = simTemplate.controls[controlName];
        const baseTemplate = this.baseTemplates[controlTemplate.template];
        
        if (!baseTemplate) {
            throw new Error(`Base template not found: ${controlTemplate.template}`);
        }

        // Merge base template with simulation-specific overrides
        return {
            ...baseTemplate,
            ...controlTemplate
        };
    }

    // Generate complete simulation configuration
    static generateSimulationConfig(simType) {
        const simTemplate = this.simulationControlTemplates[simType];
        if (!simTemplate) {
            throw new Error(`Simulation template not found: ${simType}`);
        }

        const controls = {};
        Object.keys(simTemplate.controls).forEach(controlName => {
            controls[controlName] = this.generateControlConfig(simType, controlName);
        });

        return {
            name: this.getSimulationName(simType),
            controls,
            modal: this.getModalConfig(simType)
        };
    }

    // Get simulation name
    static getSimulationName(simType) {
        const names = {
            conway: "Conway's Game of Life",
            termite: 'Termite Algorithm',
            langton: "Langton's Ant"
        };
        return names[simType] || simType;
    }

    // Get modal configuration
    static getModalConfig(simType) {
        const modalConfigs = {
            conway: {
                id: 'conway-modal',
                closeId: 'conway-modal-close'
            },
            termite: {
                id: 'termite-modal',
                closeId: 'termite-modal-close'
            },
            langton: {
                id: 'langton-modal',
                closeId: 'langton-modal-close'
            }
        };
        return modalConfigs[simType];
    }

    // Get all simulation configurations
    static getAllSimulationConfigs() {
        const configs = {};
        Object.keys(this.simulationControlTemplates).forEach(simType => {
            configs[simType] = this.generateSimulationConfig(simType);
        });
        return configs;
    }

    // Add new simulation template
    static addSimulationTemplate(simType, template) {
        this.simulationControlTemplates[simType] = template;
    }

    // Add new base template
    static addBaseTemplate(templateName, template) {
        this.baseTemplates[templateName] = template;
    }

    // Validate template configuration
    static validateTemplate(template) {
        if (!template.controls || typeof template.controls !== 'object') {
            throw new Error('Template must have controls object');
        }

        Object.entries(template.controls).forEach(([controlName, controlConfig]) => {
            if (!controlConfig.template) {
                throw new Error(`Control ${controlName} must have a template reference`);
            }
            if (!this.baseTemplates[controlConfig.template]) {
                throw new Error(`Base template not found: ${controlConfig.template}`);
            }
        });
    }
}

// Unified Configuration Manager
class ConfigurationManager {
    static simulationConfigs = ControlTemplateManager.getAllSimulationConfigs();
    
    static getConfig(simType) {
        return this.simulationConfigs[simType];
    }
    
    static getAllConfigs() {
        return this.simulationConfigs;
    }
    
    // Factory methods for creating standardized configurations (R2 Implementation)
    static createSliderConfig(id, valueElementId, min, max, step, value, label, format = null) {
        return {
            type: 'slider',
            id,
            valueElementId,
            min,
            max,
            step,
            value,
            label,
            format: format || ((val) => val.toString())
        };
    }
    
    static createButtonConfig(id, label, className = 'btn secondary') {
        return {
            type: 'button',
            id,
            label,
            className
        };
    }
    
    static createModalConfig(id, closeId, onShow = null, onHide = null) {
        return {
            id,
            closeId,
            onShow,
            onHide
        };
    }
    
    static createSimulationConfig(name, controls, modal) {
        return {
            name,
            controls,
            modal
        };
    }
    
    // Validation methods
    static validateSliderConfig(config) {
        const required = ['id', 'valueElementId', 'min', 'max', 'step', 'value', 'label'];
        return required.every(prop => config.hasOwnProperty(prop));
    }
    
    static validateButtonConfig(config) {
        const required = ['id', 'label'];
        return required.every(prop => config.hasOwnProperty(prop));
    }
    
    static validateModalConfig(config) {
        const required = ['id', 'closeId'];
        return required.every(prop => config.hasOwnProperty(prop));
    }
    
    static validateSimulationConfig(config) {
        const required = ['name', 'controls', 'modal'];
        return required.every(prop => config.hasOwnProperty(prop));
    }
    
    // Factory method to create a complete simulation configuration
    static createCompleteSimulationConfig(simType, name, controlConfigs, modalConfig) {
        const controls = {};
        
        // Process control configurations
        Object.entries(controlConfigs).forEach(([controlName, controlConfig]) => {
            if (controlConfig.type === 'slider') {
                if (!this.validateSliderConfig(controlConfig)) {
                    throw new Error(`Invalid slider config for ${simType}.${controlName}`);
                }
            } else if (controlConfig.type === 'button') {
                if (!this.validateButtonConfig(controlConfig)) {
                    throw new Error(`Invalid button config for ${simType}.${controlName}`);
                }
            }
            controls[controlName] = controlConfig;
        });
        
        // Validate modal configuration
        if (!this.validateModalConfig(modalConfig)) {
            throw new Error(`Invalid modal config for ${simType}`);
        }
        
        const simulationConfig = this.createSimulationConfig(name, controls, modalConfig);
        
        if (!this.validateSimulationConfig(simulationConfig)) {
            throw new Error(`Invalid simulation config for ${simType}`);
        }
        
        return simulationConfig;
    }

    // Regenerate configurations from templates (useful for dynamic updates)
    static regenerateConfigs() {
        this.simulationConfigs = ControlTemplateManager.getAllSimulationConfigs();
    }
}

// Event Handling Framework (R1 Implementation)
class EventFramework {
    constructor() {
        this.listeners = new Map();
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
        this.elementCache = new Map();
    }
    
    // Unified event registration with automatic cleanup
    register(element, event, handler, options = {}) {
        const key = this.createListenerKey(element, event);
        
        // Remove existing listener if present
        this.remove(element, event);
        
        // Store listener for cleanup
        this.listeners.set(key, { element, event, handler, options });
        
        // Add event listener
        element.addEventListener(event, handler, options);
        
        return key;
    }
    
    // Remove specific event listener
    remove(element, event) {
        const key = this.createListenerKey(element, event);
        const listener = this.listeners.get(key);
        
        if (listener) {
            listener.element.removeEventListener(listener.event, listener.handler, listener.options);
            this.listeners.delete(key);
        }
    }
    
    // Remove all listeners for an element
    removeAll(element) {
        const elementKey = element.id || element.tagName;
        
        for (const [key, listener] of this.listeners.entries()) {
            if (listener.element === element) {
                listener.element.removeEventListener(listener.event, listener.handler, listener.options);
                this.listeners.delete(key);
            }
        }
    }
    
    // Cleanup all listeners
    cleanup() {
        for (const [key, listener] of this.listeners.entries()) {
            listener.element.removeEventListener(listener.event, listener.handler, listener.options);
        }
        this.listeners.clear();
        this.debounceTimers.clear();
        this.throttleTimers.clear();
        this.elementCache.clear();
    }
    
    // Debounce utility
    debounce(func, wait, key = null) {
        const timerKey = key || func.toString();
        
        return (...args) => {
            clearTimeout(this.debounceTimers.get(timerKey));
            const timeout = setTimeout(() => {
                func.apply(this, args);
                this.debounceTimers.delete(timerKey);
            }, wait);
            this.debounceTimers.set(timerKey, timeout);
        };
    }
    
    // Throttle utility
    throttle(func, limit, key = null) {
        const timerKey = key || func.toString();
        
        return (...args) => {
            if (!this.throttleTimers.has(timerKey)) {
                func.apply(this, args);
                this.throttleTimers.set(timerKey, true);
                setTimeout(() => {
                    this.throttleTimers.delete(timerKey);
                }, limit);
            }
        };
    }
    
    // Element cache with automatic cleanup
    getElement(selector) {
        if (!this.elementCache.has(selector)) {
            const element = document.querySelector(selector);
            if (element) {
                this.elementCache.set(selector, element);
            }
        }
        return this.elementCache.get(selector);
    }
    
    // Create unique key for listener tracking
    createListenerKey(element, event) {
        const elementId = element.id || element.tagName || 'anonymous';
        return `${elementId}-${event}`;
    }
    
    // Batch event registration for multiple elements
    registerBatch(registrations) {
        const keys = [];
        for (const { element, event, handler, options } of registrations) {
            const key = this.register(element, event, handler, options);
            keys.push(key);
        }
        return keys;
    }
    
    // Register all simulation handlers (compatibility method)
    registerAllHandlers() {
        // This method is called by AlgorithmicPatternGenerator but the actual
        // simulation-specific handlers are now registered in ControlManager
        // This maintains backward compatibility
        console.log('EventFramework: registerAllHandlers called - simulation handlers managed by ControlManager');
    }
}

// Unified Control Manager
class ControlManager {
    constructor(eventFramework) {
        this.activeControls = null;
        this.eventFramework = eventFramework;
        this.simulationHandlers = new Map();
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
            'add-ant-btn',
            'learn-btn'
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
    
    // Register handlers for a specific simulation type
    registerSimulationHandlers(simType, app) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        // Store handlers for cleanup
        const handlers = {
            speedChange: (value) => app.handleSpeedChange(simType, value),
            randomPattern: () => app.handleRandomPattern(simType),
            showLearnModal: () => app.showLearnModal(), // Use current simulation type
            addAnt: () => app.handleAddAnt(simType),
            termiteCountChange: (count) => app.handleTermiteCountChange(count)
        };
        
        this.simulationHandlers.set(simType, handlers);
        this.setupControls(simType, handlers);
    }
    
    // Setup controls for a simulation type using EventFramework
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
    
    // Setup slider control with EventFramework
    setupSlider(config, handlers) {
        const slider = this.eventFramework.getElement(`#${config.id}`);
        const valueElement = this.eventFramework.getElement(`#${config.valueElementId}`);
        
        if (slider) {
            // Debounced input handler for smooth performance
            const debouncedInputHandler = this.eventFramework.debounce((e) => {
                const value = config.format ? config.format(e.target.value) : e.target.value;
                if (valueElement) {
                    valueElement.textContent = value;
                }
                
                if (config.id.includes('speed')) {
                    handlers.speedChange(parseFloat(e.target.value));
                } else if (config.id.includes('termites')) {
                    // Call the termite count change handler
                    handlers.termiteCountChange(parseInt(e.target.value));
                }
            }, 16, `${config.id}-debounce`); // ~60fps debounce
            
            // Immediate visual feedback for value display
            const immediateValueHandler = (e) => {
                const value = config.format ? config.format(e.target.value) : e.target.value;
                if (valueElement) {
                    valueElement.textContent = value;
                }
            };
            
            this.eventFramework.register(slider, 'input', immediateValueHandler);
            this.eventFramework.register(slider, 'change', debouncedInputHandler);
        }
    }
    
    // Setup button control with EventFramework
    setupButton(config, handlers) {
        const button = this.eventFramework.getElement(`#${config.id}`);
        
        if (button) {
            this.eventFramework.register(button, 'click', () => {
                if (config.id.includes('random')) {
                    handlers.randomPattern();
                } else if (config.id.includes('learn')) {
                    // Pass the current simulation type to show the correct modal
                    handlers.showLearnModal();
                } else if (config.id.includes('add-ant')) {
                    handlers.addAnt();
                }
            });
        }
    }
    
    // Register all simulation handlers
    registerAllHandlers(app) {
        Object.keys(ConfigurationManager.getAllConfigs()).forEach(simType => {
            this.registerSimulationHandlers(simType, app);
        });
    }
    
    // Cleanup simulation handlers
    cleanup() {
        this.simulationHandlers.clear();
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
        this.shortcuts.set('a', () => this.app.handleAddAnt(this.app.currentType, true));
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
        
        // Mouse position tracking for Add Ant feature
        this.mouseX = null;
        this.mouseY = null;
        
        // Performance optimization properties
        this.elementCache = PerformanceOptimizer.createElementCache();
        this.updateQueue = new Set();
        this.isUpdating = false;
        this.lastUIUpdate = 0;
        this.uiUpdateThrottle = 100; // ms between UI updates
        
        // Initialize managers
        this.modalManager = new ModalManager();
        this.eventFramework = new EventFramework();
        this.controlManager = new ControlManager(this.eventFramework);
        this.keyboardHandler = new KeyboardHandler(this);
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupModals();
        this.controlManager.registerAllHandlers(this);
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
        const simulationSelect = this.eventFramework.getElement('#simulation-select');
        if (simulationSelect) {
            this.eventFramework.register(simulationSelect, 'change', (e) => {
                this.switchSimulation(e.target.value);
            });
        }
        
        // Control buttons with element caching
        const startPauseBtn = this.eventFramework.getElement('#start-pause-btn');
        const resetBtn = this.eventFramework.getElement('#reset-btn');
        const immersiveBtn = this.eventFramework.getElement('#immersive-btn');
        
        if (startPauseBtn) {
            this.eventFramework.register(startPauseBtn, 'click', () => this.toggleSimulation());
        }
        if (resetBtn) {
            this.eventFramework.register(resetBtn, 'click', () => this.resetSimulation());
        }
        if (immersiveBtn) {
            this.eventFramework.register(immersiveBtn, 'click', () => this.toggleImmersiveMode());
        }
        
        // Setup brightness controls
        this.setupBrightnessControls();
        
        // Setup likelihood slider
        this.setupLikelihoodSlider();
        
        // Mouse move tracking for Add Ant feature
        this.eventFramework.register(this.canvas, 'mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        // Keyboard shortcuts
        this.eventFramework.register(document, 'keydown', (e) => {
            this.keyboardHandler.handleKeydown(e);
        });
    }
    
    setupBrightnessControls() {
        const brightnessSlider = this.eventFramework.getElement('#brightness-slider');
        const brightnessValue = this.eventFramework.getElement('#brightness-value');
        
        // Brightness slider with debounced updates
        if (brightnessSlider) {
            const debouncedBrightnessHandler = this.eventFramework.debounce((e) => {
                this.setBrightness(parseFloat(e.target.value));
            }, 16, 'brightness-debounce'); // ~60fps debounce
            
            const immediateValueHandler = (e) => {
                const value = parseFloat(e.target.value);
                const percentage = Math.round(value * 100);
                if (brightnessValue) {
                    brightnessValue.textContent = `${percentage}%`;
                }
            };
            
            this.eventFramework.register(brightnessSlider, 'input', immediateValueHandler);
            this.eventFramework.register(brightnessSlider, 'change', debouncedBrightnessHandler);
        }
        
        // Initialize brightness display
        this.updateBrightnessDisplay();
    }
    
    setupLikelihoodSlider() {
        const likelihoodSlider = this.eventFramework.getElement('#likelihood-slider');
        const likelihoodValue = this.eventFramework.getElement('#likelihood-value');
        
        // Likelihood slider with immediate value updates
        if (likelihoodSlider) {
            const likelihoodHandler = (e) => {
                const value = parseInt(e.target.value);
                if (likelihoodValue) {
                    likelihoodValue.textContent = `${value}%`;
                }
            };
            
            this.eventFramework.register(likelihoodSlider, 'input', likelihoodHandler);
        }
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
        
        // Allow cell toggling for all simulations
        if (this.currentSimulation.toggleCell) {
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
        
        // Get likelihood value from slider
        const likelihoodSlider = this.eventFramework.getElement('#likelihood-slider');
        const likelihood = likelihoodSlider ? parseInt(likelihoodSlider.value) / 100 : 0.3;
        
        if (this.currentSimulation.randomize) {
            this.currentSimulation.randomize(likelihood);
            this.updateUI();
        }
    }
    
    // Generic modal handlers using modal manager
    showLearnModal(simType) {
        // If no simType is provided, use the current simulation type
        const currentSimType = simType || this.currentType;
        const config = ConfigurationManager.getConfig(currentSimType);
        if (!config) return;
        
        this.modalManager.show(config.modal.id);
    }
    
    hideLearnModal(simType) {
        const config = ConfigurationManager.getConfig(simType);
        if (!config) return;
        
        this.modalManager.hide(config.modal.id);
    }
    
    // Generic add ant handler
    handleAddAnt(simType, useMousePosition = false) {
        if (this.currentType !== simType || !this.currentSimulation) return;
        
        if (this.currentSimulation.addAnt) {
            if (useMousePosition) {
                // Pass mouse coordinates for keyboard-triggered ant addition
                this.currentSimulation.addAnt(this.mouseX, this.mouseY);
            } else {
                // Use random placement for button-triggered ant addition
                this.currentSimulation.addAnt(null, null);
            }
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
        this.eventFramework.cleanup();
        this.controlManager.cleanup();
        this.modalManager.cleanup();
        this.elementCache.clear();
        this.updateQueue.clear();
        
        if (this.currentSimulation) {
            this.currentSimulation.pause();
            this.currentSimulation.cleanupDragToggling();
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're in a test environment to prevent auto-initialisation
    const isTestEnvironment = window.location.pathname.includes('test-suite.html') || 
                             document.getElementById('test-canvas') !== null;
    
    if (!isTestEnvironment) {
        const app = new AlgorithmicPatternGenerator();
        app.startStatsUpdate();
        
        // Make app globally accessible for debugging
        window.app = app;
        
        // Performance monitoring
        PerformanceOptimizer.startMonitoring();
    }
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