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

  runner.addTest(
    "UI Component Library: create select and manage options",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      const selectEl = document.createElement("select");
      selectEl.id = "uic-test-select";
      document.body.appendChild(selectEl);
      try {
        const select = ui.createSelect({ id: "uic-test-select", value: "a" });
        select.methods.setOptions([
          { value: "a", label: "A" },
          { value: "b", label: "B" },
        ]);
        select.methods.setValue("b");
        const ok = select.methods.getValue() === "b";
        return { passed: ok, details: `value=${select.methods.getValue()}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (selectEl.parentNode) selectEl.parentNode.removeChild(selectEl);
        ui.cleanup && ui.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );

  runner.addTest(
    "UI Component Library: control group layout switch",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      const div = document.createElement("div");
      div.id = "uic-control-group";
      document.body.appendChild(div);
      try {
        const group = ui.createControlGroup("uic-control-group", { layout: "horizontal" });
        group.methods.setLayout("vertical");
        const ok = group.state.layout === "vertical";
        return { passed: ok, details: `layout=${group.state.layout}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (div.parentNode) div.parentNode.removeChild(div);
        ui.cleanup && ui.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );
})();
