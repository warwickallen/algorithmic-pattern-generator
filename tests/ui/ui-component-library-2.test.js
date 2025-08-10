(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "UI Component Library: basic constructor and default configs",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      try {
        const basics =
          ui.components instanceof Map &&
          ui.lifecycleHooks instanceof Map &&
          ui.componentTypes instanceof Set &&
          ui.defaultConfigs instanceof Map;
        const hasDefaults = [
          "slider",
          "button",
          "select",
          "controlGroup",
          "statusDisplay",
          "modal",
          "label",
          "container",
        ].every((k) => ui.defaultConfigs.has(k));
        return {
          passed: basics && hasDefaults,
          details: `basics=${basics}, defaults=${hasDefaults}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        ui.cleanup && ui.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );

  runner.addTest(
    "UI Component Library: create slider updates value element",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      const input = document.createElement("input");
      input.id = "uic-test-slider";
      input.type = "range";
      const value = document.createElement("span");
      value.id = "uic-test-slider-value";
      document.body.appendChild(input);
      document.body.appendChild(value);
      try {
        const slider = ui.createSlider({
          id: "uic-test-slider",
          valueElementId: "uic-test-slider-value",
          min: 0,
          max: 100,
          value: 10,
          format: (v) => `${v}%`,
        });
        slider.methods.setValue(25);
        const ok = value.textContent?.includes("25");
        return { passed: !!ok, details: `valueEl=${value.textContent}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (input.parentNode) input.parentNode.removeChild(input);
        if (value.parentNode) value.parentNode.removeChild(value);
        ui.cleanup && ui.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );
})();
