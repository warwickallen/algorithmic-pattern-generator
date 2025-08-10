(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "EventHandlerFactory constructs and holds templates",
    async () => {
      if (typeof EventHandlerFactory === "undefined") {
        return {
          skip: true,
          details: "Skipped: EventHandlerFactory not available",
        };
      }
      const eventFramework = new EventFramework();
      const factory = new EventHandlerFactory(eventFramework);
      try {
        const hasTemplates =
          factory.handlerTemplates instanceof Map &&
          factory.handlerTemplates.size >= 0;
        const hasRegisteredEmpty =
          factory.registeredHandlers instanceof Map &&
          factory.registeredHandlers.size === 0;
        return {
          passed: hasTemplates && hasRegisteredEmpty,
          details: `templates=${hasTemplates}, registeredEmpty=${hasRegisteredEmpty}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        factory.cleanup && factory.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );

  runner.addTest(
    "EventHandlerFactory creates simulation handlers",
    async () => {
      if (typeof EventHandlerFactory === "undefined") {
        return {
          skip: true,
          details: "Skipped: EventHandlerFactory not available",
        };
      }
      const eventFramework = new EventFramework();
      const factory = new EventHandlerFactory(eventFramework);
      try {
        const mockApp = {
          handleSpeedChange: () => {},
          handleRandomPattern: () => {},
          showLearnModal: () => {},
          handleAddAnt: () => {},
          handleTermiteCountChange: () => {},
          setBrightness: () => {},
          setLikelihood: () => {},
        };
        const handlers = factory.createSimulationHandlers("conway", mockApp);
        const ok = [
          typeof handlers.speedChange,
          typeof handlers.randomPattern,
          typeof handlers.showLearnModal,
          typeof handlers.addAnt,
          typeof handlers.termiteCountChange,
          typeof handlers.brightnessChange,
          typeof handlers.likelihoodChange,
        ].every((t) => t === "function");
        const registered = factory.hasRegisteredHandlers("conway");
        return {
          passed: ok && registered,
          details: `ok=${ok}, registered=${registered}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        factory.cleanup && factory.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );

  runner.addTest(
    "EventHandlerFactory slider/button handler creation",
    async () => {
      if (typeof EventHandlerFactory === "undefined") {
        return {
          skip: true,
          details: "Skipped: EventHandlerFactory not available",
        };
      }
      const eventFramework = new EventFramework();
      const factory = new EventHandlerFactory(eventFramework);
      try {
        // DOM elements for slider and button
        const slider = document.createElement("input");
        slider.type = "range";
        slider.id = "test-speed-slider";
        const value = document.createElement("span");
        value.id = "test-speed-value";
        const btn = document.createElement("button");
        btn.id = "test-random-btn";
        document.body.appendChild(slider);
        document.body.appendChild(value);
        document.body.appendChild(btn);

        const handlers = {
          speedChange: () => {},
          brightnessChange: () => {},
          likelihoodChange: () => {},
          termiteCountChange: () => {},
          randomPattern: () => {},
          showLearnModal: () => {},
          addAnt: () => {},
        };

        const sliderConfig = {
          id: "test-speed-slider",
          valueElementId: "test-speed-value",
          format: (v) => `${v} steps/s`,
        };
        const buttonConfig = { id: "test-random-btn" };

        const inputHandler = factory.createSliderInputHandler(
          sliderConfig,
          handlers
        );
        const changeHandler = factory.createSliderChangeHandler(
          sliderConfig,
          handlers
        );
        const clickHandler = factory.createButtonClickHandler(
          buttonConfig,
          handlers
        );

        const ok =
          typeof inputHandler === "function" &&
          typeof changeHandler === "function" &&
          typeof clickHandler === "function";

        return { passed: ok, details: `created=${ok}` };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        factory.cleanup && factory.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );
})();
