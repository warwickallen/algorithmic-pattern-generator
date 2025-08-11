(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "ReactionDiffusion: setReactionParam updates feed/kill",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");

      const sim = SimulationFactory.createSimulation("reaction", canvas, ctx);
      sim.init();

      sim.setReactionParam("feed", 0.07);
      sim.setReactionParam("kill", 0.055);
      const ok =
        Math.abs(sim.feedRate - 0.07) < 1e-6 &&
        Math.abs(sim.killRate - 0.055) < 1e-6;

      return {
        passed: ok,
        details: `F=${sim.feedRate.toFixed(3)}, k=${sim.killRate.toFixed(3)}`,
      };
    },
    "reaction"
  );

  runner.addTest(
    "ReactionDiffusion: randomize uses likelihood",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 80;
      const ctx = canvas.getContext("2d");

      const sim = SimulationFactory.createSimulation("reaction", canvas, ctx);
      sim.init();

      sim.randomize(0.0);
      let countZero = 0;
      for (let r = 0; r < sim.rows; r++) {
        for (let c = 0; c < sim.cols; c++) {
          if (sim.v[r][c] > 0.5) countZero++;
        }
      }

      sim.randomize(0.5);
      let countHalf = 0;
      for (let r = 0; r < sim.rows; r++) {
        for (let c = 0; c < sim.cols; c++) {
          if (sim.v[r][c] > 0.5) countHalf++;
        }
      }

      return {
        passed: countHalf >= countZero,
        details: `seeded(0.0)->${countZero}, seeded(0.5)->${countHalf}`,
      };
    },
    "reaction"
  );
})();


