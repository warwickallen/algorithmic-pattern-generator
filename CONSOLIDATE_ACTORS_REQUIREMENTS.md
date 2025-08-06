# Consolidate Ants and Termites Actors - Requirements Document

## Overview

This document outlines the requirements for consolidating the ants in the Langton's Ant simulation
and the termites in the Termite Algorithm simulation to improve consistency and enable better code
reuse.

## Background

Currently, ants and termites have different movement systems:
- **Ants**: Discrete grid-based movement with `direction` (0-3) and grid coordinates
- **Termites**: Continuous pixel-based movement with `angle` and `speed` properties

Both actors already share trail systems and inherit from `BaseSimulation`, but their movement
mechanics differ significantly.

### Point-in-Time

This document was prepared with reference to the codebase at commit 91a6d8c (i.e., after Opportunity
3 of `CODE_REUSE_REPORT.md` had been implemented).

## Requirements

### 1. Visual Consistency

**1.1 Ant Appearance**
- Ants should look identical to how termites currently look, including the fading trail effect
- Ants should use the same visual styling, size, and colour scheme as termites
- Trail rendering should be consistent between both actor types

**1.2 Movement Visualisation**
- Ants should travel smoothly across the canvas with continuous motion
- Movement should appear fluid rather than discrete grid jumps
- Direction indicators should be consistent between ants and termites

### 2. Movement System Consolidation

**2.1 Smooth Movement Implementation**
- Ants should enter a cell at the middle of one of the cell's sides
- Ants should travel in a smooth arc to the middle of the side from which they will exit
- Movement should use interpolation (linear or bezier curves) for smooth transitions
- Animation should run at 60fps for fluid motion

**2.2 Turn Calculation**
- The calculation of which way the ant will turn must be made before it enters the cell
- Turn direction should be determined by Langton's Ant rules (R/L based on cell state)
- Path planning should occur at cell boundaries, not cell centres

**2.3 Edge-Based Positioning**
- Ants should always be positioned at cell edges, never at cell centres
- Entry and exit points should be at the middle of cell sides
- Initial direction should be calculated based on the entry edge

### 3. Actor Initialisation

**3.1 New Actor Placement**
- When an ant is first created, it should be placed at the middle of a cell edge
- Placement at cell centre would require different speed/path calculations
- Initial direction should be perpendicular to the entry edge

**3.2 State Initialisation**
- New actors should have empty trail arrays
- All actor properties should be properly initialised
- Position should be validated against grid boundaries

### 4. User Interface Changes

**4.1 Remove Add Ant Button**
- The "Add Ant" button should be completely removed from the UI
- All references to the button in HTML, CSS, and JavaScript should be eliminated
- Button event handlers should be cleaned up

**4.2 Add Ants Slider**
- An "Ants" slider should be added to the Langton's Ant simulation controls
- The slider should be identical to the "Termites" slider except for the label
- **Slider Specifications**:
  - Range: 1-100
  - Default value: 1 (single ant)
  - Label: "Ants:"
  - Should control `maxAnts` property
  - Should immediately affect ant count when adjusted

**4.3 Keyboard Shortcut Enhancement**
- The function to add an ant under the pointer when the "a" key is pressed should be retained for
  Langton's Ant
- When the Termite Algorithm simulation is selected, pressing the "a" key should place a termite
  under the pointer
- This is new functionality for the Termite Algorithm simulation

### 5. Code Architecture

**5.1 Shared Actor Base Class**
- Create an `Actor` base class with common properties:
  - `trail` (array for fading trail)
  - `x`, `y` (position coordinates)
  - `speed` (movement speed)
  - Common methods: `updateTrail()`, `drawTrail()`, `move()`

**5.2 Actor Subclasses**
- `GridActor` class for ants (grid-based movement with smooth interpolation)
- `ContinuousActor` class for termites (continuous movement)
- Both should inherit from the base `Actor` class

**5.3 Movement System Architecture**
- **Path Planning**: Calculate turn direction before entering cell
- **Smooth Interpolation**: Use appropriate interpolation for cell transitions
- **Edge Entry/Exit**: Define entry/exit points on cell edges (top, right, bottom, left)
- **State Management**: Maintain grid state while actors move smoothly

### 6. Performance Requirements

**6.1 Animation Performance**
- Smooth movement requires 60fps interpolation
- Trail rendering should be optimised for multiple actors
- Use `requestAnimationFrame` for smooth transitions
- Maintain existing performance optimisations

**6.2 Memory Management**
- Trail arrays should have maximum length limits
- Actor count changes should be handled efficiently
- State preservation should not impact performance

### 7. State Management

**7.1 Actor Count Management**
- **Current**: `maxTermites` property in TermiteAlgorithm
- **Proposed**: `maxActors` property in base class or simulation-specific properties
- **Dynamic Adjustment**: Slider should immediately affect actor count
- **State Preservation**: Actor count should persist during simulation switches

**7.2 Trail System**
- Both actors already have fading trails implemented
- Trail properties: `trailLength`, `trailOpacity`, `trailColor`, `trailEnabled`
- Trail rendering uses dynamic colour schemes and glow effects
- Trail system should remain unchanged and shared

### 8. Backward Compatibility

**8.1 Existing Functionality Preservation**
- Langton's Ant rules must remain completely unchanged
- Termite Algorithm wood chip interaction must remain unchanged
- Existing keyboard shortcuts must continue working
- State preservation during simulation switches must be maintained
- All existing API methods should continue to function

**8.2 UI Consistency**
- Control layouts should remain consistent
- Simulation switching should work seamlessly
- All existing buttons and controls should function as before

### 9. Testing Requirements

**9.1 Behaviour Validation**
- Smooth movement across cell boundaries
- Correct turn calculations at cell edges
- Trail fading consistency between actor types
- Slider responsiveness and actor count changes
- Keyboard shortcut functionality in both simulations

**9.2 Performance Testing**
- Animation smoothness at various speeds
- Memory usage with multiple actors
- State preservation during simulation switches
- UI responsiveness during actor count changes

**9.3 Edge Case Testing**
- Actor placement at grid boundaries
- Rapid slider adjustments
- Simulation switching during animation
- Multiple actors with long trails

## Implementation Phases

### Phase 1: Foundation (Minimal Change)
1. Create shared `Actor` base class
2. Implement smooth movement system for ants
3. Ensure existing functionality remains intact

### Phase 2: UI Consolidation
1. Add ants slider UI
2. Remove "Add Ant" button
3. Implement 'A' key functionality for termites

### Phase 3: Code Reuse
1. Refactor for maximum code reuse
2. Optimise shared components
3. Improve performance

### Phase 4: Testing and Validation
1. Comprehensive testing of all requirements
2. Performance validation
3. User experience verification

## Success Criteria

1. **Visual Consistency**: Ants and termites look and move identically
2. **Smooth Movement**: Ants move smoothly across the canvas without discrete jumps
3. **UI Consistency**: Both simulations have similar control layouts
4. **Code Reuse**: Significant reduction in duplicate code between simulations
5. **Performance**: No degradation in animation smoothness or responsiveness
6. **Functionality**: All existing features continue to work as expected

## Technical Notes

### Current Implementation Analysis
- Both `LangtonsAnt` and `TermiteAlgorithm` extend `BaseSimulation`
- Trail system is already implemented in `BaseSimulation` with methods:
  - `updateActorTrail(actor, x, y)`
  - `drawActorTrail(actor, radius)`
  - `drawTrailPoint(x, y, radius, alpha)`
- Termites use continuous movement with `angle` and `speed`
- Ants use discrete movement with `direction` (0-3) and grid coordinates

### Key Files to Modify
- `simulations.js`: Main simulation logic
- `app.js`: UI component management
- `index.html`: UI structure
- `styles.css`: Visual styling (if needed)

### Dependencies
- Existing `BaseSimulation` class
- Current trail system implementation
- Dynamic colour scheme system
- Performance optimisation utilities 
