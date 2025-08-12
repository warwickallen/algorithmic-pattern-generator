# Algorithmic Pattern Generator - AS-BUILT Documentation

## Project Overview

The Algorithmic Pattern Generator is a sophisticated web application that combines classic algorithmic simulations: Conway's Game of Life, the Termite Algorithm, Langton's Ant, and Reaction–Diffusion (Gray–Scott). Built with vanilla JavaScript, it features a modular architecture, dynamic colour schemes, comprehensive testing, and performance optimisations.

## Architecture Overview

### Core Architecture

- **Frontend**: Vanilla JavaScript with HTML5 Canvas
- **Styling**: CSS3 with responsive design and immersive mode
- **Internationalisation**: Custom i18n system supporting UK/US English
- **Testing**: Comprehensive test suite with visual and programmatic testing
- **Performance**: Optimised rendering with debouncing, throttling, and hardware acceleration
- **Control Visibility**: CSS-based declarative control visibility management

### File Structure

```
algorithmic-pattern-generator/
├── public/                 # Static assets and entry HTML
│   ├── index.html          # Main application entry point
│   ├── test-suite.html     # Comprehensive visual test suite
│   ├── browser-debug.html  # Lightweight debug harness
│   ├── styles.css          # Responsive styling and immersive mode
│   ├── favicon.*           # Icons
├── src/                    # JavaScript sources
│   ├── app.js              # Core application logic and UI management
│   ├── simulations.js      # Simulation algorithms and rendering utilities
│   ├── i18n.js             # Internationalisation system
│   ├── dynamic-layout.js   # Dynamic layout management
│   ├── constants.js        # Centralised application constants (AppConstants)
│   ├── logger.js           # Centralised logging
│   ├── resource-manager.js # Listener/timer/RAF tracking and cleanup
│   ├── animation-manager.js
│   ├── statistics-collector.js
│   ├── canvas-manager.js
│   ├── keyboard-shortcut-manager.js
│   ├── type-guards.js
│   ├── types.js            # Central JSDoc typedefs
│   ├── config-validator.js
│   ├── test-runner.js      # Programmatic test runner
│   └── test-utils.js       # Test helpers
├── tests/                  # Test files (loaded by public/test-suite.html)
├── tools/                  # Project tooling
├── README.md
├── AS-BUILT.md
└── TESTING.md
```

## Reaction–Diffusion Integration Notes

### Overview

The Reaction–Diffusion (Gray–Scott) simulation was added with the following minimal integration steps while maximising reuse of existing infrastructure:

- Implemented `class ReactionDiffusion extends BaseSimulation` in `simulations.js` with U/V scalar fields, Gray–Scott updates, and wrap‑around Laplacian.
- Registered the type in `SimulationFactory.createSimulation("reaction", ...)`.
- Added UI option to the selector in `index.html`.
- Declared control templates in `ControlTemplateManager.simulationControlTemplates.reaction` with two sliders:
  - `reaction-feed-slider` (Feed F)
  - `reaction-kill-slider` (Kill k)
- Routed new slider events via `EventHandlerFactory` using `reactionParamChange` → `AlgorithmicPatternGenerator.handleReactionParamChange` → `ReactionDiffusion.setReactionParam`.
- Included Learn modal content in `ModalTemplateManager` for Reaction–Diffusion.
- Enabled the Dynamic Fill button for the reaction simulation.
- Preserved state across resize using `stateManager.registerSerializer` to capture and restore U/V arrays with dimension clamping; `resize()` no longer re-seeds.

### UI/Control Visibility

- `ControlVisibilityManager` updated defensively to clear `.active` from known control IDs to support fixtures without `data-simulation`.

### Dynamic Speed Slider adjustments

- Change events now propagate immediately to the app and also via a debounced call; removed internal guard so app can decide to no‑op. This ensures deterministic tests while keeping good UX.

### Tests

- Added three Reaction–Diffusion test files under `tests/reaction/` and updated manifests.

## Core Components

### 1. Application Layer (`app.js`)

#### AlgorithmicPatternGenerator Class

The main application controller that orchestrates all components:

**Key Features:**

- Simulation lifecycle management
- UI state management
- Event handling and keyboard shortcuts using EventHandlerFactory
- Performance monitoring
- Modal management
- Automatic event handler registration and cleanup
- Centralised resource/loop/metrics: `ResourceManager`, `AnimationManager`, and `StatisticsCollector`
- Centralised logging via `Logger` (guarded fallback to console)

**Core Methods:**

```javascript
init(); // Initialise application
switchSimulation(type); // Switch between simulations
startSimulation(); // Start current simulation
pauseSimulation(); // Pause current simulation
toggleImmersiveMode(); // Toggle immersive mode
handleCanvasClick(e); // Handle canvas interactions
updateUI(); // Update UI elements
setupEventListeners(); // Setup event listeners using EventHandlerFactory
```

#### UIComponentLibrary

Comprehensive UI component library with lifecycle management, state management, and event handling:

**Component Types:**

- **Slider Components**: Standardised slider with value display, state management, and performance optimisation
- **Button Components**: Reusable button with text management, press/release states, and event handling
- **Select Components**: Dropdown select with options management and value tracking
- **Control Groups**: Container components for related controls with layout management (horizontal, vertical, grid)
- **Status Display Components**: Multi-value status displays with dynamic value updates
- **Modal Components**: Modal management with backdrop, escape handling, and content management
- **Label Components**: Text labels with attributes and state management
- **Container Components**: Layout containers with gap management and visibility control

**Key Features:**

- **Lifecycle Management**: onMount, onUnmount, onUpdate, onShow, onHide, onEnable, onDisable hooks
- **State Management**: Comprehensive get/set methods for all component states
- **Event Handling**: Integration with EventFramework for memory leak prevention
- **Default Configurations**: Sensible defaults for all component types
- **Batch Operations**: Show/hide/enable/disable all components
- **Factory Methods**: createSliderWithLabel, createButtonGroup, createFormGroup for common patterns
- **Component Discovery**: getComponent, getAllComponents, getComponentsByType utilities
- **Layout Management**: Dynamic layout switching and gap control
- **Modal Operations**: Backdrop creation, escape handling, content management

**Performance Optimisations:**

- Debounced input handling (16ms for 60fps)
- Element caching to reduce DOM queries
- RequestAnimationFrame for smooth rendering
- Memory leak prevention with EventFramework integration
- Efficient state management with minimal DOM updates

#### ControlVisibilityManager

CSS-based control visibility management system that replaces JavaScript-based show/hide logic:

**Key Features:**

- **Declarative CSS approach** using data attributes and CSS classes
- **Simulation-specific control groups** with automatic visibility management
- **Performance optimised** - No JavaScript DOM manipulation for visibility changes
- **Extensible design** - Easy to add new simulations and control groups
- **Backward compatibility** - Maintains existing API while improving implementation

**Core Methods:**

```javascript
init(); // Initialise visibility manager
setActiveSimulation(simType); // Set active simulation and update visibility
clearActiveStates(); // Clear all active states
applyVisibilityStates(simType); // Apply visibility states for simulation
showControls(simType); // Show controls for simulation (backward compatibility)
hideAllControls(); // Hide all controls (backward compatibility)
getActiveSimulation(); // Get currently active simulation
isControlVisible(elementId); // Check if control is visible
addControlGroup(simType, controlIds); // Add new control group
addVisibilityStates(simType, states); // Add visibility states for simulation
cleanup(); // Cleanup visibility manager
```

**CSS Implementation:**

```css
/* Control visibility states */
.control-group[data-simulation="conway"] {
  display: none;
}
.control-group[data-simulation="termite"] {
  display: none;
}
.control-group[data-simulation="langton"] {
  display: none;
}

/* Active simulation visibility */
.control-group[data-simulation].active {
  display: flex !important;
}

/* Simulation-specific control groups */
.simulation-controls[data-simulation="conway"] {
  display: none;
}
.simulation-controls[data-simulation="termite"] {
  display: none;
}
.simulation-controls[data-simulation="langton"] {
  display: none;
}

.simulation-controls[data-simulation].active {
  display: flex !important;
}

/* Special containers */
#termites-container[data-simulation="termite"].active {
  display: block !important;
}
#termites-container[data-simulation]:not(.active) {
  display: none !important;
}
```

**HTML Structure:**

```html
<!-- Conway's Game of Life specific controls -->
<div
  id="conway-controls"
  class="simulation-controls"
  data-simulation="conway"
  style="display: none;"
>
  <!-- Speed control moved to dynamic container -->
</div>

<!-- Termite Algorithm specific controls -->
<div
  id="termite-controls"
  class="simulation-controls"
  data-simulation="termite"
  style="display: none;"
>
  <!-- Speed control moved to dynamic container -->
</div>

<!-- Langton's Ant specific controls -->
<div
  id="langton-controls"
  class="simulation-controls"
  data-simulation="langton"
  style="display: none;"
>
  <!-- Speed control moved to dynamic container -->
</div>

<!-- Termites Control (top) -->
<div
  id="termites-container"
  class="control-group dynamic-position"
  data-simulation="termite"
  style="display: none;"
>
  <div class="control-group">
    <label for="termites-slider">Termites:</label>
    <input
      type="range"
      id="termites-slider"
      min="1"
      max="100"
      value="50"
      class="slider"
    />
    <span id="termites-value">50</span>
  </div>
</div>
```

**Control Group Mappings:**

```javascript
this.controlGroups = new Map([
  ["conway", ["conway-controls"]],
  ["termite", ["termite-controls", "termites-container"]],
  ["langton", ["langton-controls"]],
]);
```

**Visibility States:**

```javascript
this.visibilityStates = new Map([
  [
    "conway",
    {
      "conway-controls": "visible",
      "termite-controls": "hidden",
      "langton-controls": "hidden",
      "termites-container": "hidden",
    },
  ],
  [
    "termite",
    {
      "conway-controls": "hidden",
      "termite-controls": "visible",
      "langton-controls": "hidden",
      "termites-container": "visible",
    },
  ],
  [
    "langton",
    {
      "conway-controls": "hidden",
      "termite-controls": "hidden",
      "langton-controls": "visible",
      "termites-container": "hidden",
    },
  ],
]);
```

#### ControlTemplateManager

Template-based control configuration system that eliminates code duplication:

**Base Templates:**

```javascript
static baseTemplates = {
    dynamicSpeedSlider: {
        type: 'dynamicSlider',
        min: 1, max: 60, step: 1, value: 30,
        label: 'Speed',
        format: (value) => `${value} steps/s`
    },
    dynamicFillButton: { type: 'dynamicButton', label: 'Fill' },
    learnButton: { type: 'button', label: 'Learn' },
    addAntButton: { type: 'button', label: 'Add Ant' },
    termiteCountSlider: {
        type: 'slider',
        min: 10, max: 100, step: 1, value: 50,
        label: 'Termites',
        format: (value) => value.toString()
    }
}
```

**Simulation Templates:**

```javascript
static simulationControlTemplates = {
    conway: {
        controls: {
            speed: { template: 'dynamicSpeedSlider', id: 'dynamic-speed-slider', valueElementId: 'dynamic-speed-value' },
            fill: { template: 'dynamicFillButton', id: 'dynamic-fill-btn' },
            learn: { template: 'learnButton', id: 'learn-btn' }
        }
    },
    termite: {
        controls: {
            speed: { template: 'dynamicSpeedSlider', id: 'dynamic-speed-slider', valueElementId: 'dynamic-speed-value' },
            termiteCount: { template: 'termiteCountSlider', id: 'termites-slider', valueElementId: 'termites-value' },
            fill: { template: 'dynamicFillButton', id: 'dynamic-fill-btn' },
            learn: { template: 'learnButton', id: 'learn-btn' }
        }
    },
    langton: {
        controls: {
            speed: { template: 'dynamicSpeedSlider', id: 'dynamic-speed-slider', valueElementId: 'dynamic-speed-value' },
            addAnt: { template: 'addAntButton', id: 'add-ant-btn' },
            fill: { template: 'dynamicFillButton', id: 'dynamic-fill-btn' },
            learn: { template: 'learnButton', id: 'learn-btn' }
        }
    }
}
```

**Key Methods:**

- `generateControlConfig(simType, controlName)` - Generate individual control configs
- `generateSimulationConfig(simType)` - Generate complete simulation configs
- `getAllSimulationConfigs()` - Generate all simulation configs
- `validateTemplate(template)` - Validate template configurations
- `addSimulationTemplate(simType, template)` - Add new simulation templates
- `addBaseTemplate(templateName, template)` - Add new base templates

#### ConfigurationManager

Centralised configuration system that uses ControlTemplateManager:

- Validation of slider/button/modal/simulation configs is delegated to a reusable `ConfigValidator` (see `config-validator.js`).
- When the validator is unavailable (legacy/test contexts), minimal inline checks are used as a graceful fallback.

#### EventFramework

Comprehensive event management system with enhanced element caching and memory leak prevention:

**Features:**

- Centralised event registration and cleanup
- Debounced and throttled event handlers
- Batch event registration
- Memory leak prevention with proper handler storage and removal
- Enhanced element caching with null value handling
- Integration with UIComponentLibrary for component event management

**New Capabilities:**

- Declarative registration via `registerDeclarative(configs)` for batch binding with optional debounce/throttle per handler
- Delegated registration via `registerDelegated(container, event, selector, handler, options?)`

**Enhanced Element Caching:**

```javascript
getElement(selector) {
    if (!this.elementCache.has(selector)) {
        const element = document.querySelector(selector);
        if (element) {
            this.elementCache.set(selector, element);
        } else {
            // Don't cache null/undefined values to allow for dynamic element creation
            return null;
        }
    }
    return this.elementCache.get(selector);
}
```

**Usage Examples:**

```javascript
// Declarative registration
eventFramework.registerDeclarative([
  {
    selector: "#start-pause-btn",
    on: { click: { handler: () => app.toggleSimulation() } },
  },
  {
    selector: "#reset-btn",
    on: { click: { handler: () => app.resetSimulation() } },
  },
]);

// Delegated registration
eventFramework.registerDelegated(document, "click", ".btn.dynamic", (e) => {
  // handle dynamic button clicks
});
```

#### EventHandlerFactory

Factory pattern for event handler creation and registration that eliminates code duplication:

**Key Features:**

- **Template-based handler creation** with predefined handler templates for common patterns
- **Simulation context injection** for creating simulation-specific handlers with proper binding
- **Automatic handler registration** with the EventFramework for memory management
- **Batch registration support** for efficient event setup
- **Custom handler creation** with context injection for extensibility
- **Comprehensive cleanup** to prevent memory leaks

**Handler Templates:**

```javascript
// Slider handler templates
this.handlerTemplates.set("slider", {
  input: this.createSliderInputHandler.bind(this),
  change: this.createSliderChangeHandler.bind(this),
});

// Button handler templates
this.handlerTemplates.set("button", {
  click: this.createButtonClickHandler.bind(this),
});

// Simulation-specific handler templates
this.handlerTemplates.set("simulation", {
  speedChange: this.createSpeedChangeHandler.bind(this),
  randomPattern: this.createRandomPatternHandler.bind(this),
  showLearnModal: this.createShowLearnModalHandler.bind(this),
  addAnt: this.createAddAntHandler.bind(this),
  termiteCountChange: this.createTermiteCountChangeHandler.bind(this),
  brightnessChange: this.createBrightnessChangeHandler.bind(this),
  likelihoodChange: this.createLikelihoodChangeHandler.bind(this),
});
```

**Core Methods:**

```javascript
createSimulationHandlers(simType, app); // Create simulation-specific handlers with context
setupSlider(config, handlers); // Setup slider with factory-generated handlers
setupButton(config, handlers); // Setup button with factory-generated handlers
setupControls(simType, handlers); // Setup all controls for a simulation
registerAllSimulationHandlers(app); // Register handlers for all simulations
createCustomHandler(handlerType, context, handlerFunction); // Create custom handlers with context
createBatchRegistration(registrations); // Create batch event registration
cleanup(); // Cleanup all registered handlers
getRegisteredHandlers(simType); // Get registered handlers for simulation
hasRegisteredHandlers(simType); // Check if handlers are registered
```

**Performance Optimisations:**

- **Debounced slider change handlers** (16ms) to prevent excessive updates
- **Immediate visual feedback** for slider input events
- **Conditional routing** based on control ID patterns
- **Memory-efficient handler storage** with Map-based registration tracking
- **Automatic cleanup** to prevent memory leaks

**Integration with ControlManager:**

```javascript
// Register handlers for a specific simulation type using EventHandlerFactory
registerSimulationHandlers(simType, app) {
    const handlers = this.eventHandlerFactory.createSimulationHandlers(simType, app);
    this.eventHandlerFactory.setupControls(simType, handlers);
}

// Register all simulation handlers using EventHandlerFactory
registerAllHandlers(app) {
    this.eventHandlerFactory.registerAllSimulationHandlers(app);
}
```

#### Dynamic Speed Slider

Unified speed control system that consolidates three separate speed sliders:

**Features:**

- Single slider that adapts to the current simulation
- Simulation-specific speed state preservation
- Performance-optimised event handling with debouncing
- Automatic visibility management
- Memory-efficient cleanup

**Key Methods:**

```javascript
switchToSimulation(simType, app); // Switch to different simulation
setValue(value); // Set speed value for current simulation
getValue(); // Get current speed value
adjustSpeed(direction); // Increment/decrement speed
hide(); // Hide the speed control
cleanup(); // Clean up event listeners
```

**Performance Optimisations:**

- 100ms debounced input handling to prevent excessive updates
- Value change detection to avoid redundant DOM updates
- Simulation type change detection to prevent unnecessary switches
- Efficient state management with Map-based storage

#### Dynamic Fill Button

Unified random pattern generation system that consolidates three separate random buttons:

**Features:**

- Single button that adapts to the current simulation
- Button text changed from "Random" to "Fill" as requested
- Simulation-specific state preservation
- Performance-optimised event handling
- Automatic visibility management with conflict resolution
- Memory-efficient cleanup

**Key Methods:**

```javascript
switchToSimulation(simType, app); // Switch to different simulation
show(); // Show the fill button
hide(); // Hide the fill button
handleClick(); // Handle button click events
cleanup(); // Clean up event listeners
```

**Implementation Details:**

- **DynamicFillButton** class encapsulates all random button functionality
- **Single HTML button** (`dynamic-fill-btn`) replaces three separate buttons
- **State preservation** for each simulation's context
- **Event handling** with proper delegation to current simulation
- **Visibility management** resolves conflicts with ControlManager's global hiding
- **Integration** with existing control management system
- **Comprehensive testing** including initial visibility after app load

#### Control Manager

Dynamic UI control management with CSS-based visibility and EventHandlerFactory integration:

**Features:**

- Simulation-specific control visibility using ControlVisibilityManager
- Dynamic control value updates
- Event handler registration per simulation using EventHandlerFactory
- State preservation during simulation switches
- Automatic handler cleanup and memory management

**Integration with ControlVisibilityManager:**

```javascript
constructor(eventFramework) {
    this.activeControls = null;
    this.eventFramework = eventFramework;
    this.simulationHandlers = new Map();
    this.visibilityManager = new ControlVisibilityManager();
    this.visibilityManager.init();
    this.eventHandlerFactory = new EventHandlerFactory(eventFramework);
}

showControls(simType) {
    // Use the new CSS-based visibility manager
    this.visibilityManager.showControls(simType);
    this.activeControls = simType;

    // Show/hide action buttons based on simulation type
    this.showActionButtons(simType);
}

hideAllControls() {
    // Use the new CSS-based visibility manager
    this.visibilityManager.hideAllControls();
    this.activeControls = null;
}
```

**Integration with EventHandlerFactory:**

```javascript
// Register handlers for a specific simulation type using EventHandlerFactory
registerSimulationHandlers(simType, app) {
    const handlers = this.eventHandlerFactory.createSimulationHandlers(simType, app);
    this.eventHandlerFactory.setupControls(simType, handlers);
}

// Register all simulation handlers using EventHandlerFactory
registerAllHandlers(app) {
    this.eventHandlerFactory.registerAllSimulationHandlers(app);
}

// Cleanup with EventHandlerFactory
cleanup() {
    this.eventHandlerFactory.cleanup();
    this.visibilityManager.cleanup();
}
```

#### Keyboard Handler

Global keyboard shortcut management:

**Shortcuts:**

- `Space`: Start/Pause simulation
- `Ctrl+R`: Reset simulation
- `Ctrl+C`: Clear simulation
- `Ctrl+I`: Toggle immersive mode
- `Escape`: Exit immersive mode
- `A`: Add ant (Langton's Ant, mouse position)

#### Modal Manager

Advanced modal system with performance optimisations and dynamic content management:

**Features:**

- Render queue to prevent layout thrashing
- RequestAnimationFrame integration
- Memory management and cleanup
- Show/hide state tracking
- Dynamic modal content injection using ModalTemplateManager
- Simulation-specific scroll position management
- Single dynamic modal replacing multiple static modals

**Integration with ModalTemplateManager:**

```javascript
constructor() {
    this.modals = new Map();
    this.activeModal = null;
    this.elementCache = PerformanceOptimizer.createElementCache();
    this.renderQueue = new Set();
    this.isRendering = false;
    this.modalTemplateManager = new ModalTemplateManager();
    this.dynamicModalId = 'dynamic-modal';
    this.currentSimType = null;
    this.scrollPositions = new Map(); // Track scroll positions for each simulation type
    this.init();
}

// Register dynamic modal for a specific simulation type
registerDynamicModal(simType) {
    if (!this.modalTemplateManager.hasTemplate(simType)) {
        console.warn(`No template found for simulation type: ${simType}`);
        return false;
    }

    // Register the dynamic modal if not already registered
    if (!this.modals.has(this.dynamicModalId)) {
        this.register(this.dynamicModalId);
    }

    return true;
}

// Show modal with dynamic content injection
show(modalId, simType = null) {
    const modalConfig = this.modals.get(modalId);
    if (!modalConfig) {
        console.warn(`Modal '${modalId}' not registered`);
        return;
    }

    // If showing the dynamic modal, handle content injection
    if (modalId === this.dynamicModalId && simType) {
        // Save scroll position of previous modal if it was the dynamic modal
        if (this.activeModal === this.dynamicModalId && this.currentSimType) {
            this.saveScrollPosition(this.currentSimType);
        }

        // Update current simulation type
        this.currentSimType = simType;

        // Inject dynamic content
        this.injectDynamicContent(simType);
    }

    // Queue modal for showing
    this.queueModalRender(modalConfig, true);
    this.activeModal = modalId;

    // Trigger custom show callback
    if (modalConfig.onShow) {
        modalConfig.onShow();
    }
}
```

#### ModalTemplateManager

Template-based modal content management system:

**Features:**

- Content templates for all simulations (Conway, Termite, Langton)
- Dynamic content injection with simulation-specific titles and content
- Template management with addContentTemplate, getAvailableSimulations, and hasTemplate methods
- HTML generation for modal structures
- Content injection with robust element selection
- Extensibility for adding new simulations and modal content templates

#### UnifiedModalSystem (Facade)

To maximise reuse and present a simple API to the application, a small facade wraps the existing modal stack:

Features:

- `openLearn(simType)`: ensures the dynamic modal is registered and injects content via `ModalTemplateManager`
- `openCustom(title, htmlContent)`: opens the same modal container with arbitrary content and title
- `openById(id, simType?)`: convenience open for any modal id with optional simulation content injection
- `close()`: closes the active dynamic modal
- Delegates to `ModalManager` which retains scroll state per simulation type

Usage (excerpt from `AlgorithmicPatternGenerator`):

```javascript
this.modalManager = new ModalManager(this.eventFramework);
this.modalSystem = new UnifiedModalSystem(
  this.eventFramework,
  this.modalManager
);

// Show Learn modal for current simulation
this.modalSystem.openLearn(this.currentType);
```

**Core Methods:**

```javascript
constructor() {
    this.modalTemplates = new Map();
    this.contentTemplates = new Map();
    this.init();
}

setupContentTemplates() {
    // Conway's Game of Life content template
    this.contentTemplates.set('conway', {
        title: "Conway's Game of Life",
        content: `...` // Detailed content about Conway's Game of Life
    });

    // Termite Algorithm content template
    this.contentTemplates.set('termite', {
        title: "Termite Algorithm",
        content: `...` // Detailed content about Termite Algorithm
    });

    // Langton's Ant content template
    this.contentTemplates.set('langton', {
        title: "Langton's Ant",
        content: `...` // Detailed content about Langton's Ant
    });
}

createModalContent(simType) {
    const template = this.contentTemplates.get(simType);
    if (!template) {
        console.warn(`No content template found for simulation type: ${simType}`);
        return null;
    }

    // Create modal structure with content
    const modalHTML = this.baseModalTemplate
        .replace('[data-title]', template.title)
        .replace('[data-close-btn]', '')
        .replace('[data-content]', template.content);

    return {
        title: template.title,
        content: modalHTML
    };
}

injectModalContent(simType, modalElement) {
    const template = this.contentTemplates.get(simType);
    if (!template || !modalElement) return false;

    // Update title using data attribute for more robust selection
    const titleElement = modalElement.querySelector('[data-modal-title]');
    if (titleElement) {
        titleElement.textContent = template.title;
    }

    // Update content using data attribute for more robust selection
    const contentElement = modalElement.querySelector('[data-modal-content]');
    if (contentElement) {
        contentElement.innerHTML = template.content;
    }

    return true;
}
```

#### Performance Monitor

Real-time performance monitoring:

**Metrics:**

- FPS monitoring
- Memory usage tracking
- Performance metrics collection
- Statistical analysis

##### Logger (Centralised Logging)

To reduce scattered `console.*` usage and provide a single place to adjust verbosity, the app uses a global `Logger`:

- Levels: `silent`, `error`, `warn`, `info`, `debug` (default `info`)
- Integration points include modal lifecycle messages, performance monitor start/stop/metrics, and missing element warnings; simulation lifecycle default hooks also log via `Logger.debug`
- Test suite (`test-suite.html`) includes `logger.js` to keep output consistent during tests

Example:

```javascript
if (typeof Logger !== "undefined")
  Logger.info("Performance monitoring started");
```

##### TypeGuards (Runtime Type Guards)

Common runtime checks are centralised in `type-guards.js`:

- Predicates: `isFiniteNumber`, `isInteger`, `isString`, `isBoolean`, `isFunction`, `isObject`, `isArray`, `isElement`
- Helpers: `toNumber(value, fallback)`, `clampNumber(value, min, max)`, `inRange(value, min, max)`, `hasProps(obj, keys)`
- Adoption examples:

```javascript
// app.js – parse speed slider to integer with default
const parsedValue = Math.round(TypeGuards.toNumber(value, 30));

// simulations.js – constrain brightness and speed to allowed ranges
this.brightness = TypeGuards.clampNumber(value, 0.1, 2.0);
this.speed = TypeGuards.clampNumber(stepsPerSecond, min, max);
```

All call sites are guarded to fall back to legacy logic if `TypeGuards` is not available (legacy/CI contexts).

### 2. Simulation Engine (`simulations.js`)

#### Dynamic Colour Scheme

Advanced colour system with four-corner hue rotation:

**Features:**

- Time-based hue rotation at different periods
- Bilinear interpolation with circular hue handling
- Vector-based interpolation for smooth transitions
- HSL to RGB conversion with brightness control

**Corner Configurations:**

```javascript
corners = {
  topLeft: { startHue: 45, period: 60000 }, // 60 seconds
  topRight: { startHue: 135, period: 75000 }, // 75 seconds
  bottomRight: { startHue: 225, period: 90000 }, // 90 seconds
  bottomLeft: { startHue: 315, period: 105000 }, // 105 seconds
};
```

#### Simulation Lifecycle Framework

Framework for managing simulation lifecycles:

**Features:**

- Lifecycle hook registration and execution
- State management with subscription system and serialiser-based persistence
- Event handling with emitter pattern
- Cleanup and resource management
- Unified error routing via `errorHandler` with types: `hook`, `serialize`, `deserialize`, `subscriber`, `eventHandler`

#### Rendering Utilities

Comprehensive rendering system:

**Components:**

- **Color Manager**: HSL/RGB conversion and brightness control
- **ColorUtils (new)**: Centralised colour utilities (parse hex/rgb, HSL→RGB, interpolation) consumed by RenderingUtils and DynamicColourScheme
- **Performance Utilities**: Centralised debouncing and throttling via `PerformanceUtils` (with `PerformanceOptimizer` kept as a thin compatibility layer)
- **Grid Renderer**: Efficient grid drawing with custom cell renderers

#### Base Simulation Class

Abstract base class for all simulations:

**Core Features:**

- Canvas management and resizing
- Grid creation and manipulation
- Cell counting and neighbour calculation
- Drawing utilities with re-engineered fade-to-black effects
- Drag toggling for interactive cell manipulation
- Actor trail system for visual effects
- Unified state serialisation via lifecycle StateManager

**Re-engineered Fade-to-Black System:**
The new fading mechanism uses a brightness-based approach to eliminate race conditions:

**Key Components:**

- `cellBrightness`: Map tracking brightness for each cell (`{row,col} -> brightness (0-1)`)
- `fadeDecrement`: Configurable amount by which brightness decreases each cycle (default: 0.2)
- `fadeOutCycles`: Number of cycles to fade to black (configurable, default: 5)

**Three-Step Update Process:**

1. **Decrease Brightness**: All cells have their brightness decreased by `fadeDecrement` (bounded by 0)
2. **Apply Simulation Rules**: Cells are activated/deactivated according to simulation rules
3. **Set Active Cell Brightness**: All active cells have their brightness set to 1

**Immediate Visual Feedback Exceptions:**

- **Cell Toggle**: When a cell is toggled by user interaction, its brightness is immediately set to 1 (if active). If toggled to inactive, it starts fading from its current brightness (or 1 if no prior brightness existed), rather than jumping to 0.
- **Random Pattern**: After randomization, all active cells get brightness 1. Inactive cells do not receive brightness entries; a dedicated `initialInactiveCells` set prevents these from being treated as newly-inactive later, so they remain black until activated.

**Key Methods:**

```javascript
updateCellBrightness(); // Step 1: Decrease all cell brightness
setActiveCellBrightness(grid); // Step 3: Set active cells to brightness 1
getCellBrightness(row, col); // Get cell's current brightness
setFadeDecrement(decrement); // Configure fade decrement amount
getFadeDecrement(); // Get current fade decrement
clearFadeStates(); // Clear all brightness data
```

**Unified Brightness Helpers (new):**

To ensure identical behaviour across simulations and improve modularity, brightness handling has been centralised in the base class:

```javascript
applyToggleBrightness(row, col, isActiveAfter); // Sets brightness to 1 if active; if inactive, starts fade from current brightness or 1
resetBrightnessFromActiveGrid(isActivePredicate); // Clears brightness and sets 1 for cells considered active by the predicate
```

All simulations now call these helpers from their `toggleCell` and `randomize` implementations.

**Legacy Compatibility:**

- `updateFadeStates(grid)`: Legacy method adapted for non-Conway simulations. It now strictly distinguishes between `undefined` and `0` brightness. Zero is retained (cell stays black) and never treated as a signal to restart the fade; only `undefined` indicates no prior tracking and may initiate a new fade for newly-inactive cells not in `initialInactiveCells`.
- `getCellFadeFactor(row, col, isActive)`: Legacy method that returns cell brightness

**Enhanced Cell Drawing:**

```javascript
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

    // ... rest of drawing logic
}
```

**Key Methods:**

```javascript
init(); // Initialise simulation
resize(); // Handle canvas resize
update(); // Update simulation state
draw(); // Render simulation
toggleCell(x, y); // Toggle cell state with immediate brightness update
setBrightness(value); // Adjust visual brightness
getStats(); // Get simulation statistics
getState(); // Base state + serialised simulation-specific extras
setState(state); // Restore base state + delegate extras to serialiser
```

#### Conway's Game of Life

Classic cellular automaton implementation with re-engineered fading:

**Features:**

- Standard Conway rules (B3/S23)
- Wrap-around boundaries
- State preservation during resize
- Random pattern generation with immediate brightness updates
- Speed control
- Re-engineered fade-to-black system using the three-step process
- Serialiser preserves grids across resize and restoration

**Update Method:**

```javascript
update() {
    // Step 1: Decrease each cell's brightness value by configurable amount
    this.updateCellBrightness();

    this.generation++;

    // Step 2: Activate and deactivate cells according to simulation rules
    // ... Conway's rules implementation ...

    // Swap grids
    this.swapGrids(this.grids);

    // Step 3: For all active cells, set the brightness value to 1
    this.setActiveCellBrightness(this.grids.current);

    // Update cell count
    this.cellCount = this.countLiveCells(this.grids.current);
}
```

#### Termite Algorithm

Termite simulation with wood chip manipulation:

**Features:**

- Configurable termite count
- Wood chip pickup and drop mechanics
- Chips represented directly as active cells on a grid (no separate `woodChips` set)
- Visual termites with direction indicators and continuous trail effects
- Performance optimised for large numbers of termites
- Legacy fade system adapted to use new brightness approach
- Serialiser preserves active grid and termites (including trails and carrying state)

**Rendering Strategy:**

The Termite simulation renders the entire active grid so fading of inactive cells remains visible each frame.

#### Langton's Ant

Ant simulation with multiple ant support:

**Features:**

- Multiple ants with independent movement
- Mouse-based ant placement and ant-count slider (1-100)
- Smooth Bézier-interpolated motion between cell edge midpoints with entry/exit tangents matched to facing
- Dense trail sampling along the per-cell curve to mimic continuous trails
- State preservation and restoration
- Visual ant representation with direction indicators (toggle supported globally)
- Serialiser preserves grid and ants (including trails)

**Direction Indicator Override:**

- A shared option `showDirectionIndicator` controls visibility across actor-based simulations. It can be forced via URL parameters `?dir=0|1`, `showDir`, or `showDirectionIndicator`.

#### Simulation Factory

Factory pattern for simulation creation:

```javascript
static createSimulation(type, canvas, ctx) {
    switch(type) {
        case 'conway': return new ConwayGameOfLife(canvas, ctx);
        case 'termite': return new TermiteAlgorithm(canvas, ctx);
        case 'langton': return new LangtonsAnt(canvas, ctx);
        default: throw new Error(`Unknown simulation type: ${type}`);
    }
}
```

### 3. User Interface (`index.html`, `styles.css`)

#### Layout System

Dynamic layout management with floating controls:

**Features:**

- Full-window canvas display
- Floating control groups
- Responsive design
- Immersive mode support
- Dynamic positioning based on screen size

#### Control Groups

Organised control sections with CSS-based visibility:

1. **Title Container**: Application title (top-left)
2. **Simulation Container**: Simulation selector dropdown
3. **Playback Container**: Start/pause and speed controls
4. **Action Container**: Reset, random, and simulation-specific buttons
5. **Termites Container**: Termite count control (Termite Algorithm)
6. **Display Container**: Immersive mode and brightness controls
7. **Language Container**: Language selector (UK/US English)

All UI control containers now share a unified panel style using the `control-panel` class applied alongside `control-group`. This standardises spacing, border radius, and internal layout, reducing bespoke styling and improving consistency.

**CSS-Based Visibility Structure:**

```html
<!-- Conway's Game of Life specific controls -->
<div
  id="conway-controls"
  class="simulation-controls"
  data-simulation="conway"
  style="display: none;"
>
  <!-- Speed control moved to dynamic container -->
</div>

<!-- Termite Algorithm specific controls -->
<div
  id="termite-controls"
  class="simulation-controls"
  data-simulation="termite"
  style="display: none;"
>
  <!-- Speed control moved to dynamic container -->
</div>

<!-- Langton's Ant specific controls -->
<div
  id="langton-controls"
  class="simulation-controls"
  data-simulation="langton"
  style="display: none;"
>
  <!-- Speed control moved to dynamic container -->
</div>

<!-- Termites Control (top) -->
<div
  id="termites-container"
  class="control-group control-panel dynamic-position"
  data-simulation="termite"
  style="display: none;"
>
  <div class="control-group">
    <label for="termites-slider">Termites:</label>
    <input
      type="range"
      id="termites-slider"
      min="1"
      max="100"
      value="50"
      class="slider"
    />
    <span id="termites-value">50</span>
  </div>
</div>
```

#### Immersive Mode

Distraction-free simulation experience:

**Features:**

- Hide all controls except title
- Full-screen simulation display
- Keyboard shortcut access
- Smooth fade transitions
- Exit hint system

#### Responsive Design

Mobile-friendly responsive layout:

**Features:**

- CSS Grid and Flexbox layout
- Dynamic control positioning
- Touch-friendly controls
- Adaptive canvas sizing
- Cross-browser compatibility

### 4. Internationalisation (`i18n.js`)

#### Language System

Custom internationalisation framework:

**Features:**

- UK and US English support
- Extensible language system
- Automatic language detection
- Persistent language preferences
- Dynamic text updates

**Usage:**

```javascript
i18n.addLanguage("es", {
  title: "Generador de Patrones Algorítmicos",
  "start-btn": "Iniciar",
  // ... other translations
});
```

### 5. Dynamic Layout (`dynamic-layout.js`)

#### Layout Management

Dynamic positioning system for controls with enhanced visibility detection:

**Features:**

- YAML-based layout configuration
- Screen size adaptation
- Control group positioning
- Responsive breakpoints
- Performance optimised positioning
- Enhanced visibility detection for CSS-based controls

**Enhanced Element Positioning:**

```javascript
positionElement(element) {
    // Skip elements that are hidden (check both inline style and computed style)
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.display === 'none' ||
        (element.hasAttribute('data-simulation') && !element.classList.contains('active'))) {
        return;
    }

    // ... positioning logic
}
```

## Performance Optimisations

### 1. Rendering Optimisations

- **Hardware Acceleration**: `transform: translateZ(0)` and `will-change` properties
- **RequestAnimationFrame**: Smooth 60fps rendering
- **Canvas Optimisation**: Efficient drawing with minimal repaints
- **Element Caching**: Reduced DOM queries with enhanced null handling

### 2. Event Handling Optimisations

- **Debouncing**: 16ms debounce for slider inputs
- **Throttling**: Limited event processing rates
- **Event Delegation**: Efficient event handling
- **Memory Management**: Proper cleanup to prevent leaks

### 3. Memory Optimisations

- **Object Pooling**: Reuse objects where possible
- **Garbage Collection**: Explicit cleanup methods
- **Efficient Data Structures**: Optimised grid and state management
- **Resource Management**: Proper disposal of resources

### 4. Algorithm Optimisations

- **Efficient Neighbour Counting**: Optimised for large grids
- **Smart Updates**: Only update changed cells
- **Batch Processing**: Group operations for efficiency
- **Caching**: Cache frequently accessed values

### 5. CSS-Based Control Visibility Optimisations

- **No JavaScript DOM Manipulation**: Visibility changes handled entirely by CSS
- **Declarative Approach**: Clear separation of concerns between logic and presentation
- **Performance Benefits**: Reduced JavaScript execution for visibility changes
- **Memory Efficiency**: No need to track visibility state in JavaScript objects

## Testing Architecture

### 1. Test Suite (`public/test-suite.html`)

Comprehensive visual test suite with categories:

**Test Categories:**

- **Core Simulation Tests**: Basic simulation functionality
- **UI Component Tests**: User interface components
- **Performance Tests**: Performance benchmarks
- **Integration Tests**: Component interactions
- **Colour Scheme Tests**: Dynamic colour system
- **Fade-to-Black Tests**: Re-engineered fading mechanism
- **Control Visibility Tests**: CSS-based control visibility management

### 2. Test Runner (`src/test-runner.js`)

Programmatic testing framework:

**Features:**

- Automated test execution
- Performance benchmarking
- Result reporting and export
- Category-based testing
- Continuous integration support

### 3. Test Infrastructure

Comprehensive testing framework:

- `public/test-suite.html`: Visual test suite with interactive UI
- `src/test-runner.js`: Programmatic test runner for automation
- `src/test-utils.js`: TestUtilityFactory with shared canvas/ctx mocks and helpers
- `TESTING.md`: Complete testing documentation and guide

**New System Tests:**

```javascript
// ErrorHandler smoke tests (added via test-runner.js minimal suite)
runner.addTest(
  "ErrorHandler: default strategy handles event errors",
  async () => {
    /* ... */
  },
  "system"
);
runner.addTest(
  "ErrorHandler: state manager serialize/deserialize errors counted",
  async () => {
    /* ... */
  },
  "system"
);
```

**New Test Utilities:**

```javascript
// TestUtilityFactory usage examples
const { canvas, ctx } = TestUtilityFactory.createCanvasAndContext();
const { simulation } = TestUtilityFactory.createSimulationWithMocks("conway");
simulation.init();
```

**New Control Visibility Tests:**

## JSDoc & Types

Shared typedefs are centralised in `types.js` to maximise reuse and consistency across the codebase. These are documentation-only types and safe to include in browser and Node/CommonJS contexts.

Key typedefs:

- `SimulationId`, `Point`, `Grid`, `RGB`, `ColourString`
- `StateManager`, `EventHandler`, `Simulation`
- `TestResult`, `TestFunction`

Guidelines:

- Prefer adding new shapes to `types.js` rather than duplicating inline typedefs
- Reference shared types via `@typedef` names in function/class JSDoc

```javascript
// ControlVisibilityManager Tests
testSuite.addTest(
  "ControlVisibilityManager Initialization",
  async () => {
    const visibilityManager = new ControlVisibilityManager();
    visibilityManager.init();

    const isInitialized = visibilityManager.isInitialized;
    const hasControlGroups = visibilityManager.controlGroups.size > 0;
    const hasVisibilityStates = visibilityManager.visibilityStates.size > 0;

    visibilityManager.cleanup();

    return {
      passed: isInitialized && hasControlGroups && hasVisibilityStates,
      details: `Initialized: ${isInitialized}, Control groups: ${hasControlGroups}, Visibility states: ${hasVisibilityStates}`,
    };
  },
  "control-visibility"
);

testSuite.addTest(
  "ControlVisibilityManager Conway Simulation",
  async () => {
    const visibilityManager = new ControlVisibilityManager();
    visibilityManager.init();

    // Set active simulation to conway
    visibilityManager.setActiveSimulation("conway");

    // Check if conway controls are visible
    const conwayControls = document.getElementById("conway-controls");
    const isConwayVisible =
      conwayControls && conwayControls.classList.contains("active");

    // Check if other controls are hidden
    const termiteControls = document.getElementById("termite-controls");
    const isTermiteHidden =
      !termiteControls || !termiteControls.classList.contains("active");

    const langtonControls = document.getElementById("langton-controls");
    const isLangtonHidden =
      !langtonControls || !langtonControls.classList.contains("active");

    const termitesContainer = document.getElementById("termites-container");
    const isTermitesHidden =
      !termitesContainer || !termitesContainer.classList.contains("active");

    // Check active simulation
    const activeSim = visibilityManager.getActiveSimulation();

    visibilityManager.cleanup();

    return {
      passed:
        isConwayVisible &&
        isTermiteHidden &&
        isLangtonHidden &&
        isTermitesHidden &&
        activeSim === "conway",
      details: `Conway visible: ${isConwayVisible}, Termite hidden: ${isTermiteHidden}, Langton hidden: ${isLangtonHidden}, Termites hidden: ${isTermitesHidden}, Active: ${activeSim}`,
    };
  },
  "control-visibility"
);
```

## Configuration Files

### 1. Dynamic Colour Scheme (`dynamic-colour-scheme.yaml`)

### 3. Centralised Constants (`constants.js`)

Global constants used across the application, exposed as `AppConstants` in the browser and as a CommonJS export for tests.

Key groups:

- SimulationDefaults: speed bounds/default, cell size, fading behaviour, random coverage
- TermiteDefaults: default count, movement speed, random turn probability
- Layout: margins, tolerances, throttling/debouncing intervals, mobile breakpoint
- UISliders: default ranges for speed, likelihood, termites, brightness

Consumers:

- `simulations.js` (speed clamp, fade params, cell size, termite behaviour)
- `dynamic-layout.js` (margins, breakpoints, timings)
- `app.js` (UI component defaults and control templates)
  YAML configuration for colour system:

```yaml
corners:
  topLeft:
    startHue: 45
    period: 60000
  topRight:
    startHue: 135
    period: 75000
  bottomRight:
    startHue: 225
    period: 90000
  bottomLeft:
    startHue: 315
    period: 105000
```

### 2. Element Layout (`element-layout.yaml`)

Layout configuration for responsive design:

```yaml
breakpoints:
  mobile: 768
  tablet: 1024
  desktop: 1200

positions:
  title-container: top-left
  simulation-container: top
  playback-container: top
  # ... other positions
```

## Browser Compatibility

### Supported Features

- ES6+ JavaScript features
- HTML5 Canvas API
- CSS Grid and Flexbox
- Local Storage API
- RequestAnimationFrame
- Performance API
- CSS data attributes and class-based visibility

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Considerations

### Client-Side Security

- No server-side dependencies
- Local storage for preferences only
- No external API calls
- Sandboxed execution environment

### Data Handling

- All data processed locally
- No data transmission
- Secure random number generation
- Input validation and sanitisation

## Deployment

### Requirements

- Modern web browser
- No server-side dependencies
- Static file hosting sufficient
- HTTPS recommended for local storage

### File Structure

All files are self-contained and can be deployed to any static hosting service. Serve `public/` as the web root:

- GitHub Pages
- Netlify
- Vercel
- Traditional web servers

## Maintenance

### Code Organisation

- Modular architecture for easy maintenance
- Comprehensive documentation
- Extensive test coverage
- Clear separation of concerns
- CSS-based control visibility for improved maintainability

### Update Process

1. Run comprehensive test suite
2. Verify performance benchmarks
3. Test across different browsers
4. Update documentation
5. Deploy with version control

### Build/Versioning System

To eliminate merge conflicts while retaining an always-current identifier, the system separates version and build:

- `VERSION` (tracked): Manually updated Semantic Version (major.minor.patch).
- `BUILD` (untracked): Generated string written to `BUILD` (repo root) and `public/BUILD`.

Build format:

`${VERSION}-${BRANCH}-${HASH}-${USER}-${HOST}-${TIMESTAMP}`

- `VERSION`: from `VERSION`; `~.~.~` if missing
- `BRANCH`: `git rev-parse --abbrev-ref HEAD`; `~` if unavailable
- `HASH`: `git rev-parse --short HEAD`; `~` if unavailable
- `USER`: `git config user.name` or OS username; `~` if unavailable
- `HOST`: environment hostname or `os.hostname()`; `~` if unavailable
- `TIMESTAMP`: UTC `yyyymmddThhMMss`
- Non-word chars except parentheses and tilde are replaced with `_`.

Hooked generation:

- Installed via `node tools/install-hooks.js`.
- Runs on `post-commit`, `post-merge`, and `post-checkout` using `node tools/generate-build.js`.
- Manual generation: `node tools/generate-build.js`.

Runtime consumption:

- App (`src/app.js`) fetches `BUILD` at runtime and shows it in the footer.
- Test suite (`public/test-suite.html`) fetches `../BUILD` for the badge and includes it in exported logs.
- Test manifest no longer embeds version, reducing churn.

## Future Enhancements

### Potential Improvements

- Additional simulation algorithms
- More language support
- Advanced visual effects
- Export/import functionality
- Collaborative features
- Mobile app version
- Enhanced CSS-based control system extensions

### Extensibility

The modular architecture supports easy extension:

- New simulation types via factory pattern
- Additional UI components via component library
- Enhanced testing via test runner framework
- Custom colour schemes via configuration files
- New control groups via ControlVisibilityManager
- CSS utility classes via design token system

## CSS Utility Framework

### Design Token System

The application implements a comprehensive CSS utility framework with design tokens for consistent styling:

**CSS Custom Properties:**

```css
:root {
  /* Colours */
  --color-primary: #ff6b35;
  --color-secondary: #4ecdc4;
  --color-background: #0a0a0a;
  --color-surface: #1a1a1a;

  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 0.75rem;
  --spacing-lg: 1rem;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;

  /* Z-index */
  --z-controls: 100;
  --z-modal: 1000;
}
```

### Utility Classes

**Glass Effects:**

- `.glass` - Standard glass effect with backdrop blur
- `.glass-light` - Lighter glass effect with hover animations
- `.glass-hover` - Hover-only glass effect

**Layout Utilities:**

- `.flex`, `.flex-center`, `.flex-column` - Flexbox utilities
- `.gap-sm`, `.gap-md`, `.gap-lg` - Spacing utilities
- `.position-absolute`, `.position-relative` - Positioning utilities

**Performance Utilities:**

- `.gpu-accelerate` - Hardware acceleration for transforms
- `.gpu-accelerate-opacity` - Hardware acceleration for opacity
- `.gpu-accelerate-transform` - Hardware acceleration for transforms

**Component Variants:**

- `.control-group--static` - Static positioning for control groups
- `.control-group--transparent` - Transparent background for control groups
- `.hover-lift` - Hover lift effect for interactive elements

### Code Reduction Achievements

- **Total CSS Lines**: 822 → 650 (21% reduction)
- **Glass Effect Patterns**: 45 → 15 lines (67% reduction)
- **Control Group Overrides**: 80 → 20 lines (75% reduction)
- **Performance Optimizations**: 30 → 10 lines (67% reduction)
- **Button Styling**: 25 → 15 lines (40% reduction)
- **Spacing and Layout**: 60 → 20 lines (67% reduction)

### Implementation Benefits

- **Consistency**: Design tokens ensure consistent visual design
- **Maintainability**: Centralised styling reduces duplication
- **Performance**: Optimised utility classes improve rendering
- **Extensibility**: Easy to add new utility classes and variants
- **Testing**: Comprehensive CSS utility test suite for validation
