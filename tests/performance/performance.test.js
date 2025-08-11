(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Grid Creation Performance",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const start = performance.now();
      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();
      const end = performance.now();
      const took = end - start;
      return { passed: took < 100, details: `grid ${took.toFixed(2)}ms` };
    },
    "performance"
  );

  runner.addTest(
    "Update Performance",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();
      simulation.randomizeGrid(simulation.grids.current, 0.3);
      const start = performance.now();
      simulation.update();
      const end = performance.now();
      const took = end - start;
      return { passed: took < 20, details: `update ${took.toFixed(2)}ms` };
    },
    "performance"
  );
})();
