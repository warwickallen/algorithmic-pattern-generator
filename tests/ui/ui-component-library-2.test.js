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
    "UI Component Library: factory methods (sliderWithLabel, button group, form group)",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      // DOM for slider + label
      const input = document.createElement("input");
      input.id = "fac-slider";
      input.type = "range";
      const value = document.createElement("span");
      value.id = "fac-slider-value";
      const labelEl = document.createElement("label");
      labelEl.id = "fac-slider-label";
      document.body.appendChild(input);
      document.body.appendChild(value);
      document.body.appendChild(labelEl);
      // DOM for button group and form group containers
      const btn1 = document.createElement("button");
      btn1.id = "btn-1";
      const btn2 = document.createElement("button");
      btn2.id = "btn-2";
      document.body.appendChild(btn1);
      document.body.appendChild(btn2);
      const formSlider = document.createElement("input");
      formSlider.id = "form-slider";
      formSlider.type = "range";
      const formSliderValue = document.createElement("span");
      formSliderValue.id = "form-slider-value";
      document.body.appendChild(formSlider);
      document.body.appendChild(formSliderValue);
      try {
        const { slider, label } = ui.createSliderWithLabel({
          id: "fac-slider",
          valueElementId: "fac-slider-value",
          label: "Speed",
          min: 0,
          max: 100,
          value: 10,
        });
        const sliderOk = !!(slider && label);

        const group = ui.createButtonGroup([
          { id: "btn-1", label: "One" },
          { id: "btn-2", label: "Two" },
        ]);
        const groupOk = group && group.state && group.state.children.length === 2;

        const form = ui.createFormGroup([
          {
            type: "slider",
            id: "form-slider",
            valueElementId: "form-slider-value",
            min: 0,
            max: 100,
            value: 5,
          },
        ]);
        const formOk = form && form.state && form.state.children.length === 1;

        return { passed: sliderOk && groupOk && formOk, details: `slider=${sliderOk}, group=${groupOk}, form=${formOk}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        [input, value, labelEl, btn1, btn2, formSlider, formSliderValue].forEach((el) => {
          if (el && el.parentNode) el.parentNode.removeChild(el);
        });
        ui.cleanup && ui.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );

  runner.addTest(
    "UI Component Library: lifecycle hooks and batch ops",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      const btnEl = document.createElement("button");
      btnEl.id = "uic-life-btn";
      document.body.appendChild(btnEl);
      try {
        const button = ui.createButton({ id: "uic-life-btn", label: "X" });
        // Override hooks to capture calls
        let updates = 0;
        let unmounted = false;
        ui.lifecycleHooks.set(button.id, {
          onUpdate: () => {
            updates += 1;
          },
          onUnmount: () => {
            unmounted = true;
          },
        });
        // Trigger some updates
        button.methods.setText("Y");
        button.methods.press();
        button.methods.release();
        // Batch ops
        ui.hideAllComponents();
        ui.showAllComponents();
        const beforeCleanupUpdates = updates;
        ui.cleanup();
        const ok = beforeCleanupUpdates >= 3 && unmounted === true;
        return {
          passed: ok,
          details: `updates=${beforeCleanupUpdates}, unmounted=${unmounted}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (btnEl.parentNode) btnEl.parentNode.removeChild(btnEl);
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );

  runner.addTest(
    "UI Component Library: modal state and title/content",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      // Build minimal modal structure matching library expectations
      const modal = document.createElement("div");
      modal.id = "uic-modal";
      const header = document.createElement("div");
      header.className = "modal-header";
      const titleEl = document.createElement("h2");
      titleEl.setAttribute("data-modal-title", "");
      header.appendChild(titleEl);
      const body = document.createElement("div");
      body.className = "modal-body";
      const contentEl = document.createElement("div");
      contentEl.setAttribute("data-modal-content", "");
      body.appendChild(contentEl);
      modal.appendChild(header);
      modal.appendChild(body);
      document.body.appendChild(modal);
      try {
        const comp = ui.createModal({
          id: "uic-modal",
          title: "T",
          content: "<p>X</p>",
          closeOnEscape: false,
          backdrop: false,
        });
        const initiallyClosed = comp.state.isOpen === false;
        comp.methods.open();
        const isOpen =
          comp.state.isOpen === true && modal.style.display === "block";
        comp.methods.setTitle("Updated");
        const titleOk = comp.methods.getTitle() === "Updated";
        comp.methods.setContent("<p>Y</p>");
        const contentOk = comp.methods.getContent().includes("Y");
        comp.methods.close();
        const isClosed =
          comp.state.isOpen === false && modal.style.display === "none";
        return {
          passed: initiallyClosed && isOpen && titleOk && contentOk && isClosed,
          details: "modal ok",
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (modal.parentNode) modal.parentNode.removeChild(modal);
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
        const group = ui.createControlGroup("uic-control-group", {
          layout: "horizontal",
        });
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

  runner.addTest(
    "UI Component Library: status display create and set values",
    async () => {
      if (typeof UIComponentLibrary === "undefined") {
        return {
          skip: true,
          details: "Skipped: UIComponentLibrary not available",
        };
      }
      const eventFramework = new EventFramework();
      const ui = new UIComponentLibrary(eventFramework);
      const el = document.createElement("div");
      el.id = "uic-status";
      document.body.appendChild(el);
      try {
        const status = ui.createStatusDisplay({
          id: "uic-status",
          values: { a: 1 },
        });
        status.methods.setValue("b", 2);
        const values = status.methods.getValues();
        const ok = values.a === 1 && values.b === 2;
        return { passed: ok, details: `a=${values.a}, b=${values.b}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        if (el.parentNode) el.parentNode.removeChild(el);
        ui.cleanup && ui.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );
})();
