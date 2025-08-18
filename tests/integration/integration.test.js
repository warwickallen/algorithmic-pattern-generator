(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Simulation Switching",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      const conwaySim = SimulationRegistry.create("conway", canvas, ctx);
      const termiteSim = SimulationRegistry.create("termite", canvas, ctx);
      const langtonSim = SimulationRegistry.create("langton", canvas, ctx);
      const ok =
        conwaySim instanceof ConwayGameOfLife &&
        termiteSim instanceof TermiteAlgorithm &&
        langtonSim instanceof LangtonsAnt;
      return { passed: ok, details: ok ? "factory ok" : "factory failed" };
    },
    "integration"
  );

  runner.addTest(
    "State Preservation",
    async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();
      simulation.toggleCell(10, 10);
      simulation.toggleCell(11, 11);
      const before = simulation.getState();
      simulation.resizePreserveState();
      const after = simulation.getState();
      return {
        passed: after.generation === before.generation,
        details: `gen=${after.generation}`,
      };
    },
    "integration"
  );
})();
