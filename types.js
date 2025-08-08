/**
 * Shared JSDoc typedefs for the Algorithmic Pattern Generator.
 *
 * Note: This file contains documentation-only types to standardise
 * annotations across the codebase. It does not export any runtime API
 * and can be safely loaded in both browser and test environments.
 */

/** @typedef {('conway'|'termite'|'langton')} SimulationId */

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 */

/** @typedef {boolean[][]} Grid */

/**
 * @typedef {Object} RGB
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */

/** @typedef {string} ColourString */

/**
 * @typedef {Object} StateManager
 * @property {function(): Object} getState
 * @property {function(Object): void} setState
 * @property {function(function(Object): void): function(): boolean} subscribe
 * @property {function(Object): void} notifySubscribers
 * @property {function(Object): Object} serialize
 * @property {function(Object, Object): void} deserialize
 * @property {function(Object): void} registerSerializer
 * @property {function(): boolean} hasSerializer
 */

/**
 * @typedef {Object} EventHandler
 * @property {function(string, Function): void} on
 * @property {function(string, ...any): void} emit
 * @property {function(string, Function): void} off
 */

/**
 * @typedef {Object} Simulation
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 * @property {SimulationId} simulationId
 * @property {boolean} isRunning
 * @property {number} generation
 * @property {number} cellCount
 * @property {function(): void} init
 * @property {function(): void} resize
 * @property {function(): void} update
 * @property {function(): void} draw
 * @property {function(number): void} setSpeed
 * @property {function(number): void} setBrightness
 * @property {function(number, number): void} toggleCell
 * @property {function(): Object} getState
 * @property {function(Object): void} setState
 * @property {function(): {generation:number, cellCount:number, fps:number}} getStats
 */

/**
 * @typedef {Object} TestResult
 * @property {boolean} passed
 * @property {string} [details]
 */

/**
 * @callback TestFunction
 * @returns {Promise<TestResult>|TestResult}
 */

// Keep a tiny no-op to avoid being treated as an empty file when served
// in some environments/tools that strip comment-only assets.
(() => undefined)();


