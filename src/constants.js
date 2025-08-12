// Centralised application constants for reuse across the codebase
// Exposed as a global `AppConstants` and CommonJS export for tests

/* eslint-disable no-unused-vars */
const AppConstants = {
  SimulationDefaults: {
    SPEED_MIN: 1,
    SPEED_MAX: 60,
    SPEED_DEFAULT: 30,

    CELL_SIZE_DEFAULT: 10,

    // Fade/brightness behaviour
    FADE_OUT_CYCLES_DEFAULT: 5,
    FADE_DECREMENT_DEFAULT: 0.2,

    // Randomisation defaults
    COVERAGE_DEFAULT: 0.3
  },

  TermiteDefaults: {
    MAX_TERMITES_DEFAULT: 50,
    MOVE_SPEED: 2,
    RANDOM_TURN_PROBABILITY: 0.1
  },

  Layout: {
    MARGIN: 8,
    TOP_MARGIN: 20,
    LEFT_MARGIN: 20,
    SAME_ROW_TOLERANCE: 10,
    RESIZE_THROTTLE_MS: 250,
    MUTATION_DEBOUNCE_MS: 100,
    MOBILE_BREAKPOINT_WIDTH: 768
  },

  UISliders: {
    SPEED: { min: 1, max: 60, step: 1, value: 30 },
    LIKELIHOOD: { min: 0, max: 100, step: 1, value: 30 },
    TERMITES: { min: 1, max: 100, step: 1, value: 50 },
    BRIGHTNESS: { min: 0.1, max: 2.0, step: 0.1, value: 1.0 }
  }
};

// Browser global
if (typeof window !== 'undefined') {
  window.AppConstants = AppConstants;
}

// CommonJS export for tests/node environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AppConstants };
}


