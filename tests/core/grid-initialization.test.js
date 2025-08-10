(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Conway Grid Initialization",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");

      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();

      const hasGrids =
        simulation.grids && simulation.grids.current && simulation.grids.next;
      return {
        passed: !!hasGrids,
        details: hasGrids
          ? `Grid dimensions: ${simulation.rows}x${simulation.cols}`
          : "Missing grids",
      };
    },
    "core"
  );
})();
