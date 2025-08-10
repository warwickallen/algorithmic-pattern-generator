(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Drag Coordinate Fix",
    async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");

      canvas.style.position = "absolute";
      canvas.style.left = "-9999px";
      document.body.appendChild(canvas);

      const simulation = new ConwayGameOfLife(canvas, ctx);
      simulation.init();

      simulation.clear();
      const beforeHorizontal = simulation.cellCount;
      const rect = canvas.getBoundingClientRect();
      const horizontalDown = new MouseEvent("mousedown", {
        clientX: rect.left + 50,
        clientY: rect.top + 100,
      });
      const horizontalMove = new MouseEvent("mousemove", {
        clientX: rect.left + 150,
        clientY: rect.top + 100,
      });
      const horizontalUp = new MouseEvent("mouseup", {
        clientX: rect.left + 150,
        clientY: rect.top + 100,
      });
      simulation.handleMouseDown(horizontalDown);
      simulation.handleMouseMove(horizontalMove);
      simulation.handleMouseUp(horizontalUp);
      const afterHorizontal = simulation.cellCount;

      simulation.clear();
      const beforeVertical = simulation.cellCount;
      const verticalDown = new MouseEvent("mousedown", {
        clientX: rect.left + 100,
        clientY: rect.top + 50,
      });
      const verticalMove = new MouseEvent("mousemove", {
        clientX: rect.left + 100,
        clientY: rect.top + 150,
      });
      const verticalUp = new MouseEvent("mouseup", {
        clientX: rect.left + 100,
        clientY: rect.top + 150,
      });
      simulation.handleMouseDown(verticalDown);
      simulation.handleMouseMove(verticalMove);
      simulation.handleMouseUp(verticalUp);
      const afterVertical = simulation.cellCount;

      document.body.removeChild(canvas);

      const horizontalWorks = afterHorizontal > beforeHorizontal;
      const verticalWorks = afterVertical > beforeVertical;
      return {
        passed: horizontalWorks && verticalWorks,
        details: `horizontal ${beforeHorizontal}→${afterHorizontal}, vertical ${beforeVertical}→${afterVertical}`,
      };
    },
    "interaction"
  );
})();
