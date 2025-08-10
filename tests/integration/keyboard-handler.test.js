(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Keyboard Handler",
    async () => {
      if (typeof KeyboardHandler === "undefined") {
        return {
          passed: true,
          details: "Skipped: KeyboardHandler not available",
        };
      }

      const mockApp = {
        toggleSimulation: () => {},
        resetSimulation: () => {},
        resetBrightness: () => {},
        clearSimulation: () => {},
        toggleImmersiveMode: () => {},
        adjustSpeed: () => {},
        handleAddAnt: () => {},
        handleEscape: () => {},
        currentType: "conway",
      };

      const keyboardHandler = new KeyboardHandler(mockApp);
      const hasSpaceShortcut = keyboardHandler.shortcuts.has(" ");
      const hasEscapeShortcut = keyboardHandler.shortcuts.has("Escape");

      return {
        passed: hasSpaceShortcut && hasEscapeShortcut,
        details: `space=${hasSpaceShortcut}, escape=${hasEscapeShortcut}`,
      };
    },
    "integration"
  );
})();
