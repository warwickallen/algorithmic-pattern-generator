(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Dynamic Colour Scheme",
    async () => {
      const colourScheme = new DynamicColourScheme();
      const hue = colourScheme.getCornerHue("topLeft", 0);
      return { passed: hue === 45, details: `hue=${hue}` };
    },
    "visual"
  );

  runner.addTest(
    "Colour Interpolation",
    async () => {
      const colourScheme = new DynamicColourScheme();
      const colour = colourScheme.getColourAtPosition(
        0,
        0,
        100,
        100,
        80,
        50,
        0
      );
      return { passed: /^rgb\(/.test(colour), details: colour };
    },
    "visual"
  );

  runner.addTest(
    "ColorUtils: basics",
    async () => {
      if (typeof ColorUtils === "undefined") {
        return { passed: true, details: "Skipped: ColorUtils not loaded" };
      }
      const { r, g, b } = ColorUtils.hslToRgb(0, 100, 50);
      const a = ColorUtils.parseColor("#ff0000");
      const bcol = ColorUtils.parseColor("rgb(255,0,0)");
      const interp = ColorUtils.interpolateColor(
        "rgb(0,0,0)",
        "rgb(255,255,255)",
        2
      );
      const ok =
        r === 255 &&
        g === 0 &&
        b === 0 &&
        Array.isArray(a) &&
        a[0] === 255 &&
        Array.isArray(bcol) &&
        bcol[0] === 255 &&
        /^rgb\(255, 255, 255\)$/.test(interp);
      return { passed: ok, details: ok ? "ok" : "fail" };
    },
    "visual"
  );
})();
