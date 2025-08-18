/**
 * Test Runner for Algorithmic Pattern Generator
 *
 * This script provides automated testing capabilities for ensuring
 * refactoring doesn't introduce regressions.
 */

class TestRunner {
  constructor() {
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: 0,
      startTime: null,
      endTime: null,
    };
    this.tests = [];
  }

  /**
   * Add a test to the runner
   * @param {string} name - Test name
   * @param {Function} testFunction - Async function that returns {passed: boolean, details: string}
   * @param {string} category - Test category
   */
  addTest(name, testFunction, category = "general") {
    this.tests.push({
      name,
      testFunction,
      category,
      result: null,
      details: "",
      duration: 0,
    });
  }

  /**
   * Run a single test
   * @param {Object} test - Test object
   * @returns {Promise<Object>} Test result
   */
  async runTest(test) {
    const startTime = performance.now();

    try {
      const result = await test.testFunction();
      const endTime = performance.now();

      // Determine skip/pass/fail
      const isSkipFlag = result && result.skip === true;
      const isSkipDetails =
        result &&
        typeof result.details === "string" &&
        /^\s*Skipped:/i.test(result.details);
      if (isSkipFlag || isSkipDetails) {
        test.result = "skip";
        this.testResults.skipped++;
      } else {
        test.result = result.passed ? "pass" : "fail";
        if (result.passed) {
          this.testResults.passed++;
        } else {
          this.testResults.failed++;
        }
      }
      test.details = result.details || "";
      test.duration = endTime - startTime;

      return {
        name: test.name,
        result: test.result,
        details: test.details,
        duration: test.duration,
      };
    } catch (error) {
      const endTime = performance.now();

      test.result = "error";
      test.details = `Error: ${error.message}`;
      test.duration = endTime - startTime;

      this.testResults.errors++;

      return {
        name: test.name,
        result: "error",
        details: test.details,
        duration: test.duration,
      };
    } finally {
      this.testResults.total++;
    }
  }

  /**
   * Run all tests
   * @returns {Promise<Object>} Summary of all test results
   */
  async runAllTests() {
    this.testResults = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: 0,
      startTime: performance.now(),
      endTime: null,
    };

    console.log("🚀 Starting test suite...");
    console.log(`📋 Running ${this.tests.length} tests`);
    console.log("─".repeat(50));

    const results = [];

    for (const test of this.tests) {
      const result = await this.runTest(test);
      results.push(result);

      // Log result
      const status =
        result.result === "pass"
          ? "✅"
          : result.result === "fail"
          ? "❌"
          : result.result === "skip"
          ? "⏭️"
          : "💥";
      console.log(`${status} ${result.name} (${result.duration.toFixed(2)}ms)`);

      if (result.details) {
        console.log(`   ${result.details}`);
      }
    }

    this.testResults.endTime = performance.now();

    this.printSummary();
    return {
      summary: this.testResults,
      results: results,
    };
  }

  /**
   * Run tests by category
   * @param {string} category - Category to run
   * @returns {Promise<Object>} Summary of category test results
   */
  async runTestsByCategory(category) {
    const categoryTests = this.tests.filter(
      (test) => test.category === category
    );

    // ResourceManager smoke test
    runner.addTest(
      "ResourceManager: registers and cleans up listeners",
      async () => {
        if (typeof ResourceManager === "undefined") {
          return {
            passed: true,
            details: "Skipped: ResourceManager not loaded",
          };
        }
        const rm = new ResourceManager();
        const el = document.createElement("div");
        let count = 0;
        const off = rm.on(el, "click", () => count++);
        el.dispatchEvent(new Event("click"));
        const before = count === 1;
        rm.cleanup();
        el.dispatchEvent(new Event("click"));
        const after = count === 1;
        return {
          passed: before && after,
          details: `before=${before}, after=${after}`,
        };
      },
      "system"
    );

    // AnimationManager smoke test
    runner.addTest(
      "AnimationManager: starts and stops",
      async () => {
        if (typeof AnimationManager === "undefined") {
          return {
            passed: true,
            details: "Skipped: AnimationManager not loaded",
          };
        }
        let ticks = 0;
        const am = new AnimationManager({ fps: 30 });
        am.start(() => {
          ticks++;
        });
        await new Promise((r) => setTimeout(r, 50));
        am.stop();
        return { passed: ticks > 0, details: `ticks=${ticks}` };
      },
      "system"
    );

    // StatisticsCollector smoke test
    runner.addTest(
      "StatisticsCollector: averages samples",
      async () => {
        if (typeof StatisticsCollector === "undefined") {
          return {
            passed: true,
            details: "Skipped: StatisticsCollector not loaded",
          };
        }
        const sc = new StatisticsCollector();
        sc.defineMetric("x", { maxSamples: 5 });
        sc.addSample("x", 1);
        sc.addSample("x", 3);
        const avg = sc.getAverage("x");
        return { passed: avg === 2, details: `avg=${avg}` };
      },
      "system"
    );

    // CanvasManager smoke test
    runner.addTest(
      "CanvasManager: clear() does not throw",
      async () => {
        if (typeof CanvasManager === "undefined") {
          return { passed: true, details: "Skipped: CanvasManager not loaded" };
        }
        const canvas = document.createElement("canvas");
        canvas.width = 10;
        canvas.height = 10;
        const cm = new CanvasManager(canvas);
        cm.clear();
        return { passed: true, details: "cleared" };
      },
      "system"
    );

    // TypeGuards smoke test
    runner.addTest(
      "TypeGuards: basic guards work",
      async () => {
        if (typeof TypeGuards === "undefined") {
          return { passed: true, details: "Skipped: TypeGuards not loaded" };
        }
        const ok =
          TypeGuards.isFiniteNumber(3) &&
          !TypeGuards.isFiniteNumber(NaN) &&
          TypeGuards.clampNumber(5, 0, 3) === 3;
        return { passed: ok, details: `ok=${ok}` };
      },
      "system"
    );

    // KeyboardShortcutManager smoke test
    runner.addTest(
      "KeyboardShortcutManager: maps handler",
      async () => {
        if (typeof KeyboardShortcutManager === "undefined") {
          return {
            passed: true,
            details: "Skipped: KeyboardShortcutManager not loaded",
          };
        }
        const mgr = new KeyboardShortcutManager(document);
        let called = false;
        mgr.register("z", () => {
          called = true;
        });
        const ev = new KeyboardEvent("keydown", { key: "z" });
        document.dispatchEvent(ev);
        mgr.cleanup();
        return { passed: called, details: `called=${called}` };
      },
      "integration"
    );

    console.log(`🚀 Starting ${category} tests...`);
    console.log(
      `📋 Running ${categoryTests.length} tests in category: ${category}`
    );
    console.log("─".repeat(50));

    const results = [];

    for (const test of categoryTests) {
      const result = await this.runTest(test);
      results.push(result);

      const status =
        result.result === "pass"
          ? "✅"
          : result.result === "fail"
          ? "❌"
          : "💥";
      console.log(`${status} ${result.name} (${result.duration.toFixed(2)}ms)`);

      if (result.details) {
        console.log(`   ${result.details}`);
      }
    }

    this.printSummary();
    return {
      category,
      results: results,
    };
  }

  /**
   * Print test summary
   */
  printSummary() {
    const duration = this.testResults.endTime - this.testResults.startTime;
    const successRate =
      this.testResults.total > 0
        ? ((this.testResults.passed / this.testResults.total) * 100).toFixed(1)
        : 0;

    console.log("─".repeat(50));
    console.log("📊 TEST SUMMARY");
    console.log("─".repeat(50));
    console.log(`Total Tests: ${this.testResults.total}`);
    console.log(`✅ Passed: ${this.testResults.passed}`);
    console.log(`❌ Failed: ${this.testResults.failed}`);
    console.log(`💥 Errors: ${this.testResults.errors}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏱️  Duration: ${duration.toFixed(2)}ms`);
    console.log("─".repeat(50));

    if (this.testResults.failed > 0 || this.testResults.errors > 0) {
      console.log("⚠️  Some tests failed! Please review the results above.");
    } else {
      console.log("🎉 All tests passed!");
    }
  }

  /**
   * Get test statistics by category
   * @returns {Object} Statistics grouped by category
   */
  getCategoryStats() {
    const stats = {};

    this.tests.forEach((test) => {
      if (!stats[test.category]) {
        stats[test.category] = {
          total: 0,
          passed: 0,
          failed: 0,
          errors: 0,
        };
      }

      stats[test.category].total++;

      if (test.result === "pass") {
        stats[test.category].passed++;
      } else if (test.result === "fail") {
        stats[test.category].failed++;
      } else if (test.result === "error") {
        stats[test.category].errors++;
      }
    });

    return stats;
  }

  /**
   * Export test results to JSON
   * @returns {Object} Test results in JSON format
   */
  exportResults() {
    return {
      timestamp: new Date().toISOString(),
      summary: this.testResults,
      categoryStats: this.getCategoryStats(),
      tests: this.tests.map((test) => ({
        name: test.name,
        category: test.category,
        result: test.result,
        details: test.details,
        duration: test.duration,
      })),
    };
  }
}

// Predefined test suites for common scenarios
class PredefinedTestSuites {
  /**
   * Create a comprehensive test suite for the algorithmic pattern generator
   * @param {Object} dependencies - Required dependencies (canvas, ctx, etc.)
   * @returns {TestRunner} Configured test runner
   */
  static createComprehensiveSuite(dependencies = {}) {
    const runner = new TestRunner();

    // Core simulation tests
    runner.addTest(
      "Conway Game of Life Creation",
      async () => {
        const simulation = SimulationRegistry.create(
          "conway",
          dependencies.canvas,
          dependencies.ctx
        );
        return {
          passed: simulation instanceof ConwayGameOfLife,
          details: `Created ${simulation.constructor.name}`,
        };
      },
      "core"
    );

    runner.addTest(
      "Termite Algorithm Creation",
      async () => {
        const simulation = SimulationRegistry.create(
          "termite",
          dependencies.canvas,
          dependencies.ctx
        );
        return {
          passed: simulation instanceof TermiteAlgorithm,
          details: `Created ${simulation.constructor.name}`,
        };
      },
      "core"
    );

    runner.addTest(
      "Langton's Ant Creation",
      async () => {
        const simulation = SimulationRegistry.create(
          "langton",
          dependencies.canvas,
          dependencies.ctx
        );
        return {
          passed: simulation instanceof LangtonsAnt,
          details: `Created ${simulation.constructor.name}`,
        };
      },
      "core"
    );

    runner.addTest(
      "Termite Slider Functionality",
      async () => {
        const simulation = SimulationRegistry.create(
          "termite",
          dependencies.canvas,
          dependencies.ctx
        );
        simulation.init();

        const initialCount = simulation.termites.length;
        const newCount = 25;
        simulation.setTermiteCount(newCount);
        const afterChangeCount = simulation.termites.length;

        return {
          passed:
            afterChangeCount === newCount && afterChangeCount !== initialCount,
          details: `Termite count changed from ${initialCount} to ${afterChangeCount} (expected ${newCount})`,
        };
      },
      "core"
    );

    // Performance tests
    runner.addTest(
      "Grid Creation Performance",
      async () => {
        const start = performance.now();
        const simulation = new ConwayGameOfLife(
          dependencies.canvas,
          dependencies.ctx
        );
        simulation.init();
        const end = performance.now();

        return {
          passed: end - start < 100,
          details: `Grid creation took ${(end - start).toFixed(2)}ms`,
        };
      },
      "performance"
    );

    runner.addTest(
      "Update Performance",
      async () => {
        const simulation = new ConwayGameOfLife(
          dependencies.canvas,
          dependencies.ctx
        );
        simulation.init();
        simulation.randomizeGrid(simulation.grids.current, 0.3);

        const start = performance.now();
        simulation.update();
        const end = performance.now();

        return {
          passed: end - start < 20,
          details: `Update took ${(end - start).toFixed(2)}ms`,
        };
      },
      "performance"
    );

    // UI component tests
    runner.addTest(
      "Configuration Manager",
      async () => {
        const configs = ConfigurationManager.getAllConfigs();
        return {
          passed: configs.conway && configs.termite && configs.langton,
          details: `Found ${Object.keys(configs).length} simulation configs`,
        };
      },
      "ui"
    );

    // i18n smoke tests (dynamic content & attributes)
    runner.addTest(
      "i18n: translates data-i18n-key and data-i18n-attr",
      async () => {
        if (typeof document === "undefined" || typeof i18n === "undefined") {
          return { passed: true, details: "Skipped in non-DOM environment" };
        }
        const container = document.createElement("div");
        container.innerHTML = `
          <span id="fps-label" data-i18n-key="fps-label"></span>
          <button id="learn-btn" data-i18n-attr="title:tooltip-learn,aria-label:tooltip-learn"></button>
        `;
        document.body.appendChild(container);
        try {
          i18n.updateElements();
          const textOk =
            container.querySelector("#fps-label").textContent.trim().length > 0;
          const btn = container.querySelector("#learn-btn");
          const titleOk = !!btn.getAttribute("title");
          const ariaOk = !!btn.getAttribute("aria-label");
          return {
            passed: textOk && titleOk && ariaOk,
            details: `text=${textOk}, title=${titleOk}, aria=${ariaOk}`,
          };
        } finally {
          document.body.removeChild(container);
        }
      },
      "ui"
    );

    // ConfigValidator smoke tests
    runner.addTest(
      "ConfigValidator: validates slider schema",
      async () => {
        if (typeof ConfigValidator === "undefined") {
          return {
            passed: true,
            details: "Skipped: ConfigValidator not loaded",
          };
        }
        const good = {
          type: "slider",
          id: "x",
          valueElementId: "y",
          min: 0,
          max: 10,
          step: 1,
          value: 5,
          label: "Label",
        };
        const bad = {
          type: "slider",
          id: "x",
          min: 0,
          max: 10,
          step: 1,
          value: 20,
          label: "L",
        };
        const ok = ConfigValidator.validate("slider", good).valid;
        const notOk = !ConfigValidator.validate("slider", bad).valid;
        return { passed: ok && notOk, details: `ok=${ok}, notOk=${notOk}` };
      },
      "ui"
    );

    // Constants smoke tests
    runner.addTest(
      "AppConstants exposed",
      async () => {
        const ok =
          typeof AppConstants !== "undefined" &&
          !!AppConstants.SimulationDefaults &&
          !!AppConstants.UISliders;
        return {
          passed: ok,
          details: ok ? "AppConstants available" : "AppConstants missing",
        };
      },
      "system"
    );

    runner.addTest(
      "Speed clamping uses constants",
      async () => {
        const canvas = dependencies.canvas || document.createElement("canvas");
        const ctx = dependencies.ctx || canvas.getContext("2d");
        const sim = new ConwayGameOfLife(canvas, ctx);
        sim.setSpeed(10_000);
        const max =
          typeof AppConstants !== "undefined"
            ? AppConstants.SimulationDefaults.SPEED_MAX
            : 60;
        return {
          passed: sim.speed === max,
          details: `speed=${sim.speed}, max=${max}`,
        };
      },
      "system"
    );

    runner.addTest(
      "Initial Controls Visibility",
      async () => {
        // This test requires DOM elements to exist
        if (typeof document === "undefined") {
          return {
            passed: true,
            details: "Skipped in non-DOM environment",
          };
        }

        const app = new AlgorithmicPatternGenerator();
        app.init();

        const conwayControls = document.getElementById("conway-controls");
        // Unified visibility uses class 'active'
        const isVisible =
          conwayControls && conwayControls.classList.contains("active");

        return {
          passed: isVisible,
          details: `Controls visibility after init: ${isVisible}`,
        };
      },
      "ui"
    );

    runner.addTest(
      "Unified Control Panel class applied",
      async () => {
        if (typeof document === "undefined") {
          return { passed: true, details: "Skipped in non-DOM environment" };
        }

        const ids = [
          "simulation-container",
          "playback-container",
          "action-container",
          "termites-container",
          "display-container",
          "stats-container",
          "fps-container",
        ];
        const allHaveClass = ids.every((id) => {
          const el = document.getElementById(id);
          return !!el && el.classList.contains("control-panel");
        });
        return {
          passed: allHaveClass,
          details: `control-panel present on ${ids.length} containers`,
        };
      },
      "ui"
    );

    runner.addTest(
      "Termite Slider Integration",
      async () => {
        // This test requires DOM elements to exist
        if (typeof document === "undefined") {
          return {
            passed: true,
            details: "Skipped in non-DOM environment",
          };
        }

        // Create test canvas and simulation
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");

        const simulation = SimulationRegistry.create("termite", canvas, ctx);
        simulation.init();

        // Get initial termite count
        const initialCount = simulation.termites.length;

        // Test the setTermiteCount method directly
        simulation.setTermiteCount(25);

        // Check if termite count changed
        const afterChangeCount = simulation.termites.length;

        return {
          passed: afterChangeCount === 25 && afterChangeCount !== initialCount,
          details: `Termite count changed from ${initialCount} to ${afterChangeCount} (expected 25)`,
        };
      },
      "ui"
    );

    runner.addTest(
      "Performance Optimizer",
      async () => {
        const debounced = PerformanceOptimizer.debounce(() => {}, 100);
        const throttled = PerformanceOptimizer.throttle(() => {}, 100);

        return {
          passed:
            typeof debounced === "function" && typeof throttled === "function",
          details: "Debounce and throttle functions created successfully",
        };
      },
      "ui"
    );

    // Colour scheme tests
    runner.addTest(
      "Dynamic Colour Scheme",
      async () => {
        const colourScheme = new DynamicColourScheme();
        const hue = colourScheme.getCornerHue("topLeft", 0);

        return {
          passed: hue === 45,
          details: `Top left corner hue: ${hue}°`,
        };
      },
      "colour"
    );

    runner.addTest(
      "Colour Interpolation",
      async () => {
        const colourScheme = new DynamicColourScheme();
        const colour = colourScheme.getColourAtPosition(
          0,
          0,
          100,
          100,
          80,
          50,
          0
        );

        return {
          passed: colour.startsWith("rgb("),
          details: `Generated colour: ${colour}`,
        };
      },
      "colour"
    );

    // ColorUtils tests (utility consolidation)
    runner.addTest(
      "ColorUtils: hslToRgb consistency",
      async () => {
        if (typeof ColorUtils === "undefined") {
          return {
            passed: true,
            details: "Skipped: ColorUtils not loaded in this environment",
          };
        }
        const { r, g, b } = ColorUtils.hslToRgb(0, 100, 50); // pure red
        return {
          passed: r === 255 && g === 0 && b === 0,
          details: `rgb(${r},${g},${b})`,
        };
      },
      "colour"
    );

    runner.addTest(
      "ColorUtils: parseColor supports hex and rgb",
      async () => {
        if (typeof ColorUtils === "undefined") {
          return {
            passed: true,
            details: "Skipped: ColorUtils not loaded in this environment",
          };
        }
        const a = ColorUtils.parseColor("#ff0000");
        const b = ColorUtils.parseColor("rgb(255,0,0)");
        return {
          passed:
            Array.isArray(a) &&
            a[0] === 255 &&
            Array.isArray(b) &&
            b[0] === 255,
          details: `hex:${a}, rgb:${b}`,
        };
      },
      "colour"
    );

    runner.addTest(
      "ColorUtils: interpolateColor clamps factor",
      async () => {
        if (typeof ColorUtils === "undefined") {
          return {
            passed: true,
            details: "Skipped: ColorUtils not loaded in this environment",
          };
        }
        const c = ColorUtils.interpolateColor(
          "rgb(0,0,0)",
          "rgb(255,255,255)",
          2
        );
        return {
          passed: /^rgb\(255, 255, 255\)$/.test(c),
          details: `result: ${c}`,
        };
      },
      "colour"
    );

    // Test utilities tests
    runner.addTest(
      "TestUtilityFactory: mock canvas/ctx and simulation",
      async () => {
        try {
          if (typeof TestUtilityFactory === "undefined") {
            return {
              passed: true,
              details:
                "Skipped: TestUtilityFactory not loaded in this environment",
            };
          }
          const { canvas, ctx } = TestUtilityFactory.createCanvasAndContext();
          const { simulation } =
            TestUtilityFactory.createSimulationWithMocks("conway");
          const hasProps =
            !!canvas && !!ctx && simulation instanceof ConwayGameOfLife;
          return {
            passed: hasProps,
            details: `canvas:${!!canvas}, ctx:${!!ctx}, sim:${
              simulation &&
              simulation.constructor &&
              simulation.constructor.name
            }`,
          };
        } catch (e) {
          return { passed: false, details: e.message };
        }
      },
      "system"
    );

    return runner;
  }

  /**
   * Create a minimal test suite for quick validation
   * @param {Object} dependencies - Required dependencies
   * @returns {TestRunner} Configured test runner
   */
  static createMinimalSuite(dependencies = {}) {
    const runner = new TestRunner();

    runner.addTest(
      "Basic Simulation Creation",
      async () => {
        const simulation = SimulationRegistry.create(
          "conway",
          dependencies.canvas,
          dependencies.ctx
        );
        return {
          passed: simulation instanceof ConwayGameOfLife,
          details: "Basic simulation creation works",
        };
      },
      "basic"
    );

    runner.addTest(
      "Configuration Access",
      async () => {
        const configs = ConfigurationManager.getAllConfigs();
        return {
          passed: Object.keys(configs).length > 0,
          details: `Found ${Object.keys(configs).length} configurations`,
        };
      },
      "basic"
    );

    return runner;
  }
}

// Export for use in different environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = { TestRunner, PredefinedTestSuites };
} else if (typeof window !== "undefined") {
  window.TestRunner = TestRunner;
  window.PredefinedTestSuites = PredefinedTestSuites;
}

// Auto-run if in browser environment with canvas
if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    const runner = PredefinedTestSuites.createMinimalSuite({ canvas, ctx });
    // Add ErrorHandler smoke tests
    runner.addTest(
      "ErrorHandler: default strategy handles event errors",
      async () => {
        try {
          if (!window.errorHandler)
            return { passed: false, details: "errorHandler not initialised" };
          const initial = window.errorHandler.getMetrics();
          // Simulate an event handler error via lifecycle event handler
          const sim = SimulationRegistry.create("conway", canvas, ctx);
          sim.eventHandler.on("test", () => {
            throw new Error("boom");
          });
          sim.eventHandler.emit("test");
          const after = window.errorHandler.getMetrics();
          const increased = after.total > initial.total;
          const typed =
            (after.byType.eventHandler || 0) >
            (initial.byType.eventHandler || 0);
          return {
            passed: increased && typed,
            details: `total ${after.total}, eventHandler ${after.byType.eventHandler}`,
          };
        } catch (e) {
          return { passed: false, details: e.message };
        }
      },
      "system"
    );

    runner.addTest(
      "ErrorHandler: state manager serialize/deserialize errors counted",
      async () => {
        try {
          if (!window.errorHandler)
            return { passed: false, details: "errorHandler not initialised" };
          const sim = SimulationRegistry.create("conway", canvas, ctx);
          // Inject a serializer that throws
          sim.stateManager.registerSerializer({
            capture: () => {
              throw new Error("capture fail");
            },
            restore: () => {
              throw new Error("restore fail");
            },
          });
          const before = window.errorHandler.getMetrics();
          // Trigger serialize
          sim.getState();
          // Trigger deserialize
          sim.setState({});
          const after = window.errorHandler.getMetrics();
          const serIncreased =
            (after.byType.serialize || 0) > (before.byType.serialize || 0);
          const deserIncreased =
            (after.byType.deserialize || 0) > (before.byType.deserialize || 0);
          return {
            passed: serIncreased && deserIncreased,
            details: `serialize: ${after.byType.serialize}, deserialize: ${after.byType.deserialize}`,
          };
        } catch (e) {
          return { passed: false, details: e.message };
        }
      },
      "system"
    );

    console.log(
      "🧪 Test runner loaded. Run runner.runAllTests() to execute tests."
    );
    console.log("Available commands:");
    console.log("  - runner.runAllTests()");
    console.log('  - runner.runTestsByCategory("core")');
    console.log('  - runner.runTestsByCategory("performance")');
    console.log('  - runner.runTestsByCategory("ui")');
    console.log('  - runner.runTestsByCategory("colour")');

    // Make runner globally available
    window.testRunner = runner;
  });
}
