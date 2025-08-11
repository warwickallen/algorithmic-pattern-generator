(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "TestUtilityFactory: mock canvas/ctx and simulation",
    async () => {
      if (typeof TestUtilityFactory === "undefined") {
        return {
          passed: true,
          details: "Skipped: TestUtilityFactory not loaded",
        };
      }
      try {
        const { canvas, ctx } = TestUtilityFactory.createCanvasAndContext();
        const { simulation } =
          TestUtilityFactory.createSimulationWithMocks("conway");
        const ok = !!canvas && !!ctx && simulation instanceof ConwayGameOfLife;
        return { passed: ok, details: `canvas:${!!canvas}, ctx:${!!ctx}` };
      } catch (e) {
        return { passed: false, details: e.message };
      }
    },
    "system"
  );
})();
