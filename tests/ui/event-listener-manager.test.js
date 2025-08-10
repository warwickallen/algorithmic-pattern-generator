(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Event Listener Manager",
    async () => {
      const manager = PerformanceOptimizer.createEventListenerManager();
      let fired = false;
      const el = document.createElement("button");
      const handler = () => {
        fired = true;
      };
      manager.add(el, "click", handler);
      el.click();
      return { passed: fired === true, details: "listener fired" };
    },
    "ui"
  );
})();


