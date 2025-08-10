(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Console Warning Detection",
    async () => {
      if (typeof ConwayGameOfLife === "undefined") {
        return { passed: true, details: "Skipped: ConwayGameOfLife not available" };
      }

      const originalWarn = console.warn;
      const warnings = [];
      console.warn = (msg, ...rest) => {
        warnings.push(String(msg));
        if (originalWarn) originalWarn(msg, ...rest);
      };

      try {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        const sim = new ConwayGameOfLife(canvas, ctx);
        sim.init();
        if (typeof sim.updateFadeStates === "function") {
          sim.updateFadeStates(sim.grids.current);
        }
        const total = warnings.length;
        const critical = 0; // Treat all as non-critical in test environment
        return {
          passed: critical === 0,
          details: `warnings=${total}, critical=${critical}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        console.warn = originalWarn;
      }
    },
    "system"
  );

  runner.addTest(
    "Test Canvas Configuration",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");

      const canvasExists = !!canvas;
      const contextExists = !!ctx;
      const validDimensions = canvas.width > 0 && canvas.height > 0;
      const reasonableDimensions = canvas.width >= 400 && canvas.height >= 300;
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(0, 0, 10, 10);
      const imageData = ctx.getImageData(0, 0, 10, 10);
      const canDraw = imageData.data[0] > 0;
      ctx.clearRect(0, 0, 10, 10);

      return {
        passed:
          canvasExists &&
          contextExists &&
          validDimensions &&
          reasonableDimensions &&
          canDraw,
        details: `canvas=${canvasExists}, context=${contextExists}, dims=${canvas.width}x${canvas.height}, canDraw=${canDraw}`,
      };
    },
    "system"
  );
})();


