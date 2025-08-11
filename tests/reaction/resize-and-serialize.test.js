(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "ReactionDiffusion: state preserved via serializer on resize",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      const sim = SimulationFactory.createSimulation("reaction", canvas, ctx);
      sim.init();
      // Make a distinctive seed at a corner and update a bit
      sim.toggleCell(1, 1);
      sim.update();
      const beforeState = sim.getState();
      const beforeCount = sim.cellCount;

      // Simulate app-level resize preserving state
      sim.resizePreserveState();

      const afterState = sim.getState();
      const afterCount = sim.cellCount;

      // Check that count and presence of u/v arrays persisted reasonably
      const hasUV = !!(sim.u && sim.v);
      const countStable =
        Math.abs(afterCount - beforeCount) <= Math.max(5, beforeCount * 0.1);

      return {
        passed: hasUV && countStable,
        details: `count before=${beforeCount}, after=${afterCount}`,
      };
    },
    "reaction"
  );
})();
