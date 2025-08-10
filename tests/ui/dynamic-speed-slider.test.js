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
    "ui"
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
    "ui"
  );
})();
