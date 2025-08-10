(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Termite Movement",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120; canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const simulation = new TermiteAlgorithm(canvas, ctx);
      simulation.init();
      const ix = simulation.termites[0].x;
      const iy = simulation.termites[0].y;
      simulation.update();
      const nx = simulation.termites[0].x;
      const ny = simulation.termites[0].y;
      return { passed: nx !== ix || ny !== iy, details: `(${ix},${iy})->(${nx},${ny})` };
    },
    "core"
  );

  runner.addTest(
    "Langton Ant Movement",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 120; canvas.height = 80;
      const ctx = canvas.getContext("2d");
      const simulation = new LangtonsAnt(canvas, ctx);
      simulation.init();
      const ix = simulation.ants[0].x;
      const iy = simulation.ants[0].y;
      simulation.update();
      const nx = simulation.ants[0].x;
      const ny = simulation.ants[0].y;
      return { passed: nx !== ix || ny !== iy, details: `(${ix},${iy})->(${nx},${ny})` };
    },
    "core"
  );
})();


