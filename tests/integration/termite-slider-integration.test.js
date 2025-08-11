(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Termite Slider Integration",
    async () => {
      if (typeof AlgorithmicPatternGenerator === "undefined") {
        return { skip: true, details: "Skipped: app not available" };
      }

      // Minimal DOM required by the app and the termite slider
      const canvas = document.createElement("canvas");
      canvas.id = "canvas";
      canvas.width = 120;
      canvas.height = 80;
      document.body.appendChild(canvas);

      const slider = document.createElement("input");
      slider.type = "range";
      slider.id = "termites-slider";
      slider.min = "10";
      slider.max = "100";
      slider.value = "25";
      const valueEl = document.createElement("span");
      valueEl.id = "termites-value";
      document.body.appendChild(slider);
      document.body.appendChild(valueEl);

      let app = null;
      try {
        app = new AlgorithmicPatternGenerator();

        // Switch to termite so handler is effective
        app.switchSimulation("termite");

        // Dispatch change (debounced in factory)
        slider.value = "25";
        slider.dispatchEvent(new Event("change"));
        await new Promise((r) => setTimeout(r, 30));

        const termitesCount = app.currentSimulation?.termites?.length || 0;
        const valueUpdated = (valueEl.textContent || "").includes("25");

        return {
          passed: termitesCount === 25 && valueUpdated,
          details: `termites=${termitesCount}, valueUpdated=${valueUpdated}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (app) app.cleanup();
        [slider, valueEl, canvas].forEach((el) => {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        });
      }
    },
    "integration"
  );
})();


