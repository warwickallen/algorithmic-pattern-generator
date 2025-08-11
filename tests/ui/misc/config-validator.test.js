(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "ConfigValidator: validates slider schema",
    async () => {
      if (typeof ConfigValidator === "undefined") {
        return { passed: true, details: "Skipped: ConfigValidator not loaded" };
      }
      const good = {
        type: "slider",
        id: "x",
        valueElementId: "y",
        min: 0,
        max: 10,
        step: 1,
        value: 5,
        label: "Label",
      };
      const bad = {
        type: "slider",
        id: "x",
        min: 0,
        max: 10,
        step: 1,
        value: 20,
        label: "L",
      };
      const ok = ConfigValidator.validate("slider", good).valid;
      const notOk = !ConfigValidator.validate("slider", bad).valid;
      return { passed: ok && notOk, details: `ok=${ok}, notOk=${notOk}` };
    },
    "ui.misc"
  );
})();
