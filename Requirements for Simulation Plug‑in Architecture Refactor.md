### Requirements: Simulation Plug‑in Architecture Refactor

- **Objective**: Make it trivial for developers to add new simulations by turning each simulation
  into an independent plug‑in file, with a minimal, stable interface to the rest of the app. Convert
  the four existing simulations to the new model.

### Goals
- **Per‑simulation files** in `src/simulations/`.
- **Runtime self‑registration** via `registerSimulation(...)` (preferred), with ES module
  compatibility.
- **Minimal, stable plug‑in interface** with optional metadata.
- **Extract shared core** (`BaseSimulation`, lifecycle, error handling, rendering utils) into
  separate modules.
- **Keep controls/handlers central for the first iteration**; allow plug‑ins to provide learn‑modal
  content and i18n labels.
- **Support lazy‑loading** of simulations.
- **Update tests/types** to the new architecture and add plug‑in registration tests.
- **Provide developer scaffold** and documentation for adding simulations.

### Non‑Goals
- No complete rework of the controls system in iteration 1.
- No requirement to maintain `SimulationFactory.createSimulation(...)` unless useful for a
  transition.

### Architectural Overview
- **Global Registry**: A small registry to register, fetch, and list simulations.
  - Global function: `registerSimulation(plugin)` (preferred Option A).
  - Global object: `window.SimulationRegistry` with:
    - `register(plugin)`
    - `get(id)`
    - `list()`
    - `has(id)`
    - `create(id, canvas, ctx)` convenience creator
- **Core Extraction**:
  - `src/simulations/base-simulation.js` exporting `BaseSimulation`
  - `src/core/lifecycle.js` exporting `SimulationLifecycleFramework` and a global instance
  - `src/core/error-handler.js` exporting `ErrorHandler` and a global instance
  - `src/core/rendering-utils.js` exporting Rendering utilities
  - If needed: move DynamicColourScheme into `src/core/dynamic-colour-scheme.js`
  - Expose core globally for non‑module environments (attach to `window`) and via ESM exports
- **Loading**:
  - Eager load for simplicity; allow optional lazy‑loading by ID using a simple loader that injects
    a script or dynamic `import()` by convention/mapping.

### Plug‑in Interface (Manifest)
Each simulation file exports a plug‑in that self‑registers at load time:
- **Required**:
  - `id: string` (unique)
  - `apiVersion: string` (e.g., `"1.0.0"`)
  - `displayNameKey: string` (i18n key)
  - `create(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): BaseSimulation`
- **Optional metadata**:
  - `capabilities?: { gridBased?: boolean, actorBased?: boolean }`
  - `defaults?: { speed?: number, cellSize?: number }`
  - `ui?: { learnModalKey?: string, controlGroupId?: string, i18nNamespace?: string }`
  - `handlers?: { /* optional future contributions */ }`
  - `errorStrategy?: { handle(ctx) }` to pass to `ErrorHandler.registerStrategy(id, strategy)`

Validation:
- On `register(plugin)`, validate `id`, `apiVersion`, `create`, and canonicalise optional metadata
  (reuse `ConfigValidator` where practical).
- Reject duplicate IDs; warn on unknown metadata.

### UI Integration (Iteration 1)
- **Controls/handlers remain central** in `src/app.js` and map by `simulationId`.
- Plug‑ins provide:
  - `displayNameKey` and `ui.learnModalKey` for i18n and modal content.
  - Optional `defaults` for initial speed/cell size (applied in `create(...)`).
- Future iteration: allow plug‑ins to contribute controls/handlers (design reserved via `handlers`
  metadata).

### Learn Modal Content
- Plug‑ins provide an i18n content key (`ui.learnModalKey`).
- Modal layout, styling, and shared text remain central.

### Loading Strategy and Performance
- Default: eager load all simulations for simplicity.
- Optional: lazy‑load by ID using a simple manifest mapping `id -> module path` and inject
  script/dynamic import when selected.
- Ensure memory footprint stays modest; unload references on simulation destroy where applicable;
  rely on existing caches/cleanup in core.

### Types and Testing
- **Types**:
  - Update `src/types.js`: change `SimulationId` from hardcoded union to `string`.
  - Provide a helper `listRegisteredSimulations(): string[]`.
- **Tests**:
  - Update references from `SimulationFactory.createSimulation(...)` to
    `SimulationRegistry.create(...)` (or direct `get(id).create(...)`).
  - Add tests:
    - Plug‑in registers correctly (id/apiVersion/create present; appears in `list()`; duplicate
      rejection).
    - Registry `create(id, ...)` returns a working instance.
    - Optional: lazy‑loader loads and registers on demand.
  - Keep existing algorithm/behaviour tests for each simulation; ensure green after refactor.

### Backwards Compatibility
- Keeping `SimulationFactory` is not required. If helpful for a clean transition, provide a thin
  shim (deprecated) that forwards to `SimulationRegistry.create`; otherwise, update all references.

### File Structure
- `src/core/`
  - `error-handler.js`
  - `lifecycle.js`
  - `rendering-utils.js`
  - `dynamic-colour-scheme.js` (if extracted)
- `src/simulations/`
  - `base-simulation.js`
  - `registry.js` (global registry + `registerSimulation`)
  - `conway.js`
  - `termite.js`
  - `langton.js`
  - `reaction.js`
  - `loader.js` (optional lazy‑loader)
  - `TEMPLATE.new-simulation.js` (scaffold)
- Remove the monolithic `src/simulations.js` after migrating classes.

### Migration Plan
- Extract core modules and expose globally and via ESM.
- Implement `SimulationRegistry` and `registerSimulation`.
- Split the four simulations into separate files; adapt constructors to extend the new
  `BaseSimulation` import.
- Each simulation file registers itself with `registerSimulation(...)`.
- Update `src/app.js` to:
  - Create simulations through `SimulationRegistry.create(id, canvas, ctx)`.
  - Resolve i18n display names and learn‑modal keys via plug‑in metadata.
- Update `public/index.html` and `public/test-suite.html` script loading:
  - ESM friendly order; include `registry.js`, core modules, and simulation files (or use
    lazy‑loader).
- Update tests and helpers:
  - Replace `SimulationFactory` usage with `SimulationRegistry`.
  - Add plug‑in registration tests.
- Documentation:
  - README: “How to add a simulation” guide with scaffold steps and minimal example.
  - Mention optional lazy‑loading and where to add manifest mapping.

### Developer Experience: Adding a New Simulation
1. Copy `src/simulations/TEMPLATE.new-simulation.js` to `src/simulations/my-sim.js`.
2. Implement `create(...)` by extending `BaseSimulation`.
3. Fill in `id`, `apiVersion`, `displayNameKey`, optional metadata (`capabilities`, `defaults`,
   `ui.learnModalKey`).
4. Ensure `registerSimulation({...})` is called at the end of the file.
5. Add i18n entries for `displayNameKey` and `ui.learnModalKey` content.
6. If lazy‑loading, add the `id -> module path` mapping.
7. Run tests; ensure it appears in the simulation selector and Learn modal works.

### Error Handling
- On registration, if `errorStrategy` is present, call `errorHandler.registerStrategy(id,
  strategy)`.
- `apiVersion` check: warn and refuse registration if incompatible; maintain a semver‑compatible
  string for the plug‑in API.

### Internationalisation
- Plug‑ins must supply `displayNameKey` and may supply `ui.i18nNamespace`.
- Central i18n system resolves labels and modal content.

### Acceptance Criteria
- All four simulations exist in separate files and register via `registerSimulation`.
- Core extracted; no regressions in behaviour or performance.
- App runs with ES modules; non‑bundled script tags remain supported.
- All tests updated and passing; new registry tests in place.
- README includes a clear, tested “Add a new simulation” guide and scaffold.
- Optional lazy‑loading demonstrably works (if enabled).

