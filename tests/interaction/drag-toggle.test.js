(function () {
  if (typeof window === "undefined" || !window.testRunner) return;
  const runner = window.testRunner;

  runner.addTest(
    "Drag Cell Toggle",
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

      const hasDragToggling =
        typeof simulation.initDragToggling === "function" &&
        typeof simulation.handleMouseDown === "function" &&
        typeof simulation.handleMouseMove === "function" &&
        typeof simulation.handleMouseUp === "function";

      const initialCount = simulation.cellCount;
      simulation.toggleCell(50, 50);
      const afterSingleClick = simulation.cellCount;

      simulation.clear();
      const beforeDrag = simulation.cellCount;
      const rect = canvas.getBoundingClientRect();
      const startX = rect.left + 50;
      const startY = rect.top + 50;
      const endX = rect.left + 150;
      const endY = rect.top + 150;

      const mousedownEvent = new MouseEvent("mousedown", {
        clientX: startX,
        clientY: startY,
      });
      const mousemoveEvent = new MouseEvent("mousemove", {
        clientX: endX,
        clientY: endY,
      });
      const mouseupEvent = new MouseEvent("mouseup", {
        clientX: endX,
        clientY: endY,
      });

      simulation.handleMouseDown(mousedownEvent);
      simulation.handleMouseMove(mousemoveEvent);
      simulation.handleMouseUp(mouseupEvent);

      const afterDrag = simulation.cellCount;

      document.body.removeChild(canvas);

      const passed =
        hasDragToggling &&
        afterSingleClick !== initialCount &&
        afterDrag > beforeDrag;
      const details = `Drag toggling: single ${
        afterSingleClick !== initialCount ? "ok" : "fail"
      }, drag ${
        afterDrag > beforeDrag ? "ok" : "fail"
      } (${beforeDrag}→${afterDrag})`;
      return { passed, details };
    },
    "interaction"
  );
})();
