# Algorithmic Pattern Generator

A sophisticated web application featuring three classic algorithmic simulations: Conway's Game of Life, the Termite Algorithm, and Langton's Ant. This educational tool provides an interactive way to explore emergent behaviour and cellular automata with advanced visual effects and performance optimisations.

## Features

### Three Simulations

1. **Conway's Game of Life** - A cellular automaton where cells live or die based on their neighbours
2. **Termite Algorithm** - Termites that pick up and drop wood chips, creating fascinating patterns
3. **Langton's Ant** - A simple ant following basic rules that creates complex highways. New ants can be added randomly (button) or under the mouse pointer (keyboard) for precise placement.

### Key Features

- **Simulation Selector** - Switch between the three algorithms seamlessly
- **Immersive Mode** - Hide controls for a full-screen experience
- **Internationalisation** - Support for UK English and US English (easily extensible)
- **Interactive Controls** - Click to toggle cells in Conway's Game of Life, add ants randomly or under mouse pointer in Langton's Ant
- **Real-time Statistics** - Generation count, cell count, and FPS display
- **Keyboard Shortcuts** - Space to start/pause, Ctrl+R to reset, Ctrl+C to clear, Ctrl+I for immersive mode
- **Dynamic Colour Scheme** - Time-based four-corner hue rotation with smooth interpolation
- **Performance Optimised** - Hardware acceleration, debounced inputs, and efficient rendering
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Comprehensive Testing** - Visual and programmatic test suites for quality assurance
- **CSS-Based Control Visibility** - Declarative control visibility management using CSS classes and data attributes
- **EventHandlerFactory** - Template-based event handler creation and registration system
- **ModalTemplateManager** - Template-based modal content management with dynamic content injection and scroll position management
- **UIComponentLibrary** - Comprehensive UI component library with 8 component types, lifecycle management, and factory methods
- **CSS Utility Framework** - Design token system with utility classes for glass effects, layout, and performance optimization
 - **PerformanceUtils** - Centralised debounce/throttle utilities used across the app
 - **EventFramework (enhanced)** - Declarative and delegated event registration with centralised cleanup
 - **ErrorHandler (new)** - Centralised error handling with simulation-specific strategies and metrics

## Quick Start

1. **Open the Application**
   ```bash
   # Simply open index.html in a modern web browser
   open index.html
   ```

2. **Select a Simulation**
   - Choose from the dropdown menu: Conway's Game of Life, Termite Algorithm, or Langton's Ant

3. **Control the Simulation**
   - **Start/Pause**: Click the Start button or press Space
   - **Reset**: Click Reset or press Ctrl+R
   - **Clear**: Press Ctrl+C
   - **Speed**: Adjust the speed slider for each simulation
   - **Fill**: Click Fill to generate random patterns
   - **Coverage**: Adjust the likelihood slider to control pattern density

4. **Interactive Features**
   - **Conway's Game of Life**: Click on the canvas to toggle cells
   - **Langton's Ant**: Press 'A' to add an ant under the mouse pointer
   - **Termite Algorithm**: Adjust the termite count slider

5. **Immersive Mode**
   - Click "Immersive Mode" or press Ctrl+I for distraction-free viewing
   - Press Escape to exit immersive mode

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Space** | Start/Pause simulation |
| **Ctrl+R** | Reset simulation |
| **Ctrl+C** | Clear simulation |
| **Ctrl+I** | Toggle immersive mode |
| **Escape** | Exit immersive mode |
| **A** | Add ant (Langton's Ant only, places ant under mouse pointer) |

## Simulation Details

### Conway's Game of Life
- **Rules**: Standard Conway rules (B3/S23) with wrap-around boundaries
- **Controls**: Speed, Random pattern generation, Interactive cell toggling
- **Features**: State preservation during resize, re-engineered fade-to-black effects, brightness control
- **Fade-to-Black System**: Advanced brightness-based fading mechanism that eliminates race conditions and provides immediate visual feedback for user interactions

### Termite Algorithm
- **Mechanics**: Termites pick up and drop wood chips based on simple rules
- **Controls**: Speed, Termite count (1-100), Random wood chip placement
- **Features**: Visual termite representation with direction indicators, trail effects

### Langton's Ant
- **Rules**: Ants follow simple rules: turn right on white, left on black, flip cell colour
- **Controls**: Speed, Add ant (random or mouse position), Random pattern generation
- **Features**: Multiple ant support, state preservation, visual ant representation

## Advanced Features

### Dynamic Colour Scheme
The application features a sophisticated colour system with:
- **Four-corner hue rotation** at different time periods
- **Bilinear interpolation** for smooth colour transitions
- **Vector-based interpolation** to handle circular hue values correctly
- **Brightness control** for visual adjustment

### Re-engineered Fade-to-Black System
The Conway's Game of Life simulation features an advanced fade-to-black system:
- **Brightness-based approach** that eliminates race conditions
- **Three-step update process** for consistent fading behaviour
- **Immediate visual feedback** for user interactions (cell toggling, randomization)
- **Configurable fade parameters** for customising the fade effect
- **Consistent behaviour** for oscillating patterns like blinkers

### CSS-Based Control Visibility Management
The application uses a declarative CSS-based control visibility system:
- **ControlVisibilityManager** - Centralised visibility management using CSS classes and data attributes
- **Simulation-specific controls** - Each simulation has its own control set that shows/hides automatically
- **Data attributes** - Controls use `data-simulation` attributes to identify their simulation type
- **CSS classes** - `.active` class controls visibility with `display: flex !important`
- **Performance optimised** - No JavaScript DOM manipulation for visibility changes
- **Extensible design** - Easy to add new simulations and control groups

### Performance Optimisations
- **Hardware acceleration** with CSS transforms
- **Debounced input handling** for smooth slider interactions
- **RequestAnimationFrame** for 60fps rendering
- **Element caching** to reduce DOM queries
- **Memory management** with proper cleanup

### Responsive Design
- **Dynamic layout** that adapts to screen size
- **Floating controls** that don't obstruct the simulation
- **Touch-friendly** interface for mobile devices
- **Cross-browser compatibility** with modern browsers

## Technical Architecture

### High-Level Design
The application uses a modular architecture with clear separation of concerns:

- **`app.js`** - Main application logic, UI management, and event handling
- **`simulations.js`** - Simulation algorithms, rendering utilities, and base classes
- **`styles.css`** - Responsive styling with immersive mode support
- **`i18n.js`** - Internationalisation system
- **`dynamic-layout.js`** - Dynamic layout management
- **`test-runner.js`** - Programmatic testing framework

### Core Components
1. **AlgorithmicPatternGenerator** - Main application controller
2. **BaseSimulation** - Abstract base class for all simulations
3. **UIComponentLibrary** - Comprehensive UI component library with lifecycle management, state management, and event handling
4. **EventFramework** - Centralised event handling with performance optimisations and memory leak prevention
5. **PerformanceUtils** - Centralised debounce/throttle utilities (with `PerformanceOptimizer` kept for compatibility)
6. **ControlTemplateManager** - Template-based control configuration system
7. **ConfigurationManager** - Centralised configuration for all simulations
8. **Performance Monitor** - Real-time performance tracking
9. **ControlVisibilityManager** - CSS-based control visibility management

### Design Patterns
- **Factory Pattern** - Simulation creation via SimulationFactory
- **Observer Pattern** - Event handling and state management
- **Component Pattern** - Modular UI components
- **Strategy Pattern** - Different simulation algorithms
- **Template Pattern** - Control configuration via ControlTemplateManager
- **Singleton Pattern** - Global services like i18n

## Browser Compatibility

This application works in all modern browsers that support:
- ES6+ JavaScript features
- HTML5 Canvas API
- CSS Grid and Flexbox
- Local Storage API
- RequestAnimationFrame
- Performance API

**Supported Browsers:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Adding New Languages

To add support for additional languages, use the `i18n.addLanguage()` method:

```javascript
i18n.addLanguage('es', {
    'title': 'Generador de Patrones Algorítmicos',
    'start-btn': 'Iniciar',
    'pause-btn': 'Pausar',
    'reset-btn': 'Reiniciar',
    'clear-btn': 'Limpiar',
    'immersive-btn': 'Modo Inmersivo',
    // ... other translations
});
```

## Testing

The application includes a comprehensive testing framework:

### Visual Test Suite
Open `test-suite.html` in your browser for comprehensive visual testing:
- Core simulation functionality
- UI component testing
- Performance benchmarking
- Integration testing
- Colour scheme validation
- Fade-to-black system testing
- Control visibility management testing

### Programmatic Testing
Use `test-runner.js` for automated testing:
```javascript
// Run all tests
testRunner.runAllTests();

// Run specific categories
testRunner.runTestsByCategory('core');
testRunner.runTestsByCategory('performance');
testRunner.runTestsByCategory('control-visibility');
```

### Test Categories
The test suite covers:
- Core simulation functionality
- UI component testing (18 comprehensive test cases for UIComponentLibrary)
- Performance benchmarking
- Integration testing
- Visual effects testing
- System-level functionality
- Control visibility management
- ModalTemplateManager testing
- EventFramework testing
- CSS utility framework testing
 - Error handling tests (system category)

## CSS Utility Framework

The application implements a comprehensive CSS utility framework for consistent styling and improved maintainability:

### Design Token System
- **50+ CSS custom properties** for colours, spacing, shadows, transitions, and z-index values
- **Centralised configuration** ensuring consistent visual design across all components
- **Easy customisation** through CSS custom properties

### Utility Classes
- **Glass Effects**: `.glass`, `.glass-light`, `.glass-hover` for backdrop blur effects
- **Layout Utilities**: `.flex`, `.flex-center`, `.gap-sm`, `.gap-md`, `.gap-lg` for consistent spacing
- **Performance Utilities**: `.gpu-accelerate` for hardware acceleration
- **Component Variants**: `.control-group--static`, `.control-group--transparent` for component variations

### Code Reduction Achievements
- **21% CSS reduction**: 822 lines → 650 lines
- **67% glass effect reduction**: 45 lines → 15 lines
- **75% control group reduction**: 80 lines → 20 lines
- **67% performance optimization reduction**: 30 lines → 10 lines

### Benefits
- **Consistency**: Design tokens ensure uniform visual design
- **Maintainability**: Centralised styling reduces duplication
- **Performance**: Optimised utility classes improve rendering
- **Extensibility**: Easy to add new utility classes and variants

## Performance Benchmarks

The application is optimised for performance with the following targets:
- **Grid Creation**: < 100ms
- **Cell Counting**: < 10ms
- **Drawing**: < 50ms
- **Updates**: < 20ms


## Deployment

### Requirements
- Modern web browser
- No server-side dependencies
- Static file hosting sufficient
- HTTPS recommended for local storage

### Deployment Options
The application can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Traditional web servers

All files are self-contained and require no build process or server-side dependencies.

## Contributing

When contributing to this project:
1. Follow the existing code style and architecture
2. Add tests for new features
3. Run the comprehensive test suite before submitting
4. Update documentation as needed
5. Follow the modular design principles

## License

This project is open source and available under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all required files are loaded
3. Ensure you're using a supported browser
4. Review the test suite for functionality verification
5. If you use Cursor/VS Code on Windows and encounter direnv errors or agent-run command hangs, see this troubleshooting guide: [Fix direnv and shell command hangs in Cursor/VS Code on Windows (Git Bash per‑project)](https://gist.github.com/warwickallen/dd9051ec2462f4f90f5ec9763ca0bf04). This link is included to help Windows users quickly resolve editor/terminal configuration issues without changing global settings.