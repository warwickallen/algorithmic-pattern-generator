# Algorithmic Pattern Generator - AS-BUILT Documentation

## Project Overview

The Algorithmic Pattern Generator is a sophisticated web application that combines three classic algorithmic simulations: Conway's Game of Life, the Termite Algorithm, and Langton's Ant. Built with vanilla JavaScript, it features a modular architecture, dynamic colour schemes, comprehensive testing, and performance optimisations.

## Architecture Overview

### Core Architecture
- **Frontend**: Vanilla JavaScript with HTML5 Canvas
- **Styling**: CSS3 with responsive design and immersive mode
- **Internationalisation**: Custom i18n system supporting UK/US English
- **Testing**: Comprehensive test suite with visual and programmatic testing
- **Performance**: Optimised rendering with debouncing, throttling, and hardware acceleration

### File Structure
```
algorithmic-pattern-generator/
├── index.html              # Main application entry point
├── app.js                  # Core application logic and UI management
├── simulations.js          # Simulation algorithms and rendering utilities
├── styles.css              # Responsive styling and immersive mode
├── i18n.js                 # Internationalisation system
├── dynamic-layout.js       # Dynamic layout management
├── test-runner.js          # Programmatic test runner
├── test-suite.html         # Comprehensive visual test suite
├── LICENSE                 # MIT License
├── README.md               # Usage instructions and overview
├── AS-BUILT.md             # This comprehensive implementation guide
└── TESTING.md              # Detailed testing instructions
```

## Core Components

### 1. Application Layer (`app.js`)

#### AlgorithmicPatternGenerator Class
The main application controller that orchestrates all components:

**Key Features:**
- Simulation lifecycle management
- UI state management
- Event handling and keyboard shortcuts
- Performance monitoring
- Modal management

**Core Methods:**
```javascript
init()                    // Initialise application
switchSimulation(type)    // Switch between simulations
startSimulation()         // Start current simulation
pauseSimulation()         // Pause current simulation
toggleImmersiveMode()     // Toggle immersive mode
handleCanvasClick(e)      // Handle canvas interactions
updateUI()               // Update UI elements
```

#### UI Component Library
Modular UI component system with lifecycle management:

**Components:**
- **Slider Components**: Standardised slider with performance optimisation
- **Button Components**: Reusable button with state management
- **Control Groups**: Container components for related controls
- **Modal Components**: Modal management with render queue

**Performance Optimisations:**
- Debounced input handling (16ms for 60fps)
- Element caching to reduce DOM queries
- RequestAnimationFrame for smooth rendering
- Memory leak prevention with cleanup methods

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
    randomButton: { type: 'button', label: 'Random' },
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
            random: { template: 'randomButton', id: 'random-btn' },
            learn: { template: 'learnButton', id: 'learn-btn' }
        }
    },
    termite: {
        controls: {
            speed: { template: 'dynamicSpeedSlider', id: 'dynamic-speed-slider', valueElementId: 'dynamic-speed-value' },
            termiteCount: { template: 'termiteCountSlider', id: 'termites-slider', valueElementId: 'termites-value' },
            random: { template: 'randomButton', id: 'termite-random-btn' },
            learn: { template: 'learnButton', id: 'learn-btn' }
        }
    },
    langton: {
        controls: {
            speed: { template: 'dynamicSpeedSlider', id: 'dynamic-speed-slider', valueElementId: 'dynamic-speed-value' },
            addAnt: { template: 'addAntButton', id: 'add-ant-btn' },
            random: { template: 'randomButton', id: 'langton-random-btn' },
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

#### Event Framework
Comprehensive event management system:

**Features:**
- Centralised event registration and cleanup
- Debounced and throttled event handlers
- Batch event registration
- Memory leak prevention

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
switchToSimulation(simType, app)    // Switch to different simulation
setValue(value)                     // Set speed value for current simulation
getValue()                          // Get current speed value
adjustSpeed(direction)              // Increment/decrement speed
hide()                              // Hide the speed control
cleanup()                           // Clean up event listeners
```

**Performance Optimisations:**
- 100ms debounced input handling to prevent excessive updates
- Value change detection to avoid redundant DOM updates
- Simulation type change detection to prevent unnecessary switches
- Efficient state management with Map-based storage

#### Control Manager
Dynamic UI control management:

**Features:**
- Simulation-specific control visibility
- Dynamic control value updates
- Event handler registration per simulation
- State preservation during simulation switches

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
Advanced modal system with performance optimisations:

**Features:**
- Render queue to prevent layout thrashing
- RequestAnimationFrame integration
- Memory management and cleanup
- Show/hide state tracking

#### Performance Monitor
Real-time performance monitoring:

**Metrics:**
- FPS monitoring
- Memory usage tracking
- Performance metrics collection
- Statistical analysis

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
    topLeft: { startHue: 45, period: 60000 },     // 60 seconds
    topRight: { startHue: 135, period: 75000 },   // 75 seconds
    bottomRight: { startHue: 225, period: 90000 }, // 90 seconds
    bottomLeft: { startHue: 315, period: 105000 }  // 105 seconds
}
```

#### Simulation Lifecycle Framework
Framework for managing simulation lifecycles:

**Features:**
- Lifecycle hook registration and execution
- State management with subscription system
- Event handling with emitter pattern
- Cleanup and resource management

#### Rendering Utilities
Comprehensive rendering system:

**Components:**
- **Color Manager**: HSL/RGB conversion and brightness control
- **Performance Optimizer**: Debouncing, throttling, and timing
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
- **Cell Toggle**: When a cell is toggled by user interaction, its brightness is immediately set to 1 (if active) or 0 (if inactive)
- **Random Pattern**: After randomization, all active cells get brightness 1 and all inactive cells get brightness 0

**Key Methods:**
```javascript
updateCellBrightness()           // Step 1: Decrease all cell brightness
setActiveCellBrightness(grid)    // Step 3: Set active cells to brightness 1
getCellBrightness(row, col)      // Get cell's current brightness
setFadeDecrement(decrement)      // Configure fade decrement amount
getFadeDecrement()               // Get current fade decrement
clearFadeStates()                // Clear all brightness data
```

**Legacy Compatibility:**
- `updateFadeStates(grid)`: Legacy method adapted for non-Conway simulations
- `getCellFadeFactor(row, col, isActive)`: Legacy method that returns cell brightness

**Key Methods:**
```javascript
init()                    // Initialise simulation
resize()                  // Handle canvas resize
update()                  // Update simulation state
draw()                    // Render simulation
toggleCell(x, y)          // Toggle cell state with immediate brightness update
setBrightness(value)      // Adjust visual brightness
getStats()               // Get simulation statistics
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
- Visual termite representation with direction indicators
- Trail system for visual effects
- Performance optimised for large numbers of termites
- Legacy fade system adapted to use new brightness approach

#### Langton's Ant
Ant simulation with multiple ant support:

**Features:**
- Multiple ants with independent movement
- Mouse-based ant placement
- Random ant addition
- State preservation and restoration
- Visual ant representation with direction

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
Organised control sections:

1. **Title Container**: Application title (top-left)
2. **Simulation Container**: Simulation selector dropdown
3. **Playback Container**: Start/pause and speed controls
4. **Action Container**: Reset, random, and simulation-specific buttons
5. **Termites Container**: Termite count control (Termite Algorithm)
6. **Display Container**: Immersive mode and brightness controls
7. **Language Container**: Language selector (UK/US English)

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
i18n.addLanguage('es', {
    'title': 'Generador de Patrones Algorítmicos',
    'start-btn': 'Iniciar',
    // ... other translations
});
```

### 5. Dynamic Layout (`dynamic-layout.js`)

#### Layout Management
Dynamic positioning system for controls:

**Features:**
- YAML-based layout configuration
- Screen size adaptation
- Control group positioning
- Responsive breakpoints
- Performance optimised positioning

## Performance Optimisations

### 1. Rendering Optimisations
- **Hardware Acceleration**: `transform: translateZ(0)` and `will-change` properties
- **RequestAnimationFrame**: Smooth 60fps rendering
- **Canvas Optimisation**: Efficient drawing with minimal repaints
- **Element Caching**: Reduced DOM queries

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

## Testing Architecture

### 1. Test Suite (`test-suite.html`)
Comprehensive visual test suite with categories:

**Test Categories:**
- **Core Simulation Tests**: Basic simulation functionality
- **UI Component Tests**: User interface components
- **Performance Tests**: Performance benchmarks
- **Integration Tests**: Component interactions
- **Colour Scheme Tests**: Dynamic colour system
- **Fade-to-Black Tests**: Re-engineered fading mechanism

### 2. Test Runner (`test-runner.js`)
Programmatic testing framework:

**Features:**
- Automated test execution
- Performance benchmarking
- Result reporting and export
- Category-based testing
- Continuous integration support

### 3. Test Infrastructure
Comprehensive testing framework:

- `test-suite.html`: Visual test suite with interactive UI
- `test-runner.js`: Programmatic test runner for automation
- `TESTING.md`: Complete testing documentation and guide

## Configuration Files

### 1. Dynamic Colour Scheme (`dynamic-colour-scheme.yaml`)
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
All files are self-contained and can be deployed to any static hosting service:
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

### Update Process
1. Run comprehensive test suite
2. Verify performance benchmarks
3. Test across different browsers
4. Update documentation
5. Deploy with version control

## Future Enhancements

### Potential Improvements
- Additional simulation algorithms
- More language support
- Advanced visual effects
- Export/import functionality
- Collaborative features
- Mobile app version

### Extensibility
The modular architecture supports easy extension:
- New simulation types via factory pattern
- Additional UI components via component library
- Enhanced testing via test runner framework
- Custom colour schemes via configuration files 