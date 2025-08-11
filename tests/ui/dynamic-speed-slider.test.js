(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  function createSpeedSliderDom() {
    const container = document.createElement("div");
    container.className = "speed-control";
    const group = document.createElement("div");
    group.className = "control-group";
    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = "dynamic-speed-slider";
    slider.min = "1";
    slider.max = "60";
    slider.value = "30";
    const valueEl = document.createElement("span");
    valueEl.id = "dynamic-speed-value";
    valueEl.textContent = "30 steps/s";
    group.appendChild(slider);
    group.appendChild(valueEl);
    container.appendChild(group);
    document.body.appendChild(container);
    return { container, slider, valueEl };
  }

  runner.addTest(
    "Dynamic Speed Slider Initialization",
    async () => {
      if (typeof DynamicSpeedSlider === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicSpeedSlider not available",
        };
      }
      try {
        const { container } = createSpeedSliderDom();
        const eventFramework = new EventFramework();
        const dynamicSpeedSlider = new DynamicSpeedSlider(eventFramework);

        const elementsExist = !!(
          document.getElementById("dynamic-speed-slider") &&
          document.getElementById("dynamic-speed-value") &&
          document.querySelector(".speed-control .control-group")
        );
        const isInitialized = dynamicSpeedSlider.isInitialized === true;

        dynamicSpeedSlider.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        container.parentNode && container.parentNode.removeChild(container);

        return {
          passed: elementsExist && isInitialized,
          details: `elements=${elementsExist}, initialized=${isInitialized}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      }
    },
    "ui.controls"
  );

  runner.addTest(
    "Dynamic Speed Slider Event Handling",
    async () => {
      if (typeof DynamicSpeedSlider === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicSpeedSlider not available",
        };
      }
      const { container, slider } = createSpeedSliderDom();
      const eventFramework = new EventFramework();
      const dynamicSpeedSlider = new DynamicSpeedSlider(eventFramework);
      try {
        let speedChangeCount = 0;
        let lastSpeedValue = null;
        const mockApp = {
          currentSimulation: { speed: 30 },
          handleSpeedChange: (_simType, value) => {
            speedChangeCount += 1;
            lastSpeedValue = value;
          },
        };

        dynamicSpeedSlider.switchToSimulation("conway", mockApp);

        // Change event (debounced handler)
        slider.value = "20";
        slider.dispatchEvent(new Event("change"));
        await new Promise((r) => setTimeout(r, 160));

        // Input event (immediate display update)
        slider.value = "30";
        slider.dispatchEvent(new Event("input"));

        const displayUpdated =
          document.getElementById("dynamic-speed-value").textContent ===
          "30 steps/s";
        const speedChangeHandled =
          speedChangeCount > 0 && lastSpeedValue === 20;

        return {
          passed: speedChangeHandled && displayUpdated,
          details: `handled=${speedChangeHandled}, display=${displayUpdated}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicSpeedSlider.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        container.parentNode && container.parentNode.removeChild(container);
      }
    },
    "ui.controls"
  );

  runner.addTest(
    "Dynamic Speed Slider Simulation Switching",
    async () => {
      if (typeof DynamicSpeedSlider === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicSpeedSlider not available",
        };
      }
      const { container } = createSpeedSliderDom();
      const eventFramework = new EventFramework();
      const dynamicSpeedSlider = new DynamicSpeedSlider(eventFramework);
      try {
        const mockApp = {
          handleSpeedChange: () => {},
          currentSimulation: { speed: 30 },
        };
        dynamicSpeedSlider.switchToSimulation("conway", mockApp);
        const conwayActive = dynamicSpeedSlider.currentSimType === "conway";
        const visible =
          document.querySelector(".speed-control .control-group").style
            .display === "block";

        dynamicSpeedSlider.switchToSimulation("termite", mockApp);
        const termiteActive = dynamicSpeedSlider.currentSimType === "termite";

        dynamicSpeedSlider.switchToSimulation("langton", mockApp);
        const langtonActive = dynamicSpeedSlider.currentSimType === "langton";

        return {
          passed: conwayActive && termiteActive && langtonActive && visible,
          details: `conway=${conwayActive}, termite=${termiteActive}, langton=${langtonActive}, visible=${visible}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicSpeedSlider.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        container.parentNode && container.parentNode.removeChild(container);
      }
    },
    "ui.controls"
  );

  runner.addTest(
    "Dynamic Speed Slider Speed Adjustment",
    async () => {
      if (typeof DynamicSpeedSlider === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicSpeedSlider not available",
        };
      }
      const { container } = createSpeedSliderDom();
      const eventFramework = new EventFramework();
      const dynamicSpeedSlider = new DynamicSpeedSlider(eventFramework);
      try {
        const mockApp = {
          handleSpeedChange: () => {},
          currentSimulation: { speed: 30 },
        };
        dynamicSpeedSlider.switchToSimulation("conway", mockApp);
        dynamicSpeedSlider.setValue(30);
        dynamicSpeedSlider.adjustSpeed(1);
        const up = dynamicSpeedSlider.getValue() === 31;
        dynamicSpeedSlider.adjustSpeed(-1);
        const down = dynamicSpeedSlider.getValue() === 30;
        dynamicSpeedSlider.setValue(1);
        dynamicSpeedSlider.adjustSpeed(-1);
        const minBoundary = dynamicSpeedSlider.getValue() === 1;
        dynamicSpeedSlider.setValue(60);
        dynamicSpeedSlider.adjustSpeed(1);
        const maxBoundary = dynamicSpeedSlider.getValue() === 60;
        return {
          passed: up && down && minBoundary && maxBoundary,
          details: `up=${up}, down=${down}, min=${minBoundary}, max=${maxBoundary}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicSpeedSlider.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        container.parentNode && container.parentNode.removeChild(container);
      }
    },
    "ui.controls"
  );

  runner.addTest(
    "Dynamic Speed Slider Hide/Show",
    async () => {
      if (typeof DynamicSpeedSlider === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicSpeedSlider not available",
        };
      }
      const { container } = createSpeedSliderDom();
      const eventFramework = new EventFramework();
      const dynamicSpeedSlider = new DynamicSpeedSlider(eventFramework);
      try {
        const mockApp = {
          handleSpeedChange: () => {},
          currentSimulation: { speed: 30 },
        };
        dynamicSpeedSlider.switchToSimulation("conway", mockApp);
        const visible =
          document.querySelector(".speed-control .control-group").style
            .display === "block";
        dynamicSpeedSlider.hide();
        const hidden =
          document.querySelector(".speed-control .control-group").style
            .display === "none";
        return {
          passed: visible && hidden,
          details: `visible=${visible}, hidden=${hidden}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicSpeedSlider.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        container.parentNode && container.parentNode.removeChild(container);
      }
    },
    "ui.controls"
  );

  runner.addTest(
    "Dynamic Speed Slider Global Value",
    async () => {
      if (typeof DynamicSpeedSlider === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicSpeedSlider not available",
        };
      }
      const { container } = createSpeedSliderDom();
      const eventFramework = new EventFramework();
      const dynamicSpeedSlider = new DynamicSpeedSlider(eventFramework);
      try {
        const mockApp = {
          handleSpeedChange: () => {},
          currentSimulation: { speed: 30 },
        };
        dynamicSpeedSlider.switchToSimulation("conway", mockApp);
        dynamicSpeedSlider.setValue(22);
        dynamicSpeedSlider.switchToSimulation("termite", mockApp);
        const tVal = dynamicSpeedSlider.getValue();
        dynamicSpeedSlider.switchToSimulation("langton", mockApp);
        const lVal = dynamicSpeedSlider.getValue();
        const passed = tVal === 22 && lVal === 22;
        return { passed, details: `termite=${tVal}, langton=${lVal}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicSpeedSlider.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        container.parentNode && container.parentNode.removeChild(container);
      }
    },
    "ui.controls"
  );
})();
