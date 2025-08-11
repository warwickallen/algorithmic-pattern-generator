(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Cell Counting Performance",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const sim = new ConwayGameOfLife(canvas, ctx);
      sim.init();
      sim.randomizeGrid(sim.grids.current, 0.5);
      const start = performance.now();
      const count = sim.countLiveCells(sim.grids.current);
      const end = performance.now();
      const took = end - start;
      return {
        passed: took < 10,
        details: `count=${count} in ${took.toFixed(2)}ms`,
      };
    },
    "performance"
  );

  runner.addTest(
    "Drawing Performance",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const sim = new ConwayGameOfLife(canvas, ctx);
      sim.init();
      sim.randomizeGrid(sim.grids.current, 0.3);
      const start = performance.now();
      sim.draw();
      const end = performance.now();
      const took = end - start;
      return { passed: took < 50, details: `draw ${took.toFixed(2)}ms` };
    },
    "performance"
  );
})();
