(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Element Cache",
    async () => {
      const cache = PerformanceOptimizer.createElementCache();
      // Create a temp canvas if not present, to match old suite behaviour
      let temp = null;
      if (!document.getElementById("test-canvas")) {
        temp = document.createElement("canvas");
        temp.id = "test-canvas";
        document.body.appendChild(temp);
      }
      try {
        const el = cache.get("#test-canvas");
        return { passed: !!el, details: el ? "element cached" : "not found" };
      } finally {
        if (temp && temp.parentNode) temp.parentNode.removeChild(temp);
      }
    },
    "ui.misc"
  );
})();
