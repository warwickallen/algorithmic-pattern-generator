## Unimplemented recommendations from `CODE_REUSE_REPORT.md`

- 13. Internationalisation Enhancement

  - Extend `i18n` to handle dynamic content, tooltips, and error messages.
  - Relevance: Still relevant. Current `i18n.js` updates element text/placeholder by ID; no integration for tooltips (`title`), ARIA labels, or error strings. Limited dynamic usage observed (e.g., `immersive-btn` in `app.js`).

- 16. Memory Management Consolidation

  - Centralise cleanup via a `ResourceManager` with automatic tracking.
  - Relevance: Still relevant. No `ResourceManager` present; listener/manager cleanup appears distributed across modules.

- 17. Animation Frame Management

  - Introduce `AnimationManager` for frame rate control and decoupled animation loops.
  - Relevance: Still relevant. `requestAnimationFrame` is invoked directly in `app.js` and `simulations.js`; no central animation controller exists.

- 18. Statistics Collection Consolidation

  - Create `StatisticsCollector` with pluggable metrics across simulations.
  - Relevance: Still relevant. No `StatisticsCollector` found; stats are computed ad hoc where needed.

- 19. Canvas Management Consolidation

  - Add `CanvasManager` for common canvas setup and operations.
  - Relevance: Still relevant. No `CanvasManager` present; canvas/context handling is performed per simulation/component.

- 20. Keyboard Shortcut Management

  - Implement `KeyboardShortcutManager` with declarative configuration.
  - Relevance: Still relevant. Global `keydown` handlers are attached in `app.js`; no declarative shortcut mapping or centralised manager detected.

- 23. Logging Consolidation

  - Centralise logging to replace scattered `console.*` calls.
  - Relevance: Still relevant. Many `console.*` calls across the codebase; no unified logger. Could integrate with existing `ErrorHandler`.

- 24. Type Checking Consolidation

  - Unify common runtime type checks/guards.
  - Relevance: Partially relevant. `config-validator.js` centralises schema validation for configs, but generic runtime type guards remain scattered throughout the code.

- 26. Test Helper Consolidation
  - Consolidate repeated test helpers into shared utilities.
  - Relevance: Mostly addressed. `test-utils.js` provides `TestUtilityFactory` used by tests; no duplicate `createMockCanvas`/`createMockContext` definitions found. Only minor tidy-ups may remain if any stray helpers exist.
