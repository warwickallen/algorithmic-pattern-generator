// Dynamic colour scheme implementation based on four-corner hue rotation
class DynamicColourScheme {
    constructor() {
        // Corner configurations from the YAML specification
        this.corners = {
            topLeft: { startHue: 45, period: 60000 },    // 60 seconds
            topRight: { startHue: 135, period: 75000 },  // 75 seconds
            bottomRight: { startHue: 225, period: 90000 }, // 90 seconds
            bottomLeft: { startHue: 315, period: 105000 }  // 105 seconds
        };
        
        this.startTime = Date.now();
    }
    
    // Get current hue for a specific corner
    getCornerHue(corner, currentTime = Date.now()) {
        const config = this.corners[corner];
        
        // For static rendering (currentTime = 0), use the starting hue directly
        if (currentTime === 0) {
            return config.startHue;
        }
        
        const elapsed = currentTime - this.startTime;
        const hue = (config.startHue + (elapsed / config.period) * 360) % 360;
        return hue;
    }
    
    // Get interpolated hue for any position on the canvas
    getHueAtPosition(x, y, canvasWidth, canvasHeight, currentTime = null) {
        // Clamp position to canvas bounds
        const clampedX = Math.max(0, Math.min(x, canvasWidth));
        const clampedY = Math.max(0, Math.min(y, canvasHeight));
        
        // Normalize position to 0-1 range
        const normX = clampedX / canvasWidth;
        const normY = clampedY / canvasHeight;
        
        // For static rendering, use starting hues directly
        if (currentTime === null) {
            const topLeftHue = this.corners.topLeft.startHue;
            const topRightHue = this.corners.topRight.startHue;
            const bottomRightHue = this.corners.bottomRight.startHue;
            const bottomLeftHue = this.corners.bottomLeft.startHue;
            
            // Use proper bilinear interpolation with circular hue handling
            return this.getBilinearHue(normX, normY, topLeftHue, topRightHue, bottomRightHue, bottomLeftHue);
        }
        
        // For dynamic rendering, use time-based hues
        const topLeftHue = this.getCornerHue('topLeft', currentTime);
        const topRightHue = this.getCornerHue('topRight', currentTime);
        const bottomRightHue = this.getCornerHue('bottomRight', currentTime);
        const bottomLeftHue = this.getCornerHue('bottomLeft', currentTime);
        
        // Use proper bilinear interpolation with circular hue handling
        return this.getBilinearHue(normX, normY, topLeftHue, topRightHue, bottomRightHue, bottomLeftHue);
    }
    
    // Get hue using proper bilinear interpolation with circular hue handling
    getBilinearHue(normX, normY, topLeftHue, topRightHue, bottomRightHue, bottomLeftHue) {
        // Convert all hues to unit vectors on the colour wheel
        const topLeftVector = this.hueToVector(topLeftHue);
        const topRightVector = this.hueToVector(topRightHue);
        const bottomRightVector = this.hueToVector(bottomRightHue);
        const bottomLeftVector = this.hueToVector(bottomLeftHue);
        
        // Interpolate vectors instead of angles
        const topVector = this.interpolateVector(topLeftVector, topRightVector, normX);
        const bottomVector = this.interpolateVector(bottomLeftVector, bottomRightVector, normX);
        const finalVector = this.interpolateVector(topVector, bottomVector, normY);
        
        // Convert back to hue
        return this.vectorToHue(finalVector);
    }
    
    // Convert hue to unit vector on the colour wheel
    hueToVector(hue) {
        const angle = (hue * Math.PI) / 180;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }
    
    // Convert unit vector back to hue
    vectorToHue(vector) {
        let angle = Math.atan2(vector.y, vector.x);
        let hue = (angle * 180) / Math.PI;
        
        // Normalize to 0-360 range
        hue = ((hue % 360) + 360) % 360;
        
        return hue;
    }
    
    // Interpolate between two unit vectors
    interpolateVector(v1, v2, factor) {
        // Linear interpolation of vector components
        const x = v1.x + (v2.x - v1.x) * factor;
        const y = v1.y + (v2.y - v1.y) * factor;
        
        // Normalize to unit vector
        const length = Math.sqrt(x * x + y * y);
        if (length > 0) {
            return {
                x: x / length,
                y: y / length
            };
        } else {
            // If vectors are opposite, choose one based on factor
            return factor < 0.5 ? v1 : v2;
        }
    }
    
    // Interpolate between two hues, handling the circular nature of hue
    interpolateHue(hue1, hue2, factor) {
        // Normalize hues to 0-360 range
        hue1 = ((hue1 % 360) + 360) % 360;
        hue2 = ((hue2 % 360) + 360) % 360;
        
        // Calculate the shortest path around the colour wheel
        let diff = hue2 - hue1;
        
        // If the difference is greater than 180 degrees, go the other way
        if (diff > 180) {
            diff -= 360;
        } else if (diff < -180) {
            diff += 360;
        }
        
        // Interpolate along the shortest path
        let result = hue1 + diff * factor;
        
        // Normalize the result to 0-360 range
        result = ((result % 360) + 360) % 360;
        
        return result;
    }
    
    // Convert HSL to RGB
    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h < 1/6) {
            r = c; g = x; b = 0;
        } else if (h < 2/6) {
            r = x; g = c; b = 0;
        } else if (h < 3/6) {
            r = 0; g = c; b = x;
        } else if (h < 4/6) {
            r = 0; g = x; b = c;
        } else if (h < 5/6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    
    // Get RGB colour for a position with specified saturation and lightness
    getColourAtPosition(x, y, canvasWidth, canvasHeight, saturation = 80, lightness = 50, currentTime = null) {
        const hue = this.getHueAtPosition(x, y, canvasWidth, canvasHeight, currentTime);
        const rgb = this.hslToRgb(hue, saturation, lightness);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
}

// Simulation Lifecycle Framework (R4 Implementation)
class SimulationLifecycleFramework {
    constructor() {
        this.lifecycleHooks = new Map();
        this.stateManagers = new Map();
        this.eventHandlers = new Map();
    }
    
    // Register lifecycle hooks for a simulation
    registerLifecycleHooks(simulationId, hooks) {
        const defaultHooks = {
            onInit: () => console.log(`Simulation ${simulationId} initialized`),
            onStart: () => console.log(`Simulation ${simulationId} started`),
            onPause: () => console.log(`Simulation ${simulationId} paused`),
            onReset: () => console.log(`Simulation ${simulationId} reset`),
            onClear: () => console.log(`Simulation ${simulationId} cleared`),
            onResize: () => console.log(`Simulation ${simulationId} resized`),
            onUpdate: () => console.log(`Simulation ${simulationId} updated`),
            onDraw: () => console.log(`Simulation ${simulationId} drawn`),
            onDestroy: () => console.log(`Simulation ${simulationId} destroyed`)
        };
        
        this.lifecycleHooks.set(simulationId, { ...defaultHooks, ...hooks });
    }
    
    // Register state manager for a simulation
    registerStateManager(simulationId, stateManager) {
        this.stateManagers.set(simulationId, stateManager);
    }
    
    // Register event handlers for a simulation
    registerEventHandlers(simulationId, handlers) {
        this.eventHandlers.set(simulationId, handlers);
    }
    
    // Execute lifecycle hook
    executeHook(simulationId, hookName, ...args) {
        const hooks = this.lifecycleHooks.get(simulationId);
        if (hooks && hooks[hookName]) {
            try {
                return hooks[hookName](...args);
            } catch (error) {
                console.error(`Error executing ${hookName} hook for simulation ${simulationId}:`, error);
            }
        }
    }
    
    // Get state manager for a simulation
    getStateManager(simulationId) {
        return this.stateManagers.get(simulationId);
    }
    
    // Get event handlers for a simulation
    getEventHandlers(simulationId) {
        return this.eventHandlers.get(simulationId);
    }
    
    // Create standardized state manager
    createStateManager(initialState = {}) {
        return {
            state: { ...initialState },
            subscribers: new Set(),
            
            // Get current state
            getState() {
                return { ...this.state };
            },
            
            // Set state
            setState(newState) {
                this.state = { ...this.state, ...newState };
                this.notifySubscribers();
            },
            
            // Subscribe to state changes
            subscribe(callback) {
                this.subscribers.add(callback);
                return () => this.subscribers.delete(callback);
            },
            
            // Notify subscribers of state changes
            notifySubscribers() {
                this.subscribers.forEach(callback => {
                    try {
                        callback(this.state);
                    } catch (error) {
                        console.error('Error in state subscriber:', error);
                    }
                });
            }
        };
    }
    
    // Create standardized event handler
    createEventHandler() {
        return {
            events: new Map(),
            
            // Register event handler
            on(eventName, handler) {
                if (!this.events.has(eventName)) {
                    this.events.set(eventName, []);
                }
                this.events.get(eventName).push(handler);
            },
            
            // Emit event
            emit(eventName, ...args) {
                const handlers = this.events.get(eventName);
                if (handlers) {
                    handlers.forEach(handler => {
                        try {
                            handler(...args);
                        } catch (error) {
                            console.error(`Error in event handler for ${eventName}:`, error);
                        }
                    });
                }
            },
            
            // Remove event handler
            off(eventName, handler) {
                const handlers = this.events.get(eventName);
                if (handlers) {
                    const index = handlers.indexOf(handler);
                    if (index > -1) {
                        handlers.splice(index, 1);
                    }
                }
            }
        };
    }
    
    // Cleanup lifecycle framework
    cleanup() {
        this.lifecycleHooks.clear();
        this.stateManagers.clear();
        this.eventHandlers.clear();
    }
}

// Global lifecycle framework instance
const simulationLifecycleFramework = new SimulationLifecycleFramework();

// Rendering Utilities Framework (R5 Implementation)
class RenderingUtils {
    constructor() {
        this.renderCache = new Map();
        this.colorCache = new Map();
        this.maxCacheSize = 1000;
        this.performanceMetrics = {
            renderTime: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
    }
    
    // Unified colour management
    createColorManager() {
        return {
            // Convert HSL to RGB
            hslToRgb(h, s, l) {
                h /= 360;
                s /= 100;
                l /= 100;
                
                const c = (1 - Math.abs(2 * l - 1)) * s;
                const x = c * (1 - Math.abs((h * 6) % 2 - 1));
                const m = l - c / 2;
                
                let r, g, b;
                if (h < 1/6) {
                    [r, g, b] = [c, x, 0];
                } else if (h < 2/6) {
                    [r, g, b] = [x, c, 0];
                } else if (h < 3/6) {
                    [r, g, b] = [0, c, x];
                } else if (h < 4/6) {
                    [r, g, b] = [0, x, c];
                } else if (h < 5/6) {
                    [r, g, b] = [x, 0, c];
                } else {
                    [r, g, b] = [c, 0, x];
                }
                
                return [
                    Math.round((r + m) * 255),
                    Math.round((g + m) * 255),
                    Math.round((b + m) * 255)
                ];
            },
            
            // Apply brightness to colour
            applyBrightness(color, brightness) {
                const cacheKey = `${color}-${brightness}`;
                if (this.colorCache.has(cacheKey)) {
                    this.performanceMetrics.cacheHits++;
                    return this.colorCache.get(cacheKey);
                }
                
                this.performanceMetrics.cacheMisses++;
                let rgb;
                
                if (color.startsWith('#')) {
                    const hex = color.slice(1);
                    rgb = [
                        parseInt(hex.slice(0, 2), 16),
                        parseInt(hex.slice(2, 4), 16),
                        parseInt(hex.slice(4, 6), 16)
                    ];
                } else if (color.startsWith('rgb')) {
                    rgb = color.match(/\d+/g).map(Number);
                } else {
                    return color; // Return as-is for unsupported formats
                }
                
                const adjustedRgb = rgb.map(c => Math.min(255, Math.max(0, Math.round(c * brightness))));
                const result = `rgb(${adjustedRgb[0]}, ${adjustedRgb[1]}, ${adjustedRgb[2]})`;
                
                // Cache the result
                if (this.colorCache.size < this.maxCacheSize) {
                    this.colorCache.set(cacheKey, result);
                }
                
                return result;
            },
            
            // Interpolate between two colours
            interpolateColor(color1, color2, factor) {
                const cacheKey = `${color1}-${color2}-${factor}`;
                if (this.colorCache.has(cacheKey)) {
                    this.performanceMetrics.cacheHits++;
                    return this.colorCache.get(cacheKey);
                }
                
                this.performanceMetrics.cacheMisses++;
                
                // Convert colours to RGB arrays
                const rgb1 = this.parseColor(color1);
                const rgb2 = this.parseColor(color2);
                
                if (!rgb1 || !rgb2) {
                    return color1;
                }
                
                const interpolated = rgb1.map((c1, i) => 
                    Math.round(c1 + (rgb2[i] - c1) * factor)
                );
                
                const result = `rgb(${interpolated[0]}, ${interpolated[1]}, ${interpolated[2]})`;
                
                // Cache the result
                if (this.colorCache.size < this.maxCacheSize) {
                    this.colorCache.set(cacheKey, result);
                }
                
                return result;
            },
            
            // Parse colour string to RGB array
            parseColor(color) {
                if (color.startsWith('#')) {
                    const hex = color.slice(1);
                    return [
                        parseInt(hex.slice(0, 2), 16),
                        parseInt(hex.slice(2, 4), 16),
                        parseInt(hex.slice(4, 6), 16)
                    ];
                } else if (color.startsWith('rgb')) {
                    return color.match(/\d+/g).map(Number);
                }
                return null;
            }
        };
    }
    
    // Performance optimization utilities
    createPerformanceOptimizer() {
        return {
            // Debounced render function
            debounceRender(func, delay = 16) {
                let timeoutId;
                return (...args) => {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => func(...args), delay);
                };
            },
            
            // Throttled render function
            throttleRender(func, limit = 16) {
                let inThrottle;
                return (...args) => {
                    if (!inThrottle) {
                        func(...args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            },
            
            // Measure render performance
            measureRenderTime(func, ...args) {
                const startTime = performance.now();
                const result = func(...args);
                const endTime = performance.now();
                
                this.performanceMetrics.renderTime = endTime - startTime;
                return result;
            }
        };
    }
    
    // Grid rendering utilities
    createGridRenderer() {
        return {
            // Draw grid with custom cell renderer
            drawGrid(ctx, grid, cellSize, cellRenderer = null) {
                const startTime = performance.now();
                
                for (let row = 0; row < grid.length; row++) {
                    for (let col = 0; col < grid[row].length; col++) {
                        const x = col * cellSize;
                        const y = row * cellSize;
                        
                        if (cellRenderer) {
                            cellRenderer(ctx, x, y, cellSize, grid[row][col], row, col);
                        } else {
                            // Default cell rendering
                            ctx.fillStyle = grid[row][col] ? '#ffffff' : '#000000';
                            ctx.fillRect(x, y, cellSize, cellSize);
                        }
                    }
                }
                
                this.performanceMetrics.renderTime = performance.now() - startTime;
            },
            
            // Draw cell with glow effect
            drawCellWithGlow(ctx, x, y, size, color, glowIntensity = 0) {
                if (glowIntensity > 0) {
                    ctx.shadowColor = color;
                    ctx.shadowBlur = glowIntensity;
                }
                
                ctx.fillStyle = color;
                ctx.fillRect(x, y, size, size);
                
                ctx.shadowBlur = 0;
            },
            
            // Draw actor (termite, ant, etc.)
            drawActor(ctx, x, y, radius, color, direction = 0) {
                ctx.save();
                ctx.translate(x + radius, y + radius);
                ctx.rotate(direction * Math.PI / 2);
                
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(0, 0, radius, 0, 2 * Math.PI);
                ctx.fill();
                
                // Draw direction indicator
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -radius + 2);
                ctx.stroke();
                
                ctx.restore();
            }
        };
    }
    
    // Cache management
    clearCaches() {
        this.renderCache.clear();
        this.colorCache.clear();
    }
    
    // Get performance metrics
    getPerformanceMetrics() {
        return { ...this.performanceMetrics };
    }
    
    // Reset performance metrics
    resetPerformanceMetrics() {
        this.performanceMetrics = {
            renderTime: 0,
            cacheHits: 0,
            cacheMisses: 0
        };
    }
}

// Global rendering utilities instance
const renderingUtils = new RenderingUtils();

// Base simulation class with performance optimization
class BaseSimulation {
    constructor(canvas, ctx, simulationId = 'base') {
        this.canvas = canvas;
        this.ctx = ctx;
        this.simulationId = simulationId;
        this.isRunning = false;
        this.generation = 0;
        this.cellCount = 0;
        this.fps = 0;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fpsUpdateInterval = 30; // Update FPS every 30 frames
        this.brightness = 1.0; // Default brightness
        
        // Performance optimization properties
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / 30; // Default 30 FPS
        this.renderCache = new Map(); // Cache for rendered elements
        this.colorCache = new Map(); // Cache for brightness-adjusted colors
        this.maxCacheSize = 1000; // Limit cache size to prevent memory leaks
        
        // Trail properties
        this.trailLength = 30; // Steps before fade
        this.trailEnabled = true; // Toggle on/off
        this.trailOpacity = 0.8; // Maximum opacity
        this.trailColor = null; // Use dynamic colour or custom
        
        // Dynamic colour scheme
        this.colourScheme = new DynamicColourScheme();
        
        // Lifecycle framework integration
        this.stateManager = simulationLifecycleFramework.createStateManager({
            isRunning: false,
            generation: 0,
            cellCount: 0,
            brightness: 1.0,
            trailLength: this.trailLength,
            trailEnabled: this.trailEnabled
        });
        
        this.eventHandler = simulationLifecycleFramework.createEventHandler();
        
        // Register with lifecycle framework
        simulationLifecycleFramework.registerStateManager(this.simulationId, this.stateManager);
        simulationLifecycleFramework.registerEventHandlers(this.simulationId, this.eventHandler);
        
        // Rendering utilities integration
        this.colorManager = renderingUtils.createColorManager();
        this.performanceOptimizer = renderingUtils.createPerformanceOptimizer();
        this.gridRenderer = renderingUtils.createGridRenderer();
    }
    
    init() {
        simulationLifecycleFramework.executeHook(this.simulationId, 'onInit');
        this.resize();
        this.reset();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.cellSize = Math.min(this.canvas.width, this.canvas.height) / 100;
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
        
        // Clear caches on resize
        this.clearCaches();
        
        simulationLifecycleFramework.executeHook(this.simulationId, 'onResize');
    }
    
    // New method for preserving state during resize
    resizePreserveState() {
        // Store current state before resize
        const preservedState = this.getState();
        
        // Perform resize
        this.resize();
        
        // Restore state after resize
        this.setState(preservedState);
    }
    
    // Override these methods in subclasses to preserve specific state
    getState() {
        // Default implementation - override in subclasses
        return {
            generation: this.generation,
            cellCount: this.cellCount,
            isRunning: this.isRunning,
            trailLength: this.trailLength,
            trailEnabled: this.trailEnabled
        };
    }
    
    setState(state) {
        // Default implementation - override in subclasses
        this.generation = state.generation || 0;
        this.cellCount = state.cellCount || 0;
        this.isRunning = state.isRunning || false;
        this.trailLength = state.trailLength || 30;
        this.trailEnabled = state.trailEnabled !== undefined ? state.trailEnabled : true;
    }
    
    start() {
        this.isRunning = true;
        this.stateManager.setState({ isRunning: true });
        simulationLifecycleFramework.executeHook(this.simulationId, 'onStart');
        this.animate();
    }
    
    pause() {
        this.isRunning = false;
        this.stateManager.setState({ isRunning: false });
        simulationLifecycleFramework.executeHook(this.simulationId, 'onPause');
    }
    
    reset() {
        this.generation = 0;
        this.cellCount = 0;
        this.isRunning = false;
        this.stateManager.setState({ 
            generation: 0, 
            cellCount: 0, 
            isRunning: false 
        });
        simulationLifecycleFramework.executeHook(this.simulationId, 'onReset');
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cellCount = 0;
        this.stateManager.setState({ cellCount: 0 });
        simulationLifecycleFramework.executeHook(this.simulationId, 'onClear');
    }
    
    animate(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calculate FPS
        this.frameCount++;
        if (this.frameCount % this.fpsUpdateInterval === 0) {
            this.fps = Math.round((this.fpsUpdateInterval * 1000) / (currentTime - this.lastTime));
            this.lastTime = currentTime;
        }
        
        // For all simulations, control update frequency based on speed
        if (currentTime - this.lastUpdateTime >= this.updateInterval) {
            this.update();
            this.lastUpdateTime = currentTime;
        }
        
        this.draw();
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    update() {
        // Override in subclasses
        simulationLifecycleFramework.executeHook(this.simulationId, 'onUpdate');
    }
    
    draw() {
        // Override in subclasses
        simulationLifecycleFramework.executeHook(this.simulationId, 'onDraw');
    }
    
    getStats() {
        return {
            generation: this.generation,
            cellCount: this.cellCount,
            fps: this.fps
        };
    }
    
    setBrightness(value) {
        this.brightness = Math.max(0.1, Math.min(2.0, value));
        // Clear color cache when brightness changes
        this.colorCache.clear();
    }
    
    // Optimized brightness application with caching
    applyBrightness(color) {
        // Check cache first
        const cacheKey = `${color}-${this.brightness}`;
        if (this.colorCache.has(cacheKey)) {
            return this.colorCache.get(cacheKey);
        }
        
        // Parse the color (supports rgb, rgba, and hex formats)
        let r, g, b, a = 1;
        
        if (color.startsWith('rgb')) {
            // Handle rgb(r, g, b) or rgba(r, g, b, a) format
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
                a = match[4] ? parseFloat(match[4]) : 1;
            }
        } else if (color.startsWith('#')) {
            // Handle hex format
            const hex = color.slice(1);
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.slice(0, 2), 16);
                g = parseInt(hex.slice(2, 4), 16);
                b = parseInt(hex.slice(4, 6), 16);
            }
        }
        
        if (r !== undefined && g !== undefined && b !== undefined) {
            // Apply brightness
            r = Math.min(255, Math.max(0, Math.round(r * this.brightness)));
            g = Math.min(255, Math.max(0, Math.round(g * this.brightness)));
            b = Math.min(255, Math.max(0, Math.round(b * this.brightness)));
            
            const result = `rgba(${r}, ${g}, ${b}, ${a})`;
            
            // Cache the result
            this.colorCache.set(cacheKey, result);
            
            // Limit cache size
            if (this.colorCache.size > this.maxCacheSize) {
                const firstKey = this.colorCache.keys().next().value;
                this.colorCache.delete(firstKey);
            }
            
            return result;
        }
        
        // Return original color if parsing failed
        return color;
    }
    
    // Cache management
    clearCaches() {
        this.renderCache.clear();
        this.colorCache.clear();
    }
    
    // Common grid utilities with performance optimization
    createGrid(rows, cols, defaultValue = false) {
        return Array(rows).fill().map(() => Array(cols).fill(defaultValue));
    }
    
    createGrids(rows, cols, defaultValue = false) {
        return {
            current: this.createGrid(rows, cols, defaultValue),
            next: this.createGrid(rows, cols, defaultValue)
        };
    }
    
    swapGrids(grids) {
        [grids.current, grids.next] = [grids.next, grids.current];
    }
    
    // Optimized cell counting
    countLiveCells(grid) {
        let count = 0;
        for (let row = 0; row < grid.length; row++) {
            const rowData = grid[row];
            for (let col = 0; col < rowData.length; col++) {
                if (rowData[col]) count++;
            }
        }
        return count;
    }
    
    // Common neighbour counting utility with boundary checking optimization
    countNeighbours(grid, row, col, rows, cols, wrapAround = true) {
        let count = 0;
        
        if (wrapAround) {
            // Optimized wrap-around version
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    
                    const nr = (row + dr + rows) % rows;
                    const nc = (col + dc + cols) % cols;
                    
                    if (grid[nr][nc]) {
                        count++;
                    }
                }
            }
        } else {
            // Optimized bounded version
            const startRow = Math.max(0, row - 1);
            const endRow = Math.min(rows - 1, row + 1);
            const startCol = Math.max(0, col - 1);
            const endCol = Math.min(cols - 1, col + 1);
            
            for (let nr = startRow; nr <= endRow; nr++) {
                for (let nc = startCol; nc <= endCol; nc++) {
                    if (nr === row && nc === col) continue;
                    if (grid[nr][nc]) {
                        count++;
                    }
                }
            }
        }
        
        return count;
    }
    
    // Optimized grid rendering utility
    drawGrid(grid, cellRenderer = null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Use more efficient iteration
        for (let row = 0; row < grid.length; row++) {
            const rowData = grid[row];
            for (let col = 0; col < rowData.length; col++) {
                if (rowData[col]) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    
                    if (cellRenderer && typeof cellRenderer === 'function') {
                        cellRenderer(x, y, row, col, rowData[col]);
                    } else {
                        this.drawCell(x, y);
                    }
                }
            }
        }
    }
    
    // Common random grid generation utility
    randomizeGrid(grid, density = 0.3) {
        for (let row = 0; row < grid.length; row++) {
            const rowData = grid[row];
            for (let col = 0; col < rowData.length; col++) {
                rowData[col] = Math.random() < density;
            }
        }
        return this.countLiveCells(grid);
    }
    
    // Common cell coordinate conversion utilities
    screenToGrid(x, y) {
        return {
            col: Math.floor(x / this.cellSize),
            row: Math.floor(y / this.cellSize)
        };
    }
    
    gridToScreen(col, row) {
        return {
            x: col * this.cellSize,
            y: row * this.cellSize
        };
    }
    
    isValidGridPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    // Gradient colour utilities with caching
    getGradientColor(x, y, startColor, endColor) {
        // Use dynamic colour scheme instead of static gradient
        // Pass current time if simulation is running, otherwise use null for static rendering
        const currentTime = this.isRunning ? Date.now() : null;
        return this.colourScheme.getColourAtPosition(x, y, this.canvas.width, this.canvas.height, 80, 50, currentTime);
    }
    
    interpolateColor(color1, color2, factor) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Glow effect utility with performance optimization
    setGlowEffect(color, intensity = 15) {
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = intensity;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
    
    clearGlowEffect() {
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
    
    // Common cell rendering method with caching
    drawCell(x, y, color = null) {
        if (!color) {
            color = this.getGradientColor(x, y);
        }
        
        // Apply brightness to the color
        color = this.applyBrightness(color);
        
        this.ctx.fillStyle = color;
        this.setGlowEffect(color, 20 * this.brightness);
        
        this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
        
        this.clearGlowEffect();
    }
    
    // Common actor rendering method (for termites and ants) with caching
    drawActor(x, y, radius, color = null) {
        if (!color) {
            // Use a slightly different saturation/lightness for actors to make them stand out
            const currentTime = this.isRunning ? Date.now() : null;
            color = this.colourScheme.getColourAtPosition(x, y, this.canvas.width, this.canvas.height, 90, 60, currentTime);
        }
        
        // Apply brightness to the color
        color = this.applyBrightness(color);
        
        this.ctx.fillStyle = color;
        this.setGlowEffect(color, 25 * this.brightness);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.clearGlowEffect();
    }
    
    // Common direction indicator rendering
    drawDirectionIndicator(x, y, angle, length = 8, color = '#ffffff', lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length
        );
        this.ctx.stroke();
    }
    
    // Set speed with validation
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
    
    // Trail management methods
    updateActorTrail(actor, x, y) {
        if (!this.trailEnabled || !actor) return;
        
        // Initialize trail array if it doesn't exist
        if (!actor.trail) {
            actor.trail = [];
        }
        
        // Add current position to trail
        actor.trail.push({x: x, y: y, age: 0});
        
        // Age existing trail points
        actor.trail.forEach(point => point.age++);
        
        // Remove expired trail points
        actor.trail = actor.trail.filter(point => point.age < this.trailLength);
    }
    
    drawActorTrail(actor, radius = 2) {
        if (!this.trailEnabled || !actor || !actor.trail) return;
        
        actor.trail.forEach(point => {
            const alpha = this.trailOpacity * (1 - (point.age / this.trailLength));
            if (alpha > 0.01) { // Only draw if visible enough
                this.drawTrailPoint(point.x, point.y, radius, alpha);
            }
        });
    }
    
    drawTrailPoint(x, y, radius, alpha) {
        this.ctx.save();
        
        // Set up transparency
        this.ctx.globalAlpha = alpha;
        
        // Get trail colour
        let color = this.trailColor;
        if (!color) {
            // Use dynamic colour scheme for trail
            const currentTime = this.isRunning ? Date.now() : null;
            color = this.colourScheme.getColourAtPosition(x, y, this.canvas.width, this.canvas.height, 70, 40, currentTime);
        }
        
        // Apply brightness to the color
        color = this.applyBrightness(color);
        
        this.ctx.fillStyle = color;
        this.setGlowEffect(color, 10 * this.brightness * alpha);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.clearGlowEffect();
        this.ctx.restore();
    }
    
    // Trail configuration methods
    setTrailLength(length) {
        this.trailLength = Math.max(1, Math.min(100, length));
        this.stateManager.setState({ trailLength: this.trailLength });
    }
    
    setTrailEnabled(enabled) {
        this.trailEnabled = enabled;
        this.stateManager.setState({ trailEnabled: this.trailEnabled });
    }
    
    setTrailOpacity(opacity) {
        this.trailOpacity = Math.max(0.1, Math.min(1.0, opacity));
    }
    
    setTrailColor(color) {
        this.trailColor = color; // null for dynamic, or specific colour string
    }
}



// Conway's Game of Life
class ConwayGameOfLife extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx, 'conway');
        this.grids = null;
        this.speed = 30; // FPS for simulation speed
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / this.speed; // milliseconds between updates
    }
    
    init() {
        super.init();
        this.initData();
    }
    
    initData() {
        this.initGrids();
    }
    
    initGrids() {
        this.grids = this.createGrids(this.rows, this.cols, false);
    }
    
    // Override lifecycle methods
    reset() {
        super.reset();
        this.initData();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.initGrids(); // Only clear the grids, keep generation count and simulation state
        this.draw();
    }
    
    resize() {
        super.resize();
        this.initData();
    }
    
    // Override to preserve grid state during resize
    resizePreserveState() {
        // Store current grid state before resize
        const preservedState = this.getState();
        
        // Perform resize
        this.resize();
        
        // Restore grid state after resize
        this.setState(preservedState);
    }
    
    // Override to preserve grid data
    getState() {
        const state = super.getState();
        if (this.grids) {
            state.grids = {
                current: this.grids.current.map(row => [...row]),
                next: this.grids.next.map(row => [...row])
            };
        }
        return state;
    }
    
    setState(state) {
        super.setState(state);
        if (state.grids && this.grids) {
            // Copy the preserved grid data to the new grid dimensions
            const oldCurrent = state.grids.current;
            const oldNext = state.grids.next;
            
            // Clear the new grids
            this.initGrids();
            
            // Copy data from old grids to new grids, handling size differences
            const minRows = Math.min(oldCurrent.length, this.rows);
            const minCols = Math.min(oldCurrent[0]?.length || 0, this.cols);
            
            for (let row = 0; row < minRows; row++) {
                for (let col = 0; col < minCols; col++) {
                    this.grids.current[row][col] = oldCurrent[row][col];
                    this.grids.next[row][col] = oldNext[row][col];
                }
            }
            
            // Update cell count
            this.cellCount = this.countLiveCells(this.grids.current);
        }
    }
    
    update() {
        this.generation++;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbours = this.countNeighbours(this.grids.current, row, col, this.rows, this.cols);
                const isAlive = this.grids.current[row][col];
                
                if (isAlive) {
                    this.grids.next[row][col] = neighbours === 2 || neighbours === 3;
                } else {
                    this.grids.next[row][col] = neighbours === 3;
                }
            }
        }
        
        // Swap grids
        this.swapGrids(this.grids);
        
        // Update cell count
        this.cellCount = this.countLiveCells(this.grids.current);
    }
    
    draw() {
        this.drawGrid(this.grids.current);
    }
    
    toggleCell(x, y) {
        const { col, row } = this.screenToGrid(x, y);
        
        if (this.isValidGridPosition(row, col)) {
            this.grids.current[row][col] = !this.grids.current[row][col];
            this.cellCount = this.countLiveCells(this.grids.current);
            this.draw();
        }
    }
    
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
    
    randomize() {
        // Clear existing pattern
        this.initGrids();
        
        // Fill with random cells (30% density)
        this.cellCount = this.randomizeGrid(this.grids.current, 0.3);
        this.generation = 0;
        this.draw();
    }
}

// Termite Algorithm
class TermiteAlgorithm extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx, 'termite');
        this.termites = [];
        this.woodChips = new Set();
        this.maxTermites = 50;
        this.speed = 30; // steps per second
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / this.speed; // milliseconds between updates
    }
    
    init() {
        super.init();
        this.initData();
    }
    
    initData() {
        this.initTermites();
        this.initWoodChips();
    }
    
    initTermites() {
        this.termites = [];
        for (let i = 0; i < this.maxTermites; i++) {
            this.termites.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                angle: Math.random() * Math.PI * 2,
                carrying: false,
                trail: [] // Initialize empty trail
            });
        }
    }
    
    initWoodChips() {
        this.woodChips.clear();
        const numChips = Math.floor((this.cols * this.rows) * 0.3);
        
        for (let i = 0; i < numChips; i++) {
            const x = Math.floor(Math.random() * this.cols) * this.cellSize;
            const y = Math.floor(Math.random() * this.rows) * this.cellSize;
            this.woodChips.add(`${x},${y}`);
        }
    }
    
    // Override lifecycle methods
    reset() {
        super.reset();
        this.initData();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.woodChips.clear();
        this.termites.forEach(termite => termite.carrying = false);
        this.draw();
    }
    
    resize() {
        super.resize();
        this.initData();
    }
    
    update() {
        this.generation++;
        this.cellCount = this.woodChips.size;
        
        this.termites.forEach(termite => {
            // Update trail before moving
            this.updateActorTrail(termite, termite.x, termite.y);
            
            // Move termite
            const speed = 2; // Base movement speed
            termite.x += Math.cos(termite.angle) * speed;
            termite.y += Math.sin(termite.angle) * speed;
            
            // Wrap around edges
            termite.x = (termite.x + this.canvas.width) % this.canvas.width;
            termite.y = (termite.y + this.canvas.height) % this.canvas.height;
            
            // Check for wood chips
            const gridX = Math.floor(termite.x / this.cellSize) * this.cellSize;
            const gridY = Math.floor(termite.y / this.cellSize) * this.cellSize;
            const chipKey = `${gridX},${gridY}`;
            
            if (termite.carrying) {
                // Drop wood chip if on empty space
                if (!this.woodChips.has(chipKey)) {
                    this.woodChips.add(chipKey);
                    termite.carrying = false;
                }
            } else {
                // Pick up wood chip if on wood chip
                if (this.woodChips.has(chipKey)) {
                    this.woodChips.delete(chipKey);
                    termite.carrying = true;
                }
            }
            
            // Random direction change
            if (Math.random() < 0.1) {
                termite.angle += (Math.random() - 0.5) * Math.PI / 2;
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw wood chips
        this.woodChips.forEach(chipKey => {
            const [x, y] = chipKey.split(',').map(Number);
            this.drawCell(x, y);
        });
        
        // Draw termites with trails
        this.termites.forEach(termite => {
            // Draw trail first (behind the termite)
            this.drawActorTrail(termite, 2);
            
            // Draw termite
            this.drawActor(termite.x, termite.y, 3);
            this.drawDirectionIndicator(termite.x, termite.y, termite.angle);
        });
    }
    
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
    
    setTermiteCount(count) {
        this.maxTermites = count;
        this.initTermites();
    }
    
    randomize() {
        this.woodChips.clear();
        const numChips = Math.floor((this.cols * this.rows) * 0.3);
        
        for (let i = 0; i < numChips; i++) {
            const x = Math.floor(Math.random() * this.cols) * this.cellSize;
            const y = Math.floor(Math.random() * this.rows) * this.cellSize;
            this.woodChips.add(`${x},${y}`);
        }
        
        // Reset termites to not carrying anything
        this.termites.forEach(termite => termite.carrying = false);
        
        // Redraw to show the new random pattern
        this.draw();
    }
}

// Langton's Ant
class LangtonsAnt extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx, 'langton');
        this.ants = [{ x: 0, y: 0, direction: 0 }]; // 0: up, 1: right, 2: down, 3: left
        this.grid = [];
        this.rules = ['R', 'L']; // Standard Langton's ant rules
        this.speed = 30; // steps per second
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / this.speed; // milliseconds between updates
    }
    
    init() {
        super.init();
        this.initData();
    }
    
    initData() {
        this.initGrid();
        this.resetAnts();
    }
    
    initGrid() {
        this.grid = this.createGrid(this.rows, this.cols, false);
    }
    
    resetAnts() {
        this.ants = [{ 
            x: Math.floor(this.cols / 2), 
            y: Math.floor(this.rows / 2), 
            direction: 0,
            trail: [] // Initialize empty trail
        }];
    }
    
    // Override lifecycle methods
    reset() {
        super.reset();
        this.initData();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.initGrid(); // Only clear the grid, keep ants in current positions
        this.draw();
    }
    
    resize() {
        super.resize();
        this.initData();
    }
    
    // Override to preserve grid and ant state during resize
    resizePreserveState() {
        // Store current state before resize
        const preservedState = this.getState();
        
        // Perform resize
        this.resize();
        
        // Restore state after resize
        this.setState(preservedState);
    }
    
    // Override to preserve grid and ant data
    getState() {
        const state = super.getState();
        if (this.grid) {
            state.grid = this.grid.map(row => [...row]);
        }
        if (this.ants) {
            state.ants = this.ants.map(ant => ({ ...ant }));
        }
        return state;
    }
    
    setState(state) {
        super.setState(state);
        if (state.grid && this.grid) {
            // Copy the preserved grid data to the new grid dimensions
            const oldGrid = state.grid;
            
            // Clear the new grid
            this.initGrid();
            
            // Copy data from old grid to new grid, handling size differences
            const minRows = Math.min(oldGrid.length, this.rows);
            const minCols = Math.min(oldGrid[0]?.length || 0, this.cols);
            
            for (let row = 0; row < minRows; row++) {
                for (let col = 0; col < minCols; col++) {
                    this.grid[row][col] = oldGrid[row][col];
                }
            }
        }
        
        if (state.ants && this.ants) {
            // Restore ant positions, adjusting for new grid size
            this.ants = state.ants.map(ant => ({
                x: Math.min(ant.x, this.cols - 1),
                y: Math.min(ant.y, this.rows - 1),
                direction: ant.direction,
                trail: ant.trail || [] // Preserve trail data
            }));
        }
        
        // Update cell count
        this.cellCount = this.countLiveCells(this.grid);
    }
    
    update() {
        this.generation++;
        
        // Update each ant
        this.ants.forEach(ant => {
            // Get current cell state
            const currentCell = this.grid[ant.y][ant.x];
            
            // Update trail before moving (convert grid coordinates to screen coordinates)
            const antX = ant.x * this.cellSize + this.cellSize / 2;
            const antY = ant.y * this.cellSize + this.cellSize / 2;
            this.updateActorTrail(ant, antX, antY);
            
            // Flip the cell
            this.grid[ant.y][ant.x] = !currentCell;
            
            // Turn based on cell state
            const rule = this.rules[currentCell ? 1 : 0];
            if (rule === 'R') {
                ant.direction = (ant.direction + 1) % 4;
            } else {
                ant.direction = (ant.direction + 3) % 4;
            }
            
            // Move forward
            switch (ant.direction) {
                case 0: ant.y = (ant.y - 1 + this.rows) % this.rows; break; // Up
                case 1: ant.x = (ant.x + 1) % this.cols; break; // Right
                case 2: ant.y = (ant.y + 1) % this.rows; break; // Down
                case 3: ant.x = (ant.x - 1 + this.cols) % this.cols; break; // Left
            }
        });
        
        // Update cell count
        this.cellCount = this.countLiveCells(this.grid);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid using common utility
        this.drawGrid(this.grid);
        
        // Draw each ant with trails
        this.ants.forEach(ant => {
            const antX = ant.x * this.cellSize + this.cellSize / 2;
            const antY = ant.y * this.cellSize + this.cellSize / 2;
            
            // Draw trail first (behind the ant)
            this.drawActorTrail(ant, this.cellSize / 4);
            
            // Draw ant
            this.drawActor(antX, antY, this.cellSize / 3);
            
            // Draw direction indicator using common utility
            const directionAngle = ant.direction * Math.PI / 2;
            this.drawDirectionIndicator(antX, antY, directionAngle, this.cellSize / 2, '#ffffff', 2);
        });
    }
    
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
    
    addAnt(mouseX = null, mouseY = null) {
        let x, y;
        
        if (mouseX !== null && mouseY !== null) {
            // Convert screen coordinates to grid coordinates
            const gridPos = this.screenToGrid(mouseX, mouseY);
            
            // Clamp to valid grid bounds
            x = Math.max(0, Math.min(this.cols - 1, gridPos.col));
            y = Math.max(0, Math.min(this.rows - 1, gridPos.row));
        } else {
            // Fallback to random position if no mouse coordinates provided
            x = Math.floor(Math.random() * this.cols);
            y = Math.floor(Math.random() * this.rows);
        }
        
        // Add a new ant at the specified or random position
        const newAnt = {
            x: x,
            y: y,
            direction: Math.floor(Math.random() * 4),
            trail: [] // Initialize empty trail
        };
        this.ants.push(newAnt);
        
        // Draw immediately so the ant is visible even when paused
        this.draw();
    }
    
    randomize() {
        // Clear existing pattern
        this.initGrid();
        
        // Fill with random cells (50% density of white cells)
        this.cellCount = this.randomizeGrid(this.grid, 0.5);
        this.generation = 0;
        this.draw();
    }
}

// Simulation factory
class SimulationFactory {
    static createSimulation(type, canvas, ctx) {
        switch (type) {
            case 'conway':
                return new ConwayGameOfLife(canvas, ctx);
            case 'termite':
                return new TermiteAlgorithm(canvas, ctx);
            case 'langton':
                return new LangtonsAnt(canvas, ctx);
            default:
                throw new Error(`Unknown simulation type: ${type}`);
        }
    }
} 