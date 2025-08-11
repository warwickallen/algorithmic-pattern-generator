(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Configuration Manager",
    async () => {
      const configs = ConfigurationManager.getAllConfigs();
      const ok =
        configs && configs.conway && configs.termite && configs.langton;
      return {
        passed: !!ok,
        details: ok
          ? `configs=${Object.keys(configs).length}`
          : "missing configs",
      };
    },
    "ui.misc"
  );

  runner.addTest(
    "Performance Optimizer",
    async () => {
      const debounced = PerformanceOptimizer.debounce(() => {}, 100);
      const throttled = PerformanceOptimizer.throttle(() => {}, 100);
      return {
        passed:
          typeof debounced === "function" && typeof throttled === "function",
        details: "debounce/throttle available",
      };
    },
    "ui.misc"
  );

  runner.addTest(
    "Initial Controls Visibility",
    async () => {
      if (typeof document === "undefined") {
        return { passed: true, details: "Skipped in non-DOM environment" };
      }
      if (!document.getElementById("canvas")) {
        return {
          passed: true,
          details: "Skipped: required #canvas element not present",
        };
      }
      const app = new AlgorithmicPatternGenerator();
      app.init();
      const el = document.getElementById("conway-controls");
      if (!el) {
        return {
          passed: true,
          details: "Skipped: conway-controls element not present",
        };
      }
      const visible = !!(el.classList && el.classList.contains("active"));
      return { passed: visible, details: `visible=${visible}` };
    },
    "ui.controls"
  );
})();
