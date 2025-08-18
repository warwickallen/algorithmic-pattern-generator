// Dynamic colour scheme implementation based on four-corner hue rotation
class DynamicColourScheme {
  constructor() {
    // Corner configurations from the YAML specification
    this.corners = {
      topLeft: { startHue: 45, period: 60000 }, // 60 seconds
      topRight: { startHue: 135, period: 75000 }, // 75 seconds
      bottomRight: { startHue: 225, period: 90000 }, // 90 seconds
      bottomLeft: { startHue: 315, period: 105000 }, // 105 seconds
    };

    this.startTime = Date.now();
  }

  // Get current hue for a specific corner
  getCornerHue(corner, currentTime = Date.now()) {
    const config = this.corners[corner];

    // For static rendering (currentTime = 0), use the starting hue directly
    if (currentTime === 0) {
      return config.startHue;
    }

    const elapsed = currentTime - this.startTime;
    const hue = (config.startHue + (elapsed / config.period) * 360) % 360;
    return hue;
  }

  // Get interpolated hue for any position on the canvas
  getHueAtPosition(x, y, canvasWidth, canvasHeight, currentTime = null) {
    // Clamp position to canvas bounds
    const clampedX = Math.max(0, Math.min(x, canvasWidth));
    const clampedY = Math.max(0, Math.min(y, canvasHeight));

    // Normalize position to 0-1 range
    const normX = clampedX / canvasWidth;
    const normY = clampedY / canvasHeight;

    // For static rendering, use starting hues directly
    if (currentTime === null) {
      const topLeftHue = this.corners.topLeft.startHue;
      const topRightHue = this.corners.topRight.startHue;
      const bottomRightHue = this.corners.bottomRight.startHue;
      const bottomLeftHue = this.corners.bottomLeft.startHue;

      // Use proper bilinear interpolation with circular hue handling
      return this.getBilinearHue(
        normX,
        normY,
        topLeftHue,
        topRightHue,
        bottomRightHue,
        bottomLeftHue
      );
    }

    // For dynamic rendering, use time-based hues
    const topLeftHue = this.getCornerHue("topLeft", currentTime);
    const topRightHue = this.getCornerHue("topRight", currentTime);
    const bottomRightHue = this.getCornerHue("bottomRight", currentTime);
    const bottomLeftHue = this.getCornerHue("bottomLeft", currentTime);

    // Use proper bilinear interpolation with circular hue handling
    return this.getBilinearHue(
      normX,
      normY,
      topLeftHue,
      topRightHue,
      bottomRightHue,
      bottomLeftHue
    );
  }

  // Get hue using proper bilinear interpolation with circular hue handling
  getBilinearHue(
    normX,
    normY,
    topLeftHue,
    topRightHue,
    bottomRightHue,
    bottomLeftHue
  ) {
    // Convert all hues to unit vectors on the colour wheel
    const topLeftVector = this.hueToVector(topLeftHue);
    const topRightVector = this.hueToVector(topRightHue);
    const bottomRightVector = this.hueToVector(bottomRightHue);
    const bottomLeftVector = this.hueToVector(bottomLeftHue);

    // Interpolate vectors instead of angles
    const topVector = this.interpolateVector(
      topLeftVector,
      topRightVector,
      normX
    );
    const bottomVector = this.interpolateVector(
      bottomLeftVector,
      bottomRightVector,
      normX
    );
    const finalVector = this.interpolateVector(topVector, bottomVector, normY);

    // Convert back to hue
    return this.vectorToHue(finalVector);
  }

  // Convert hue to unit vector on the colour wheel
  hueToVector(hue) {
    const angle = (hue * Math.PI) / 180;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
  }

  // Convert unit vector back to hue
  vectorToHue(vector) {
    let angle = Math.atan2(vector.y, vector.x);
    let hue = (angle * 180) / Math.PI;

    // Normalize to 0-360 range
    hue = ((hue % 360) + 360) % 360;

    return hue;
  }

  // Interpolate between two unit vectors
  interpolateVector(v1, v2, factor) {
    // Linear interpolation of vector components
    const x = v1.x + (v2.x - v1.x) * factor;
    const y = v1.y + (v2.y - v1.y) * factor;

    // Normalize to unit vector
    const length = Math.sqrt(x * x + y * y);
    if (length > 0) {
      return {
        x: x / length,
        y: y / length,
      };
    } else {
      // If vectors are opposite, choose one based on factor
      return factor < 0.5 ? v1 : v2;
    }
  }

  // Interpolate between two hues, handling the circular nature of hue
  interpolateHue(hue1, hue2, factor) {
    // Normalize hues to 0-360 range
    hue1 = ((hue1 % 360) + 360) % 360;
    hue2 = ((hue2 % 360) + 360) % 360;

    // Calculate the shortest path around the colour wheel
    let diff = hue2 - hue1;

    // If the difference is greater than 180 degrees, go the other way
    if (diff > 180) {
      diff -= 360;
    } else if (diff < -180) {
      diff += 360;
    }

    // Interpolate along the shortest path
    let result = hue1 + diff * factor;

    // Normalize the result to 0-360 range
    result = ((result % 360) + 360) % 360;

    return result;
  }

  // Convert HSL to RGB using shared utility
  hslToRgb(h, s, l) {
    if (typeof ColorUtils !== "undefined") {
      return ColorUtils.hslToRgb(h, s, l);
    }
    // Fallback (should not be used when utils loaded)
    const [r, g, b] = (function (hh, ss, ll) {
      hh /= 360;
      ss /= 100;
      ll /= 100;
      const c = (1 - Math.abs(2 * ll - 1)) * ss;
      const x = c * (1 - Math.abs(((hh * 6) % 2) - 1));
      const m = ll - c / 2;
      let r, g, b;
      if (hh < 1 / 6) {
        r = c;
        g = x;
        b = 0;
      } else if (hh < 2 / 6) {
        r = x;
        g = c;
        b = 0;
      } else if (hh < 3 / 6) {
        r = 0;
        g = c;
        b = x;
      } else if (hh < 4 / 6) {
        r = 0;
        g = x;
        b = c;
      } else if (hh < 5 / 6) {
        r = x;
        g = 0;
        b = c;
      } else {
        r = c;
        g = 0;
        b = x;
      }
      return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
      ];
    })(h, s, l);
    return { r, g, b };
  }

  // Get RGB colour for a position with specified saturation and lightness
  getColourAtPosition(
    x,
    y,
    canvasWidth,
    canvasHeight,
    saturation = 80,
    lightness = 50,
    currentTime = null
  ) {
    const hue = this.getHueAtPosition(
      x,
      y,
      canvasWidth,
      canvasHeight,
      currentTime
    );
    const rgb = this.hslToRgb(hue, saturation, lightness);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }
}

// Conway's Game of Life
class ConwayGameOfLife extends BaseSimulation {
  constructor(canvas, ctx) {
    super(canvas, ctx, "conway");
    this.grids = null;
    this.speed = 30; // FPS for simulation speed
    this.lastUpdateTime = 0;
    this.updateInterval = 1000 / this.speed; // milliseconds between updates

    // Register serializer for grid state preservation
    this.stateManager.registerSerializer({
      capture: (sim) => {
        const extra = {};
        if (sim.grids) {
          extra.grids = {
            current: sim.grids.current.map((row) => [...row]),
            next: sim.grids.next.map((row) => [...row]),
          };
        }
        return extra;
      },
      restore: (sim, state) => {
        if (state.grids) {
          const oldCurrent = state.grids.current;
          const oldNext = state.grids.next;
          // Recreate grids for current dimensions
          sim.initGrids();
          const minRows = Math.min(oldCurrent.length, sim.rows);
          const minCols = Math.min(oldCurrent[0]?.length || 0, sim.cols);
          for (let row = 0; row < minRows; row++) {
            for (let col = 0; col < minCols; col++) {
              sim.grids.current[row][col] = oldCurrent[row][col];
              sim.grids.next[row][col] = oldNext[row][col];
            }
          }
          // Recompute cell count
          sim.cellCount = sim.countLiveCells(sim.grids.current);
        }
      },
    });
  }

  init() {
    super.init();
    this.initData();
  }

  initData() {
    this.initGrids();
  }

  initGrids() {
    this.grids = this.createGrids(this.rows, this.cols, false);
  }

  // Override lifecycle methods
  reset() {
    super.reset();
    this.initData();
    this.draw();
  }

  clear() {
    super.clear();
    this.initGrids(); // Only clear the grids, keep generation count and simulation state
    this.draw();
  }

  resize() {
    super.resize();
    this.initData();
  }

  // Override to preserve grid state during resize
  resizePreserveState() {
    // Store current grid state before resize
    const preservedState = this.getState();

    // Perform resize
    this.resize();

    // Restore grid state after resize
    this.setState(preservedState);
  }

  // Grid state now handled via registered serializer

  update() {
    // Step 1: Decrease each cell's brightness value by configurable amount
    this.updateCellBrightness();

    this.generation++;

    // Step 2: Activate and deactivate cells according to simulation rules
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const neighbours = this.countNeighbours(
          this.grids.current,
          row,
          col,
          this.rows,
          this.cols
        );
        const isAlive = this.grids.current[row][col];

        if (isAlive) {
          this.grids.next[row][col] = neighbours === 2 || neighbours === 3;
        } else {
          this.grids.next[row][col] = neighbours === 3;
        }
      }
    }

    // Swap grids
    this.swapGrids(this.grids);

    // Step 3: For all active cells, set the brightness value to 1
    this.setActiveCellBrightness(this.grids.current);

    // Update cell count
    this.cellCount = this.countLiveCells(this.grids.current);
  }

  draw() {
    this.drawGrid(this.grids.current);
  }

  toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);

    if (this.isValidGridPosition(row, col)) {
      const wasActive = this.grids.current[row][col];
      this.grids.current[row][col] = !this.grids.current[row][col];
      this.cellCount = this.countLiveCells(this.grids.current);

      // Unified brightness handling
      this.applyToggleBrightness(row, col, this.grids.current[row][col]);

      this.draw();
    }
  }

  setSpeed(stepsPerSecond) {
    const min =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MIN
        : 1;
    const max =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MAX
        : 60;
    this.speed = Math.max(min, Math.min(max, stepsPerSecond));
    this.updateInterval = 1000 / this.speed;
  }

  // Conway-specific randomize implementation
  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    // Clear existing pattern
    this.initGrids();

    // Fill with random cells using the provided likelihood
    this.cellCount = this.randomizeGrid(this.grids.current, likelihood);
    this.generation = 0;

    // Reinitialise brightness using unified helper
    this.resetBrightnessFromActiveGrid(
      (row, col) => this.grids.current[row][col]
    );

    this.draw();
  }
}

// Termite Algorithm
class TermiteAlgorithm extends BaseSimulation {
  constructor(canvas, ctx) {
    super(canvas, ctx, "termite");
    this.termites = [];
    this.grid = this.createGrid(this.rows || 1, this.cols || 1, false);
    this.maxTermites = 50;
    this.speed =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_DEFAULT
        : 30; // steps per second
    this.lastUpdateTime = 0;
    this.updateInterval = 1000 / this.speed; // milliseconds between updates

    // Set default cell size to ensure rows/cols are calculated properly
    this.cellSize =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.CELL_SIZE_DEFAULT
        : 10;

    // Register serializer for active grid and termites state preservation
    this.stateManager.registerSerializer({
      capture: (sim) => {
        const extra = {};
        if (sim.grid) extra.grid = sim.grid.map((row) => [...row]);
        extra.termites = sim.termites.map((t) => ({
          x: t.x,
          y: t.y,
          angle: t.angle,
          isCarrying: !!(t.isCarrying || t.carrying),
          trail: t.trail || [],
        }));
        return extra;
      },
      restore: (sim, state) => {
        if (state.grid) {
          // Recreate grid for current dimensions
          sim.grid = sim.createGrid(sim.rows, sim.cols, false);
          const minRows = Math.min(state.grid.length, sim.rows);
          const minCols = Math.min(state.grid[0]?.length || 0, sim.cols);
          for (let row = 0; row < minRows; row++) {
            for (let col = 0; col < minCols; col++) {
              sim.grid[row][col] = state.grid[row][col];
            }
          }
        }
        if (Array.isArray(state.termites)) {
          sim.termites = state.termites.map((t) => ({
            x: Math.max(0, Math.min(t.x, sim.canvas.width)),
            y: Math.max(0, Math.min(t.y, sim.canvas.height)),
            angle: t.angle || 0,
            isCarrying: !!(t.isCarrying || t.carrying),
            trail: t.trail || [],
          }));
        }
        sim.cellCount = sim.countLiveCells(sim.grid || []);
      },
    });
  }

  init() {
    super.init();
    this.initData();
  }

  initData() {
    this.initTermites();
    this.initActiveGrid();
  }

  initTermites() {
    this.termites = [];
    for (let i = 0; i < this.maxTermites; i++) {
      this.termites.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        angle: Math.random() * Math.PI * 2,
        carrying: false,
        trail: [], // Initialize empty trail
      });
    }
  }

  initActiveGrid() {
    // Initialize active grid of cells representing chips
    this.grid = this.createGrid(this.rows, this.cols, false);
    const defaultCoverage =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
        : 0.3;
    // Use shared randomizeGrid for consistency
    this.randomizeGrid(this.grid, defaultCoverage);
    this.cellCount = this.countLiveCells(this.grid);
  }

  // Override lifecycle methods
  reset() {
    super.reset();
    this.initData();
    this.draw();
  }

  clear() {
    super.clear();
    this.grid = this.createGrid(this.rows, this.cols, false);
    this.termites.forEach((termite) => (termite.isCarrying = false));
    this.draw();
  }

  resize() {
    super.resize();
    this.initData();
  }

  update() {
    // Update fade states based on active grid before incrementing generation
    this.updateFadeStates(this.grid);

    this.generation++;
    this.cellCount = this.countLiveCells(this.grid);

    this.termites.forEach((termite) => {
      // Update trail before moving
      this.updateActorTrail(termite, termite.x, termite.y);

      // Move termite
      const speed =
        typeof AppConstants !== "undefined"
          ? AppConstants.TermiteDefaults.MOVE_SPEED
          : 2; // Base movement speed
      termite.x += Math.cos(termite.angle) * speed;
      termite.y += Math.sin(termite.angle) * speed;

      // Wrap around edges
      termite.x = (termite.x + this.canvas.width) % this.canvas.width;
      termite.y = (termite.y + this.canvas.height) % this.canvas.height;

      // Determine current grid cell under the termite
      let gridCol = Math.floor((termite.x - this.gridOffsetX) / this.cellSize);
      let gridRow = Math.floor((termite.y - this.gridOffsetY) / this.cellSize);
      // Clamp to valid grid bounds to avoid off-grid chip positions
      gridCol = Math.max(0, Math.min(this.cols - 1, gridCol));
      gridRow = Math.max(0, Math.min(this.rows - 1, gridRow));
      const isActive = this.grid[gridRow][gridCol];
      if (termite.isCarrying) {
        // Drop chip if current cell is inactive
        if (!isActive) {
          this.grid[gridRow][gridCol] = true;
          termite.isCarrying = false;
        }
      } else {
        // Pick up chip if current cell is active
        if (isActive) {
          this.grid[gridRow][gridCol] = false;
          termite.isCarrying = true;
        }
      }

      // Random direction change
      if (
        Math.random() <
        (typeof AppConstants !== "undefined"
          ? AppConstants.TermiteDefaults.RANDOM_TURN_PROBABILITY
          : 0.1)
      ) {
        termite.angle += ((Math.random() - 0.5) * Math.PI) / 2;
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the entire grid so fading of inactive cells is visible
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = this.gridOffsetX + col * this.cellSize;
        const y = this.gridOffsetY + row * this.cellSize;
        const isActive = this.grid[row][col];
        this.drawCell(x, y, null, isActive);
      }
    }

    // Draw termites with trails
    this.termites.forEach((termite) => {
      // Draw trail first (behind the termite)
      this.drawActorTrail(termite, 2);

      // Draw termite
      this.drawActor(termite.x, termite.y, 3);
      if (this.getShowDirectionIndicator()) {
        this.drawDirectionIndicator(termite.x, termite.y, termite.angle);
      }
    });
  }

  setSpeed(stepsPerSecond) {
    const min =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MIN
        : 1;
    const max =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MAX
        : 60;
    this.speed = Math.max(min, Math.min(max, stepsPerSecond));
    this.updateInterval = 1000 / this.speed;
  }

  setTermiteCount(count) {
    this.maxTermites = count;
    this.initTermites();
  }

  // Standardised add-actor API: place a termite under the pointer
  addActorAt(mouseX, mouseY) {
    if (typeof mouseX !== "number" || typeof mouseY !== "number") return;
    const termite = {
      x: Math.max(0, Math.min(this.canvas.width, mouseX)),
      y: Math.max(0, Math.min(this.canvas.height, mouseY)),
      angle: Math.random() * Math.PI * 2,
      carrying: false,
      trail: [],
    };
    this.termites.push(termite);
    this.draw();
  }

  toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);

    if (this.isValidGridPosition(row, col)) {
      const wasActive = this.grid[row][col];
      this.grid[row][col] = !wasActive;
      this.cellCount = this.countLiveCells(this.grid);

      // Unified brightness handling
      this.applyToggleBrightness(row, col, this.grid[row][col]);

      // Update fade states before drawing to ensure proper fade behavior
      this.updateFadeStates(this.grid);
      this.draw();
    }
  }

  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    // Create/clear grid then randomize
    this.grid = this.createGrid(this.rows, this.cols, false);
    this.randomizeGrid(this.grid, likelihood);
    this.cellCount = this.countLiveCells(this.grid);

    // Reset termites to not carrying anything
    this.termites.forEach((termite) => (termite.isCarrying = false));

    // Reinitialise brightness using unified helper
    this.resetBrightnessFromActiveGrid((row, col) => this.grid[row][col]);

    // Redraw to show the new random pattern
    this.draw();
  }
}

// Langton's Ant
class LangtonsAnt extends BaseSimulation {
  constructor(canvas, ctx) {
    super(canvas, ctx, "langton");
    this.ants = [{ x: 0, y: 0, direction: 0 }]; // 0: up, 1: right, 2: down, 3: left
    this.grid = [];
    this.rules = ["R", "L"]; // Standard Langton's ant rules
    this.speed =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_DEFAULT
        : 30; // steps per second
    this.lastUpdateTime = 0;
    this.updateInterval = 1000 / this.speed; // milliseconds between updates

    // Set default cell size to ensure rows/cols are calculated properly
    this.cellSize =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.CELL_SIZE_DEFAULT
        : 10;

    // Register serializer for grid and ants
    this.stateManager.registerSerializer({
      capture: (sim) => {
        const extra = {};
        if (sim.grid) extra.grid = sim.grid.map((row) => [...row]);
        if (sim.ants) extra.ants = sim.ants.map((ant) => ({ ...ant }));
        return extra;
      },
      restore: (sim, state) => {
        if (state.grid) {
          const oldGrid = state.grid;
          sim.initGrid();
          const minRows = Math.min(oldGrid.length, sim.rows);
          const minCols = Math.min(oldGrid[0]?.length || 0, sim.cols);
          for (let row = 0; row < minRows; row++) {
            for (let col = 0; col < minCols; col++) {
              sim.grid[row][col] = oldGrid[row][col];
            }
          }
        }
        if (state.ants) {
          sim.ants = state.ants.map((ant) => ({
            x: Math.max(0, Math.min(ant.x, sim.cols - 1)),
            y: Math.max(0, Math.min(ant.y, sim.rows - 1)),
            direction: ant.direction,
            trail: ant.trail || [],
          }));
        }
        sim.cellCount = sim.countLiveCells(sim.grid);
      },
    });
  }

  init() {
    super.init();
    this.initData();
  }

  initData() {
    this.initGrid();
    this.resetAnts();
  }

  initGrid() {
    this.grid = this.createGrid(this.rows, this.cols, false);
  }

  resetAnts() {
    const ctor = typeof GridActor !== "undefined" ? GridActor : null;
    const cx = Math.floor(this.cols / 2);
    const cy = Math.floor(this.rows / 2);
    this.ants = [
      ctor
        ? new ctor(cx, cy, 0, { trail: [] })
        : { x: cx, y: cy, direction: 0, trail: [] },
    ];
  }

  // Override lifecycle methods
  reset() {
    super.reset();
    this.initData();
    this.draw();
  }

  clear() {
    super.clear();
    this.initGrid(); // Only clear the grid, keep ants in current positions
    this.draw();
  }

  resize() {
    super.resize();
    this.initData();
  }

  // Override to preserve grid and ant state during resize
  resizePreserveState() {
    // Store current state before resize
    const preservedState = this.getState();

    // Perform resize
    this.resize();

    // Restore state after resize
    this.setState(preservedState);
  }

  // Grid and ants state now handled via registered serializer

  update() {
    // Update fade states before incrementing generation
    // This ensures we can properly track initial inactive cells on generation 0
    this.updateFadeStates(this.grid);

    this.generation++;

    // Update each ant
    this.ants.forEach((ant) => {
      // Get current cell state
      const currentCell = this.grid[ant.y][ant.x];

      // Prepare smooth interpolation geometry within the current cell
      const entryEdge = (ant.direction + 2) % 4; // Opposite of current facing
      const startAngle = this.#edgeAngle(entryEdge);
      const cx = this.gridOffsetX + ant.x * this.cellSize + this.cellSize / 2;
      const cy = this.gridOffsetY + ant.y * this.cellSize + this.cellSize / 2;
      const radius = this.cellSize / 2;

      // Flip the cell
      this.grid[ant.y][ant.x] = !currentCell;

      // Turn based on cell state
      const rule = this.rules[currentCell ? 1 : 0];
      const turnRight = rule === "R";
      const newDirection = turnRight
        ? (ant.direction + 1) % 4
        : (ant.direction + 3) % 4;
      const exitAngle = this.#edgeAngle(newDirection);

      // Compute cubic Bézier control points to ensure smooth entry/exit tangents
      const p0x = cx + radius * Math.cos(startAngle);
      const p0y = cy + radius * Math.sin(startAngle);
      const p3x = cx + radius * Math.cos(exitAngle);
      const p3y = cy + radius * Math.sin(exitAngle);

      const dirToVec = (d) => {
        switch (d) {
          case 0:
            return { x: 0, y: -1 };
          case 1:
            return { x: 1, y: 0 };
          case 2:
            return { x: 0, y: 1 };
          case 3:
          default:
            return { x: -1, y: 0 };
        }
      };
      const v0 = dirToVec(ant.direction);
      const v1 = dirToVec(newDirection);
      const k = 0.6 * this.cellSize; // control handle length tuned for smoothness
      const p1x = p0x + v0.x * k;
      const p1y = p0y + v0.y * k;
      const p2x = p3x - v1.x * k;
      const p2y = p3y - v1.y * k;

      // Record render path for the duration until the next update
      ant.renderPath = {
        type: "bezier",
        p0: { x: p0x, y: p0y },
        p1: { x: p1x, y: p1y },
        p2: { x: p2x, y: p2y },
        p3: { x: p3x, y: p3y },
      };

      // Dense trail sampling along the curve similar to termite density
      const termiteStep =
        typeof AppConstants !== "undefined"
          ? (AppConstants.TermiteDefaults &&
              AppConstants.TermiteDefaults.MOVE_SPEED) ||
            2
          : 2;
      const approxLength = Math.PI * radius * 0.5; // quarter-arc baseline
      const samples = Math.max(
        2,
        Math.round(approxLength / Math.max(1, termiteStep))
      );
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const omt = 1 - t;
        const sx =
          omt * omt * omt * p0x +
          3 * omt * omt * t * p1x +
          3 * omt * t * t * p2x +
          t * t * t * p3x;
        const sy =
          omt * omt * omt * p0y +
          3 * omt * omt * t * p1y +
          3 * omt * t * t * p2y +
          t * t * t * p3y;
        this.updateActorTrail(ant, sx, sy);
      }

      // Apply the direction change after planning path
      ant.direction = newDirection;

      // Move forward
      switch (ant.direction) {
        case 0:
          ant.y = (ant.y - 1 + this.rows) % this.rows;
          break; // Up
        case 1:
          ant.x = (ant.x + 1) % this.cols;
          break; // Right
        case 2:
          ant.y = (ant.y + 1) % this.rows;
          break; // Down
        case 3:
          ant.x = (ant.x - 1 + this.cols) % this.cols;
          break; // Left
      }
    });

    // Update cell count
    this.cellCount = this.countLiveCells(this.grid);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid using common utility
    this.drawGrid(this.grid);

    // Draw each ant with trails
    const now =
      typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now();
    const progress = this.isRunning
      ? Math.max(
          0,
          Math.min(1, (now - this.lastUpdateTime) / this.updateInterval)
        )
      : 1;

    this.ants.forEach((ant) => {
      let drawX, drawY, headingAngle;
      if (ant.renderPath && ant.renderPath.type === "bezier") {
        const { p0, p1, p2, p3 } = ant.renderPath;
        const t = progress;
        const omt = 1 - t;
        // Position on curve
        drawX =
          omt * omt * omt * p0.x +
          3 * omt * omt * t * p1.x +
          3 * omt * t * t * p2.x +
          t * t * t * p3.x;
        drawY =
          omt * omt * omt * p0.y +
          3 * omt * omt * t * p1.y +
          3 * omt * t * t * p2.y +
          t * t * t * p3.y;
        // Derivative for heading
        const dx =
          3 * omt * omt * (p1.x - p0.x) +
          6 * omt * t * (p2.x - p1.x) +
          3 * t * t * (p3.x - p2.x);
        const dy =
          3 * omt * omt * (p1.y - p0.y) +
          6 * omt * t * (p2.y - p1.y) +
          3 * t * t * (p3.y - p2.y);
        headingAngle = Math.atan2(dy, dx);
      } else {
        drawX = this.gridOffsetX + ant.x * this.cellSize + this.cellSize / 2;
        drawY = this.gridOffsetY + ant.y * this.cellSize + this.cellSize / 2;
        headingAngle = (ant.direction * Math.PI) / 2;
      }

      // Draw trail first (behind the ant) — match termite styling
      this.drawActorTrail(ant, 2);

      // Draw ant — match termite sizing
      this.drawActor(drawX, drawY, 3);

      // Draw direction indicator using shared toggle
      if (this.getShowDirectionIndicator()) {
        // Use default length/line width to match termite appearance
        this.drawDirectionIndicator(drawX, drawY, headingAngle);
      }
    });
  }

  setSpeed(stepsPerSecond) {
    const min =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MIN
        : 1;
    const max =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_MAX
        : 60;
    this.speed = Math.max(min, Math.min(max, stepsPerSecond));
    this.updateInterval = 1000 / this.speed;
  }

  addAnt(mouseX = null, mouseY = null) {
    let x, y;

    if (mouseX !== null && mouseY !== null) {
      // Convert screen coordinates to grid coordinates
      const gridPos = this.screenToGrid(mouseX, mouseY);

      // Clamp to valid grid bounds
      x = Math.max(0, Math.min(this.cols - 1, gridPos.col));
      y = Math.max(0, Math.min(this.rows - 1, gridPos.row));
    } else {
      // Fallback to random position if no mouse coordinates provided
      x = Math.floor(Math.random() * this.cols);
      y = Math.floor(Math.random() * this.rows);
    }

    // Add a new ant at the specified or random position
    const ctor = typeof GridActor !== "undefined" ? GridActor : null;
    const dir = Math.floor(Math.random() * 4);
    const ant = ctor
      ? new ctor(x, y, dir, { trail: [] })
      : { x, y, direction: dir, trail: [] };
    this.ants.push(ant);

    // Draw immediately so the ant is visible even when paused
    this.draw();
  }

  // Generic add-actor API for keyboard/UX
  addActorAt(mouseX, mouseY) {
    if (typeof mouseX !== "number" || typeof mouseY !== "number") {
      this.addAnt(null, null);
      return;
    }
    const gridPos = this.screenToGrid(mouseX, mouseY);
    const x = Math.max(0, Math.min(this.cols - 1, gridPos.col));
    const y = Math.max(0, Math.min(this.rows - 1, gridPos.row));
    const ctor = typeof GridActor !== "undefined" ? GridActor : null;
    const dir = Math.floor(Math.random() * 4);
    const ant = ctor
      ? new ctor(x, y, dir, { trail: [] })
      : { x, y, direction: dir, trail: [] };
    this.ants.push(ant);
    this.draw();
  }

  // Set the number of ants (actor count) dynamically
  setAntCount(count) {
    const desired = Math.max(1, Math.min(100, parseInt(count, 10) || 1));
    const current = this.ants.length;
    if (desired === current) return;

    if (desired > current) {
      const toAdd = desired - current;
      for (let i = 0; i < toAdd; i++) {
        // Random placement at valid grid cell and random facing
        const x = Math.floor(Math.random() * this.cols);
        const y = Math.floor(Math.random() * this.rows);
        const ctor = typeof GridActor !== "undefined" ? GridActor : null;
        const dir = Math.floor(Math.random() * 4);
        const ant = ctor
          ? new ctor(x, y, dir, { trail: [] })
          : { x, y, direction: dir, trail: [] };
        this.ants.push(ant);
      }
    } else {
      // Reduce from the end
      this.ants.length = desired;
    }

    // Render updated count immediately
    this.draw();
  }

  // Compute angle for a given edge midpoint around the cell centre
  #edgeAngle(edgeIndex) {
    // 0: top (-PI/2), 1: right (0), 2: bottom (PI/2), 3: left (PI)
    switch (edgeIndex % 4) {
      case 0:
        return -Math.PI / 2;
      case 1:
        return 0;
      case 2:
        return Math.PI / 2;
      case 3:
      default:
        return Math.PI;
    }
  }

  toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);

    if (this.isValidGridPosition(row, col)) {
      const wasActive = this.grid[row][col];
      this.grid[row][col] = !this.grid[row][col];
      this.cellCount = this.countLiveCells(this.grid);

      // Unified brightness handling
      this.applyToggleBrightness(row, col, this.grid[row][col]);

      // Update fade states before drawing to ensure proper fade behavior
      this.updateFadeStates(this.grid);
      this.draw();
    }
  }

  // Langton-specific randomize implementation
  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    // Clear existing pattern
    this.initGrid();

    // Fill with random cells using the provided likelihood
    this.cellCount = this.randomizeGrid(this.grid, likelihood);
    this.generation = 0;

    // Reinitialise brightness using unified helper
    this.resetBrightnessFromActiveGrid((row, col) => this.grid[row][col]);

    this.draw();
  }
}

// Reaction-Diffusion (Gray-Scott) simulation
class ReactionDiffusion extends BaseSimulation {
  constructor(canvas, ctx) {
    super(canvas, ctx, "reaction");
    // Parameters (good starting set for Turing patterns)
    this.diffusionU = 0.16;
    this.diffusionV = 0.08;
    this.feedRate = 0.06;
    this.killRate = 0.062;
    this.deltaTime = 1.0;

    // Fields
    this.u = null; // rows x cols, floats
    this.v = null; // rows x cols, floats
    this.uNext = null;
    this.vNext = null;

    // Register serializer to preserve fields across resize
    this.stateManager.registerSerializer({
      capture: (sim) => {
        const extra = {};
        if (sim.u && sim.v) {
          extra.u = sim.u.map((row) => row.slice());
          extra.v = sim.v.map((row) => row.slice());
        }
        return extra;
      },
      restore: (sim, state) => {
        if (state.u && state.v) {
          // Recreate fields for current dimensions
          sim.initFields();
          const minRows = Math.min(state.u.length, sim.rows);
          const minCols = Math.min(state.u[0]?.length || 0, sim.cols);
          for (let r = 0; r < minRows; r++) {
            for (let c = 0; c < minCols; c++) {
              sim.u[r][c] = state.u[r][c];
              sim.v[r][c] = state.v[r][c];
            }
          }
          // Recompute cell count
          let count = 0;
          for (let r = 0; r < sim.rows; r++) {
            for (let c = 0; c < sim.cols; c++) {
              if (sim.v[r][c] > 0.5) count++;
            }
          }
          sim.cellCount = count;
        }
      },
    });
  }

  init() {
    super.init();
    this.initData();
  }

  initData() {
    this.initFields();
    // Default seed: a small square in the centre
    const cx = Math.floor(this.cols / 2);
    const cy = Math.floor(this.rows / 2);
    const radius = Math.max(
      2,
      Math.floor(Math.min(this.rows, this.cols) * 0.02)
    );
    for (let y = cy - radius; y <= cy + radius; y++) {
      for (let x = cx - radius; x <= cx + radius; x++) {
        const r = (y + this.rows) % this.rows;
        const c = (x + this.cols) % this.cols;
        this.u[r][c] = 0.0;
        this.v[r][c] = 1.0;
      }
    }
  }

  initFields() {
    this.u = this.createNumericGrid(this.rows, this.cols, 1.0);
    this.v = this.createNumericGrid(this.rows, this.cols, 0.0);
    this.uNext = this.createNumericGrid(this.rows, this.cols, 1.0);
    this.vNext = this.createNumericGrid(this.rows, this.cols, 0.0);
  }

  // Helper to create numeric grids
  createNumericGrid(rows, cols, defaultValue) {
    const grid = new Array(rows);
    for (let r = 0; r < rows; r++) {
      grid[r] = new Array(cols);
      for (let c = 0; c < cols; c++) grid[r][c] = defaultValue;
    }
    return grid;
  }

  reset() {
    super.reset();
    this.initData();
    this.draw();
  }

  clear() {
    super.clear();
    this.initFields();
    this.draw();
  }

  resize() {
    // Do not re-seed on resize; state is preserved via resizePreserveState()
    super.resize();
  }

  // Wrap-around accessor
  #idx(r, c) {
    const row = (r + this.rows) % this.rows;
    const col = (c + this.cols) % this.cols;
    return { row, col };
  }

  // 3x3 Laplacian with standard Gray-Scott weights
  #laplacian(grid, r, c) {
    const { row: r0, col: c0 } = this.#idx(r, c);
    let sum = -1.0 * grid[r0][c0];
    const weightsOrth = 0.2;
    const weightsDiag = 0.05;

    const n = this.#idx(r0 - 1, c0);
    const s = this.#idx(r0 + 1, c0);
    const w = this.#idx(r0, c0 - 1);
    const e = this.#idx(r0, c0 + 1);
    sum +=
      weightsOrth *
      (grid[n.row][n.col] +
        grid[s.row][s.col] +
        grid[w.row][w.col] +
        grid[e.row][e.col]);

    const nw = this.#idx(r0 - 1, c0 - 1);
    const ne = this.#idx(r0 - 1, c0 + 1);
    const sw = this.#idx(r0 + 1, c0 - 1);
    const se = this.#idx(r0 + 1, c0 + 1);
    sum +=
      weightsDiag *
      (grid[nw.row][nw.col] +
        grid[ne.row][ne.col] +
        grid[sw.row][sw.col] +
        grid[se.row][se.col]);

    return sum;
  }

  update() {
    this.generation++;

    const du = this.diffusionU;
    const dv = this.diffusionV;
    const F = this.feedRate;
    const k = this.killRate;
    const dt = this.deltaTime;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const u = this.u[r][c];
        const v = this.v[r][c];
        const lapU = this.#laplacian(this.u, r, c);
        const lapV = this.#laplacian(this.v, r, c);

        const uvv = u * v * v;
        let uNext = u + (du * lapU - uvv + F * (1 - u)) * dt;
        let vNext = v + (dv * lapV + uvv - (F + k) * v) * dt;

        // Clamp
        if (uNext < 0) uNext = 0;
        else if (uNext > 1) uNext = 1;
        if (vNext < 0) vNext = 0;
        else if (vNext > 1) vNext = 1;

        this.uNext[r][c] = uNext;
        this.vNext[r][c] = vNext;
      }
    }

    // Swap buffers
    [this.u, this.uNext] = [this.uNext, this.u];
    [this.v, this.vNext] = [this.vNext, this.v];

    // Update a rough cell count (number of cells above threshold)
    let count = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.v[r][c] > 0.5) count++;
      }
    }
    this.cellCount = count;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = this.gridOffsetX + c * this.cellSize;
        const y = this.gridOffsetY + r * this.cellSize;
        const v = this.v[r][c];

        // Map v -> colour using dynamic scheme mixed to black for contrast
        const base = this.getGradientColor(x, y);
        const color = this.interpolateColor(
          base,
          "#000000",
          1 - Math.min(1, Math.max(0, v))
        );
        const finalColor = this.applyBrightness(color);

        this.ctx.fillStyle = finalColor;
        this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
      }
    }
  }

  setReactionParam(name, value) {
    if (name === "feed") {
      this.feedRate = Math.max(0, Math.min(0.1, value));
    } else if (name === "kill") {
      this.killRate = Math.max(0, Math.min(0.1, value));
    }
  }

  toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);
    if (!this.isValidGridPosition(row, col)) return;
    // Inject V and consume U in a small neighbourhood
    const radius = 2;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const p = this.#idx(row + dy, col + dx);
        this.u[p.row][p.col] = 0.0;
        this.v[p.row][p.col] = 1.0;
      }
    }
    this.draw();
  }

  randomize(likelihood = 0.3) {
    // Re-initialize then seed random V spots
    this.initFields();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (Math.random() < likelihood) {
          this.u[r][c] = 0.0;
          this.v[r][c] = 1.0;
        }
      }
    }
    this.generation = 0;
    this.draw();
  }

  setLikelihood(value) {
    // Keep for consistency with the app; not used directly between steps
    this.likelihood = Math.max(0, Math.min(100, value));
  }
}

// Simulation factory
class SimulationFactory {
  static createSimulation(type, canvas, ctx) {
    switch (type) {
      case "conway":
        return new ConwayGameOfLife(canvas, ctx);
      case "termite":
        return new TermiteAlgorithm(canvas, ctx);
      case "langton":
        return new LangtonsAnt(canvas, ctx);
      case "reaction":
        return new ReactionDiffusion(canvas, ctx);
      default:
        throw new Error(`Unknown simulation type: ${type}`);
    }
  }
}
