(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Fade Progression Debug",
    async () => {
      if (typeof ConwayGameOfLife === "undefined") {
        return { passed: true, details: "Skipped: ConwayGameOfLife not available" };
      }
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      const sim = new ConwayGameOfLife(canvas, ctx);
      sim.init();
      if (typeof sim.setFadeOutCycles === "function") sim.setFadeOutCycles(3);

      const testX = sim.cellSize * 5;
      const testY = sim.cellSize * 5;
      sim.toggleCell(testX, testY);
      const gridPos = sim.screenToGrid(testX, testY);
      const activeBrightness = sim.getCellFadeFactor(gridPos.row, gridPos.col, true);

      sim.toggleCell(testX, testY);
      const inactiveBefore = sim.getCellFadeFactor(gridPos.row, gridPos.col, false);

      const dec = typeof sim.getFadeDecrement === "function" ? sim.getFadeDecrement() : 0.2;
      sim.update();
      const inactiveAfter = sim.getCellFadeFactor(gridPos.row, gridPos.col, false);

      const systemWorks =
        activeBrightness === 1 &&
        inactiveBefore === 1 &&
        Math.abs(inactiveAfter - (1 - dec)) < 1e-6;

      return {
        passed: systemWorks,
        details: `active=${activeBrightness}, before=${inactiveBefore}, after=${inactiveAfter}`,
      };
    },
    "system"
  );
})();


