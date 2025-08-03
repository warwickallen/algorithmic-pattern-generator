# Testing Guide for Algorithmic Pattern Generator

This guide explains how to use the comprehensive test suite to ensure your refactoring doesn't introduce regressions.

## Overview

The test suite consists of several components:

1. **`test-suite.html`** - Comprehensive visual test suite with UI
2. **`test-colour-scheme.html`** - Specialised tests for dynamic colour scheme
3. **`test-runner.js`** - Programmatic test runner for automation
4. **`TESTING.md`** - This guide

## Quick Start

### 1. Visual Test Suite

Open `test-suite.html` in your browser to run the comprehensive test suite:

```bash
# Open in browser
open test-suite.html
```

This provides:
- **Core Simulation Tests** - Tests for Conway's Game of Life, Termite Algorithm, and Langton's Ant
- **UI Component Tests** - Tests for configuration management, performance optimisers, and shared components
- **Performance Tests** - Tests for grid creation, updates, and drawing performance
- **Integration Tests** - Tests for simulation switching, state preservation, and modal management

### 2. Colour Scheme Tests

Open `test-colour-scheme.html` for specialised dynamic colour scheme testing:

```bash
# Open in browser
open test-colour-scheme.html
```

This tests:
- Corner hue calculations
- Time-based hue rotation
- Colour interpolation
- HSL to RGB conversion
- Performance of colour generation

### 3. Programmatic Test Runner

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
testRunner.runTestsByCategory('colour');
```

## Test Categories

### Core Simulation Tests

Tests the fundamental simulation functionality:

- ✅ **Simulation Creation** - Verifies all simulation types can be created
- ✅ **Grid Initialization** - Tests grid setup and dimensions
- ✅ **Cell Toggle** - Tests interactive cell manipulation
- ✅ **Neighbour Counting** - Tests the core algorithm logic
- ✅ **Movement** - Tests termite and ant movement patterns
- ✅ **Brightness Application** - Tests visual brightness controls
- ✅ **Speed Setting** - Tests simulation speed controls

### UI Component Tests

Tests the user interface components:

- ✅ **Configuration Manager** - Tests simulation configuration access
- ✅ **Shared Components** - Tests reusable UI components
- ✅ **Performance Optimizer** - Tests debounce and throttle functions
- ✅ **Element Cache** - Tests DOM element caching
- ✅ **Event Listener Manager** - Tests event handling
- ✅ **Initial Controls Visibility on Page Load** - **Critical test** - Ensures controls are visible immediately when the application initialises, not waiting for simulation updates
- ✅ **Controls Visibility Timing** - Tests that controls become visible immediately after `app.init()`, preventing the issue where controls only appear after canvas updates

### Performance Tests

Tests performance characteristics:

- ✅ **Grid Creation Performance** - Must complete in < 100ms
- ✅ **Cell Counting Performance** - Must complete in < 10ms
- ✅ **Drawing Performance** - Must complete in < 50ms
- ✅ **Update Performance** - Must complete in < 20ms

### Integration Tests

Tests component interactions:

- ✅ **Simulation Switching** - Tests switching between simulation types
- ✅ **State Preservation** - Tests state preservation during resize
- ✅ **Modal Management** - Tests modal show/hide functionality
- ✅ **Control Management** - Tests UI control visibility
- ✅ **Keyboard Handler** - Tests keyboard shortcut registration

### Colour Scheme Tests

Tests the dynamic colour system:

- ✅ **Corner Hues** - Tests initial corner hue values
- ✅ **Time-based Rotation** - Tests hue rotation over time
- ✅ **Interpolation** - Tests colour interpolation between corners
- ✅ **HSL to RGB** - Tests colour space conversion
- ✅ **Vector Interpolation** - Tests mathematical interpolation
- ✅ **Performance** - Tests colour generation speed

## Before Refactoring

1. **Run the full test suite** and ensure all tests pass:
   ```javascript
   testRunner.runAllTests();
   ```

2. **Note the baseline performance**:
   - Grid creation time
   - Update performance
   - Drawing performance
   - Colour generation speed

3. **Save the test results** for comparison:
   ```javascript
   const baselineResults = testRunner.exportResults();
   console.log(JSON.stringify(baselineResults, null, 2));
   ```

## During Refactoring

1. **Run tests frequently** after each significant change:
   ```javascript
   // Quick validation
   testRunner.runTestsByCategory('core');
   
   // Full validation
   testRunner.runAllTests();
   ```

2. **Monitor performance** to ensure you're not introducing regressions:
   ```javascript
   testRunner.runTestsByCategory('performance');
   ```

3. **Test specific areas** you're refactoring:
   ```javascript
   // If refactoring UI components
   testRunner.runTestsByCategory('ui');
   
   // If refactoring colour system
   testRunner.runTestsByCategory('colour');
   ```

## After Refactoring

1. **Run the complete test suite**:
   ```javascript
   const newResults = await testRunner.runAllTests();
   ```

2. **Compare with baseline**:
   ```javascript
   // Compare performance metrics
   const performanceDiff = {
       gridCreation: newResults.summary.duration - baselineResults.summary.duration,
       // Add other metrics as needed
   };
   ```

3. **Verify no regressions**:
   - All tests should still pass
   - Performance should not degrade significantly
   - Visual appearance should remain the same

## Adding New Tests

### For New Features

```javascript
testRunner.addTest('New Feature Test', async () => {
    // Test implementation
    const result = someFunction();
    
    return {
        passed: result === expectedValue,
        details: `Result: ${result}, Expected: ${expectedValue}`
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
    
    return {
        passed: duration < threshold,
        details: `Operation took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`
    };
}, 'performance');
```

## Troubleshooting

### Tests Failing After Refactoring

1. **Check the test details** for specific failure information
2. **Compare with baseline** to understand what changed
3. **Run individual tests** to isolate the issue:
   ```javascript
   // Run a specific test
   const test = testRunner.tests.find(t => t.name === 'Test Name');
   await testRunner.runTest(test);
   ```

### Performance Degradation

1. **Identify the slow operation** from performance test results
2. **Profile the code** using browser dev tools
3. **Compare with baseline** performance metrics
4. **Optimise the bottleneck** while maintaining functionality

### Visual Regressions

1. **Use the visual test suite** to see colour changes
2. **Check the colour scheme tests** for interpolation issues
3. **Verify brightness controls** still work correctly
4. **Test on different screen sizes** for layout issues

## Best Practices

1. **Run tests before committing** any changes
2. **Keep performance baselines** for comparison
3. **Add tests for new features** as you develop them
4. **Document test failures** and their resolutions
5. **Use the visual test suite** for manual verification
6. **Automate testing** in your development workflow

## Continuous Integration

For automated testing, you can integrate the test runner into your CI/CD pipeline:

```javascript
// Example CI script
const { TestRunner, PredefinedTestSuites } = require('./test-runner.js');

async function runCITests() {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    
    const runner = PredefinedTestSuites.createComprehensiveSuite({ canvas, ctx });
    const results = await runner.runAllTests();
    
    if (results.summary.failed > 0 || results.summary.errors > 0) {
        console.error('Tests failed!');
        process.exit(1);
    }
    
    console.log('All tests passed!');
}

runCITests();
```

## Support

If you encounter issues with the test suite:

1. Check the browser console for error messages
2. Verify all required files are loaded (`simulations.js`, `app.js`)
3. Ensure the canvas element is available for testing
4. Review the test details for specific failure information

The test suite is designed to be comprehensive and help you maintain code quality during refactoring. Use it regularly to catch regressions early and ensure your algorithmic pattern generator continues to work correctly. 