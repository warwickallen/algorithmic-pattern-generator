(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "ControlVisibilityManager Initialization",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return { passed: true, details: "Skipped: ControlVisibilityManager not available" };
      }
      const visibilityManager = new ControlVisibilityManager();
      visibilityManager.init();
      const isInitialized = visibilityManager.isInitialized;
      const hasControlGroups = visibilityManager.controlGroups.size > 0;
      const hasVisibilityStates = visibilityManager.visibilityStates.size > 0;
      visibilityManager.cleanup();
      return { passed: isInitialized && hasControlGroups && hasVisibilityStates, details: `init=${isInitialized}, groups=${hasControlGroups}, states=${hasVisibilityStates}` };
    },
    "ui"
  );

  runner.addTest(
    "ControlVisibilityManager CSS Classes",
    async () => {
      if (typeof ControlVisibilityManager === "undefined") {
        return { passed: true, details: "Skipped: ControlVisibilityManager not available" };
      }
      const visibilityManager = new ControlVisibilityManager();
      visibilityManager.init();
      const styleElement = document.getElementById("control-visibility-styles");
      const hasStyles = !!styleElement && styleElement.textContent.includes("control-group[data-simulation]");
      visibilityManager.cleanup();
      return { passed: hasStyles, details: `styles=${hasStyles}` };
    },
    "ui"
  );
})();


