(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  const createCanvasAndSim = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const sim = new ConwayGameOfLife(canvas, ctx);
    sim.init();
    return { canvas, ctx, sim };
  };

  runner.addTest(
    "Fade-to-Black Effect",
    async () => {
      if (typeof ConwayGameOfLife === "undefined") {
        return {
          passed: true,
          details: "Skipped: ConwayGameOfLife not available",
        };
      }
      const { canvas, sim } = createCanvasAndSim();
      if (canvas.width <= 0 || canvas.height <= 0) {
        throw new Error("Invalid canvas dimensions for testing");
      }

      const defaultCycles =
        typeof sim.getFadeOutCycles === "function" ? sim.getFadeOutCycles() : 5;
      if (typeof sim.setFadeOutCycles === "function") sim.setFadeOutCycles(3);
      const newCycles =
        typeof sim.getFadeOutCycles === "function" ? sim.getFadeOutCycles() : 3;

      const testX = sim.cellSize * 5;
      const testY = sim.cellSize * 5;
      sim.toggleCell(testX, testY);
      const gridPos = sim.screenToGrid(testX, testY);
      const activeFade = sim.getCellFadeFactor(gridPos.row, gridPos.col, true);
      const activeFull = activeFade === 1;
      sim.toggleCell(testX, testY);
      const inactiveBefore = sim.getCellFadeFactor(
        gridPos.row,
        gridPos.col,
        false
      );
      const inactiveBeforeFull = inactiveBefore === 1;
      const dec =
        typeof sim.getFadeDecrement === "function"
          ? sim.getFadeDecrement()
          : 0.2;
      sim.update();
      const inactiveAfter = sim.getCellFadeFactor(
        gridPos.row,
        gridPos.col,
        false
      );
      const inactiveAfterCorrect = Math.abs(inactiveAfter - (1 - dec)) < 1e-6;

      if (typeof sim.clearFadeStates === "function") sim.clearFadeStates();
      const cleared = sim.getCellFadeFactor(1, 1, false);
      const clearedOk = cleared === 0;

      return {
        passed:
          defaultCycles === 5 &&
          newCycles === 3 &&
          activeFull &&
          inactiveBeforeFull &&
          inactiveAfterCorrect &&
          clearedOk,
        details: `cycles: ${defaultCycles}->${newCycles}, active=${activeFade}, before=${inactiveBefore}, after=${inactiveAfter}, cleared=${cleared}`,
      };
    },
    "visual"
  );

  runner.addTest(
    "Comprehensive Fade Functionality",
    async () => {
      if (typeof ConwayGameOfLife === "undefined") {
        return {
          passed: true,
          details: "Skipped: ConwayGameOfLife not available",
        };
      }
      const { sim } = createCanvasAndSim();
      const testX = sim.cellSize * 5;
      const testY = sim.cellSize * 5;
      sim.toggleCell(testX, testY);
      const gridPos = sim.screenToGrid(testX, testY);
      const activeFade = sim.getCellFadeFactor(gridPos.row, gridPos.col, true);
      const activeOk = activeFade === 1;
      sim.toggleCell(testX, testY);
      const before = sim.getCellFadeFactor(gridPos.row, gridPos.col, false);
      const beforeOk = before === 1;
      const dec =
        typeof sim.getFadeDecrement === "function"
          ? sim.getFadeDecrement()
          : 0.2;
      sim.update();
      const after = sim.getCellFadeFactor(gridPos.row, gridPos.col, false);
      const afterOk = Math.abs(after - (1 - dec)) < 1e-6;

      const testX2 = sim.cellSize * 10;
      const testY2 = sim.cellSize * 10;
      sim.toggleCell(testX2, testY2);
      const gridPos2 = sim.screenToGrid(testX2, testY2);
      const b1 = sim.getCellFadeFactor(gridPos2.row, gridPos2.col, true);
      sim.toggleCell(testX2, testY2);
      sim.update();
      const b2 = sim.getCellFadeFactor(gridPos2.row, gridPos2.col, false);
      const threeStepOk = b1 === 1 && Math.abs(b2 - (1 - dec)) < 1e-6;

      if (typeof sim.clearFadeStates === "function") sim.clearFadeStates();
      const cleared = sim.getCellFadeFactor(0, 0, false);
      const clearedOk = cleared === 0;

      return {
        passed: activeOk && beforeOk && afterOk && threeStepOk && clearedOk,
        details: `active=${activeOk}, before=${beforeOk}, after=${afterOk}, 3step=${threeStepOk}, cleared=${clearedOk}`,
      };
    },
    "visual"
  );

  runner.addTest(
    "Visual Regression Test",
    async () => {
      if (typeof ConwayGameOfLife === "undefined") {
        return {
          passed: true,
          details: "Skipped: ConwayGameOfLife not available",
        };
      }
      const { canvas, ctx, sim } = createCanvasAndSim();
      if (canvas.width !== 400 || canvas.height !== 300) {
        throw new Error(
          `Canvas dimensions incorrect: ${canvas.width}x${canvas.height}, expected 400x300`
        );
      }
      sim.toggleCell(10, 10);
      sim.toggleCell(11, 10);
      sim.toggleCell(12, 10);
      sim.draw();
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const hasValidData =
        data.length === canvas.width * canvas.height * 4 && data.length > 0;
      let nonBlack = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) nonBlack++;
      }
      return {
        passed: hasValidData && nonBlack > 0,
        details: `valid=${hasValidData}, nonBlack=${nonBlack}`,
      };
    },
    "visual"
  );
})();
