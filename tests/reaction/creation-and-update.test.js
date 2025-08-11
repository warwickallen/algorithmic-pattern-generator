(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "ReactionDiffusion: Factory creation",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");

      const sim = SimulationFactory.createSimulation("reaction", canvas, ctx);
      return {
        passed:
          sim &&
          sim.constructor &&
          sim.constructor.name === "ReactionDiffusion",
        details: `Created ${sim && sim.constructor && sim.constructor.name}`,
      };
    },
    "reaction"
  );

  runner.addTest(
    "ReactionDiffusion: init + update produces valid state",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 160;
      canvas.height = 120;
      const ctx = canvas.getContext("2d");
      const sim = SimulationFactory.createSimulation("reaction", canvas, ctx);
      sim.init();

      // Run a few updates
      for (let i = 0; i < 3; i++) sim.update();

      const dimsOk = sim.rows > 0 && sim.cols > 0 && Array.isArray(sim.v);
      const countOk = typeof sim.cellCount === "number" && sim.cellCount >= 0;

      return {
        passed: dimsOk && countOk,
        details: `rows=${sim.rows}, cols=${sim.cols}, cells=${sim.cellCount}`,
      };
    },
    "reaction"
  );
})();
