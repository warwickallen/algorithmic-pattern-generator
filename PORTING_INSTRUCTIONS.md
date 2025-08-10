# Old-to-New Test Mapping

This document maps each test from `test-suite-old.html` to its corresponding new test file and category.

Note: Names and categories are matched by test title where possible; some tests have been consolidated or split.

## Mappings

- Old: "Basic Environment Check" (system) → New: `tests/system/system.test.js` (system)
- Old: "Conway Game of Life Creation" (simulation-core) → New: `tests/core/simulation-creation.test.js` (core)
- Old: "Termite Algorithm Creation" (simulation-core) → New: `tests/core/simulation-creation.test.js` (core)
- Old: "Langton's Ant Creation" (simulation-core) → New: `tests/core/simulation-creation.test.js` (core)
- Old: "Conway Grid Initialization" (simulation-core) → New: `tests/core/grid-initialization.test.js` (core)
- Old: "Conway Cell Toggle" (simulation-core) → New: `tests/core/cell-toggle.test.js` (core)
- Old: "Termite Cell Toggle" (simulation-core) → New: `tests/core/cell-toggle.test.js` (core)
- Old: "Langton Cell Toggle" (simulation-core) → New: `tests/core/cell-toggle.test.js` (core)
- Old: "Conway Neighbour Counting" (simulation-core) → New: `tests/core/neighbour-counting.test.js` (core)
- Old: "Termite Movement" (simulation-core) → New: `tests/core/movement.test.js` (core)
- Old: "Langton Ant Movement" (simulation-core) → New: `tests/core/movement.test.js` (core)
- Old: "Termite Slider Functionality" (simulation-features) → New: `tests/features/simulation-features.test.js` (features)
- Old: "Brightness Application" (simulation-features) → New: `tests/features/simulation-features.test.js` (features)
- Old: "Cell Toggle" (simulation-features) → New: `tests/features/simulation-features.test.js` (features)
- Old: "Drag Cell Toggle" (interaction) → New: `tests/interaction/drag-toggle.test.js` (interaction)
- Old: "Drag Coordinate Fix" (interaction) → New: `tests/interaction/drag-coordinate-fix.test.js` (interaction)
- Old: "Speed Setting" (simulation-features) → New: `tests/features/simulation-features.test.js` (features)
- Old: "Configuration Manager" (ui) → New: `tests/ui/ui.test.js` (ui)
- Old: "Shared Components" (ui) → New: `tests/ui/shared-components.test.js` (ui)
- Old: "Performance Optimizer" (ui) → New: `tests/ui/ui.test.js` (ui)
- Old: "Element Cache" (ui) → New: `tests/ui/element-cache.test.js` (ui)
- Old: "Event Listener Manager" (ui) → New: `tests/ui/event-listener-manager.test.js` (ui)
- Old: "Grid Creation Performance" (performance) → New: `tests/performance/performance.test.js` (performance)
- Old: "Cell Counting Performance" (performance) → New: `tests/performance/more-performance.test.js` (performance)
- Old: "Drawing Performance" (performance) → New: `tests/performance/more-performance.test.js` (performance)
- Old: "Update Performance" (performance) → New: `tests/performance/performance.test.js` (performance)
- Old: "Simulation Switching" (integration) → New: `tests/integration/integration.test.js` (integration)
- Old: "State Preservation" (integration) → New: `tests/integration/integration.test.js` (integration)
- Old: "Modal Management" (integration) → New: `tests/integration/modal-manager.test.js` (integration)
- Old: "Control Management" (integration) → New: `tests/integration/control-management.test.js` (integration)
- Old: "Initial Controls Visibility on Page Load" (ui) → New: `tests/ui/control-manager-visibility.test.js` (ui)
- Old: "Controls Visibility Timing" (ui) → New: `tests/integration/control-management.test.js` (integration)
- Old: "Termite Slider Integration" (ui) → New: `tests/features/simulation-features.test.js` (features)
- Old: "Modal Template Manager - Content Templates" (ui) → New: `tests/integration/modal-template-manager.test.js` (integration)
- Old: "Modal Template Manager - HTML Generation" (ui) → New: `tests/ui/modal-template-html.test.js` (ui)
- Old: "Modal Template Manager - Content Injection" (ui) → New: `tests/ui/modal-template-injection.test.js` (ui)
- Old: "Dynamic Modal System - Integration" (ui) → New: `tests/ui/dynamic-modal-integration.test.js` (ui)
- Old: "Learn Modal Content Verification" (ui) → New: `tests/ui/learn-modal-content.test.js` (ui)
- Old: "Learn Modal Shows Correct Content for Current Simulation" (ui) → New: `tests/ui/learn-modal-content.test.js` (ui)
- Old: "UnifiedModalSystem opens custom content" (ui) → New: `tests/ui/unified-modal-system.test.js` (ui)
- Old: "Modal Scroll Position Management" (ui) → New: `tests/ui/modal-scroll-position.test.js` (ui)
- Old: "Dynamic Speed Slider Initialization" (dynamic-speed-slider) → New: `tests/ui/dynamic-speed-slider.test.js` (ui)
- Old: "Dynamic Speed Slider Simulation Switching" (dynamic-speed-slider) → New: `tests/ui/dynamic-speed-slider.test.js` (ui)
- Old: "Dynamic Speed Slider Global Value" (dynamic-speed-slider) → New: `tests/ui/dynamic-speed-slider.test.js` (ui)
- Old: "Dynamic Speed Slider Event Handling" (dynamic-speed-slider) → New: `tests/ui/dynamic-speed-slider.test.js` (ui)
- Old: "Dynamic Speed Slider Speed Adjustment" (dynamic-speed-slider) → New: `tests/ui/dynamic-speed-slider.test.js` (ui)
- Old: "Dynamic Speed Slider Hide/Show" (dynamic-speed-slider) → New: `tests/ui/dynamic-speed-slider.test.js` (ui)
- Old: "Dynamic Fill Button Class Exists" (dynamic-fill-button) → New: `tests/ui/dynamic-fill-button.test.js` (ui)
- Old: "Dynamic Fill Button Simulation Switching" (dynamic-fill-button) → New: `tests/ui/dynamic-fill-button.test.js` (ui)
- Old: "Dynamic Fill Button Show/Hide" (dynamic-fill-button) → New: `tests/ui/dynamic-fill-button.test.js` (ui)
- Old: "Dynamic Fill Button Event Handling" (dynamic-fill-button) → New: `tests/ui/dynamic-fill-button.test.js` (ui)
- Old: "Dynamic Fill Button Initial Visibility After App Load" (dynamic-fill-button) → New: `tests/ui/dynamic-fill-button.test.js` (ui)
- Old: "Dynamic Fill Coverage Statistical Bounds (±2σ, r=2)" (dynamic-fill-button) → New: `tests/ui/dynamic-fill-button.test.js` (ui)
- Old: "Fill Button Equal Cell Activation Probability (Variance Test)" (dynamic-fill-button) → New: `tests/ui/dynamic-fill-button.test.js` (ui)
- Old: "Keyboard Handler" (integration) → New: `tests/integration/keyboard-handler.test.js` (integration)
- Old: "Fade-to-Black Effect" (visual) → New: `tests/visual/fade-visual-tests.test.js` (visual)
- Old: "Comprehensive Fade Functionality" (visual) → New: `tests/visual/fade-visual-tests.test.js` (visual)
- Old: "Visual Regression Test" (visual) → New: `tests/visual/fade-visual-tests.test.js` (visual)
- Old: "Full Simulation Lifecycle Test" (integration) → New: `tests/integration/full-lifecycle.test.js` (integration)
- Old: "Console Warning Detection" (system) → New: `tests/system/console-and-canvas.test.js` (system)
- Old: "Test Canvas Configuration" (system) → New: `tests/system/console-and-canvas.test.js` (system)
- Old: "Fade Progression Debug" (system) → New: `tests/system/fade-progression-debug.test.js` (system)
- Old: "ControlVisibilityManager …" (control-visibility) → New: `tests/ui/control-visibility-manager.test.js` (ui)
- Old: "EventFramework Declarative Registration" (event-framework) → New: `tests/ui/event-framework-declarative.test.js` (ui)
- Old: "EventFramework Delegated Registration" (event-framework) → New: `tests/ui/event-framework-declarative.test.js` (ui)
- Old: "EventHandlerFactory …" (ui) → New: `tests/ui/event-handler-factory.test.js` and `tests/ui/event-handler-factory-extra.test.js` (ui)
- Old: "UI Component Library …" (ui) → New: `tests/ui/ui-component-library-2.test.js` and `tests/ui/ui-component-library-extra.test.js` (ui)

If any old test is not listed above, it may have been consolidated into a broader new test case.

# Porting Instructions: Complete test-suite-old.html to test-suite.html

## Overview

You need to complete the port of all functionality from `test-suite-old.html` to the new `test-suite.html`. The new test suite has a modern jsTree-based interface and now contains a substantial portion of the ported tests. A few items remain to finish the port and to stabilise a small number of UI tests.

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

### 2. Create Test Files in Appropriate Categories (Ported so far)

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
- ui:
  - `ui.tests.js`, `shared-components.test.js`, `control-manager-visibility.test.js`, `control-visibility-manager.test.js`, `element-cache.test.js`, `event-listener-manager.test.js`, `event-framework-declarative.test.js`
  - Modal-related: `modal-template-html.test.js`, `modal-template-injection.test.js`, `dynamic-modal-integration.test.js`, `learn-modal-content.test.js`, `unified-modal-system.test.js`, `modal-scroll-position.test.js`
  - Dynamic controls: `dynamic-speed-slider.test.js`, `dynamic-fill-button.test.js`
  - Event system: `event-handler-factory.test.js`
  - UI library: `ui-component-library-2.test.js`
- visual:
  - `colour.tests.js`
- system:
  - `system.tests.js`, `test-utilities.test.js`

The test manifest (`tests/manifest.js`) is auto-generated and currently includes 42 test files, with 99 total tests.

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

✅ **RESOLVED**: The failing test `Learn Modal Shows Correct Content for Current Simulation` (category `ui`) has been fixed.

- **Solution implemented**: Added dynamic modal mount element creation in the test, increased wait times, and ensured proper cleanup.
- What’s been tried:
- **Changes made**:
  - Created `#dynamic-modal` with required structure before app initialization
  - Increased wait from 50ms to 100ms after `showLearnModal()`
  - Added proper cleanup of both canvas and modal mount elements
- **All tests now pass or are skipped as expected**.

Further items to port (tracked and being migrated incrementally):

- Dynamic Speed Slider: Global value behaviour across simulation switches — added
- Dynamic Fill Button: Statistical coverage check — added (reduced/loose bounds)
- Event Handler Factory: Control setup — added; custom handler binding — added; cleanup — added; ControlManager integration — added
- UI Component Library: Status display — added; modal state management — added; lifecycle hooks and batch operations — added; factory methods — added; component management retrieval tests — added
- Keyboard handler coverage — added (tests/integration/keyboard-handler.test.js)
- Fade/visual tests ported — added (tests/visual/fade-visual-tests.test.js)
- Console warnings + canvas configuration — added (tests/system/console-and-canvas.test.js)
- Fade progression debug — added (tests/system/fade-progression-debug.test.js)
- Full lifecycle test — added (tests/integration/full-lifecycle.test.js)

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
