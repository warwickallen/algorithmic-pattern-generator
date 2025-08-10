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
    "EventHandlerFactory integrates with ControlManager",
    async () => {
      if (
        typeof EventHandlerFactory === "undefined" ||
        typeof ControlManager === "undefined"
      ) {
        return {
          skip: true,
          details: "Skipped: required classes not available",
        };
      }
      const eventFramework = new EventFramework();
      const controlManager = new ControlManager(eventFramework);
      try {
        // Should not throw when registering handlers for a sim type
        controlManager.registerSimulationHandlers("conway", {
          handleSpeedChange: () => {},
          handleRandomPattern: () => {},
          showLearnModal: () => {},
          handleAddAnt: () => {},
          handleTermiteCountChange: () => {},
          setBrightness: () => {},
          setLikelihood: () => {},
        });
        controlManager.cleanup();
        return { passed: true, details: "registration ok" };
      } catch (e) {
        return { passed: false, details: e.message };
      }
    },
    "ui"
  );

  runner.addTest(
    "EventHandlerFactory custom handler and cleanup",
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
        const context = { value: 7 };
        const baseFn = function (x) {
          return this.value + x;
        };
        const handler = factory.createCustomHandler("sum", context, baseFn);
        const customOk = typeof handler === "function" && handler(5) === 12;
        // Register and then cleanup
        factory.createSimulationHandlers("conway", {
          handleSpeedChange: () => {},
          handleRandomPattern: () => {},
          showLearnModal: () => {},
          handleAddAnt: () => {},
          handleTermiteCountChange: () => {},
          setBrightness: () => {},
          setLikelihood: () => {},
        });
        const hadHandlers = factory.hasRegisteredHandlers("conway");
        factory.cleanup();
        const cleaned = !factory.hasRegisteredHandlers("conway");
        return {
          passed: customOk && hadHandlers && cleaned,
          details: `custom=${customOk}, registered=${hadHandlers}, cleaned=${cleaned}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        eventFramework.cleanup && eventFramework.cleanup();
      }
    },
    "ui"
  );

  runner.addTest(
    "EventHandlerFactory control setup binds DOM to handlers",
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
        // Create a speed slider and likelihood slider DOM
        const speed = document.createElement("input");
        speed.type = "range";
        speed.id = "ehf-speed";
        const speedVal = document.createElement("span");
        speedVal.id = "ehf-speed-val";
        const like = document.createElement("input");
        like.type = "range";
        like.id = "ehf-likelihood";
        const likeVal = document.createElement("span");
        likeVal.id = "ehf-like-val";
        document.body.appendChild(speed);
        document.body.appendChild(speedVal);
        document.body.appendChild(like);
        document.body.appendChild(likeVal);

        let speedChanged = 0;
        let likeChanged = 0;
        const handlers = {
          speedChange: () => {
            speedChanged += 1;
          },
          likelihoodChange: () => {
            likeChanged += 1;
          },
        };

        factory.setupSlider(
          {
            id: "ehf-speed",
            valueElementId: "ehf-speed-val",
            format: (v) => `${v}`,
          },
          handlers
        );
        factory.setupSlider(
          {
            id: "ehf-likelihood",
            valueElementId: "ehf-like-val",
            format: (v) => `${v}%`,
          },
          handlers
        );

        speed.value = "15";
        speed.dispatchEvent(new Event("change"));
        like.value = "40";
        like.dispatchEvent(new Event("change"));

        await new Promise((r) => setTimeout(r, 30));

        const ok = speedChanged > 0 && likeChanged > 0;
        return {
          passed: ok,
          details: `speed=${speedChanged}, like=${likeChanged}`,
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
