/**
 * Additional behaviour tests for URL params, ants slider, and termite rules.
 */

if (typeof window !== "undefined") {
  (function () {
    const addResult = (name, passed, details = "") => {
      console.log(`${passed ? "✅" : "❌"} ${name}${details ? ` - ${details}` : ""}`);
      return { name, passed, details };
    };

    window.runAdditionalTests = async function () {
      const results = [];

      // 1) Direction indicator forced via URL param
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("dir", "0");
        history.replaceState({}, "", url);

        const app = new AlgorithmicPatternGenerator();
        const sim = app.currentSimulation;
        const forcedOff = typeof sim.getShowDirectionIndicator === "function" && !sim.getShowDirectionIndicator();
        results.push(addResult("Direction indicator forced off via URL", forcedOff));

        // Clean up
        app.cleanup();
        // restore URL
        url.searchParams.delete("dir");
        history.replaceState({}, "", url);
      } catch (e) {
        results.push(addResult("Direction indicator forced off via URL", false, e.message));
      }

      // 2) Ants slider responsiveness (Langton)
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        const sim = SimulationFactory.createSimulation("langton", canvas, ctx);
        sim.init();
        const before = sim.ants.length;
        sim.setAntCount(5);
        const after = sim.ants.length;
        results.push(addResult("Ants slider responsiveness", after === 5 && after !== before, `before=${before}, after=${after}`));
      } catch (e) {
        results.push(addResult("Ants slider responsiveness", false, e.message));
      }

      // 3) Termite pick-up/drop edge cases
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        const sim = SimulationFactory.createSimulation("termite", canvas, ctx);
        sim.init();

        // Prepare a known cell
        const col = Math.floor(sim.cols / 2);
        const row = Math.floor(sim.rows / 2);
        sim.grid[row][col] = true; // active chip present

        // Place a termite over that cell, not carrying
        sim.termites = [
          { x: sim.gridOffsetX + col * sim.cellSize + 1, y: sim.gridOffsetY + row * sim.cellSize + 1, angle: 0, isCarrying: false, trail: [] },
        ];

        // One update should cause pickup (active -> inactive, carrying -> true)
        sim.update();
        const pickedUp = sim.termites[0].isCarrying === true && sim.grid[row][col] === false;

        // Move to neighbouring empty cell and drop
        const ncol = Math.max(0, Math.min(sim.cols - 1, col + 1));
        sim.termites[0].x = sim.gridOffsetX + ncol * sim.cellSize + 1;
        sim.termites[0].y = sim.gridOffsetY + row * sim.cellSize + 1;
        sim.update();
        const dropped = sim.termites[0].isCarrying === false && sim.grid[row][ncol] === true;

        results.push(addResult("Termite pickup/drop edge cases", pickedUp && dropped, `pickedUp=${pickedUp}, dropped=${dropped}`));
      } catch (e) {
        results.push(addResult("Termite pickup/drop edge cases", false, e.message));
      }

      return results;
    };
  })();
}


