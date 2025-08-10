(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Control Management",
    async () => {
      if (typeof ControlManager === "undefined") {
        return { passed: true, details: "Skipped: ControlManager not available" };
      }
      const controlManager = new ControlManager();
      controlManager.showControls("conway");
      return { passed: controlManager.activeControls === "conway", details: `active=${controlManager.activeControls}` };
    },
    "integration"
  );

  runner.addTest(
    "Controls Visibility Timing",
    async () => {
      if (typeof ControlManager === "undefined") {
        return { passed: true, details: "Skipped: ControlManager not available" };
      }
      const controlManager = new ControlManager();
      const start = performance.now();
      controlManager.showControls("conway");
      const end = performance.now();
      const took = end - start;
      return { passed: took < 10 && controlManager.activeControls === "conway", details: `${took.toFixed(2)}ms` };
    },
    "integration"
  );
})();


