(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  function makeCanvas() {
    if (typeof TestUtilityFactory !== "undefined") {
      return TestUtilityFactory.createCanvasAndContext({
        width: 120,
        height: 80,
      });
    }
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 80;
    return { canvas, ctx: canvas.getContext("2d") };
  }

  runner.addTest(
    "Conway Cell Toggle",
    async () => {
      const { canvas, ctx } = makeCanvas();
      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();
      const before = simulation.cellCount;
      simulation.toggleCell(50, 50);
      const after = simulation.cellCount;
      return { passed: after !== before, details: `count ${before}→${after}` };
    },
    "core"
  );

  runner.addTest(
    "Termite Cell Toggle",
    async () => {
      const { canvas, ctx } = makeCanvas();
      const simulation = new TermiteAlgorithm(canvas, ctx);
      simulation.init();
      const before = simulation.cellCount;
      simulation.toggleCell(50, 50);
      const after = simulation.cellCount;
      return { passed: after !== before, details: `count ${before}→${after}` };
    },
    "core"
  );

  runner.addTest(
    "Langton Cell Toggle",
    async () => {
      const { canvas, ctx } = makeCanvas();
      const simulation = new LangtonsAnt(canvas, ctx);
      simulation.init();
      const before = simulation.cellCount;
      simulation.toggleCell(50, 50);
      const after = simulation.cellCount;
      return { passed: after !== before, details: `count ${before}→${after}` };
    },
    "core"
  );
})();
