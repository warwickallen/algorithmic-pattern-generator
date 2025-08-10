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
})();
