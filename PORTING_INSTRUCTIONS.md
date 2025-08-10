# Porting Instructions: Complete test-suite-old.html to test-suite.html

## Overview

You need to complete the port of all functionality from `test-suite-old.html` to the new `test-suite.html`. The new test suite has a modern jsTree-based interface but is missing the actual test implementations.

## Current State

- ✅ New `test-suite.html` with jsTree-based test selection
- ✅ `tests/` directory structure with manifest system
- ✅ Pre-commit hooks and npm scripts
- ❌ **Missing**: All actual test implementations from `test-suite-old.html`

## Required Tasks

### 1. Extract and Organize Tests by Category

The old test suite has tests organized into these categories (found in the HTML):

- `simulation-core` - Basic simulation creation and initialization
- `simulation-features` - Advanced simulation functionality
- `ui` - User interface components
- `interaction` - User interaction handling
- `performance` - Performance and optimization tests
- `integration` - Integration between components
- `visual` - Visual effects and rendering
- `system` - System-level functionality
- `dynamic-speed-slider` - Speed control functionality
- `dynamic-fill-button` - Fill button functionality
- `control-visibility` - Control visibility management
- `event-handler-factory` - Event handling system
- `ui-component-library` - UI component library tests

### 2. Create Test Files in Appropriate Categories

For each test in `test-suite-old.html`, create a corresponding `.js` file in the `tests/` directory structure:

```
tests/
├── core/
│   ├── simulation-creation.test.js
│   ├── simulation-initialization.test.js
│   └── ...
├── features/
│   ├── simulation-features.test.js
│   └── ...
├── ui/
│   ├── ui-components.test.js
│   ├── control-visibility.test.js
│   └── ...
├── interaction/
│   ├── user-interactions.test.js
│   └── ...
├── performance/
│   ├── performance-tests.test.js
│   └── ...
├── integration/
│   ├── component-integration.test.js
│   └── ...
├── visual/
│   ├── visual-effects.test.js
│   └── ...
├── system/
│   ├── system-tests.test.js
│   └── ...
└── dynamic/
    ├── speed-slider.test.js
    ├── fill-button.test.js
    └── ...
```

### 3. Test File Format

Each test file should follow this pattern:

```javascript
(function () {
  if (!window || !window.testRunner) return;
  const runner = window.testRunner;

  // Test 1
  runner.addTest(
    "Test Name",
    async () => {
      // Test implementation
      return {
        passed: true / false,
        details: "Test details",
      };
    },
    "category"
  );

  // Test 2
  runner.addTest(
    "Another Test",
    async () => {
      // Test implementation
      return {
        passed: true / false,
        details: "Test details",
      };
    },
    "category"
  );
})();
```

### 4. Key Test Categories to Port

#### A. Simulation Core Tests (tests/core/)

- Basic simulation creation (Conway, Termite, Langton's Ant)
- Grid initialization
- Simulation state management
- Basic update cycles

#### B. Simulation Features Tests (tests/features/)

- Advanced simulation functionality
- Custom rules and behaviors
- State transitions
- Complex simulation logic

#### C. UI Tests (tests/ui/)

- Control panel functionality
- Dynamic control visibility
- UI component library tests
- Modal and dialog functionality

#### D. Performance Tests (tests/performance/)

- Update performance benchmarks
- Memory usage tests
- Rendering performance
- Optimization validation

#### E. Integration Tests (tests/integration/)

- Component interaction tests
- Event system integration
- State management integration
- Cross-component communication

#### F. System Tests (tests/system/)

- Environment validation
- Error handling
- Console monitoring
- Critical warning detection

### 5. Special Considerations

#### A. Canvas and Context Handling

The old test suite uses a dedicated test canvas. The new suite should:

- Create temporary canvases for tests that need them
- Clean up resources after tests
- Handle canvas dimension validation

#### B. Console Monitoring

The old suite monitors console warnings and errors. Consider:

- Adding console monitoring to the new test runner
- Filtering expected warnings from test failures
- Reporting critical warnings in test results

#### C. Test Environment Validation

The old suite validates the test environment. Ensure:

- Required classes and functions exist
- Canvas is properly configured
- No critical warnings are present

#### D. Async Test Handling

All tests are async functions. Ensure:

- Proper error handling
- Timeout handling for long-running tests
- Sequential test execution

### 6. Implementation Steps

1. **Analyze the old test suite**: Extract all `testSuite.addTest()` calls
2. **Categorize tests**: Group tests by their category parameter
3. **Create test files**: Create `.js` files in appropriate directories
4. **Port test logic**: Convert each test to the new format
5. **Update manifest**: Run `npm run generate:test-manifest` to update the manifest
6. **Test the new suite**: Open `test-suite.html` and verify tests work

### 7. Test Dependencies

Ensure these dependencies are loaded in `test-suite.html`:

- `constants.js`
- `types.js`
- `config-validator.js`
- `dynamic-layout.js`
- `i18n.js`
- `utils.js`
- `simulations.js`
- `app.js`
- `test-utils.js`
- `test-runner.js`

### 8. Validation Checklist

After porting, verify:

- [ ] All tests from the old suite are present in the new structure
- [ ] Tests run without errors in the new interface
- [ ] Test results are displayed correctly
- [ ] Category filtering works properly
- [ ] Manifest is up-to-date
- [ ] Pre-commit hooks work correctly

### 9. Example Test Port

**Old format (test-suite-old.html):**

```javascript
testSuite.addTest(
  "Conway Game of Life Creation",
  async () => {
    const simulation = SimulationFactory.createSimulation(
      "conway",
      testSuite.canvas,
      testSuite.ctx
    );
    return {
      passed: simulation instanceof ConwayGameOfLife,
      details: `Created ${simulation.constructor.name}`,
    };
  },
  "simulation-core"
);
```

**New format (tests/core/simulation-creation.test.js):**

```javascript
(function () {
  if (!window || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Conway Game of Life Creation",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      const simulation = SimulationFactory.createSimulation(
        "conway",
        canvas,
        ctx
      );
      return {
        passed: simulation instanceof ConwayGameOfLife,
        details: `Created ${simulation.constructor.name}`,
      };
    },
    "core"
  );
})();
```

### 10. Final Steps

1. Run `npm run generate:test-manifest` to update the manifest
2. Test the complete suite by opening `test-suite.html`
3. Verify all categories are populated in the jsTree
4. Run tests from different categories to ensure they work
5. Commit the changes with a descriptive message

## Notes

- The new test suite uses the existing `TestRunner` class from `test-runner.js`
- Tests should be self-contained and not depend on global state
- Each test file should handle its own canvas creation and cleanup
- The manifest system will automatically discover new test files
- Follow the existing code style and formatting conventions
