(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Shared Components: createSlider",
    async () => {
      if (typeof document === "undefined") {
        return { passed: true, details: "Skipped: no DOM" };
      }
      const wrapper = document.createElement("div");
      const input = document.createElement("input");
      input.type = "range";
      input.id = "test-slider";
      const value = document.createElement("span");
      value.id = "test-slider-value";
      wrapper.appendChild(input);
      wrapper.appendChild(value);
      document.body.appendChild(wrapper);
      try {
        const slider = SharedComponents.createSlider({
          id: "test-slider",
          min: 0,
          max: 100,
          value: 50,
          label: "Test",
        });
        return {
          passed: !!(slider && slider.element && slider.range),
          details: "slider ok",
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        document.body.removeChild(wrapper);
      }
    },
    "ui.components"
  );

  runner.addTest(
    "Element Cache",
    async () => {
      const cache = PerformanceOptimizer.createElementCache();
      // In old suite, #test-canvas existed in DOM. In new suite, it may not.
      // If missing, create a temporary element to validate caching behaviour.
      let temp = null;
      if (!document.getElementById("test-canvas")) {
        temp = document.createElement("canvas");
        temp.id = "test-canvas";
        document.body.appendChild(temp);
      }
      try {
        const el = cache.get("#test-canvas");
        return {
          passed: !!el,
          details: el ? "element cache returns a value" : "not found",
        };
      } finally {
        if (temp && temp.parentNode) temp.parentNode.removeChild(temp);
      }
    },
    "ui.components"
  );

  runner.addTest(
    "Event Listener Manager",
    async () => {
      const manager = PerformanceOptimizer.createEventListenerManager();
      let fired = false;
      const canvas = document.createElement("button");
      const handler = () => {
        fired = true;
      };
      manager.add(canvas, "click", handler);
      canvas.click();
      return { passed: fired === true, details: "listener fired" };
    },
    "ui.components"
  );
})();
