(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Basic Environment Check",
    async () => {
      const classesExist =
        typeof SimulationFactory !== "undefined" &&
        typeof ConwayGameOfLife !== "undefined" &&
        typeof TermiteAlgorithm !== "undefined" &&
        typeof LangtonsAnt !== "undefined" &&
        typeof ConfigurationManager !== "undefined" &&
        typeof PerformanceOptimizer !== "undefined";

      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      const canvasValid =
        !!canvas && !!ctx && canvas.width > 0 && canvas.height > 0;
      return {
        passed: classesExist && canvasValid,
        details: `classes=${classesExist}, canvas=${canvasValid}`,
      };
    },
    "system"
  );

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
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const sim = new ConwayGameOfLife(canvas, ctx);
      sim.setSpeed(10000);
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
})();
