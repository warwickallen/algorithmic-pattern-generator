# Old-to-New Test Mapping

This document maps each test from `test-suite-old.html` to its corresponding new test file and category.

Note: Some items were consolidated across fewer, broader tests. Names matched by title where possible.

| Old test name | Old category | New test file(s) | New category |
| --- | --- | --- | --- |
| Basic Environment Check | system | tests/system/system.test.js | system |
| Conway Game of Life Creation | simulation-core | tests/core/simulation-creation.test.js | core |
| Termite Algorithm Creation | simulation-core | tests/core/simulation-creation.test.js | core |
| Langton's Ant Creation | simulation-core | tests/core/simulation-creation.test.js | core |
| Conway Grid Initialization | simulation-core | tests/core/grid-initialization.test.js | core |
| Conway Cell Toggle | simulation-core | tests/core/cell-toggle.test.js | core |
| Termite Cell Toggle | simulation-core | tests/core/cell-toggle.test.js | core |
| Langton Cell Toggle | simulation-core | tests/core/cell-toggle.test.js | core |
| Conway Neighbour Counting | simulation-core | tests/core/neighbour-counting.test.js | core |
| Termite Movement | simulation-core | tests/core/movement.test.js | core |
| Langton Ant Movement | simulation-core | tests/core/movement.test.js | core |
| Termite Slider Functionality | simulation-features | tests/features/simulation-features.test.js | features |
| Brightness Application | simulation-features | tests/features/simulation-features.test.js | features |
| Cell Toggle | simulation-features | UNMAPPED | UNMAPPED |
| Drag Cell Toggle | interaction | tests/interaction/drag-toggle.test.js | interaction |
| Drag Coordinate Fix | interaction | tests/interaction/drag-coordinate-fix.test.js | interaction |
| Speed Setting | simulation-features | tests/features/simulation-features.test.js | features |
| Configuration Manager | ui | tests/ui/ui.test.js | ui |
| Shared Components | ui | UNMAPPED | UNMAPPED |
| Performance Optimizer | ui | tests/ui/ui.test.js | ui |
| Element Cache | ui | tests/ui/element-cache.test.js | ui |
| Element Cache | ui | tests/ui/shared-components.test.js | ui |
| Event Listener Manager | ui | tests/ui/event-listener-manager.test.js | ui |
| Event Listener Manager | ui | tests/ui/shared-components.test.js | ui |
| Grid Creation Performance | performance | tests/performance/performance.test.js | performance |
| Cell Counting Performance | performance | tests/performance/more-performance.test.js | performance |
| Drawing Performance | performance | tests/performance/more-performance.test.js | performance |
| Update Performance | performance | tests/performance/performance.test.js | performance |
| Simulation Switching | integration | tests/integration/integration.test.js | integration |
| State Preservation | integration | tests/integration/integration.test.js | integration |
| Modal Management | integration | tests/integration/modal-manager.test.js | integration |
| Control Management | integration | tests/integration/control-management.test.js | integration |
| Initial Controls Visibility on Page Load | ui | tests/ui/control-manager-visibility.test.js | ui |
| Controls Visibility Timing | ui | tests/integration/control-management.test.js | integration |
| Termite Slider Integration | termite | UNMAPPED | UNMAPPED |
| Modal Template Manager - Content Templates | ui | tests/integration/modal-template-manager.test.js | integration |
| Modal Template Manager - HTML Generation | ui | tests/ui/modal-template-html.test.js | ui |
| Modal Template Manager - Content Injection | ui | tests/ui/modal-template-injection.test.js | ui |
| Dynamic Modal System - Integration | conway | tests/ui/dynamic-modal-integration.test.js | conway |
| Learn Modal Content Verification | conway | UNMAPPED | UNMAPPED |
| Learn Modal Shows Correct Content for Current Simulation | ui | tests/ui/learn-modal-content.test.js | ui |
| UnifiedModalSystem opens custom content | ui | tests/ui/unified-modal-system.test.js | ui |
| Modal Scroll Position Management | conway | tests/ui/modal-scroll-position.test.js | conway |
| Dynamic Speed Slider Initialization | dynamic-speed-slider | tests/ui/dynamic-speed-slider.test.js | ui |
| Dynamic Speed Slider Simulation Switching | dynamic-speed-slider | tests/ui/dynamic-speed-slider.test.js | ui |
| Dynamic Speed Slider Global Value | dynamic-speed-slider | tests/ui/dynamic-speed-slider.test.js | ui |
| Dynamic Speed Slider Event Handling | dynamic-speed-slider | tests/ui/dynamic-speed-slider.test.js | ui |
| Dynamic Speed Slider Speed Adjustment | dynamic-speed-slider | tests/ui/dynamic-speed-slider.test.js | ui |
| Dynamic Speed Slider Hide/Show | dynamic-speed-slider | tests/ui/dynamic-speed-slider.test.js | ui |
| Dynamic Fill Button Class Exists | dynamic-fill-button | UNMAPPED | UNMAPPED |
| Dynamic Fill Button Simulation Switching | dynamic-fill-button | UNMAPPED | UNMAPPED |
| Dynamic Fill Button Show/Hide | dynamic-fill-button | tests/ui/dynamic-fill-button.test.js | ui |
| Dynamic Fill Button Event Handling | dynamic-fill-button | UNMAPPED | UNMAPPED |
| Dynamic Fill Button Initial Visibility After App Load | dynamic-fill-button | UNMAPPED | UNMAPPED |
| Dynamic Fill Coverage Statistical Bounds (±2σ, r=2) | dynamic-fill-button | UNMAPPED | UNMAPPED |
| Fill Button Equal Cell Activation Probability (Variance Test) | dynamic-fill-button | UNMAPPED | UNMAPPED |
| Keyboard Handler | integration | tests/integration/keyboard-handler.test.js | integration |
| Fade-to-Black Effect | visual | tests/visual/fade-visual-tests.test.js | visual |
| Comprehensive Fade Functionality | visual | tests/visual/fade-visual-tests.test.js | visual |
| Visual Regression Test | visual | tests/visual/fade-visual-tests.test.js | visual |
| Full Simulation Lifecycle Test | integration | tests/integration/full-lifecycle.test.js | integration |
| Console Warning Detection | system | tests/system/console-and-canvas.test.js | system |
| Test Canvas Configuration | system | tests/system/console-and-canvas.test.js | system |
| Fade Progression Debug | system | tests/system/fade-progression-debug.test.js | system |
| ControlVisibilityManager Initialization | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager CSS Classes | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager Conway Simulation | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager Termite Simulation | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager Langton Simulation | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager State Clearing | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager Backward Compatibility | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager Control Visibility Check | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlVisibilityManager Extensibility | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| ControlManager Integration with ControlVisibilityManager | control-visibility | tests/ui/control-visibility-manager.test.js | ui |
| EventFramework Declarative Registration | event-framework | tests/ui/event-framework-declarative.test.js | ui |
| EventFramework Delegated Registration | event-framework | tests/ui/event-framework-declarative.test.js | ui |
| EventHandlerFactory Initialization | event-handler-factory | tests/ui/event-handler-factory-extra.test.js | ui |
| EventHandlerFactory Simulation Handlers Creation | event-handler-factory | UNMAPPED | UNMAPPED |
| EventHandlerFactory Slider Handler Creation | event-handler-factory | UNMAPPED | UNMAPPED |
| EventHandlerFactory Button Handler Creation | event-handler-factory | UNMAPPED | UNMAPPED |
| EventHandlerFactory Control Setup | event-handler-factory | UNMAPPED | UNMAPPED |
| EventHandlerFactory Custom Handler Creation | event-handler-factory | UNMAPPED | UNMAPPED |
| EventHandlerFactory Cleanup | event-handler-factory | tests/ui/event-handler-factory-extra.test.js | ui |
| EventHandlerFactory Integration with ControlManager | event-handler-factory | UNMAPPED | UNMAPPED |
| UI Component Library Constructor | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Default Configurations | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Slider Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Slider State Management | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Button Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Button State Management | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Select Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Select Options Management | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Control Group Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Control Group Layout Management | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Status Display Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Status Display Value Management | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Modal Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Modal State Management | Updated Title | UNMAPPED | UNMAPPED |
| UI Component Library Label Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Container Creation | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Lifecycle Hooks | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Batch Operations | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Factory Methods | ui-component-library | UNMAPPED | UNMAPPED |
| UI Component Library Component Management | ui-component-library | UNMAPPED | UNMAPPED |
