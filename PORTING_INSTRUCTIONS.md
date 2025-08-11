# Old-to-New Test Mapping

See `PORTING_MAPPING.md` for a tabular mapping of old tests to new tests, including categories and files.

# Porting Instructions: Port test-suite-old.html to the new test-suite.html (Deprecated: test-suite-old.html)

## Overview

The legacy `test-suite-old.html` is now deprecated. The live suite is `test-suite.html` with a jsTree-based interface and a manifest-driven file discovery model. All functionality has been ported to the new structure.

## Current State

- ✅ New `test-suite.html` with jsTree-based test selection
- ✅ `tests/` directory structure with manifest system
- ✅ Pre-commit hooks and npm scripts
- ✅ A large set of tests have been ported and grouped by category (see below)
- ✅ Test runner enhanced with skip support and richer exports
- ✅ Suite UI improvements: copy/export logs, version badge, grouping headings, scrolling/top-alignment tweaks, non-blocking toasts, source file tooltips in results, skipped badge and grey styling
- ✅ **All tests now pass or are skipped as expected**
- ✅ **Enhanced UI features**: selection summary, per-file counts, category result counts, status filtering, and improved jsTree layout

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

### 2. Create Test Files in Appropriate Categories (Ported)

For each test in `test-suite-old.html`, create a corresponding `.js` file in the `tests/` directory structure:

Key files already ported (non-exhaustive):

- core:
  - `simulation-creation.test.js`, `grid-initialization.test.js`, `cell-toggle.test.js`, `neighbour-counting.test.js`, `movement.test.js`
- features:
  - `simulation-features.test.js`
- interaction:
  - `drag-toggle.test.js`, `drag-coordinate-fix.test.js`
- performance:
  - `performance.test.js`, `more-performance.test.js`
- integration:
  - `integration.tests.js`, `modal-manager.test.js`, `control-management.test.js`
- ui (directory-defined sub-categories under `tests/ui/`):
  - `components/`: `shared-components.test.js`, `ui-component-library-2.test.js`, `ui-component-library-extra.test.js`
  - `controls/`: `control-manager-visibility.test.js`, `control-visibility-manager.test.js`, `dynamic-speed-slider.test.js`, `dynamic-fill-button.test.js`
  - `event/`: `event-listener-manager.test.js`, `event-framework-declarative.test.js`, `event-handler-factory.test.js`, `event-handler-factory-extra.test.js`
  - `modal/`: `modal-template-html.test.js`, `modal-template-injection.test.js`, `dynamic-modal-integration.test.js`, `learn-modal-content.test.js`, `unified-modal-system.test.js`, `modal-scroll-position.test.js`
  - `misc/`: `config-validator.test.js`, `element-cache.test.js`, `ui.test.js`
- visual:
  - `colour.tests.js`
- system:
  - `system.tests.js`, `test-utilities.test.js`

The test manifest (`tests/manifest.js`) is auto-generated and currently includes 43 test files, with 102 total tests. Categories and sub-categories are derived from the directory structure (e.g., `tests/ui/controls/*`).

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

#### E. Skipped Tests

- The runner now supports skipped tests. A test may set `skip: true` or return a `details` starting with `"Skipped:"`. Skipped tests:
  - Render with a grey left border in the UI
  - Are counted in the new “Skipped” badge in the summary
  - Are exported in JSON with `"result": "skip"`

### 6. Implementation Steps

1. **Analyze the old test suite**: Extract all `testSuite.addTest()` calls
2. **Categorize tests**: Group tests by their category parameter
3. **Create test files**: Create `.js` files in appropriate directories
4. **Port test logic**: Convert each test to the new format
5. **Update manifest**: Run `npm run generate:test-manifest` to update the manifest (pre-commit hook also regenerates it)
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

- [x] All tests from the old suite are present in the new structure
- [x] Tests run without errors in the new interface
- [x] Test results are displayed correctly (with category headings, tooltips, and skip styling)
- [x] Category filtering works properly
- [x] Manifest is up-to-date
- [x] Pre-commit hooks work correctly (manifest + version update)

### 9. Known Issues / Next Steps

✅ All previously unmapped items from the old suite have now been ported:

- Dynamic Fill Button: class existence, simulation switching, event handling, initial visibility, coverage bounds, and equal-probability variance — ported into `tests/ui/dynamic-fill-button.test.js` (using loose bounds to minimise flakiness).
- Termite Slider Integration — added as `tests/integration/termite-slider-integration.test.js` and wired via `EventHandlerFactory` and `ConfigurationManager`.
- EventHandlerFactory gaps — covered in `tests/ui/event-handler-factory.test.js` and `tests/ui/event-handler-factory-extra.test.js` (simulation/slider/button handler creation, control setup, custom handler, ControlManager integration).
- UI Component Library gaps — covered across `tests/ui/ui-component-library-2.test.js` and `tests/ui/ui-component-library-extra.test.js`.

All tests now pass or are skipped as expected.

### 10. Suite/UI Enhancements Implemented

- Results grouping with category headings (e.g., CORE, FEATURES)
- Test name tooltips showing the source file path
- Copy logs (clipboard with toast) and Export logs (JSON download)
- Version badge (injected from manifest) shown in the header and exported with logs
- Page scrolling and panel top-alignment fixes for long trees/results
- Compact header/summary panels (height fits content)
- Skipped badge/count in summary and grey styling for skipped results
- **Selection summary**: Live-updating "n tests selected in m test files" display
- **Per-file test counts**: File names show test counts in italicised brackets [n]
- **Category result counts**: Group headings show (passed+failed+skipped+errors)/total format
- **Status filtering**: Checkboxes to filter results by pass/fail/skip/error status
- **jsTree improvements**: Fixed wrapping, indentation, and overlap issues for long filenames

### 11. Example Test Port

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
- Filenames are standardised to end with `.test.js` (legacy `.tests.js` have been renamed)
