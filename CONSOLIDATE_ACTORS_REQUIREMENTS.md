# Consolidate Ants and Termites Actors - Requirements Document

## Overview

This document outlines the requirements for consolidating the ants in the Langton's Ant simulation
and the termites in the Termite Algorithm simulation to improve consistency and enable better code
reuse.

Change scope: while minimal, incremental changes are preferred where possible, this consolidation is expected to be a significant refactoring. Larger structural changes are acceptable when they meaningfully reduce complexity, improve reuse, or align the simulations, provided that observable behaviour is preserved.

## Background

Currently, ants and termites have different movement systems:

- **Ants**: Discrete grid-based movement with `direction` (0-3) and grid coordinates
- **Termites**: Continuous pixel-based movement with `angle` and `speed` properties

Both actors already share trail systems and inherit from `BaseSimulation`, but their movement
mechanics differ significantly.

### Point-in-Time

This document is aligned with the current codebase on main as of version `0.0.1-main-8760362` (see `VERSION`, dated 2025-08-11). It supersedes the earlier reference to commit `91a6d8c`.

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

**1.3 Direction Indicators**

- Direction indicator visibility must be controlled by a shared option (for example, `showDirectionIndicator`).
- The same rule applies to all actor-based simulations (ants, termites, and new ones) to ensure visual consistency.

### 2. Movement System Consolidation

**2.1 Smooth Movement Implementation**

- Ants should enter a cell at the middle of one of the cell's sides
- Ants should travel in a smooth arc to the middle of the side from which they will exit
- For Langton's Ant, movement paths are restricted to either a straight line (no turn) or a quarter-circle arc (90° turn), given square cells and edge mid-point entry/exit.
- For other actor types (for example, termites), interpolation may use linear or Bézier curves as appropriate to the simulation’s movement model.
- Rendering should use `requestAnimationFrame`; the logic step rate (controlled by the speed slider) should be time-based and decoupled from render cadence to maintain smooth motion.

**2.2 Turn Calculation**

- The calculation of which way the ant will turn must be made before it enters the cell
- Turn direction should be determined by Langton's Ant rules (R/L based on cell state)
- Path planning should occur at cell boundaries, not cell centres

**2.3 Edge-Based Positioning**

- At the start and end of each decision step, ants should be positioned at cell edges, never at cell centres
- Entry and exit points should be at the middle of cell sides
- Initial direction should be calculated based on the entry edge

Terminology note: use “decision step” (or “cell transition”) rather than “generation” to avoid confusion with tick-based updates while supporting smooth interpolation.

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

- Current state: An "Add Ant" button exists and is wired via `ControlTemplateManager` in `app.js` and present in `index.html` (`#add-ant-btn`).
- Requirement: Remove this button completely from the UI.
- All references in HTML (`index.html`), control templates (`ControlTemplateManager` in `app.js`), and event handling should be eliminated.

**4.2 Add Ants Slider**

- Current state: A "Termites" slider exists and is wired to `setTermiteCount(count)` with backing `maxTermites` in `TermiteAlgorithm`.
- Requirement: Add an "Ants" slider to the Langton's Ant controls, mirroring the termites slider behaviour.
- Prefer using a generic slider template (for example, `actorCountSlider`) via `ControlTemplateManager` with per-simulation label/id configuration, rather than introducing new constants per simulation.
- **Slider Specifications**:
  - Range: 1-100
  - Default value: 1 (single ant)
  - Label: "Ants:"
  - Should call `setActorCount(count)` if implemented, or `setAntCount(count)` in `LangtonsAnt`
  - Should immediately affect ant count when adjusted

**4.3 Add Actor Enhancement**

- Current state: The global "a" shortcut calls `handleAddAnt(currentType, true)` and only takes effect in Langton's Ant (which implements `addAnt(x, y)`). `TermiteAlgorithm` does not currently implement an equivalent add method.
- Requirement: Standardise on an `addActorAt(x, y)` simulation method. The global "a" shortcut should call this if present. Langton's Ant and the Termite Algorithm should implement this to place an actor under the pointer.
- Requirement (for development/debug): provide a togglable generic "Add Agent" UI control that calls `addActorAt` when enabled, rather than simulation-specific buttons.

### 5. Code Architecture

**5.1 Shared Actor Base Class**

- Create an `Actor` base class with common properties:
  - `trail` (array for fading trail)
  - `x`, `y` (position coordinates)
  - `speed` (movement speed)
  - `isCarrying` (boolean, optional; used by simulations like the Termite Algorithm)
  - Common methods: `updateTrail()`, `drawTrail()`, `move()`

**5.2 Actor Subclasses**

- `GridActor` class for ants (grid-based movement with smooth interpolation)
- `ContinuousActor` class for termites (continuous movement)
- Both should inherit from the base `Actor` class

**5.3 Movement System Architecture**

- **Path Planning**: Calculate turn direction before entering cell
- **Smooth Interpolation**: For grid-based actors (for example, Langton's Ant), interpolate actor rendering between entry and exit edges per decision step; for continuous actors (for example, termites), interpolation may be linear or Bézier and is not constrained to cell edges.
- **Edge Entry/Exit**: Define entry/exit points on cell edges (top, right, bottom, left)
- **State Management**: Maintain grid state while actors move smoothly

Implementation note: internal logical state for grid-based simulations can remain grid-indexed (row/col with direction), while rendered positions interpolate along the configured path (straight or quarter-circle) between decision boundaries.

### 6. Performance Requirements

**6.1 Animation Performance**

- Use `requestAnimationFrame` for rendering to achieve smooth transitions
- Logic step rate (speed) should be time-based and decoupled from render cadence
- Trail rendering should be optimised for multiple actors
- Maintain existing performance optimisations

**6.2 Memory Management**

- Trail arrays should honour `BaseSimulation.trailLength` (maximum length)
- Actor count changes should be handled efficiently
- State preservation should not impact performance

### 7. State Management

**7.1 Actor Count Management**

- **Current**: `maxTermites` property in TermiteAlgorithm
- **Proposed**: Actor-capable simulations should implement `setActorCount(count)`. The base class should provide a `maxActors` property with a common default, which can be overloaded by a specific actor class
- **Dynamic Adjustment**: Slider should immediately affect actor count
- **State Preservation**: Actor count should persist during simulation switches

**7.2 Trail System**

- Both actors already have fading trails implemented
- Trail properties: `trailLength`, `trailOpacity`, `trailColor`, `trailEnabled`
- Trail rendering uses dynamic colour schemes and glow effects
- Trail system should remain unchanged and shared

**7.3 Actor State Serialisation**

- Simulations that manage actors must register serialisers/deserialisers for actor state (for example, arrays, counts, and relevant per-actor fields such as `trail`, `direction`, `isCarrying`), so state is preserved across resizes and simulation switches.

### 8. Backward Compatibility

**8.1 Existing Functionality Preservation**

- Langton's Ant rules must remain completely unchanged
- Termite Algorithm wood chip interaction rules and observable behaviour must be preserved. The underlying implementation may change substantially (for example, normalising wood chips as activated cells managed via an actor `isCarrying` flag), as long as the external behaviour matches the original simulation.
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

### 10. Wood Chip Normalisation (Termite Algorithm)

- Wood chips must not be treated as separate entities. A wood chip is simply an activated cell. Remove specialised `woodChips` collections and represent chip presence via the grid’s activation state plus an `isCarrying` attribute on the actor.
- Rules for the Termite Algorithm:
  - If an actor is carrying, then as it enters a cell, that cell becomes active (if it is not already).
  - If the actor decides to drop its wood chip on a cell, that cell remains active when the actor exits it, and the actor’s `isCarrying` becomes false.
  - The actor cannot drop its wood chip onto an already-active cell.
  - If the actor is not carrying when it enters an active cell and decides to pick up a wood chip, that cell will deactivate when the actor leaves it.
  - If the actor neither picks up nor drops in a cell, when the actor leaves the cell, the cell retains the activation state it had upon entry.

Implementation guidance:

- Introduce/standardise `actor.isCarrying` for termite-like simulations.
- Replace direct manipulation of chip sets with grid cell activation toggles at decision boundaries consistent with the above rules.

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

- Both `LangtonsAnt` and `TermiteAlgorithm` extend `BaseSimulation`.
- Trail system is implemented in `BaseSimulation` with shared methods:
  - `updateActorTrail(actor, x, y)`
  - `drawActorTrail(actor, radius)`
  - `drawTrailPoint(x, y, radius, alpha)`
- `TermiteAlgorithm` uses continuous movement with `angle` and `speed`, manages `maxTermites`, and exposes `setTermiteCount(count)`.
- `LangtonsAnt` uses discrete grid-based movement with `direction` (0-3) and grid coordinates, and exposes `addAnt(mouseX, mouseY)` for adding ants.
- UI controls are templated via `ControlTemplateManager` in `app.js`. The termites slider (`#termites-slider`, `#termites-value`) is present in `index.html` and wired through `AlgorithmicPatternGenerator.handleTermiteCountChange`.
- The "Add Ant" button (`#add-ant-btn`) is present in `index.html` and configured via `ControlTemplateManager` for the Langton simulation.
- The keyboard handler binds the "a" key to `handleAddAnt(currentType, true)`; only Langton currently implements `addAnt`, so the shortcut affects Langton only.

### Key Files to Modify

- `simulations.js`: Main simulation logic (add actor count management for ants, smooth movement rendering, and actor add-on-pointer functionality; normalise termite logic to use grid activation + `isCarrying`)
- `app.js`: UI component management (remove `addAnt` control from `ControlTemplateManager`, wire an ants slider via a generic `actorCountSlider` template, route keyboard handler to `addActorAt` when present)
- `index.html`: UI structure (remove "Add Ant" button, add ants slider markup)
- `constants.js`: No change required for a generic slider template; only update if you decide to add explicit presets
- `styles.css`: Visual styling (if needed)

### Dependencies

- Existing `BaseSimulation` class
- Current trail system implementation
- Dynamic colour scheme system
- Performance optimisation utilities
