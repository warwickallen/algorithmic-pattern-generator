// Dynamic colour scheme implementation based on four-corner hue rotation
class DynamicColourScheme {
  constructor() {
    // Corner configurations from the YAML specification
    this.corners = {
      topLeft: { startHue: 45, period: 60000 }, // 60 seconds
      topRight: { startHue: 135, period: 75000 }, // 75 seconds
      bottomRight: { startHue: 225, period: 90000 }, // 90 seconds
      bottomLeft: { startHue: 315, period: 105000 }, // 105 seconds
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
      return this.getBilinearHue(
        normX,
        normY,
        topLeftHue,
        topRightHue,
        bottomRightHue,
        bottomLeftHue
      );
    }

    // For dynamic rendering, use time-based hues
    const topLeftHue = this.getCornerHue("topLeft", currentTime);
    const topRightHue = this.getCornerHue("topRight", currentTime);
    const bottomRightHue = this.getCornerHue("bottomRight", currentTime);
    const bottomLeftHue = this.getCornerHue("bottomLeft", currentTime);

    // Use proper bilinear interpolation with circular hue handling
    return this.getBilinearHue(
      normX,
      normY,
      topLeftHue,
      topRightHue,
      bottomRightHue,
      bottomLeftHue
    );
  }

  // Get hue using proper bilinear interpolation with circular hue handling
  getBilinearHue(
    normX,
    normY,
    topLeftHue,
    topRightHue,
    bottomRightHue,
    bottomLeftHue
  ) {
    // Convert all hues to unit vectors on the colour wheel
    const topLeftVector = this.hueToVector(topLeftHue);
    const topRightVector = this.hueToVector(topRightHue);
    const bottomRightVector = this.hueToVector(bottomRightHue);
    const bottomLeftVector = this.hueToVector(bottomLeftHue);

    // Interpolate vectors instead of angles
    const topVector = this.interpolateVector(
      topLeftVector,
      topRightVector,
      normX
    );
    const bottomVector = this.interpolateVector(
      bottomLeftVector,
      bottomRightVector,
      normX
    );
    const finalVector = this.interpolateVector(topVector, bottomVector, normY);

    // Convert back to hue
    return this.vectorToHue(finalVector);
  }

  // Convert hue to unit vector on the colour wheel
  hueToVector(hue) {
    const angle = (hue * Math.PI) / 180;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
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
        y: y / length,
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

  // Convert HSL to RGB using shared utility
  hslToRgb(h, s, l) {
    if (typeof ColorUtils !== "undefined") {
      return ColorUtils.hslToRgb(h, s, l);
    }
    // Fallback (should not be used when utils loaded)
    const [r, g, b] = (function (hh, ss, ll) {
      hh /= 360;
      ss /= 100;
      ll /= 100;
      const c = (1 - Math.abs(2 * ll - 1)) * ss;
      const x = c * (1 - Math.abs(((hh * 6) % 2) - 1));
      const m = ll - c / 2;
      let r, g, b;
      if (hh < 1 / 6) {
        r = c;
        g = x;
        b = 0;
      } else if (hh < 2 / 6) {
        r = x;
        g = c;
        b = 0;
      } else if (hh < 3 / 6) {
        r = 0;
        g = c;
        b = x;
      } else if (hh < 4 / 6) {
        r = 0;
        g = x;
        b = c;
      } else if (hh < 5 / 6) {
        r = x;
        g = 0;
        b = c;
      } else {
        r = c;
        g = 0;
        b = x;
      }
      return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
      ];
    })(h, s, l);
    return { r, g, b };
  }

  // Get RGB colour for a position with specified saturation and lightness
  getColourAtPosition(
    x,
    y,
    canvasWidth,
    canvasHeight,
    saturation = 80,
    lightness = 50,
    currentTime = null
  ) {
    const hue = this.getHueAtPosition(
      x,
      y,
      canvasWidth,
      canvasHeight,
      currentTime
    );
    const rgb = this.hslToRgb(hue, saturation, lightness);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
}

// Centralised Error Handling (R6 Implementation)
class ErrorHandler {
  constructor() {
    this.strategies = new Map();
    this.defaultStrategy = {
      handle: ({ type, simulationId, scope, message, error }) => {
        const simPart = simulationId ? `[${simulationId}] ` : "";
        const scopePart = scope ? `${scope}: ` : "";
        console.error(
          `ErrorHandler ${simPart}${type} ${scopePart}${message}`,
          error
        );
      },
    };
    this.metrics = {
      total: 0,
      byType: new Map(),
      bySimulation: new Map(),
    };
  }

  setDefaultStrategy(strategy) {
    if (strategy && typeof strategy.handle === "function") {
      this.defaultStrategy = strategy;
    }
  }

  registerStrategy(simulationId, strategy) {
    if (!simulationId || !strategy || typeof strategy.handle !== "function")
      return;
    this.strategies.set(simulationId, strategy);
  }

  handle({
    type,
    simulationId = null,
    scope = null,
    message = "",
    error = null,
  }) {
    // Update metrics
    this.metrics.total++;
    this.metrics.byType.set(type, (this.metrics.byType.get(type) || 0) + 1);
    if (simulationId) {
      const simCounts = this.metrics.bySimulation.get(simulationId) || {};
      simCounts[type] = (simCounts[type] || 0) + 1;
      this.metrics.bySimulation.set(simulationId, simCounts);
    }

    // Route to strategy
    const strategy =
      (simulationId && this.strategies.get(simulationId)) ||
      this.defaultStrategy;
    try {
      strategy.handle({ type, simulationId, scope, message, error });
    } catch (strategyError) {
      // Fallback to console if strategy itself fails
      console.error("ErrorHandler strategy failure:", strategyError);
      console.error("Original error context:", {
        type,
        simulationId,
        scope,
        message,
      });
      if (error) console.error("Original error:", error);
    }
  }

  getMetrics() {
    // Return a shallow clone that is easy to inspect in tests/UIs
    const byType = {};
    for (const [k, v] of this.metrics.byType.entries()) byType[k] = v;
    const bySimulation = {};
    for (const [sim, counts] of this.metrics.bySimulation.entries()) {
      bySimulation[sim] = { ...counts };
    }
    return { total: this.metrics.total, byType, bySimulation };
  }
}

// Global error handler instance
const errorHandler = new ErrorHandler();
if (typeof window !== "undefined") {
  window.ErrorHandler = ErrorHandler;
  window.errorHandler = errorHandler;
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
      onDestroy: () => console.log(`Simulation ${simulationId} destroyed`),
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
        errorHandler.handle({
          type: "hook",
          simulationId,
          scope: hookName,
          message: `Error executing lifecycle hook`,
          error,
        });
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
      serializer: null,

      // Get current state
      getState() {
        return { ...this.state };
      },

      // Set state
      setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();
      },

      // Register simulation-specific serializer
      registerSerializer(serializer) {
        this.serializer = serializer;
      },

      // Whether a serializer is registered
      hasSerializer() {
        return !!this.serializer;
      },

      // Produce simulation-specific serialised fragment
      serialize(simulationInstance) {
        if (this.serializer && typeof this.serializer.capture === "function") {
          try {
            return this.serializer.capture(simulationInstance) || {};
          } catch (error) {
            errorHandler.handle({
              type: "serialize",
              simulationId:
                simulationInstance && simulationInstance.simulationId,
              scope: "StateManager.serialize",
              message: "Error capturing simulation state",
              error,
            });
            return {};
          }
        }
        return {};
      },

      // Restore simulation-specific state
      deserialize(simulationInstance, state) {
        if (this.serializer && typeof this.serializer.restore === "function") {
          try {
            this.serializer.restore(simulationInstance, state);
          } catch (error) {
            errorHandler.handle({
              type: "deserialize",
              simulationId:
                simulationInstance && simulationInstance.simulationId,
              scope: "StateManager.deserialize",
              message: "Error restoring simulation state",
              error,
            });
          }
        }
      },

      // Subscribe to state changes
      subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
      },

      // Notify subscribers of state changes
      notifySubscribers() {
        this.subscribers.forEach((callback) => {
          try {
            callback(this.state);
          } catch (error) {
            errorHandler.handle({
              type: "subscriber",
              simulationId: null,
              scope: "StateManager.notifySubscribers",
              message: "Error in state subscriber",
              error,
            });
          }
        });
      },
    };
  }

  // Create standardized event handler
  createEventHandler(simulationId = null) {
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
          handlers.forEach((handler) => {
            try {
              handler(...args);
            } catch (error) {
              errorHandler.handle({
                type: "eventHandler",
                simulationId,
                scope: eventName,
                message: "Error in event handler",
                error,
              });
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
      },
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
      cacheMisses: 0,
    };
  }

  // Unified colour management
  createColorManager() {
    return {
      // Convert HSL to RGB using shared utility
      hslToRgb(h, s, l) {
        if (typeof ColorUtils !== "undefined") {
          const { r, g, b } = ColorUtils.hslToRgb(h, s, l);
          return [r, g, b];
        }
        // Fallback minimal inline to avoid runtime breakage
        const convert = (hh, ss, ll) => {
          hh /= 360;
          ss /= 100;
          ll /= 100;
          const c = (1 - Math.abs(2 * ll - 1)) * ss;
          const x = c * (1 - Math.abs(((hh * 6) % 2) - 1));
          const m = ll - c / 2;
          let r, g, b;
          if (hh < 1 / 6) {
            r = c;
            g = x;
            b = 0;
          } else if (hh < 2 / 6) {
            r = x;
            g = c;
            b = 0;
          } else if (hh < 3 / 6) {
            r = 0;
            g = c;
            b = x;
          } else if (hh < 4 / 6) {
            r = 0;
            g = x;
            b = c;
          } else if (hh < 5 / 6) {
            r = x;
            g = 0;
            b = c;
          } else {
            r = c;
            g = 0;
            b = x;
          }
          return [
            Math.round((r + m) * 255),
            Math.round((g + m) * 255),
            Math.round((b + m) * 255),
          ];
        };
        return convert(h, s, l);
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

        if (color.startsWith("#")) {
          const hex = color.slice(1);
          rgb = [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
          ];
        } else if (color.startsWith("rgb")) {
          rgb = color.match(/\d+/g).map(Number);
        } else {
          return color; // Return as-is for unsupported formats
        }

        const adjustedRgb = rgb.map((c) =>
          Math.min(255, Math.max(0, Math.round(c * brightness)))
        );
        const result = `rgb(${adjustedRgb[0]}, ${adjustedRgb[1]}, ${adjustedRgb[2]})`;

        // Cache the result
        if (this.colorCache.size < this.maxCacheSize) {
          this.colorCache.set(cacheKey, result);
        }

        return result;
      },

      // Interpolate between two colours using shared utility
      interpolateColor(color1, color2, factor) {
        const cacheKey = `${color1}-${color2}-${factor}`;
        if (this.colorCache.has(cacheKey)) {
          this.performanceMetrics.cacheHits++;
          return this.colorCache.get(cacheKey);
        }
        this.performanceMetrics.cacheMisses++;
        let result;
        if (typeof ColorUtils !== "undefined") {
          result = ColorUtils.interpolateColor(color1, color2, factor);
        } else {
          // Minimal inline fallback
          const clamp = (v) => Math.max(0, Math.min(1, v));
          const f = clamp(factor);
          const parse = (c) =>
            c.startsWith("#")
              ? [
                  parseInt(c.slice(1, 3), 16),
                  parseInt(c.slice(3, 5), 16),
                  parseInt(c.slice(5, 7), 16),
                ]
              : (c.match(/\d+/g) || []).slice(0, 3).map(Number);
          const a = parse(color1);
          const b = parse(color2);
          if (!a || !b || a.length < 3 || b.length < 3) return color1;
          const out = a.map((c1, i) => Math.round(c1 + (b[i] - c1) * f));
          result = `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
        }
        if (this.colorCache.size < this.maxCacheSize) {
          this.colorCache.set(cacheKey, result);
        }
        return result;
      },

      // Parse colour string to RGB array using shared utility
      parseColor(color) {
        if (typeof ColorUtils !== "undefined") {
          return ColorUtils.parseColor(color);
        }
        const matches = color && color.match && color.match(/\d+/g);
        return matches ? matches.slice(0, 3).map(Number) : null;
      },
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
            setTimeout(() => (inThrottle = false), limit);
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
      },
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
              ctx.fillStyle = grid[row][col] ? "#ffffff" : "#000000";
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
        ctx.rotate((direction * Math.PI) / 2);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fill();

        // Draw direction indicator
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius + 2);
        ctx.stroke();

        ctx.restore();
      },
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
      cacheMisses: 0,
    };
  }
}

// Global rendering utilities instance
const renderingUtils = new RenderingUtils();

// Base simulation class with performance optimization
class BaseSimulation {
  constructor(canvas, ctx, simulationId = "base") {
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

    // Re-engineered fade-to-black configuration
    this.fadeOutCycles =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.FADE_OUT_CYCLES_DEFAULT
        : 5; // Number of cycles to fade to black (configurable)
    this.fadeDecrement =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.FADE_DECREMENT_DEFAULT
        : 0.2; // Amount to decrease brightness each cycle (configurable)
    this.cellBrightness = new Map(); // Track brightness for each cell: {row,col} -> brightness (0-1)

    // Performance optimization properties
    this.lastUpdateTime = 0;
    this.updateInterval =
      1000 /
      (typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_DEFAULT
        : 30); // Default 30 FPS
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

    // Grid offsets for centring when canvas is not an exact multiple of cell size
    this.gridOffsetX = 0;
    this.gridOffsetY = 0;

    // Shared actor rendering options
    this.showDirectionIndicator = true;

    // Lifecycle framework integration
    this.stateManager = simulationLifecycleFramework.createStateManager({
      isRunning: false,
      generation: 0,
      cellCount: 0,
      brightness: 1.0,
      trailLength: this.trailLength,
      trailEnabled: this.trailEnabled,
    });

    this.eventHandler = simulationLifecycleFramework.createEventHandler(
      this.simulationId
    );

    // Register with lifecycle framework
    simulationLifecycleFramework.registerStateManager(
      this.simulationId,
      this.stateManager
    );
    simulationLifecycleFramework.registerEventHandlers(
      this.simulationId,
      this.eventHandler
    );

    // Rendering utilities integration
    this.colorManager = renderingUtils.createColorManager();
    this.performanceOptimizer = renderingUtils.createPerformanceOptimizer();
    this.gridRenderer = renderingUtils.createGridRenderer();
  }

  init() {
    simulationLifecycleFramework.executeHook(this.simulationId, "onInit");
    this.resize();
    this.reset();
    this.initDragToggling();
  }

  resize() {
    // Check if canvas is attached to DOM
    const isAttached = this.canvas.parentNode !== null;

    const originalWidth = this.canvas.width;
    const originalHeight = this.canvas.height;

    if (isAttached) {
      // For attached canvases, use a more robust approach to handle browser differences
      // The canvas is styled with width: 100% and height: 100%, so we need to get the actual viewport size

      // Method 1: Use window dimensions as the primary source for viewport-sized canvas
      let targetWidth = window.innerWidth;
      let targetHeight = window.innerHeight;

      // Method 2: If window dimensions seem unreasonable, fall back to getBoundingClientRect
      if (
        targetWidth <= 0 ||
        targetHeight <= 0 ||
        targetWidth > 5000 ||
        targetHeight > 5000
      ) {
        const rect = this.canvas.getBoundingClientRect();
        targetWidth = rect.width;
        targetHeight = rect.height;
      }

      // Method 3: If still unreasonable, use parent container size
      if (
        targetWidth <= 0 ||
        targetHeight <= 0 ||
        targetWidth > 5000 ||
        targetHeight > 5000
      ) {
        const parent = this.canvas.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          targetWidth = parentRect.width;
          targetHeight = parentRect.height;
        }
      }

      // Method 4: Final fallback to reasonable defaults
      if (targetWidth <= 0 || targetHeight <= 0) {
        targetWidth = 800;
        targetHeight = 600;
      }

      // Set canvas dimensions
      this.canvas.width = targetWidth;
      this.canvas.height = targetHeight;
    } else {
      // For detached canvases (like in tests), use the canvas attributes
      // These should already be set by the test code
      this.canvas.width = this.canvas.width || 800;
      this.canvas.height = this.canvas.height || 600;
    }

    // Ensure minimum canvas dimensions
    if (this.canvas.width <= 0 || this.canvas.height <= 0) {
      console.warn("Canvas dimensions are invalid, using fallback values");
      this.canvas.width = 800;
      this.canvas.height = 600;
    }

    // Calculate cell size targeting ~100 cells on the smaller axis (no perfect-divisibility requirement)
    const targetCells = 100; // Target approximately 100 cells along the smaller dimension
    const minDimension = Math.min(this.canvas.width, this.canvas.height);
    this.cellSize = Math.max(1, Math.floor(minDimension / targetCells));

    // Compute grid dimensions
    this.cols = Math.max(1, Math.floor(this.canvas.width / this.cellSize));
    this.rows = Math.max(1, Math.floor(this.canvas.height / this.cellSize));

    // Centre the grid within the canvas
    const gridPixelWidth = this.cols * this.cellSize;
    const gridPixelHeight = this.rows * this.cellSize;
    this.gridOffsetX = Math.floor((this.canvas.width - gridPixelWidth) / 2);
    this.gridOffsetY = Math.floor((this.canvas.height - gridPixelHeight) / 2);

    // Clear caches on resize
    this.clearCaches();

    simulationLifecycleFramework.executeHook(this.simulationId, "onResize");
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
    const baseState = {
      generation: this.generation,
      cellCount: this.cellCount,
      isRunning: this.isRunning,
      trailLength: this.trailLength,
      trailEnabled: this.trailEnabled,
    };
    // Merge in simulation-specific serialised state if available
    if (
      this.stateManager &&
      typeof this.stateManager.serialize === "function"
    ) {
      const extra = this.stateManager.serialize(this) || {};
      return { ...baseState, ...extra };
    }
    return baseState;
  }

  setState(state) {
    // Default implementation - override in subclasses
    this.generation = state.generation || 0;
    this.cellCount = state.cellCount || 0;
    this.isRunning = state.isRunning || false;
    this.trailLength = state.trailLength || 30;
    this.trailEnabled =
      state.trailEnabled !== undefined ? state.trailEnabled : true;
    // Delegate simulation-specific restore if available
    if (
      this.stateManager &&
      typeof this.stateManager.deserialize === "function"
    ) {
      this.stateManager.deserialize(this, state);
    }
  }

  start() {
    this.isRunning = true;
    this.stateManager.setState({ isRunning: true });
    simulationLifecycleFramework.executeHook(this.simulationId, "onStart");
    this.animate();
  }

  pause() {
    this.isRunning = false;
    this.stateManager.setState({ isRunning: false });
    simulationLifecycleFramework.executeHook(this.simulationId, "onPause");
  }

  reset() {
    this.generation = 0;
    this.cellCount = 0;
    this.clearFadeStates(); // Clear fade states when simulation is reset
    this.stateManager.setState({
      generation: 0,
      cellCount: 0,
    });
    simulationLifecycleFramework.executeHook(this.simulationId, "onReset");
  }

  clear() {
    this.generation = 0;
    this.cellCount = 0;
    this.clearFadeStates(); // Clear fade states when grid is cleared
    this.stateManager.setState({ cellCount: 0 });
    simulationLifecycleFramework.executeHook(this.simulationId, "onClear");
  }

  animate(currentTime = 0) {
    if (!this.isRunning) return;

    // Calculate FPS
    this.frameCount++;
    if (this.frameCount % this.fpsUpdateInterval === 0) {
      this.fps = Math.round(
        (this.fpsUpdateInterval * 1000) / (currentTime - this.lastTime)
      );
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
    simulationLifecycleFramework.executeHook(this.simulationId, "onUpdate");
  }

  draw() {
    // Override in subclasses
    simulationLifecycleFramework.executeHook(this.simulationId, "onDraw");
  }

  getStats() {
    return {
      generation: this.generation,
      cellCount: this.cellCount,
      fps: this.fps,
    };
  }

  setBrightness(value) {
    this.brightness = Math.max(0.1, Math.min(2.0, value));
    // Clear color cache when brightness changes
    this.colorCache.clear();
  }

  // Shared actor rendering toggles
  setShowDirectionIndicator(enabled) {
    this.showDirectionIndicator = !!enabled;
  }

  getShowDirectionIndicator() {
    return !!this.showDirectionIndicator;
  }

  // Fade-to-black configuration methods
  setFadeOutCycles(cycles) {
    this.fadeOutCycles = Math.max(1, Math.min(20, cycles)); // Limit between 1-20 cycles
  }

  getFadeOutCycles() {
    return this.fadeOutCycles;
  }

  // Legacy fade state methods for compatibility with other simulation types
  // These now use the new brightness system internally
  updateFadeStates(grid) {
    // For Conway's Game of Life, use the new 3-step process
    // For other simulations, use the legacy approach but with brightness system
    if (this.constructor.name === "ConwayGameOfLife") {
      // Conway's Game of Life uses the new system in its update() method
      return;
    }

    // Legacy approach for other simulations
    const currentGeneration = this.generation;

    // Debug logging for timing issues
    if (window.DEBUG_FADE && currentGeneration > 0) {
      console.log(
        `updateFadeStates called for generation ${currentGeneration}`
      );
    }

    // Ensure initialInactiveCells is always initialized
    if (!this.initialInactiveCells) {
      this.initialInactiveCells = new Set();
    }

    // If this is the first generation (generation 0), populate the initial state tracking
    if (currentGeneration === 0) {
      // Populate tracking of cells that were inactive from the start
      this.initialInactiveCells.clear();
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (!grid[row][col]) {
            this.initialInactiveCells.add(`${row},${col}`);
          }
        }
      }
      return; // Don't process fade states on generation 0
    }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cellKey = `${row},${col}`;
        const isActive = grid[row][col];

        if (isActive) {
          // Cell is active - set brightness to 1
          this.cellBrightness.set(cellKey, 1);
          // Remove from initial inactive set if it was there
          this.initialInactiveCells.delete(cellKey);
        } else {
          // Cell is inactive - check if we need to start or continue fading
          const brightness = this.cellBrightness.get(cellKey);
          if (brightness === undefined) {
            // Only create brightness data if this cell was not initially inactive
            if (!this.initialInactiveCells.has(cellKey)) {
              // First time seeing this inactive cell - start fade
              this.cellBrightness.set(cellKey, 1);
            }
            // If it was initially inactive, don't create brightness data - cell remains black
          } else if (brightness > 0) {
            // Cell has brightness data - continue fading
            const newBrightness = Math.max(0, brightness - this.fadeDecrement);
            this.cellBrightness.set(cellKey, newBrightness);
            // Keep zero entries so we don't accidentally re-brighten later
          }
          // If brightness is already 0, don't do anything - cell stays black
        }
      }
    }
  }

  // Get fade factor for a specific cell (0 = fully faded to black, 1 = full brightness)
  getCellFadeFactor(row, col, isActive = null) {
    // Use the new brightness system directly
    return this.getCellBrightness(row, col);
  }

  // Clear all fade states (useful for reset/clear operations)
  clearFadeStates() {
    this.cellBrightness.clear();
  }

  // Re-engineered fade-to-black methods
  updateCellBrightness() {
    // Step 1: Decrease each cell's brightness value by configurable amount
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cellKey = `${row},${col}`;
        const currentBrightness = this.cellBrightness.get(cellKey) || 0;
        const newBrightness = Math.max(
          0,
          currentBrightness - this.fadeDecrement
        );
        this.cellBrightness.set(cellKey, newBrightness);
      }
    }
  }

  setActiveCellBrightness(grid) {
    // Step 3: For all active cells, set the brightness value to 1
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (grid[row][col]) {
          const cellKey = `${row},${col}`;
          this.cellBrightness.set(cellKey, 1);
        }
      }
    }
  }

  getCellBrightness(row, col) {
    const cellKey = `${row},${col}`;
    return this.cellBrightness.get(cellKey) || 0;
  }

  setFadeDecrement(decrement) {
    this.fadeDecrement = Math.max(0.01, Math.min(1.0, decrement));
  }

  getFadeDecrement() {
    return this.fadeDecrement;
  }

  // Unified brightness handling helpers
  applyToggleBrightness(row, col, isActiveAfter) {
    const cellKey = `${row},${col}`;
    if (isActiveAfter) {
      this.cellBrightness.set(cellKey, 1);
      return;
    }
    const currentBrightness = this.cellBrightness.get(cellKey);
    this.cellBrightness.set(
      cellKey,
      currentBrightness === undefined ? 1 : currentBrightness
    );
  }

  resetBrightnessFromActiveGrid(isActivePredicate) {
    this.cellBrightness.clear();
    if (!this.initialInactiveCells) {
      this.initialInactiveCells = new Set();
    }
    this.initialInactiveCells.clear();

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (isActivePredicate(row, col)) {
          const cellKey = `${row},${col}`;
          this.cellBrightness.set(cellKey, 1);
        }
      }
    }
  }

  // Optimized brightness application with caching
  applyBrightness(color) {
    // Check cache first
    const cacheKey = `${color}-${this.brightness}`;
    if (this.colorCache.has(cacheKey)) {
      return this.colorCache.get(cacheKey);
    }

    // Parse the color (supports rgb, rgba, and hex formats)
    let r,
      g,
      b,
      a = 1;

    if (color.startsWith("rgb")) {
      // Handle rgb(r, g, b) or rgba(r, g, b, a) format
      const match = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
        a = match[4] ? parseFloat(match[4]) : 1;
      }
    } else if (color.startsWith("#")) {
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
    // Validate dimensions to prevent RangeError
    if (
      !Number.isInteger(rows) ||
      rows <= 0 ||
      !Number.isInteger(cols) ||
      cols <= 0
    ) {
      console.warn(
        `Invalid grid dimensions: rows=${rows}, cols=${cols}. Using minimum size of 1x1.`
      );
      rows = Math.max(1, Math.floor(rows) || 1);
      cols = Math.max(1, Math.floor(cols) || 1);
    }
    return Array(rows)
      .fill()
      .map(() => Array(cols).fill(defaultValue));
  }

  createGrids(rows, cols, defaultValue = false) {
    return {
      current: this.createGrid(rows, cols, defaultValue),
      next: this.createGrid(rows, cols, defaultValue),
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

    // Render ALL cells (both active and inactive) to show fade effects
    for (let row = 0; row < grid.length; row++) {
      const rowData = grid[row];
      for (let col = 0; col < rowData.length; col++) {
        const x = this.gridOffsetX + col * this.cellSize;
        const y = this.gridOffsetY + row * this.cellSize;
        const isActive = rowData[col];

        if (cellRenderer && typeof cellRenderer === "function") {
          cellRenderer(x, y, row, col, isActive);
        } else {
          this.drawCell(x, y, null, isActive);
        }
      }
    }
  }

  // Common random grid generation utility
  randomizeGrid(
    grid,
    density = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    for (let row = 0; row < grid.length; row++) {
      const rowData = grid[row];
      for (let col = 0; col < rowData.length; col++) {
        rowData[col] = Math.random() < density;
      }
    }
    return this.countLiveCells(grid);
  }

  // Base randomize method with common pattern
  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    // Default implementation - subclasses can override if they need special behavior
    console.warn(`randomize() not implemented for ${this.simulationId}`);
  }

  // Common cell coordinate conversion utilities
  screenToGrid(x, y) {
    const localX = x - this.gridOffsetX;
    const localY = y - this.gridOffsetY;
    return {
      col: Math.floor(localX / this.cellSize),
      row: Math.floor(localY / this.cellSize),
    };
  }

  gridToScreen(col, row) {
    return {
      x: this.gridOffsetX + col * this.cellSize,
      y: this.gridOffsetY + row * this.cellSize,
    };
  }

  isValidGridPosition(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  // Generic cell toggling method - to be overridden by subclasses
  toggleCell(x, y) {
    // Default implementation - subclasses should override this
    console.warn(
      `toggleCell not implemented for ${this.simulationId} simulation`
    );
  }

  // Click-and-drag cell toggling functionality
  initDragToggling() {
    this.isDragging = false;
    this.dragStartPos = null;
    this.lastDragPos = null;
    this.toggledCells = new Set(); // Track cells toggled during this drag

    // Store bound handlers for cleanup
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);

    // Bind event handlers
    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("mouseup", this.boundMouseUp);
    this.canvas.addEventListener("mouseleave", this.boundMouseUp);
  }

  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.isDragging = true;
    this.dragStartPos = { x, y };
    this.lastDragPos = { x, y };
    this.toggledCells.clear();

    // Toggle the initial cell
    this.toggleCellAtPosition(x, y);
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Toggle cells along the drag path
    this.toggleCellsAlongPath(this.lastDragPos.x, this.lastDragPos.y, x, y);

    this.lastDragPos = { x, y };
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.dragStartPos = null;
    this.lastDragPos = null;
    this.toggledCells.clear();
  }

  toggleCellAtPosition(x, y) {
    const gridPos = this.screenToGrid(x, y);
    if (gridPos && this.isValidGridPosition(gridPos.row, gridPos.col)) {
      const cellKey = `${gridPos.row},${gridPos.col}`;
      if (!this.toggledCells.has(cellKey)) {
        this.toggleCell(x, y);
        this.toggledCells.add(cellKey);

        // Trigger UI update if available
        if (window.app && window.app.updateUI) {
          window.app.updateUI();
        }
      }
    }
  }

  toggleCellsAlongPath(startX, startY, endX, endY) {
    // Use Bresenham's line algorithm to toggle all cells along the path
    const startGrid = this.screenToGrid(startX, startY);
    const endGrid = this.screenToGrid(endX, endY);

    if (!startGrid || !endGrid) return;

    // getLinePoints expects (col0, row0, col1, row1) - grid coordinates
    const points = this.getLinePoints(
      startGrid.col,
      startGrid.row,
      endGrid.col,
      endGrid.row
    );

    for (const point of points) {
      if (this.isValidGridPosition(point.row, point.col)) {
        const screenPos = this.gridToScreen(point.col, point.row);
        this.toggleCellAtPosition(screenPos.x, screenPos.y);
      }
    }
  }

  getLinePoints(col0, row0, col1, row1) {
    const points = [];
    const dx = Math.abs(col1 - col0);
    const dy = Math.abs(row1 - row0);
    const sx = col0 < col1 ? 1 : -1;
    const sy = row0 < row1 ? 1 : -1;
    let err = dx - dy;

    let col = col0,
      row = row0;

    while (true) {
      points.push({ row: row, col: col });

      if (col === col1 && row === row1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        col += sx;
      }
      if (e2 < dx) {
        err += dx;
        row += sy;
      }
    }

    return points;
  }

  // Gradient colour utilities with caching
  getGradientColor(x, y, startColor, endColor) {
    // Use dynamic colour scheme instead of static gradient
    // Pass current time if simulation is running, otherwise use null for static rendering
    const currentTime = this.isRunning ? Date.now() : null;
    return this.colourScheme.getColourAtPosition(
      x,
      y,
      this.canvas.width,
      this.canvas.height,
      80,
      50,
      currentTime
    );
  }

  interpolateColor(color1, color2, factor) {
    if (typeof ColorUtils !== "undefined") {
      return ColorUtils.interpolateColor(color1, color2, factor);
    }
    // Minimal inline fallback
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const f = clamp(factor);
    const parse = (c) =>
      c.startsWith("#")
        ? [
            parseInt(c.slice(1, 3), 16),
            parseInt(c.slice(3, 5), 16),
            parseInt(c.slice(5, 7), 16),
          ]
        : (c.match(/\d+/g) || []).slice(0, 3).map(Number);
    const a = parse(color1);
    const b = parse(color2);
    if (!a || !b || a.length < 3 || b.length < 3) return color1;
    const out = a.map((c1, i) => Math.round(c1 + (b[i] - c1) * f));
    return `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
  }

  // Glow effect utility with performance optimization
  setGlowEffect(color, intensity = 15) {
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = intensity;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  clearGlowEffect() {
    this.ctx.shadowColor = "transparent";
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  // Common cell rendering method with caching
  drawCell(x, y, color = null, isActive = null) {
    // Get grid position for brightness calculations
    const { col, row } = this.screenToGrid(x, y);
    let cellBrightness = this.getCellBrightness(row, col);

    // If no brightness data exists, assume full brightness for active cells
    // This ensures cells are visible when they should be (e.g., initial wood chips in Termite Algorithm)
    if (cellBrightness === 0 && isActive !== false) {
      cellBrightness = 1.0;
    }

    // If cell is completely faded (brightness = 0), don't render anything
    if (cellBrightness === 0) {
      return;
    }

    // Get base color (either provided or gradient)
    if (!color) {
      color = this.getGradientColor(x, y);
    }

    // Apply brightness to the color
    const brightColor = this.applyBrightness(color);

    // Apply fade-to-black effect using the cell's brightness value
    let finalColor = brightColor;
    if (cellBrightness < 1) {
      // Interpolate between the cell color and black based on brightness
      // cellBrightness = 1 means full brightness, cellBrightness = 0 means black
      finalColor = this.interpolateColor(
        brightColor,
        "#000000",
        1 - cellBrightness
      );
    }

    this.ctx.fillStyle = finalColor;
    this.setGlowEffect(finalColor, 20 * this.brightness * cellBrightness);

    this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);

    this.clearGlowEffect();
  }

  // Common actor rendering method (for termites and ants) with caching
  drawActor(x, y, radius, color = null) {
    if (!color) {
      // Use a slightly different saturation/lightness for actors to make them stand out
      const currentTime = this.isRunning ? Date.now() : null;
      color = this.colourScheme.getColourAtPosition(
        x,
        y,
        this.canvas.width,
        this.canvas.height,
        90,
        60,
        currentTime
      );
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
  drawDirectionIndicator(
    x,
    y,
    angle,
    length = 8,
    color = "#ffffff",
    lineWidth = 1
  ) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.ctx.stroke();
  }

  // Set speed with validation
  setSpeed(stepsPerSecond) {
    const min =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MIN
        : 1;
    const max =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MAX
        : 60;
    this.speed = Math.max(min, Math.min(max, stepsPerSecond));
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
    actor.trail.push({ x: x, y: y, age: 0 });

    // Age existing trail points
    actor.trail.forEach((point) => point.age++);

    // Remove expired trail points
    actor.trail = actor.trail.filter((point) => point.age < this.trailLength);
  }

  drawActorTrail(actor, radius = 2) {
    if (!this.trailEnabled || !actor || !actor.trail) return;

    actor.trail.forEach((point) => {
      const alpha = this.trailOpacity * (1 - point.age / this.trailLength);
      if (alpha > 0.01) {
        // Only draw if visible enough
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
      color = this.colourScheme.getColourAtPosition(
        x,
        y,
        this.canvas.width,
        this.canvas.height,
        70,
        40,
        currentTime
      );
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

  // Cleanup drag toggling event listeners
  cleanupDragToggling() {
    if (this.boundMouseDown) {
      this.canvas.removeEventListener("mousedown", this.boundMouseDown);
      this.canvas.removeEventListener("mousemove", this.boundMouseMove);
      this.canvas.removeEventListener("mouseup", this.boundMouseUp);
      this.canvas.removeEventListener("mouseleave", this.boundMouseUp);
    }
  }
}

// Conway's Game of Life
class ConwayGameOfLife extends BaseSimulation {
  constructor(canvas, ctx) {
    super(canvas, ctx, "conway");
    this.grids = null;
    this.speed = 30; // FPS for simulation speed
    this.lastUpdateTime = 0;
    this.updateInterval = 1000 / this.speed; // milliseconds between updates

    // Register serializer for grid state preservation
    this.stateManager.registerSerializer({
      capture: (sim) => {
        const extra = {};
        if (sim.grids) {
          extra.grids = {
            current: sim.grids.current.map((row) => [...row]),
            next: sim.grids.next.map((row) => [...row]),
          };
        }
        return extra;
      },
      restore: (sim, state) => {
        if (state.grids) {
          const oldCurrent = state.grids.current;
          const oldNext = state.grids.next;
          // Recreate grids for current dimensions
          sim.initGrids();
          const minRows = Math.min(oldCurrent.length, sim.rows);
          const minCols = Math.min(oldCurrent[0]?.length || 0, sim.cols);
          for (let row = 0; row < minRows; row++) {
            for (let col = 0; col < minCols; col++) {
              sim.grids.current[row][col] = oldCurrent[row][col];
              sim.grids.next[row][col] = oldNext[row][col];
            }
          }
          // Recompute cell count
          sim.cellCount = sim.countLiveCells(sim.grids.current);
        }
      },
    });
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

  // Grid state now handled via registered serializer

  update() {
    // Step 1: Decrease each cell's brightness value by configurable amount
    this.updateCellBrightness();

    this.generation++;

    // Step 2: Activate and deactivate cells according to simulation rules
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const neighbours = this.countNeighbours(
          this.grids.current,
          row,
          col,
          this.rows,
          this.cols
        );
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

    // Step 3: For all active cells, set the brightness value to 1
    this.setActiveCellBrightness(this.grids.current);

    // Update cell count
    this.cellCount = this.countLiveCells(this.grids.current);
  }

  draw() {
    this.drawGrid(this.grids.current);
  }

  toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);

    if (this.isValidGridPosition(row, col)) {
      const wasActive = this.grids.current[row][col];
      this.grids.current[row][col] = !this.grids.current[row][col];
      this.cellCount = this.countLiveCells(this.grids.current);

      // Unified brightness handling
      this.applyToggleBrightness(row, col, this.grids.current[row][col]);

      this.draw();
    }
  }

  setSpeed(stepsPerSecond) {
    const min =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MIN
        : 1;
    const max =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MAX
        : 60;
    this.speed = Math.max(min, Math.min(max, stepsPerSecond));
    this.updateInterval = 1000 / this.speed;
  }

  // Conway-specific randomize implementation
  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    // Clear existing pattern
    this.initGrids();

    // Fill with random cells using the provided likelihood
    this.cellCount = this.randomizeGrid(this.grids.current, likelihood);
    this.generation = 0;

    // Reinitialise brightness using unified helper
    this.resetBrightnessFromActiveGrid(
      (row, col) => this.grids.current[row][col]
    );

    this.draw();
  }
}

// Termite Algorithm
class TermiteAlgorithm extends BaseSimulation {
  constructor(canvas, ctx) {
    super(canvas, ctx, "termite");
    this.termites = [];
    this.grid = this.createGrid(this.rows || 1, this.cols || 1, false);
    this.maxTermites = 50;
    this.speed =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_DEFAULT
        : 30; // steps per second
    this.lastUpdateTime = 0;
    this.updateInterval = 1000 / this.speed; // milliseconds between updates

    // Set default cell size to ensure rows/cols are calculated properly
    this.cellSize =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.CELL_SIZE_DEFAULT
        : 10;

    // Register serializer for active grid and termites state preservation
    this.stateManager.registerSerializer({
      capture: (sim) => {
        const extra = {};
        if (sim.grid) extra.grid = sim.grid.map((row) => [...row]);
        extra.termites = sim.termites.map((t) => ({
          x: t.x,
          y: t.y,
          angle: t.angle,
          isCarrying: !!(t.isCarrying || t.carrying),
          trail: t.trail || [],
        }));
        return extra;
      },
      restore: (sim, state) => {
        if (state.grid) {
          // Recreate grid for current dimensions
          sim.grid = sim.createGrid(sim.rows, sim.cols, false);
          const minRows = Math.min(state.grid.length, sim.rows);
          const minCols = Math.min(state.grid[0]?.length || 0, sim.cols);
          for (let row = 0; row < minRows; row++) {
            for (let col = 0; col < minCols; col++) {
              sim.grid[row][col] = state.grid[row][col];
            }
          }
        }
        if (Array.isArray(state.termites)) {
          sim.termites = state.termites.map((t) => ({
            x: Math.max(0, Math.min(t.x, sim.canvas.width)),
            y: Math.max(0, Math.min(t.y, sim.canvas.height)),
            angle: t.angle || 0,
            isCarrying: !!(t.isCarrying || t.carrying),
            trail: t.trail || [],
          }));
        }
        sim.cellCount = sim.countLiveCells(sim.grid || []);
      },
    });
  }

  init() {
    super.init();
    this.initData();
  }

  initData() {
    this.initTermites();
    this.initActiveGrid();
  }

  initTermites() {
    this.termites = [];
    for (let i = 0; i < this.maxTermites; i++) {
      this.termites.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        angle: Math.random() * Math.PI * 2,
        carrying: false,
        trail: [], // Initialize empty trail
      });
    }
  }

  initActiveGrid() {
    // Initialize active grid of cells representing chips
    this.grid = this.createGrid(this.rows, this.cols, false);
    const defaultCoverage =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
        : 0.3;
    // Use shared randomizeGrid for consistency
    this.randomizeGrid(this.grid, defaultCoverage);
    this.cellCount = this.countLiveCells(this.grid);
  }

  // Override lifecycle methods
  reset() {
    super.reset();
    this.initData();
    this.draw();
  }

  clear() {
    super.clear();
    this.grid = this.createGrid(this.rows, this.cols, false);
    this.termites.forEach((termite) => (termite.isCarrying = false));
    this.draw();
  }

  resize() {
    super.resize();
    this.initData();
  }

  update() {
    // Update fade states based on active grid before incrementing generation
    this.updateFadeStates(this.grid);

    this.generation++;
    this.cellCount = this.countLiveCells(this.grid);

    this.termites.forEach((termite) => {
      // Update trail before moving
      this.updateActorTrail(termite, termite.x, termite.y);

      // Move termite
      const speed =
        typeof AppConstants !== "undefined"
          ? AppConstants.TermiteDefaults.MOVE_SPEED
          : 2; // Base movement speed
      termite.x += Math.cos(termite.angle) * speed;
      termite.y += Math.sin(termite.angle) * speed;

      // Wrap around edges
      termite.x = (termite.x + this.canvas.width) % this.canvas.width;
      termite.y = (termite.y + this.canvas.height) % this.canvas.height;

      // Determine current grid cell under the termite
      let gridCol = Math.floor((termite.x - this.gridOffsetX) / this.cellSize);
      let gridRow = Math.floor((termite.y - this.gridOffsetY) / this.cellSize);
      // Clamp to valid grid bounds to avoid off-grid chip positions
      gridCol = Math.max(0, Math.min(this.cols - 1, gridCol));
      gridRow = Math.max(0, Math.min(this.rows - 1, gridRow));
      const isActive = this.grid[gridRow][gridCol];
      if (termite.isCarrying) {
        // Drop chip if current cell is inactive
        if (!isActive) {
          this.grid[gridRow][gridCol] = true;
          termite.isCarrying = false;
        }
      } else {
        // Pick up chip if current cell is active
        if (isActive) {
          this.grid[gridRow][gridCol] = false;
          termite.isCarrying = true;
        }
      }

      // Random direction change
      if (
        Math.random() <
        (typeof AppConstants !== "undefined"
          ? AppConstants.TermiteDefaults.RANDOM_TURN_PROBABILITY
          : 0.1)
      ) {
        termite.angle += ((Math.random() - 0.5) * Math.PI) / 2;
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the entire grid so fading of inactive cells is visible
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = this.gridOffsetX + col * this.cellSize;
        const y = this.gridOffsetY + row * this.cellSize;
        const isActive = this.grid[row][col];
        this.drawCell(x, y, null, isActive);
      }
    }

    // Draw termites with trails
    this.termites.forEach((termite) => {
      // Draw trail first (behind the termite)
      this.drawActorTrail(termite, 2);

      // Draw termite
      this.drawActor(termite.x, termite.y, 3);
      if (this.getShowDirectionIndicator()) {
        this.drawDirectionIndicator(termite.x, termite.y, termite.angle);
      }
    });
  }

  setSpeed(stepsPerSecond) {
    const min =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MIN
        : 1;
    const max =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MAX
        : 60;
    this.speed = Math.max(min, Math.min(max, stepsPerSecond));
    this.updateInterval = 1000 / this.speed;
  }

  setTermiteCount(count) {
    this.maxTermites = count;
    this.initTermites();
  }

  // Standardised add-actor API: place a termite under the pointer
  addActorAt(mouseX, mouseY) {
    if (typeof mouseX !== "number" || typeof mouseY !== "number") return;
    const termite = {
      x: Math.max(0, Math.min(this.canvas.width, mouseX)),
      y: Math.max(0, Math.min(this.canvas.height, mouseY)),
      angle: Math.random() * Math.PI * 2,
      carrying: false,
      trail: [],
    };
    this.termites.push(termite);
    this.draw();
  }

  toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);

    if (this.isValidGridPosition(row, col)) {
      const wasActive = this.grid[row][col];
      this.grid[row][col] = !wasActive;
      this.cellCount = this.countLiveCells(this.grid);

      // Unified brightness handling
      this.applyToggleBrightness(row, col, this.grid[row][col]);

      // Update fade states before drawing to ensure proper fade behavior
      this.updateFadeStates(this.grid);
      this.draw();
    }
  }

  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    // Create/clear grid then randomize
    this.grid = this.createGrid(this.rows, this.cols, false);
    this.randomizeGrid(this.grid, likelihood);
    this.cellCount = this.countLiveCells(this.grid);

    // Reset termites to not carrying anything
    this.termites.forEach((termite) => (termite.isCarrying = false));

    // Reinitialise brightness using unified helper
    this.resetBrightnessFromActiveGrid((row, col) => this.grid[row][col]);

    // Redraw to show the new random pattern
    this.draw();
  }
}

// Langton's Ant
class LangtonsAnt extends BaseSimulation {
  constructor(canvas, ctx) {
    super(canvas, ctx, "langton");
    this.ants = [{ x: 0, y: 0, direction: 0 }]; // 0: up, 1: right, 2: down, 3: left
    this.grid = [];
    this.rules = ["R", "L"]; // Standard Langton's ant rules
    this.speed =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_DEFAULT
        : 30; // steps per second
    this.lastUpdateTime = 0;
    this.updateInterval = 1000 / this.speed; // milliseconds between updates

    // Set default cell size to ensure rows/cols are calculated properly
    this.cellSize =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.CELL_SIZE_DEFAULT
        : 10;

    // Register serializer for grid and ants
    this.stateManager.registerSerializer({
      capture: (sim) => {
        const extra = {};
        if (sim.grid) extra.grid = sim.grid.map((row) => [...row]);
        if (sim.ants) extra.ants = sim.ants.map((ant) => ({ ...ant }));
        return extra;
      },
      restore: (sim, state) => {
        if (state.grid) {
          const oldGrid = state.grid;
          sim.initGrid();
          const minRows = Math.min(oldGrid.length, sim.rows);
          const minCols = Math.min(oldGrid[0]?.length || 0, sim.cols);
          for (let row = 0; row < minRows; row++) {
            for (let col = 0; col < minCols; col++) {
              sim.grid[row][col] = oldGrid[row][col];
            }
          }
        }
        if (state.ants) {
          sim.ants = state.ants.map((ant) => ({
            x: Math.max(0, Math.min(ant.x, sim.cols - 1)),
            y: Math.max(0, Math.min(ant.y, sim.rows - 1)),
            direction: ant.direction,
            trail: ant.trail || [],
          }));
        }
        sim.cellCount = sim.countLiveCells(sim.grid);
      },
    });
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
    const ctor = typeof GridActor !== "undefined" ? GridActor : null;
    const cx = Math.floor(this.cols / 2);
    const cy = Math.floor(this.rows / 2);
    this.ants = [
      ctor
        ? new ctor(cx, cy, 0, { trail: [] })
        : { x: cx, y: cy, direction: 0, trail: [] },
    ];
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

  // Grid and ants state now handled via registered serializer

  update() {
    // Update fade states before incrementing generation
    // This ensures we can properly track initial inactive cells on generation 0
    this.updateFadeStates(this.grid);

    this.generation++;

    // Update each ant
    this.ants.forEach((ant) => {
      // Get current cell state
      const currentCell = this.grid[ant.y][ant.x];

      // Prepare smooth interpolation geometry within the current cell
      const entryEdge = (ant.direction + 2) % 4; // Opposite of current facing
      const startAngle = this.#edgeAngle(entryEdge);
      const cx = this.gridOffsetX + ant.x * this.cellSize + this.cellSize / 2;
      const cy = this.gridOffsetY + ant.y * this.cellSize + this.cellSize / 2;
      const startX = cx + (this.cellSize / 2) * Math.cos(startAngle);
      const startY = cy + (this.cellSize / 2) * Math.sin(startAngle);
      // Update trail at the entry edge midpoint before moving
      this.updateActorTrail(ant, startX, startY);

      // Flip the cell
      this.grid[ant.y][ant.x] = !currentCell;

      // Turn based on cell state
      const rule = this.rules[currentCell ? 1 : 0];
      const turnRight = rule === "R";
      const newDirection = turnRight
        ? (ant.direction + 1) % 4
        : (ant.direction + 3) % 4;
      const endAngle = startAngle + (turnRight ? -Math.PI / 2 : Math.PI / 2);

      // Record render path for the duration until the next update
      ant.renderPath = {
        type: "arc",
        cx,
        cy,
        radius: this.cellSize / 2,
        startAngle,
        endAngle,
        turn: turnRight ? 1 : -1, // 1 => right (CW), -1 => left (CCW)
      };

      // Apply the direction change after planning path
      ant.direction = newDirection;

      // Move forward
      switch (ant.direction) {
        case 0:
          ant.y = (ant.y - 1 + this.rows) % this.rows;
          break; // Up
        case 1:
          ant.x = (ant.x + 1) % this.cols;
          break; // Right
        case 2:
          ant.y = (ant.y + 1) % this.rows;
          break; // Down
        case 3:
          ant.x = (ant.x - 1 + this.cols) % this.cols;
          break; // Left
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
    const now =
      typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now();
    const progress = this.isRunning
      ? Math.max(
          0,
          Math.min(1, (now - this.lastUpdateTime) / this.updateInterval)
        )
      : 1;

    this.ants.forEach((ant) => {
      let drawX, drawY, headingAngle;
      const hasPath = ant.renderPath && ant.renderPath.type === "arc";
      if (hasPath) {
        const { cx, cy, radius, startAngle, endAngle, turn } = ant.renderPath;
        const angle = startAngle + (endAngle - startAngle) * progress;
        drawX = cx + radius * Math.cos(angle);
        drawY = cy + radius * Math.sin(angle);
        // Tangent direction along arc
        headingAngle = angle + (turn === 1 ? -Math.PI / 2 : Math.PI / 2);
      } else {
        drawX = this.gridOffsetX + ant.x * this.cellSize + this.cellSize / 2;
        drawY = this.gridOffsetY + ant.y * this.cellSize + this.cellSize / 2;
        headingAngle = (ant.direction * Math.PI) / 2;
      }

      // Draw trail first (behind the ant) — match termite styling
      this.drawActorTrail(ant, 2);

      // Draw ant — match termite sizing
      this.drawActor(drawX, drawY, 3);

      // Draw direction indicator using shared toggle
      if (this.getShowDirectionIndicator()) {
        // Use default length/line width to match termite appearance
        this.drawDirectionIndicator(drawX, drawY, headingAngle);
      }
    });
  }

  setSpeed(stepsPerSecond) {
    const min =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MIN
        : 1;
    const max =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MAX
        : 60;
    this.speed = Math.max(min, Math.min(max, stepsPerSecond));
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
    const ctor = typeof GridActor !== "undefined" ? GridActor : null;
    const dir = Math.floor(Math.random() * 4);
    const ant = ctor ? new ctor(x, y, dir, { trail: [] }) : { x, y, direction: dir, trail: [] };
    this.ants.push(ant);

    // Draw immediately so the ant is visible even when paused
    this.draw();
  }

  // Generic add-actor API for keyboard/UX
  addActorAt(mouseX, mouseY) {
    if (typeof mouseX !== "number" || typeof mouseY !== "number") {
      this.addAnt(null, null);
      return;
    }
    const gridPos = this.screenToGrid(mouseX, mouseY);
    const x = Math.max(0, Math.min(this.cols - 1, gridPos.col));
    const y = Math.max(0, Math.min(this.rows - 1, gridPos.row));
    const ctor = typeof GridActor !== "undefined" ? GridActor : null;
    const dir = Math.floor(Math.random() * 4);
    const ant = ctor ? new ctor(x, y, dir, { trail: [] }) : { x, y, direction: dir, trail: [] };
    this.ants.push(ant);
    this.draw();
  }

  // Set the number of ants (actor count) dynamically
  setAntCount(count) {
    const desired = Math.max(1, Math.min(100, parseInt(count, 10) || 1));
    const current = this.ants.length;
    if (desired === current) return;

    if (desired > current) {
      const toAdd = desired - current;
      for (let i = 0; i < toAdd; i++) {
        // Random placement at valid grid cell and random facing
        const x = Math.floor(Math.random() * this.cols);
        const y = Math.floor(Math.random() * this.rows);
        const ctor = typeof GridActor !== "undefined" ? GridActor : null;
        const dir = Math.floor(Math.random() * 4);
        const ant = ctor ? new ctor(x, y, dir, { trail: [] }) : { x, y, direction: dir, trail: [] };
        this.ants.push(ant);
      }
    } else {
      // Reduce from the end
      this.ants.length = desired;
    }

    // Render updated count immediately
    this.draw();
  }

  // Compute angle for a given edge midpoint around the cell centre
  #edgeAngle(edgeIndex) {
    // 0: top (-PI/2), 1: right (0), 2: bottom (PI/2), 3: left (PI)
    switch (edgeIndex % 4) {
      case 0:
        return -Math.PI / 2;
      case 1:
        return 0;
      case 2:
        return Math.PI / 2;
      case 3:
      default:
        return Math.PI;
    }
  }

  toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);

    if (this.isValidGridPosition(row, col)) {
      const wasActive = this.grid[row][col];
      this.grid[row][col] = !this.grid[row][col];
      this.cellCount = this.countLiveCells(this.grid);

      // Unified brightness handling
      this.applyToggleBrightness(row, col, this.grid[row][col]);

      // Update fade states before drawing to ensure proper fade behavior
      this.updateFadeStates(this.grid);
      this.draw();
    }
  }

  // Langton-specific randomize implementation
  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    // Clear existing pattern
    this.initGrid();

    // Fill with random cells using the provided likelihood
    this.cellCount = this.randomizeGrid(this.grid, likelihood);
    this.generation = 0;

    // Reinitialise brightness using unified helper
    this.resetBrightnessFromActiveGrid((row, col) => this.grid[row][col]);

    this.draw();
  }
}

// Simulation factory
class SimulationFactory {
  static createSimulation(type, canvas, ctx) {
    switch (type) {
      case "conway":
        return new ConwayGameOfLife(canvas, ctx);
      case "termite":
        return new TermiteAlgorithm(canvas, ctx);
      case "langton":
        return new LangtonsAnt(canvas, ctx);
      default:
        throw new Error(`Unknown simulation type: ${type}`);
    }
  }
}
