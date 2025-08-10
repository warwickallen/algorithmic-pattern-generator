(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Conway Neighbour Counting",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 60;
      canvas.height = 60;
      const ctx = canvas.getContext("2d");
      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();

      simulation.grids.current[1][1] = true;
      simulation.grids.current[1][2] = true;
      simulation.grids.current[2][1] = true;

      const neighbours = simulation.countNeighbours(
        simulation.grids.current,
        1,
        1,
        simulation.rows,
        simulation.cols
      );
      return { passed: neighbours === 2, details: `neighbours=${neighbours}` };
    },
    "core"
  );
})();
