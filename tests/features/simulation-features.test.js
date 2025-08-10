(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Termite Slider Functionality",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      const simulation = new TermiteAlgorithm(canvas, ctx);
      simulation.init();
      const initial = simulation.termites.length;
      const expected = 25;
      simulation.setTermiteCount(expected);
      const after = simulation.termites.length;
      return {
        passed: after === expected && after !== initial,
        details: `${initial}→${after}`,
      };
    },
    "features"
  );

  runner.addTest(
    "Brightness Application",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();
      const original = "rgb(100, 150, 200)";
      const bright = simulation.applyBrightness(original);
      return { passed: bright !== original, details: `${original}→${bright}` };
    },
    "features"
  );

  runner.addTest(
    "Speed Setting",
    async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();
      simulation.setSpeed(15);
      const ok =
        simulation.speed === 15 && simulation.updateInterval === 1000 / 15;
      return {
        passed: ok,
        details: `speed=${simulation.speed}, interval=${simulation.updateInterval}`,
      };
    },
    "features"
  );

  runner.addTest(
    "Cell Toggle Methods",
    async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const conway = new ConwayGameOfLife(canvas, ctx);
      const termite = new TermiteAlgorithm(canvas, ctx);
      const langton = new LangtonsAnt(canvas, ctx);
      const allHave = [conway, termite, langton].every(
        (s) => typeof s.toggleCell === "function"
      );
      const baseHas = typeof BaseSimulation.prototype.toggleCell === "function";
      const overrides =
        conway.toggleCell !== BaseSimulation.prototype.toggleCell &&
        termite.toggleCell !== BaseSimulation.prototype.toggleCell &&
        langton.toggleCell !== BaseSimulation.prototype.toggleCell;
      return {
        passed: allHave && baseHas && overrides,
        details: "DRY + overrides ok",
      };
    },
    "features"
  );
})();
