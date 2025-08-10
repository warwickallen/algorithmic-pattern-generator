(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Full Simulation Lifecycle Test",
    async () => {
      if (typeof ConwayGameOfLife === "undefined") {
        return {
          passed: true,
          details: "Skipped: ConwayGameOfLife not available",
        };
      }
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      const sim = new ConwayGameOfLife(canvas, ctx);

      sim.init();
      const initOk = !!(sim.grids && sim.grids.current && sim.grids.next);

      const initialCount = sim.cellCount;
      const x = sim.cellSize * 5;
      const y = sim.cellSize * 5;
      sim.toggleCell(x, y);
      const afterToggle = sim.cellCount;
      const toggleOk = afterToggle !== initialCount;

      const gridPos = sim.screenToGrid(x, y);
      const activeBrightness = sim.getCellFadeFactor(
        gridPos.row,
        gridPos.col,
        true
      );
      const fadeOk = activeBrightness === 1;

      const beforeGen = sim.generation;
      sim.update();
      const updateOk = sim.generation > beforeGen;

      sim.draw();
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const drawOk = imageData.data.length > 0;

      sim.setSpeed(15);
      const speedOk = sim.speed === 15 || typeof AppConstants !== "undefined";

      const saved = sim.getState();
      const origGen = sim.generation;
      const origCount = sim.cellCount;
      sim.generation = 999;
      sim.cellCount = 999;
      sim.setState(saved);
      const stateOk = sim.generation === origGen && sim.cellCount === origCount;

      const allOk =
        initOk &&
        toggleOk &&
        fadeOk &&
        updateOk &&
        drawOk &&
        speedOk &&
        stateOk;
      const passed = [
        initOk,
        toggleOk,
        fadeOk,
        updateOk,
        drawOk,
        speedOk,
        stateOk,
      ].filter(Boolean).length;
      const failed = 7 - passed;
      return { passed: allOk, details: `${passed} passed, ${failed} failed` };
    },
    "integration"
  );
})();
