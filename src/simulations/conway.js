(function () {
  if (typeof window === "undefined") return;
  if (typeof window.registerSimulation !== "function") return;

  class ConwayGameOfLife extends BaseSimulation {
    constructor(canvas, ctx) {
      super(canvas, ctx, "conway");
      this.initGrid();
    }

    initGrid() {
      this.grid = this.createGrid(this.rows, this.cols, false);
      this.nextGrid = this.createGrid(this.rows, this.cols, false);
      this.randomizeGrid(this.grid);
    }

    reset() {
      super.reset();
      this.initGrid();
    }

    update() {
      const rows = this.rows;
      const cols = this.cols;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const alive = this.grid[row][col];
          const neighbours = this.countNeighbours(
            this.grid,
            row,
            col,
            rows,
            cols,
            true
          );
          if (alive) {
            this.nextGrid[row][col] = neighbours === 2 || neighbours === 3;
          } else {
            this.nextGrid[row][col] = neighbours === 3;
          }
        }
      }
      this.swapGrids({ current: this.grid, next: this.nextGrid });
      this.cellCount = this.countLiveCells(this.grid);
      this.generation++;
    }

    draw() {
      this.drawGrid(this.grid);
    }

    toggleCell(x, y) {
      const { col, row } = this.screenToGrid(x, y);
      if (this.isValidGridPosition(row, col)) {
        this.grid[row][col] = !this.grid[row][col];
        this.cellCount = this.countLiveCells(this.grid);
      }
    }
  }

  const plugin = {
    id: "conway",
    apiVersion: "1.0.0",
    displayNameKey: "simulation.conway",
    ui: { learnModalKey: "learn.conway" },
    defaults: { speed: 30, cellSize: 10 },
    capabilities: { gridBased: true },
    create(canvas, ctx) {
      return new ConwayGameOfLife(canvas, ctx);
    },
  };

  window.registerSimulation(plugin);
})();
