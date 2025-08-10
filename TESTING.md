# Testing Guide for Algorithmic Pattern Generator

This comprehensive guide explains how to use the test suite to ensure code quality, catch regressions, and maintain performance standards during development and refactoring.

## Test Suite Overview

The Algorithmic Pattern Generator includes a sophisticated testing framework with two main components:

### Core Testing Components

1. **`test-suite.html`** - Comprehensive visual test suite with interactive UI
2. **`test-runner.js`** - Programmatic test runner for automation and CI/CD
3. **`test-utils.js`** - TestUtilityFactory providing shared mocks and helpers
4. **`utils.js`** - `ColorUtils` centralised colour utilities used by rendering tests

### Test Categories

The test suite is organised into logical categories:

- **Core Simulation Tests** - Basic simulation functionality and algorithms
- **UI Component Tests** - User interface components and interactions
- **Performance Tests** - Performance benchmarks and optimisation validation
- **Integration Tests** - Component interactions and system integration
- **Visual Effects Tests** - Visual rendering and re-engineered fade-to-black effects
- **System Tests** - System-level functionality and error handling
- **Control Visibility Tests** - CSS-based control visibility management system
- **EventHandlerFactory Tests** - Template-based event handler creation and registration system
- **EventFramework Tests** - Declarative and delegated registration with centralised cleanup
- **ModalTemplateManager Tests** - Template-based modal content management system
- **UnifiedModalSystem Tests** - Facade over modal stack; verifies custom content open/close and title/content injection
- **UI Component Library Tests** - Comprehensive UI component library with lifecycle management and state management
- **CSS Utility Tests** - CSS utility framework and design token system validation
- **Error Handling Tests** - Centralised ErrorHandler smoke tests

## Quick Start

### 1. Visual Test Suite

Open `test-suite.html` in your browser for comprehensive visual testing:

```bash
# Open in browser
open test-suite.html
```

**What it provides:**

- Interactive test interface with real-time results
- Visual feedback for test outcomes
- Performance metrics display
- **Checkbox-based test group selection** - Choose which test categories to run
- **Select/Deselect All functionality** - Quickly manage all test groups
- Export capabilities for test results
- Warning detection and reporting

### 2. Programmatic Test Runner

Include `test-runner.js` in your HTML or use it programmatically:

```html
<script src="test-runner.js"></script>
<script src="simulations.js"></script>
<script src="app.js"></script>
<script src="test-utils.js"></script>
```

Then run tests from the browser console:

```javascript
// Run all tests
testRunner.runAllTests();

// Run specific categories
testRunner.runTestsByCategory("core");
testRunner.runTestsByCategory("performance");
testRunner.runTestsByCategory("ui");
testRunner.runTestsByCategory("control-visibility");
testRunner.runTestsByCategory("system"); // includes ErrorHandler tests
```

### 3. Using the Visual Test Suite Interface

The visual test suite (`test-suite.html`) provides an intuitive interface for test selection:

1. **Select Test Groups**: Use the checkboxes to choose which test categories to run:

   - Simulation Core Tests
   - UI Component Tests
   - Interaction Tests
   - Performance Tests
   - Visual Effects Tests
   - Integration Tests
   - System Tests
   - Control Visibility Tests
   - ModalTemplateManager Tests
   - UI Component Library Tests
   - CSS Utility Tests

2. **Select/Deselect All**: Use the top checkbox to quickly select or deselect all test groups at once. The checkbox shows:

   - **Checked**: All test groups are selected
   - **Unchecked**: No test groups are selected
   - **Indeterminate (orange with dash)**: Some test groups are selected

3. **Run Selected Tests**: Click the "Run Selected Tests" button to execute only the chosen test categories

4. **Additional Actions**: Use the action buttons to:
   - Clear previous results
   - Export test logs
   - Copy logs to clipboard
   - View warning details

## Detailed Test Categories

### Core Simulation Tests

Tests the fundamental simulation functionality:

#### ✅ Simulation Creation

- Verifies all simulation types can be created successfully
- Tests factory pattern implementation
- Validates simulation inheritance hierarchy

#### ✅ Grid Initialization

- Tests grid setup and dimensions
- Validates grid data structure integrity
- Tests grid resizing functionality

#### ✅ Cell Toggle

- Tests interactive cell manipulation
- Validates coordinate conversion (screen to grid)
- Tests boundary conditions and wrap-around

#### ✅ Neighbour Counting

- Tests the core algorithm logic for each simulation
- Validates neighbour calculation accuracy
- Tests edge cases and boundary conditions

#### ✅ Movement Patterns

- Tests termite and ant movement algorithms
- Validates direction changes and state updates
- Tests collision detection and resolution

#### ✅ Brightness Application

- Tests visual brightness controls
- Validates colour modification algorithms
- Tests brightness persistence across updates

#### ✅ Speed Setting

- Tests simulation speed controls
- Validates timing and frame rate management
- Tests speed change responsiveness

### UI Component Tests

Tests the user interface components and interactions:

#### ✅ Configuration Manager

- Tests simulation configuration access
- Validates configuration validation
- Tests configuration updates and persistence

#### ✅ Shared Components

- Tests reusable UI components
- Validates component lifecycle management
- Tests component state management

#### ✅ Performance Utilities

- Tests debounce and throttle functions via `PerformanceUtils` (with `PerformanceOptimizer` facade compatibility)
- Validates performance optimisation effectiveness
- Tests memory management and cleanup

#### ✅ Element Cache

- Tests DOM element caching
- Validates cache hit/miss scenarios
- Tests cache invalidation and updates

#### ✅ Event Listener Manager

- Tests event handling registration
- Validates event cleanup and memory management
- Tests event delegation and propagation

#### ✅ Controls Visibility

- **Critical test** - Ensures controls are visible immediately when the application initialises
- Tests that controls become visible immediately after `app.init()`
- Prevents the issue where controls only appear after canvas updates

#### ✅ Modal Management

- Tests modal show/hide functionality
- Validates modal state management
- Tests modal event handling and cleanup

#### ✅ Termite Slider Integration

- Tests termite count slider functionality
- Validates slider event handling
- Tests real-time termite count updates

#### ✅ Learn Modal Content Verification

- Tests educational modal content
- Validates modal content accuracy
- Tests modal navigation and display

#### ✅ Dynamic Fill Button Tests

- Tests DynamicFillButton class existence and initialisation
- Validates simulation switching functionality
- Tests show/hide visibility management
- Tests event handling and click delegation
- **Critical test** - Dynamic Fill Button Initial Visibility After App Load
  - Ensures the Fill button is visible immediately after application initialisation
  - Tests proper test environment handling for app instance creation
  - Validates button visibility state management and conflict resolution

### Statistical Coverage Validation for Fill Button

The Dynamic Fill button uses per-cell Bernoulli sampling with likelihood \(P\). The test suite includes two complementary statistical tests to validate randomization quality:

#### Coverage Statistical Bounds Test

To validate that the observed number of activated cells is statistically plausible, the test suite includes a bounds test with retries that checks whether the observed count lies within \(\pm k\sigma\) of the expected mean, where:

- N: Number of bits/cells
- P: Probability of each bit being true
- k: Number of standard deviations (\(\sigma\)) for individual test bounds
- r: Number of retries (total attempts = \(r + 1\))
- \(\Phi(k)\): the cumulative distribution function of the standard normal distribution

overall_confidence = \(1 - [1 - (2 \times \Phi(k) - 1)]^{(r + 1)}\)

Therefore:

- \(\pm 2\sigma\) with 1 retry achieves 99.79% confidence
- \(\pm 2\sigma\) with 2 retries achieves 99.990% confidence

The concrete implementation lives in the test suite as "Dynamic Fill Coverage Statistical Bounds (±2σ, r=2)" and uses the app's current grid size for \(N\) and the slider likelihood for \(P\).

#### Equal Cell Activation Probability Test

To validate that each cell has an equal chance of being activated (uniform distribution), the test suite includes a coefficient of variation test:

- **Test Name**: "Fill Button Equal Cell Activation Probability (Variance Test)"
- **Methodology**: Performs 200 Fill operations and tracks activation count for each individual cell
- **Statistical Analysis**: Uses coefficient of variation ratio to compare observed vs expected variance
- **Pass Criteria**: CV ratio must be within 0.9-1.1 (10% deviation from expected variance)
- **Bug Detection**: Can identify subtle biases in randomization algorithms that achieve correct overall coverage but don't give each cell equal probability

**Expected Results:**

- Each cell should be activated approximately 60 times out of 200 trials (30% probability)
- Coefficient of variation ratio should be close to 1.0
- Observed variance should match expected binomial variance

**Failure Indicators:**

- CV ratio significantly different from 1.0 indicates non-uniform distribution
- High spatial bias (MaxRowDev/MaxColDev > 100) suggests coordinate-related issues
- Wide activation range (e.g., [40-80] instead of [50-70]) suggests unequal probabilities

This test uses a more appropriate statistical method for large sample sizes than the previous chi-square approach, avoiding false positives from natural random variation in large datasets.

### Performance Tests

Tests performance characteristics and benchmarks:

#### ✅ Grid Creation Performance

- **Target**: Must complete in < 100ms
- Tests grid creation speed for different sizes
- Validates memory allocation efficiency

#### ✅ Cell Counting Performance

- **Target**: Must complete in < 10ms
- Tests live cell counting algorithms
- Validates counting optimisation effectiveness

#### ✅ Drawing Performance

- **Target**: Must complete in < 50ms
- Tests canvas rendering speed
- Validates drawing optimisation techniques

#### ✅ Update Performance

- **Target**: Must complete in < 20ms
- Tests simulation update algorithms
- Validates update optimisation effectiveness

### Integration Tests

Tests component interactions and system integration:

#### ✅ Simulation Switching

- Tests switching between simulation types
- Validates state preservation during switches
- Tests resource cleanup and initialisation

#### ✅ State Preservation

- Tests state preservation during resize
- Validates state restoration accuracy
- Tests state serialisation and deserialisation

#### ✅ Control Management

- Tests UI control visibility and updates
- Validates control value synchronisation
- Tests control event handling

#### ✅ Keyboard Handler

- Tests keyboard shortcut registration
- Validates shortcut functionality
- Tests shortcut conflict resolution

#### ✅ Event Framework

- Tests event registration and cleanup
- Validates event propagation
- Tests event memory management
- Tests declarative registration API
- Tests delegated registration API

### Visual Effects Tests

Tests visual rendering and effects:

#### ✅ Re-engineered Fade-to-Black Effect

- Tests the new brightness-based fade effect implementation
- Validates the three-step update process (decrease brightness, apply rules, set active brightness)
- Tests fade state management using the `cellBrightness` map
- Validates immediate visual feedback for user interactions
- **Recently Fixed**: Rewritten to properly handle coordinate conversion between screen and grid coordinates

#### ✅ Comprehensive Fade Functionality

- Tests brightness calculations and fade decrement application
- Validates brightness state tracking across simulation cycles
- Tests fade clearing and reset functionality
- Validates configurable fade parameters (fadeDecrement, fadeOutCycles)
- **Recently Fixed**: Updated to use correct coordinate system and cell brightness map access patterns

#### ✅ Visual Regression Test

- Tests canvas rendering accuracy
- Validates pixel data integrity
- Tests visual output consistency

### System Tests

Tests system-level functionality:

#### ✅ Console Warning Detection

- Tests warning detection and reporting
- Validates warning categorisation
- Tests warning filtering and display

#### ✅ Test Canvas Configuration

- Tests canvas setup and validation
- Validates canvas drawing capabilities
- Tests canvas dimension handling
- **Recently Fixed**: Enhanced canvas dimension detection to handle both attached and detached canvases
  - Uses `getBoundingClientRect()` for canvases attached to DOM
  - Falls back to canvas `width`/`height` attributes for detached canvases (common in test scenarios)
  - Prevents "Canvas dimensions are invalid" warnings in test environments

#### ✅ Full Simulation Lifecycle Test

- Tests complete simulation workflow
- Validates all simulation phases
- Tests error handling and recovery
- **Recently Fixed**: Completely rewritten to simplify cell toggling logic, clarify test structure, and improve state preservation testing

### Control Visibility Tests

Tests the CSS-based control visibility management system:

#### ✅ ControlVisibilityManager Initialization

- Tests ControlVisibilityManager class creation and initialisation
- Validates control group mappings and visibility states setup
- Tests CSS class injection and style management
- Verifies proper cleanup and memory management

#### ✅ ControlVisibilityManager CSS Classes

- Tests CSS style injection for control visibility
- Validates data attribute and class-based visibility system
- Tests CSS rule generation and application
- Verifies proper style element management

#### ✅ ControlVisibilityManager Conway Simulation

- Tests Conway's Game of Life control visibility
- Validates that Conway controls are visible when active
- Tests that other simulation controls are hidden
- Verifies proper active state management

#### ✅ ControlVisibilityManager Termite Simulation

- Tests Termite Algorithm control visibility
- Validates that Termite controls and termites container are visible when active
- Tests that other simulation controls are hidden
- Verifies special container visibility management

#### ✅ ControlVisibilityManager Langton Simulation

- Tests Langton's Ant control visibility
- Validates that Langton controls are visible when active
- Tests that other simulation controls are hidden
- Verifies proper state isolation between simulations

#### ✅ ControlVisibilityManager State Clearing

- Tests clearing of all active states
- Validates that all controls are hidden after clearing
- Tests active simulation state reset
- Verifies proper cleanup of CSS classes

#### ✅ ControlVisibilityManager Backward Compatibility

- Tests backward compatibility with existing API
- Validates showControls() and hideAllControls() methods
- Tests integration with existing ControlManager
- Verifies seamless migration from JavaScript-based visibility

#### ✅ ControlVisibilityManager Control Visibility Check

- Tests isControlVisible() method functionality
- Validates visibility state checking for specific controls
- Tests control group visibility validation
- Verifies accurate visibility reporting

#### ✅ ControlVisibilityManager Extensibility

- Tests adding new control groups and visibility states
- Validates extensibility for new simulations
- Tests dynamic control group management
- Verifies proper integration with existing system

#### ✅ ControlManager Integration with ControlVisibilityManager

- Tests ControlManager integration with new visibility system
- Validates seamless operation of showControls() and hideAllControls()
- Tests proper cleanup and resource management
- Verifies event framework integration

### EventHandlerFactory Tests

Tests the template-based event handler creation and registration system:

#### ✅ EventHandlerFactory Initialization

- Tests EventHandlerFactory class creation and initialisation
- Validates handler template setup and registration
- Tests empty registered handlers state
- Verifies proper cleanup and memory management

#### ✅ EventHandlerFactory Simulation Handlers Creation

- Tests simulation-specific handler creation with context injection
- Validates handler registration tracking
- Tests handler storage and retrieval
- Verifies proper simulation context binding

#### ✅ EventHandlerFactory Slider Handler Creation

- Tests slider input and change handler creation
- Validates debounced change events (16ms)
- Tests immediate visual feedback for input events
- Verifies conditional routing based on control ID patterns

#### ✅ EventHandlerFactory Button Handler Creation

- Tests button click handler creation
- Validates conditional routing for different button types
- Tests handler delegation to appropriate simulation methods
- Verifies proper event registration with EventFramework

#### ✅ EventHandlerFactory Control Setup

- Tests setupSlider() and setupButton() methods
- Validates automatic event registration with EventFramework
- Tests control configuration validation
- Verifies proper element selection and handler binding

#### ✅ EventHandlerFactory Custom Handler Creation

- Tests createCustomHandler() method with context injection
- Validates custom handler creation for extensibility
- Tests context binding and function execution
- Verifies proper handler function wrapping

#### ✅ EventHandlerFactory Cleanup

- Tests comprehensive cleanup of all registered handlers
- Validates memory leak prevention
- Tests handler registration tracking cleanup
- Verifies proper resource deallocation

#### ✅ EventHandlerFactory Integration with ControlManager

- Tests integration with existing ControlManager
- Validates seamless operation of registerSimulationHandlers()
- Tests registerAllHandlers() functionality
- Verifies proper cleanup integration

### ModalTemplateManager Tests

Tests the template-based modal content management system:

#### ✅ ModalTemplateManager Content Templates

- Tests content template setup for all simulations (Conway, Termite, Langton)
- Validates template existence and availability
- Tests template content creation and structure
- Verifies proper handling of invalid simulation types

#### ✅ ModalTemplateManager HTML Generation

- Tests HTML generation for modal structures
- Validates proper modal ID and class assignment
- Tests HTML structure integrity
- Verifies template-based HTML creation

#### ✅ ModalTemplateManager Content Injection

- Tests dynamic content injection into modal elements
- Validates title and content updates using data attributes
- Tests robust element selection and content replacement
- Verifies proper handling of missing elements and invalid simulation types

#### ✅ Dynamic Modal System Integration

- Tests complete dynamic modal system integration
- Validates modal registration and content injection
- Tests simulation-specific modal showing and hiding
- Verifies proper modal state management

#### ✅ Learn Modal Content Verification

- Tests Learn modal content for all simulation types
- Validates correct content display based on current simulation
- Tests modal visibility and content structure
- Verifies absence of nested modal structures

#### ✅ Learn Modal Shows Correct Content for Current Simulation

- Tests that Learn modal shows correct content based on current simulation type
- Validates simulation switching and content updates
- Tests modal content accuracy for each simulation
- Verifies proper simulation context awareness

#### ✅ Modal Scroll Position Management

- Tests simulation-specific scroll position preservation
- Validates scroll position saving and restoration
- Tests scroll position management across simulation switches
- Verifies initial scroll position for new simulations

### UI Component Library Tests

Tests the comprehensive UI component library with lifecycle management and state management:

#### ✅ UI Component Library Constructor

- Tests UIComponentLibrary class creation and initialisation
- Validates component storage, lifecycle hooks, and default configurations
- Tests EventFramework integration for event handling
- Verifies proper cleanup and memory management

#### ✅ UI Component Library Default Configurations

- Tests default configuration setup for all component types
- Validates slider, button, select, controlGroup, statusDisplay, modal, label, and container configs
- Tests configuration completeness and accessibility
- Verifies sensible default values for all component types

#### ✅ UI Component Library Slider Creation

- Tests slider component creation with value elements
- Validates slider state management and configuration
- Tests slider element binding and value display
- Verifies proper slider initialisation and default values

#### ✅ UI Component Library Slider State Management

- Tests slider value get/set operations
- Validates slider enable/disable functionality
- Tests slider state persistence and updates
- Verifies proper slider state management lifecycle

#### ✅ UI Component Library Button Creation

- Tests button component creation with labels and classes
- Validates button state management and configuration
- Tests button element binding and text display
- Verifies proper button initialisation and default values

#### ✅ UI Component Library Button State Management

- Tests button text get/set operations
- Validates button press/release functionality
- Tests button state persistence and updates
- Verifies proper button state management lifecycle

#### ✅ UI Component Library Select Creation

- Tests select component creation with options
- Validates select state management and configuration
- Tests select element binding and option display
- Verifies proper select initialisation and default values

#### ✅ UI Component Library Select Options Management

- Tests select options get/set operations
- Validates select value management
- Tests select options updates and value changes
- Verifies proper select state management lifecycle

#### ✅ UI Component Library Control Group Creation

- Tests control group component creation with layouts
- Validates control group state management and configuration
- Tests control group element binding and layout display
- Verifies proper control group initialisation and default values

#### ✅ UI Component Library Control Group Layout Management

- Tests control group layout changes (horizontal, vertical, grid)
- Validates layout state persistence and updates
- Tests layout switching functionality
- Verifies proper layout management lifecycle

#### ✅ UI Component Library Status Display Creation

- Tests status display component creation with values
- Validates status display state management and configuration
- Tests status display element binding and value display
- Verifies proper status display initialisation and default values

#### ✅ UI Component Library Status Display Value Management

- Tests status display value get/set operations
- Validates status display values updates
- Tests status display value persistence and changes
- Verifies proper status display state management lifecycle

#### ✅ UI Component Library Modal Creation

- Tests modal component creation with titles and content
- Validates modal state management and configuration
- Tests modal element binding and content display
- Verifies proper modal initialisation and default values

#### ✅ UI Component Library Modal State Management

- Tests modal open/close operations
- Validates modal title management
- Tests modal state persistence and updates
- Verifies proper modal state management lifecycle

#### ✅ UI Component Library Label Creation

- Tests label component creation with text and attributes
- Validates label state management and configuration
- Tests label element binding and text display
- Verifies proper label initialisation and default values

#### ✅ UI Component Library Container Creation

- Tests container component creation with layouts
- Validates container state management and configuration
- Tests container element binding and layout display
- Verifies proper container initialisation and default values

#### ✅ UI Component Library Lifecycle Hooks

- Tests component lifecycle hook registration and execution
- Validates onMount, onUpdate, and onUnmount hook functionality
- Tests lifecycle hook state management and cleanup
- Verifies proper lifecycle management throughout component lifecycle

#### ✅ UI Component Library Batch Operations

- Tests batch operations for showing/hiding all components
- Validates batch operation state management
- Tests batch operation performance and consistency
- Verifies proper batch operation lifecycle management

#### ✅ UI Component Library Factory Methods

- Tests factory methods for common component combinations
- Validates createSliderWithLabel, createButtonGroup, and createFormGroup
- Tests factory method component creation and configuration
- Verifies proper factory method component lifecycle management

#### ✅ UI Component Library Component Management

- Tests component discovery and management utilities
- Validates getComponent, getAllComponents, getComponentsByType methods
- Tests component type tracking and management
- Verifies proper component management lifecycle and cleanup

### CSS Utility Tests

Tests the CSS utility framework and design token system:

#### ✅ CSS Utility Design Tokens

- Tests CSS custom properties (design tokens) are properly defined
- Validates colour tokens (primary, secondary, background, surface)
- Tests spacing tokens (sm, md, lg, xl, 2xl)
- Verifies border radius, shadow, transition, and z-index tokens
- Tests design token accessibility and consistency

#### ✅ CSS Utility Glass Effects

- Tests glass effect utility classes (.glass, .glass-light)
- Validates backdrop filter blur effects
- Tests gradient background implementations
- Verifies hover animations and transitions
- Tests glass effect performance and rendering

#### ✅ CSS Utility Layout Classes

- Tests flexbox utility classes (.flex, .flex-center, .flex-column)
- Validates spacing utility classes (.gap-sm, .gap-md, .gap-lg)
- Tests positioning utility classes (.position-absolute, .position-relative)
- Verifies layout class combinations and responsiveness
- Tests layout utility performance and consistency

#### ✅ CSS Utility Component Classes

- Tests component-specific utility classes
- Validates control group variants (.control-group--static, .control-group--transparent)
- Tests button utility classes and hover effects
- Verifies form element styling and consistency
- Tests modal utility classes and glass effects

#### ✅ CSS Utility Performance Classes

- Tests GPU acceleration utility classes (.gpu-accelerate)
- Validates performance optimization implementations
- Tests transition and animation utility classes
- Verifies performance class effectiveness and browser support
- Tests performance utility integration with components

#### ✅ CSS Utility Responsive Design

- Tests responsive utility class behavior
- Validates breakpoint-specific styling
- Tests responsive layout adaptations
- Verifies mobile and tablet compatibility
- Tests responsive design performance and consistency

#### ✅ CSS Utility Performance Optimizations

- Tests CSS optimization implementations
- Validates reduced CSS file size and complexity
- Tests utility class efficiency and rendering
- Verifies performance optimization effectiveness
- Tests optimization impact on overall application performance

## Before Refactoring

### 1. Establish Baseline

Run the full test suite and ensure all tests pass:

```javascript
// Run comprehensive test suite
const baselineResults = await testRunner.runAllTests();

// Verify all tests pass
if (baselineResults.summary.failed > 0) {
  console.error("Baseline tests failed! Fix before refactoring.");
  return;
}
```

### 2. Record Performance Metrics

Note the baseline performance metrics:

```javascript
// Record baseline performance
const baselinePerformance = {
  gridCreation: baselineResults.performance.gridCreation,
  cellCounting: baselineResults.performance.cellCounting,
  drawing: baselineResults.performance.drawing,
  updates: baselineResults.performance.updates,
};

console.log("Baseline Performance:", baselinePerformance);
```

### 3. Save Test Results

Save the test results for comparison:

```javascript
// Save baseline results
const baselineData = {
  timestamp: new Date().toISOString(),
  results: baselineResults,
  performance: baselinePerformance,
};

// Store for later comparison
localStorage.setItem("testBaseline", JSON.stringify(baselineData));
```

## During Refactoring

### 1. Frequent Testing

Run tests frequently after each significant change:

```javascript
// Quick validation after small changes
const quickResults = await testRunner.runTestsByCategory("core");

// Full validation after major changes
const fullResults = await testRunner.runAllTests();
```

### 2. Performance Monitoring

Monitor performance to ensure no regressions:

```javascript
// Check performance after changes
const performanceResults = await testRunner.runTestsByCategory("performance");

// Compare with baseline
const performanceDiff = {
  gridCreation:
    performanceResults.performance.gridCreation -
    baselinePerformance.gridCreation,
  cellCounting:
    performanceResults.performance.cellCounting -
    baselinePerformance.cellCounting,
  drawing: performanceResults.performance.drawing - baselinePerformance.drawing,
  updates: performanceResults.performance.updates - baselinePerformance.updates,
};

console.log("Performance Change:", performanceDiff);
```

### 3. Targeted Testing

Test specific areas you're refactoring:

```javascript
// If refactoring UI components
const uiResults = await testRunner.runTestsByCategory("ui");

// If refactoring simulation algorithms
const coreResults = await testRunner.runTestsByCategory("core");

// If refactoring visual effects
const visualResults = await testRunner.runTestsByCategory("visual");
```

## After Refactoring

### 1. Complete Validation

Run the complete test suite:

```javascript
// Run full test suite
const newResults = await testRunner.runAllTests();

// Verify all tests pass
if (newResults.summary.failed > 0) {
  console.error("Tests failed after refactoring!");
  console.log("Failed tests:", newResults.failed);
  return;
}
```

### 2. Performance Comparison

Compare with baseline performance:

```javascript
// Load baseline data
const baselineData = JSON.parse(localStorage.getItem("testBaseline"));

// Compare performance
const performanceComparison = {
  gridCreation: {
    baseline: baselineData.performance.gridCreation,
    current: newResults.performance.gridCreation,
    change:
      newResults.performance.gridCreation -
      baselineData.performance.gridCreation,
  },
  cellCounting: {
    baseline: baselineData.performance.cellCounting,
    current: newResults.performance.cellCounting,
    change:
      newResults.performance.cellCounting -
      baselineData.performance.cellCounting,
  },
  // ... other metrics
};

console.log("Performance Comparison:", performanceComparison);
```

### 3. Regression Verification

Verify no regressions have been introduced:

```javascript
// Check for performance regressions
const hasRegressions = Object.values(performanceComparison).some(
  (metric) => metric.change > 0.1 // 10% threshold
);

if (hasRegressions) {
  console.warn("Performance regressions detected!");
  console.log("Consider optimising affected areas.");
}
```

## Adding New Tests

### For New Features

```javascript
// Use shared utilities for setup
const { canvas, ctx } = TestUtilityFactory.createCanvasAndContext();
const { simulation } = TestUtilityFactory.createSimulationWithMocks("conway");

testRunner.addTest(
  "New Feature Test",
  async () => {
    // Test implementation
    simulation.init();
    const result = simulation instanceof ConwayGameOfLife;
    const expectedValue = "expected";

    return {
      passed: result === true,
      details: `Conway initialised`,
      category: "feature-category",
    };
  },
  "feature-category"
);
```

### For Performance Testing

```javascript
testRunner.addTest(
  "New Performance Test",
  async () => {
    const start = performance.now();

    // Perform operation
    someOperation();

    const end = performance.now();
    const duration = end - start;
    const threshold = 100; // 100ms threshold

    return {
      passed: duration < threshold,
      details: `Operation took ${duration.toFixed(
        2
      )}ms (threshold: ${threshold}ms)`,
      category: "performance",
      performance: { duration },
    };
  },
  "performance"
);
```

### For UI Component Testing

```javascript
testRunner.addTest(
  "New UI Component Test",
  async () => {
    // Create component
    const component = new UIComponent();

    // Test functionality
    const result = component.someMethod();

    // Cleanup
    component.cleanup();

    return {
      passed: result === expectedValue,
      details: `Component test result: ${result}`,
      category: "ui",
    };
  },
  "ui"
);
```

## Troubleshooting

### Tests Failing After Refactoring

1. **Check the test details** for specific failure information
2. **Compare with baseline** to understand what changed
3. **Run individual tests** to isolate the issue:

### Common Test Issues and Solutions

#### Coordinate System Mismatches

- **Problem**: Tests using screen coordinates where grid coordinates are expected
- **Solution**: Use `simulation.screenToGrid(x, y)` to convert coordinates before calling grid-based methods
- **Example**: `getCellFadeFactor()` expects grid coordinates, not screen coordinates

#### Cell Brightness Map Access

- **Problem**: Incorrect key format when accessing the `cellBrightness` map
- **Solution**: Use string keys in format `"${row},${col}"` when directly accessing the map
- **Example**: `cellBrightness.get("5,5")` not `cellBrightness.get([5,5])`

#### Test Coordinate Positioning

- **Problem**: Test coordinates not mapping to valid grid positions due to `cellSize` scaling
- **Solution**: Use `simulation.cellSize * N` to generate screen coordinates that reliably map to grid positions
- **Example**: `const testX = simulation.cellSize * 5; const testY = simulation.cellSize * 5;`

#### Canvas Dimension Warnings

- **Problem**: "Canvas dimensions are invalid, using fallback values" warnings in test console
- **Cause**: Canvas elements not attached to DOM or hidden with `display: none` causing `getBoundingClientRect()` to return zero dimensions
- **Solution**: The `resize()` method now automatically detects attached vs detached canvases
  - For attached canvases: Uses `getBoundingClientRect()` for accurate dimensions
  - For detached canvases: Uses canvas `width`/`height` attributes (set by test code)
- **Prevention**: Ensure test canvases have explicit `width` and `height` attributes set before calling `resize()`

```javascript
// Run a specific test
const test = testRunner.tests.find((t) => t.name === "Test Name");
const result = await testRunner.runTest(test);
console.log("Test result:", result);
```

4. **Check browser console** for error messages
5. **Verify file dependencies** are loaded correctly

### Performance Degradation

1. **Identify the slow operation** from performance test results
2. **Profile the code** using browser dev tools
3. **Compare with baseline** performance metrics
4. **Optimise the bottleneck** while maintaining functionality

### Visual Regressions

1. **Use the visual test suite** to see rendering changes
2. **Check the visual effects tests** for fade and rendering issues
3. **Verify brightness controls** still work correctly
4. **Test on different screen sizes** for layout issues

### Memory Leaks

1. **Check for proper cleanup** in component lifecycle
2. **Verify event listener removal** in cleanup methods
3. **Monitor memory usage** in browser dev tools
4. **Test long-running scenarios** for memory accumulation

## Best Practices

### 1. Test-Driven Development

- Write tests before implementing features
- Use tests to guide implementation
- Ensure tests cover edge cases and error conditions

### 2. Test Writing Guidelines

- **Coordinate System Awareness**: Always consider whether methods expect screen or grid coordinates
- **State Testing**: When testing state preservation, actively modify state before restoring to verify functionality
- **Minimal Test Logic**: Keep test logic simple and focused on the specific functionality being tested
- **Clear Test Structure**: Use descriptive sub-test names and clear separation between test phases

### 3. Regular Testing

- Run tests before committing any changes
- Include testing in your development workflow
- Use automated testing in CI/CD pipelines

### 4. Performance Awareness

- Keep performance baselines for comparison
- Monitor performance during development
- Optimise bottlenecks proactively

### 5. Documentation

- Document test failures and their resolutions
- Keep test documentation up to date
- Document performance expectations

### 6. Quality Assurance

- Use the visual test suite for manual verification
- Test across different browsers and devices
- Validate accessibility and usability

## Continuous Integration

For automated testing, integrate the test runner into your CI/CD pipeline:

```javascript
// Example CI script
const { TestRunner, PredefinedTestSuites } = require("./test-runner.js");

async function runCITests() {
  // Create test environment
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext("2d");

  // Create test runner
  const runner = PredefinedTestSuites.createComprehensiveSuite({ canvas, ctx });

  // Run all tests
  const results = await runner.runAllTests();

  // Check for failures
  if (results.summary.failed > 0 || results.summary.errors > 0) {
    console.error("Tests failed!");
    console.log("Failed tests:", results.failed);
    process.exit(1);
  }

  // Check for performance regressions
  const performanceThreshold = 0.2; // 20% threshold
  const hasPerformanceRegression = Object.values(results.performance).some(
    (metric) => metric > performanceThreshold
  );

  if (hasPerformanceRegression) {
    console.warn("Performance regression detected!");
    process.exit(1);
  }

  console.log("All tests passed!");
  console.log("Performance metrics:", results.performance);
}

runCITests().catch((error) => {
  console.error("Test execution failed:", error);
  process.exit(1);
});
```

## Support and Resources

### Getting Help

If you encounter issues with the test suite:

1. **Check the browser console** for error messages
2. **Verify all required files** are loaded (`simulations.js`, `app.js`, `i18n.js`)
3. **Ensure the canvas element** is available for testing
4. **Review the test details** for specific failure information
5. **Check browser compatibility** and supported features

### Test Suite Features

The test suite is designed to be comprehensive and help you maintain code quality:

- **Automated testing** for regression detection
- **Performance benchmarking** for optimisation validation
- **Visual testing** for UI verification
- **Integration testing** for system validation
- **Extensible framework** for adding new tests

### Maintenance

- **Regular updates** to test coverage
- **Performance baseline updates** as optimisations are made
- **Test documentation updates** as features evolve
- **Cross-browser testing** for compatibility validation

The test suite is your primary tool for ensuring the algorithmic pattern generator continues to work correctly and perform optimally throughout its development lifecycle.
