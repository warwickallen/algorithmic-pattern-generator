(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  function ensureFillButtonDom() {
    let btn = document.getElementById("dynamic-fill-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "dynamic-fill-btn";
      btn.style.display = "none";
      document.body.appendChild(btn);
    }
    return btn;
  }

  runner.addTest(
    "Dynamic Fill Button Exists and Initializes",
    async () => {
      if (typeof DynamicFillButton === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicFillButton not available",
        };
      }
      const button = ensureFillButtonDom();
      const eventFramework = new EventFramework();
      const dynamicFillButton = new DynamicFillButton(eventFramework);
      try {
        dynamicFillButton.init();
        return {
          passed: !!button && dynamicFillButton.isInitialized === true,
          details: "button present and initialized",
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicFillButton.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        if (button && button.parentNode) button.parentNode.removeChild(button);
      }
    },
    "ui"
  );

  runner.addTest(
    "Dynamic Fill Button Click Calls Handler",
    async () => {
      if (typeof DynamicFillButton === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicFillButton not available",
        };
      }
      const button = ensureFillButtonDom();
      const eventFramework = new EventFramework();
      const dynamicFillButton = new DynamicFillButton(eventFramework);
      try {
        let called = false;
        let simType = null;
        const mockApp = {
          handleRandomPattern: (t) => {
            called = true;
            simType = t;
          },
        };
        dynamicFillButton.init();
        dynamicFillButton.switchToSimulation("conway", mockApp);
        button.click();
        return {
          passed: called && simType === "conway",
          details: `called=${called}, type=${simType}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicFillButton.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        if (button && button.parentNode) button.parentNode.removeChild(button);
      }
    },
    "ui"
  );

  runner.addTest(
    "Dynamic Fill Button Show/Hide",
    async () => {
      if (typeof DynamicFillButton === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicFillButton not available",
        };
      }
      const button = ensureFillButtonDom();
      const eventFramework = new EventFramework();
      const dynamicFillButton = new DynamicFillButton(eventFramework);
      try {
        const mockApp = { handleRandomPattern: () => {} };
        dynamicFillButton.init();
        dynamicFillButton.switchToSimulation("conway", mockApp);
        const visible = button.style.display === "inline-block";
        dynamicFillButton.hide();
        const hidden = button.style.display === "none";
        dynamicFillButton.show();
        const shown = button.style.display === "inline-block";
        return {
          passed: visible && hidden && shown,
          details: `visible=${visible}, hidden=${hidden}, shown=${shown}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicFillButton.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        if (button && button.parentNode) button.parentNode.removeChild(button);
      }
    },
    "ui"
  );

  runner.addTest(
    "Dynamic Fill Button initial visibility after app load",
    async () => {
      if (
        typeof DynamicFillButton === "undefined" ||
        typeof AlgorithmicPatternGenerator === "undefined"
      ) {
        return {
          skip: true,
          details: "Skipped: required classes not available",
        };
      }
      // Prepare required DOM elements
      const canvas = document.createElement("canvas");
      canvas.id = "canvas";
      document.body.appendChild(canvas);
      const fillBtn = document.createElement("button");
      fillBtn.id = "dynamic-fill-btn";
      document.body.appendChild(fillBtn);
      try {
        const app = new AlgorithmicPatternGenerator();
        // Allow any async listeners to settle
        await new Promise((r) => setTimeout(r, 50));
        const button = document.getElementById("dynamic-fill-btn");
        const isVisible =
          button &&
          button.style.display !== "none" &&
          window.getComputedStyle(button).display !== "none";
        const shouldBeVisible = app.currentType === "conway";
        app.cleanup();
        return {
          passed: !!isVisible && shouldBeVisible,
          details: `visible=${isVisible}, sim=${app.currentType}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (fillBtn.parentNode) fillBtn.parentNode.removeChild(fillBtn);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    },
    "ui"
  );

  runner.addTest(
    "Dynamic Fill Button Simulation Switching",
    async () => {
      if (typeof DynamicFillButton === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicFillButton not available",
        };
      }
      const button = ensureFillButtonDom();
      const eventFramework = new EventFramework();
      const dynamicFillButton = new DynamicFillButton(eventFramework);
      try {
        const mockApp = { handleRandomPattern: () => {} };
        dynamicFillButton.init();
        dynamicFillButton.switchToSimulation("conway", mockApp);
        const cVisible = button.style.display === "inline-block";
        dynamicFillButton.switchToSimulation("termite", mockApp);
        const tVisible = button.style.display === "inline-block";
        dynamicFillButton.switchToSimulation("langton", mockApp);
        const lVisible = button.style.display === "inline-block";
        dynamicFillButton.switchToSimulation("unknown", mockApp);
        const hidden = button.style.display === "none";
        return {
          passed: cVisible && tVisible && lVisible && hidden,
          details: `conway=${cVisible}, termite=${tVisible}, langton=${lVisible}, otherHidden=${hidden}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicFillButton.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        if (button && button.parentNode) button.parentNode.removeChild(button);
      }
    },
    "ui"
  );

  runner.addTest(
    "Dynamic Fill Button activates cells approximately",
    async () => {
      if (typeof AlgorithmicPatternGenerator === "undefined") {
        return { skip: true, details: "Skipped: app class not available" };
      }
      // Minimal DOM
      const canvas = document.createElement("canvas");
      canvas.id = "canvas";
      document.body.appendChild(canvas);
      const btn = document.createElement("button");
      btn.id = "dynamic-fill-btn";
      document.body.appendChild(btn);
      const like = document.createElement("input");
      like.type = "range";
      like.id = "likelihood-slider";
      like.value = "30";
      const likeVal = document.createElement("span");
      likeVal.id = "likelihood-value";
      likeVal.textContent = "30%";
      document.body.appendChild(like);
      document.body.appendChild(likeVal);
      try {
        const app = new AlgorithmicPatternGenerator();
        await new Promise((r) => setTimeout(r, 50));
        // Click fill once
        btn.click();
        const sim = app.currentSimulation;
        if (!sim || !sim.rows || !sim.cols) {
          app.cleanup();
          return { skip: true, details: "Skipped: simulation not initialised" };
        }
        const N = sim.rows * sim.cols;
        const observed = sim.cellCount || 0;
        // Loose bounds to avoid flakes
        const lower = Math.max(0, Math.floor(N * 0.1));
        const upper = Math.ceil(N * 0.6);
        const passed = observed >= lower && observed <= upper;
        app.cleanup();
        return {
          passed,
          details: `N=${N}, observed=${observed}, bounds=[${lower}..${upper}]`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        [canvas, btn, like, likeVal].forEach(
          (el) => el.parentNode && el.parentNode.removeChild(el)
        );
      }
    },
    "ui"
  );

  runner.addTest(
    "Dynamic Fill Button equal activation probability (variance)",
    async () => {
      if (typeof AlgorithmicPatternGenerator === "undefined") {
        return { skip: true, details: "Skipped: app class not available" };
      }
      // Small grid for speed and stability
      const canvas = document.createElement("canvas");
      canvas.id = "canvas";
      canvas.width = 20;
      canvas.height = 20;
      document.body.appendChild(canvas);
      const btn = document.createElement("button");
      btn.id = "dynamic-fill-btn";
      document.body.appendChild(btn);
      const like = document.createElement("input");
      like.type = "range";
      like.id = "likelihood-slider";
      like.value = "30";
      const likeVal = document.createElement("span");
      likeVal.id = "likelihood-value";
      likeVal.textContent = "30%";
      document.body.appendChild(like);
      document.body.appendChild(likeVal);
      let app = null;
      try {
        app = new AlgorithmicPatternGenerator();
        await new Promise((r) => setTimeout(r, 30));
        const sim = app.currentSimulation;
        if (!sim || !sim.rows || !sim.cols || !sim.grids) {
          return { skip: true, details: "Skipped: conway grid not available" };
        }
        const rows = sim.rows;
        const cols = sim.cols;
        const counts = new Array(rows * cols).fill(0);
        const indexOf = (r, c) => r * cols + c;
        const trials = 40;
        for (let k = 0; k < trials; k++) {
          btn.click();
          const grid = app.currentSimulation.grids.current;
          for (let r = 0; r < rows; r++) {
            const row = grid[r];
            for (let c = 0; c < cols; c++) {
              if (row[c]) counts[indexOf(r, c)] += 1;
            }
          }
        }
        const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
        const variance =
          counts.reduce((acc, x) => acc + (x - mean) * (x - mean), 0) /
          counts.length;
        const stdev = Math.sqrt(variance);
        // Loose bound to avoid flakes: coefficient of variation under 0.5
        const passed = mean > 0 && stdev / mean < 0.5;
        return {
          passed,
          details: `cells=${counts.length}, trials=${trials}, mean=${mean.toFixed(
            2
          )}, stdev=${stdev.toFixed(2)}, cv=${(stdev / mean).toFixed(2)}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (app) app.cleanup();
        [canvas, btn, like, likeVal].forEach(
          (el) => el && el.parentNode && el.parentNode.removeChild(el)
        );
      }
    },
    "ui"
  );
})();
