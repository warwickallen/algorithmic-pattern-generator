# Old-to-New Test Mapping

This document maps each test from `test-suite-old.html` to its corresponding new test file.

Note: Some items were consolidated across fewer, broader tests. Names matched by title where possible.

| Id  | Old test name                                                 | Old category          | New test file(s)                               |
| --- | ------------------------------------------------------------- | --------------------- | ---------------------------------------------- |
| 1   | Basic Environment Check                                       | system                | system/system.test.js                          |
| 2   | Conway Game of Life Creation                                  | simulation-core       | core/simulation-creation.test.js               |
| 3   | Termite Algorithm Creation                                    | simulation-core       | core/simulation-creation.test.js               |
| 4   | Langton's Ant Creation                                        | simulation-core       | core/simulation-creation.test.js               |
| 5   | Conway Grid Initialization                                    | simulation-core       | core/grid-initialization.test.js               |
| 6   | Conway Cell Toggle                                            | simulation-core       | core/cell-toggle.test.js                       |
| 7   | Termite Cell Toggle                                           | simulation-core       | core/cell-toggle.test.js                       |
| 8   | Langton Cell Toggle                                           | simulation-core       | core/cell-toggle.test.js                       |
| 9   | Conway Neighbour Counting                                     | simulation-core       | core/neighbour-counting.test.js                |
| 10  | Termite Movement                                              | simulation-core       | core/movement.test.js                          |
| 11  | Langton Ant Movement                                          | simulation-core       | core/movement.test.js                          |
| 12  | Termite Slider Functionality                                  | simulation-features   | features/simulation-features.test.js           |
| 13  | Brightness Application                                        | simulation-features   | features/simulation-features.test.js           |
| 14  | Cell Toggle                                                   | simulation-features   | UNMAPPED                                       |
| 15  | Drag Cell Toggle                                              | interaction           | interaction/drag-toggle.test.js                |
| 16  | Drag Coordinate Fix                                           | interaction           | interaction/drag-coordinate-fix.test.js        |
| 17  | Speed Setting                                                 | simulation-features   | features/simulation-features.test.js           |
| 18  | Configuration Manager                                         | ui                    | ui/ui.test.js                                  |
| 19  | Shared Components                                             | ui                    | UNMAPPED                                       |
| 20  | Performance Optimizer                                         | ui                    | ui/ui.test.js                                  |
| 21  | Element Cache                                                 | ui                    | ui/element-cache.test.js                       |
| 22  | Element Cache                                                 | ui                    | ui/shared-components.test.js                   |
| 23  | Event Listener Manager                                        | ui                    | ui/event-listener-manager.test.js              |
| 24  | Event Listener Manager                                        | ui                    | ui/shared-components.test.js                   |
| 25  | Grid Creation Performance                                     | performance           | performance/performance.test.js                |
| 26  | Cell Counting Performance                                     | performance           | performance/more-performance.test.js           |
| 27  | Drawing Performance                                           | performance           | performance/more-performance.test.js           |
| 28  | Update Performance                                            | performance           | performance/performance.test.js                |
| 29  | Simulation Switching                                          | integration           | integration/integration.test.js                |
| 30  | State Preservation                                            | integration           | integration/integration.test.js                |
| 31  | Modal Management                                              | integration           | integration/modal-manager.test.js              |
| 32  | Control Management                                            | integration           | integration/control-management.test.js         |
| 33  | Initial Controls Visibility on Page Load                      | ui                    | ui/control-manager-visibility.test.js          |
| 34  | Controls Visibility Timing                                    | ui                    | integration/control-management.test.js         |
| 35  | Termite Slider Integration                                    | termite               | integration/termite-slider-integration.test.js |
| 36  | Modal Template Manager - Content Templates                    | ui                    | integration/modal-template-manager.test.js     |
| 37  | Modal Template Manager - HTML Generation                      | ui                    | ui/modal-template-html.test.js                 |
| 38  | Modal Template Manager - Content Injection                    | ui                    | ui/modal-template-injection.test.js            |
| 39  | Dynamic Modal System - Integration                            | conway                | ui/dynamic-modal-integration.test.js           |
| 40  | Learn Modal Content Verification                              | conway                | UNMAPPED                                       |
| 41  | Learn Modal Shows Correct Content for Current Simulation      | ui                    | ui/learn-modal-content.test.js                 |
| 42  | UnifiedModalSystem opens custom content                       | ui                    | ui/unified-modal-system.test.js                |
| 43  | Modal Scroll Position Management                              | conway                | ui/modal-scroll-position.test.js               |
| 44  | Dynamic Speed Slider Initialization                           | dynamic-speed-slider  | ui/dynamic-speed-slider.test.js                |
| 45  | Dynamic Speed Slider Simulation Switching                     | dynamic-speed-slider  | ui/dynamic-speed-slider.test.js                |
| 46  | Dynamic Speed Slider Global Value                             | dynamic-speed-slider  | ui/dynamic-speed-slider.test.js                |
| 47  | Dynamic Speed Slider Event Handling                           | dynamic-speed-slider  | ui/dynamic-speed-slider.test.js                |
| 48  | Dynamic Speed Slider Speed Adjustment                         | dynamic-speed-slider  | ui/dynamic-speed-slider.test.js                |
| 49  | Dynamic Speed Slider Hide/Show                                | dynamic-speed-slider  | ui/dynamic-speed-slider.test.js                |
| 50  | Dynamic Fill Button Class Exists                              | dynamic-fill-button   | ui/dynamic-fill-button.test.js                 |
| 51  | Dynamic Fill Button Simulation Switching                      | dynamic-fill-button   | ui/dynamic-fill-button.test.js                 |
| 52  | Dynamic Fill Button Show/Hide                                 | dynamic-fill-button   | ui/dynamic-fill-button.test.js                 |
| 53  | Dynamic Fill Button Event Handling                            | dynamic-fill-button   | ui/dynamic-fill-button.test.js                 |
| 54  | Dynamic Fill Button Initial Visibility After App Load         | dynamic-fill-button   | ui/dynamic-fill-button.test.js                 |
| 55  | Dynamic Fill Coverage Statistical Bounds (±2σ, r=2)           | dynamic-fill-button   | ui/dynamic-fill-button.test.js                 |
| 56  | Fill Button Equal Cell Activation Probability (Variance Test) | dynamic-fill-button   | ui/dynamic-fill-button.test.js                 |
| 57  | Keyboard Handler                                              | integration           | integration/keyboard-handler.test.js           |
| 58  | Fade-to-Black Effect                                          | visual                | visual/fade-visual-tests.test.js               |
| 59  | Comprehensive Fade Functionality                              | visual                | visual/fade-visual-tests.test.js               |
| 60  | Visual Regression Test                                        | visual                | visual/fade-visual-tests.test.js               |
| 61  | Full Simulation Lifecycle Test                                | integration           | integration/full-lifecycle.test.js             |
| 62  | Console Warning Detection                                     | system                | system/console-and-canvas.test.js              |
| 63  | Test Canvas Configuration                                     | system                | system/console-and-canvas.test.js              |
| 64  | Fade Progression Debug                                        | system                | system/fade-progression-debug.test.js          |
| 65  | ControlVisibilityManager Initialization                       | control-visibility    | ui/control-visibility-manager.test.js          |
| 66  | ControlVisibilityManager CSS Classes                          | control-visibility    | ui/control-visibility-manager.test.js          |
| 67  | ControlVisibilityManager Conway Simulation                    | control-visibility    | ui/control-visibility-manager.test.js          |
| 68  | ControlVisibilityManager Termite Simulation                   | control-visibility    | ui/control-visibility-manager.test.js          |
| 69  | ControlVisibilityManager Langton Simulation                   | control-visibility    | ui/control-visibility-manager.test.js          |
| 70  | ControlVisibilityManager State Clearing                       | control-visibility    | ui/control-visibility-manager.test.js          |
| 71  | ControlVisibilityManager Backward Compatibility               | control-visibility    | ui/control-visibility-manager.test.js          |
| 72  | ControlVisibilityManager Control Visibility Check             | control-visibility    | ui/control-visibility-manager.test.js          |
| 73  | ControlVisibilityManager Extensibility                        | control-visibility    | ui/control-visibility-manager.test.js          |
| 74  | ControlManager Integration with ControlVisibilityManager      | control-visibility    | ui/control-visibility-manager.test.js          |
| 75  | EventFramework Declarative Registration                       | event-framework       | ui/event-framework-declarative.test.js         |
| 76  | EventFramework Delegated Registration                         | event-framework       | ui/event-framework-declarative.test.js         |
| 77  | EventHandlerFactory Initialization                            | event-handler-factory | ui/event-handler-factory-extra.test.js         |
| 78  | EventHandlerFactory Simulation Handlers Creation              | event-handler-factory | ui/event-handler-factory.test.js               |
| 79  | EventHandlerFactory Slider Handler Creation                   | event-handler-factory | ui/event-handler-factory.test.js               |
| 80  | EventHandlerFactory Button Handler Creation                   | event-handler-factory | ui/event-handler-factory.test.js               |
| 81  | EventHandlerFactory Control Setup                             | event-handler-factory | ui/event-handler-factory.test.js               |
| 82  | EventHandlerFactory Custom Handler Creation                   | event-handler-factory | ui/event-handler-factory.test.js               |
| 83  | EventHandlerFactory Cleanup                                   | event-handler-factory | ui/event-handler-factory-extra.test.js         |
| 84  | EventHandlerFactory Integration with ControlManager           | event-handler-factory | ui/event-handler-factory-extra.test.js         |
| 85  | UI Component Library Constructor                              | ui-component-library  | ui/ui-component-library-2.test.js              |
| 86  | UI Component Library Default Configurations                   | ui-component-library  | ui/ui-component-library-2.test.js              |
| 87  | UI Component Library Slider Creation                          | ui-component-library  | ui/ui-component-library-2.test.js              |
| 88  | UI Component Library Slider State Management                  | ui-component-library  | ui/ui-component-library-2.test.js              |
| 89  | UI Component Library Button Creation                          | ui-component-library  | ui/ui-component-library-2.test.js              |
| 90  | UI Component Library Button State Management                  | ui-component-library  | ui/ui-component-library-2.test.js              |
| 91  | UI Component Library Select Creation                          | ui-component-library  | ui/ui-component-library-2.test.js              |
| 92  | UI Component Library Select Options Management                | ui-component-library  | ui/ui-component-library-2.test.js              |
| 93  | UI Component Library Control Group Creation                   | ui-component-library  | ui/ui-component-library-2.test.js              |
| 94  | UI Component Library Control Group Layout Management          | ui-component-library  | ui/ui-component-library-2.test.js              |
| 95  | UI Component Library Status Display Creation                  | ui-component-library  | ui/ui-component-library-2.test.js              |
| 96  | UI Component Library Status Display Value Management          | ui-component-library  | ui/ui-component-library-2.test.js              |
| 97  | UI Component Library Modal Creation                           | ui-component-library  | ui/ui-component-library-2.test.js              |
| 98  | UI Component Library Modal State Management                   | Updated Title         | ui/ui-component-library-2.test.js              |
| 99  | UI Component Library Label Creation                           | ui-component-library  | ui/ui-component-library-extra.test.js          |
| 100 | UI Component Library Container Creation                       | ui-component-library  | ui/ui-component-library-extra.test.js          |
| 101 | UI Component Library Lifecycle Hooks                          | ui-component-library  | ui/ui-component-library-2.test.js              |
| 102 | UI Component Library Batch Operations                         | ui-component-library  | ui/ui-component-library-2.test.js              |
| 103 | UI Component Library Factory Methods                          | ui-component-library  | ui/ui-component-library-2.test.js              |
| 104 | UI Component Library Component Management                     | ui-component-library  | ui/ui-component-library-2.test.js              |
