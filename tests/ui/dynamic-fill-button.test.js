(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  function ensureFillButtonDom() {
    let btn = document.getElementById("dynamic-fill-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "dynamic-fill-btn";
      btn.style.display = "none";
      document.body.appendChild(btn);
    }
    return btn;
  }

  runner.addTest(
    "Dynamic Fill Button Exists and Initializes",
    async () => {
      if (typeof DynamicFillButton === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicFillButton not available",
        };
      }
      const button = ensureFillButtonDom();
      const eventFramework = new EventFramework();
      const dynamicFillButton = new DynamicFillButton(eventFramework);
      try {
        dynamicFillButton.init();
        return {
          passed: !!button && dynamicFillButton.isInitialized === true,
          details: "button present and initialized",
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicFillButton.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        if (button && button.parentNode) button.parentNode.removeChild(button);
      }
    },
    "ui"
  );

  runner.addTest(
    "Dynamic Fill Button Click Calls Handler",
    async () => {
      if (typeof DynamicFillButton === "undefined") {
        return {
          skip: true,
          details: "Skipped: DynamicFillButton not available",
        };
      }
      const button = ensureFillButtonDom();
      const eventFramework = new EventFramework();
      const dynamicFillButton = new DynamicFillButton(eventFramework);
      try {
        let called = false;
        let simType = null;
        const mockApp = {
          handleRandomPattern: (t) => {
            called = true;
            simType = t;
          },
        };
        dynamicFillButton.init();
        dynamicFillButton.switchToSimulation("conway", mockApp);
        button.click();
        return {
          passed: called && simType === "conway",
          details: `called=${called}, type=${simType}`,
        };
      } catch (e) {
        return { passed: false, details: e.message };
      } finally {
        dynamicFillButton.cleanup();
        eventFramework.cleanup && eventFramework.cleanup();
        if (button && button.parentNode) button.parentNode.removeChild(button);
      }
    },
    "ui"
  );
})();
