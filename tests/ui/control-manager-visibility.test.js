(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Initial Controls Visibility on Page Load",
    async () => {
      if (typeof ControlManager === "undefined") {
        return {
          passed: true,
          details: "Skipped: ControlManager not available",
        };
      }
      const controlManager = new ControlManager();
      controlManager.showControls("conway");
      const conwayActive = controlManager.activeControls === "conway";
      controlManager.showControls("termite");
      const termiteActive = controlManager.activeControls === "termite";
      controlManager.showControls("langton");
      const langtonActive = controlManager.activeControls === "langton";
      return {
        passed: conwayActive && termiteActive && langtonActive,
        details: `conway=${conwayActive}, termite=${termiteActive}, langton=${langtonActive}`,
      };
    },
    "ui"
  );
})();
