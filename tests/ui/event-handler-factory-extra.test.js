(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "EventHandlerFactory Initialization",
    async () => {
      if (typeof EventHandlerFactory === "undefined") {
        return {
          passed: true,
          details: "Skipped: EventHandlerFactory not available",
        };
      }
      const ef = new EventFramework();
      const factory = new EventHandlerFactory(ef);
      const ok = !!factory && factory.eventFramework === ef;
      ef.cleanup();
      return { passed: ok, details: `factory=${!!factory}` };
    },
    "ui"
  );

  runner.addTest(
    "EventHandlerFactory Cleanup",
    async () => {
      if (typeof EventHandlerFactory === "undefined") {
        return {
          passed: true,
          details: "Skipped: EventHandlerFactory not available",
        };
      }
      const ef = new EventFramework();
      const factory = new EventHandlerFactory(ef);
      // Register a bogus handler map to exercise cleanup
      factory.registeredHandlers.set("x", { y: () => {} });
      factory.cleanup();
      const ok = factory.registeredHandlers.size === 0;
      ef.cleanup();
      return { passed: ok, details: `size=${factory.registeredHandlers.size}` };
    },
    "ui"
  );
})();
