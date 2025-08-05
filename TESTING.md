# Testing Guide for Algorithmic Pattern Generator

This comprehensive guide explains how to use the test suite to ensure code quality, catch regressions, and maintain performance standards during development and refactoring.

## Test Suite Overview

The Algorithmic Pattern Generator includes a sophisticated testing framework with two main components:

### Core Testing Components

1. **`test-suite.html`** - Comprehensive visual test suite with interactive UI
2. **`test-runner.js`** - Programmatic test runner for automation and CI/CD

### Test Categories

The test suite is organised into logical categories:

- **Core Simulation Tests** - Basic simulation functionality and algorithms
- **UI Component Tests** - User interface components and interactions
- **Performance Tests** - Performance benchmarks and optimisation validation
- **Integration Tests** - Component interactions and system integration
- **Visual Effects Tests** - Visual rendering and re-engineered fade-to-black effects
- **System Tests** - System-level functionality and error handling
- **Control Visibility Tests** - CSS-based control visibility management system

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
```

Then run tests from the browser console:

```javascript
// Run all tests
testRunner.runAllTests();

// Run specific categories
testRunner.runTestsByCategory('core');
testRunner.runTestsByCategory('performance');
testRunner.runTestsByCategory('ui');
testRunner.runTestsByCategory('control-visibility');
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

#### ✅ Performance Optimizer
- Tests debounce and throttle functions
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

## Before Refactoring

### 1. Establish Baseline

Run the full test suite and ensure all tests pass:

```javascript
// Run comprehensive test suite
const baselineResults = await testRunner.runAllTests();

// Verify all tests pass
if (baselineResults.summary.failed > 0) {
    console.error('Baseline tests failed! Fix before refactoring.');
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
    updates: baselineResults.performance.updates
};

console.log('Baseline Performance:', baselinePerformance);
```

### 3. Save Test Results

Save the test results for comparison:

```javascript
// Save baseline results
const baselineData = {
    timestamp: new Date().toISOString(),
    results: baselineResults,
    performance: baselinePerformance
};

// Store for later comparison
localStorage.setItem('testBaseline', JSON.stringify(baselineData));
```

## During Refactoring

### 1. Frequent Testing

Run tests frequently after each significant change:

```javascript
// Quick validation after small changes
const quickResults = await testRunner.runTestsByCategory('core');

// Full validation after major changes
const fullResults = await testRunner.runAllTests();
```

### 2. Performance Monitoring

Monitor performance to ensure no regressions:

```javascript
// Check performance after changes
const performanceResults = await testRunner.runTestsByCategory('performance');

// Compare with baseline
const performanceDiff = {
    gridCreation: performanceResults.performance.gridCreation - baselinePerformance.gridCreation,
    cellCounting: performanceResults.performance.cellCounting - baselinePerformance.cellCounting,
    drawing: performanceResults.performance.drawing - baselinePerformance.drawing,
    updates: performanceResults.performance.updates - baselinePerformance.updates
};

console.log('Performance Change:', performanceDiff);
```

### 3. Targeted Testing

Test specific areas you're refactoring:

```javascript
// If refactoring UI components
const uiResults = await testRunner.runTestsByCategory('ui');

// If refactoring simulation algorithms
const coreResults = await testRunner.runTestsByCategory('core');

// If refactoring visual effects
const visualResults = await testRunner.runTestsByCategory('visual');
```

## After Refactoring

### 1. Complete Validation

Run the complete test suite:

```javascript
// Run full test suite
const newResults = await testRunner.runAllTests();

// Verify all tests pass
if (newResults.summary.failed > 0) {
    console.error('Tests failed after refactoring!');
    console.log('Failed tests:', newResults.failed);
    return;
}
```

### 2. Performance Comparison

Compare with baseline performance:

```javascript
// Load baseline data
const baselineData = JSON.parse(localStorage.getItem('testBaseline'));

// Compare performance
const performanceComparison = {
    gridCreation: {
        baseline: baselineData.performance.gridCreation,
        current: newResults.performance.gridCreation,
        change: newResults.performance.gridCreation - baselineData.performance.gridCreation
    },
    cellCounting: {
        baseline: baselineData.performance.cellCounting,
        current: newResults.performance.cellCounting,
        change: newResults.performance.cellCounting - baselineData.performance.cellCounting
    },
    // ... other metrics
};

console.log('Performance Comparison:', performanceComparison);
```

### 3. Regression Verification

Verify no regressions have been introduced:

```javascript
// Check for performance regressions
const hasRegressions = Object.values(performanceComparison).some(metric => 
    metric.change > 0.1 // 10% threshold
);

if (hasRegressions) {
    console.warn('Performance regressions detected!');
    console.log('Consider optimising affected areas.');
}
```

## Adding New Tests

### For New Features

```javascript
testRunner.addTest('New Feature Test', async () => {
    // Test implementation
    const result = someFunction();
    const expectedValue = 'expected';
    
    return {
        passed: result === expectedValue,
        details: `Result: ${result}, Expected: ${expectedValue}`,
        category: 'feature-category'
    };
}, 'feature-category');
```

### For Performance Testing

```javascript
testRunner.addTest('New Performance Test', async () => {
    const start = performance.now();
    
    // Perform operation
    someOperation();
    
    const end = performance.now();
    const duration = end - start;
    const threshold = 100; // 100ms threshold
    
    return {
        passed: duration < threshold,
        details: `Operation took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`,
        category: 'performance',
        performance: { duration }
    };
}, 'performance');
```

### For UI Component Testing

```javascript
testRunner.addTest('New UI Component Test', async () => {
    // Create component
    const component = new UIComponent();
    
    // Test functionality
    const result = component.someMethod();
    
    // Cleanup
    component.cleanup();
    
    return {
        passed: result === expectedValue,
        details: `Component test result: ${result}`,
        category: 'ui'
    };
}, 'ui');
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
const test = testRunner.tests.find(t => t.name === 'Test Name');
const result = await testRunner.runTest(test);
console.log('Test result:', result);
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
const { TestRunner, PredefinedTestSuites } = require('./test-runner.js');

async function runCITests() {
    // Create test environment
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    
    // Create test runner
    const runner = PredefinedTestSuites.createComprehensiveSuite({ canvas, ctx });
    
    // Run all tests
    const results = await runner.runAllTests();
    
    // Check for failures
    if (results.summary.failed > 0 || results.summary.errors > 0) {
        console.error('Tests failed!');
        console.log('Failed tests:', results.failed);
        process.exit(1);
    }
    
    // Check for performance regressions
    const performanceThreshold = 0.2; // 20% threshold
    const hasPerformanceRegression = Object.values(results.performance).some(
        metric => metric > performanceThreshold
    );
    
    if (hasPerformanceRegression) {
        console.warn('Performance regression detected!');
        process.exit(1);
    }
    
    console.log('All tests passed!');
    console.log('Performance metrics:', results.performance);
}

runCITests().catch(error => {
    console.error('Test execution failed:', error);
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