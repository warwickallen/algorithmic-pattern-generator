// BaseSimulation extracted for plug-in architecture
class BaseSimulation {
  constructor(canvas, ctx, simulationId = "base") {
    this.canvas = canvas;
    this.ctx = ctx;
    this.simulationId = simulationId;
    this.animationManager =
      typeof AnimationManager !== "undefined"
        ? new AnimationManager({ fps: 60 })
        : null;
    this.isRunning = false;
    this.generation = 0;
    this.cellCount = 0;
    this.fps = 0;
    this.lastTime = 0;
    this.lastFpsTime = 0;
    this.fpsInitialized = false;
    this.frameCount = 0;
    this.fpsUpdateInterval = 30;
    this.brightness = 1.0;

    this.fadeOutCycles =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.FADE_OUT_CYCLES_DEFAULT
        : 5;
    this.fadeDecrement =
      typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.FADE_DECREMENT_DEFAULT
        : 0.2;
    this.cellBrightness = new Map();

    this.lastUpdateTime = 0;
    this.updateInterval =
      1000 /
      (typeof AppConstants !== "undefined"
        ? AppConstants.SimulationDefaults.SPEED_DEFAULT
        : 30);
    this.renderCache = new Map();
    this.colorCache = new Map();
    this.maxCacheSize = 1000;

    this.trailLength = 30;
    this.trailEnabled = true;
    this.trailOpacity = 0.8;
    this.trailColor = null;

    this.colourScheme = new DynamicColourScheme();

    this.gridOffsetX = 0;
    this.gridOffsetY = 0;

    this.showDirectionIndicator = true;

    this.stateManager = simulationLifecycleFramework.createStateManager({
      isRunning: false,
      generation: 0,
      cellCount: 0,
      brightness: 1.0,
      trailLength: this.trailLength,
      trailEnabled: this.trailEnabled,
    });

    this.eventHandler = simulationLifecycleFramework.createEventHandler(
      this.simulationId
    );

    simulationLifecycleFramework.registerStateManager(
      this.simulationId,
      this.stateManager
    );
    simulationLifecycleFramework.registerEventHandlers(
      this.simulationId,
      this.eventHandler
    );

    this.colorManager = renderingUtils.createColorManager();
    this.performanceOptimizer = renderingUtils.createPerformanceOptimizer();
    this.gridRenderer = renderingUtils.createGridRenderer();
  }

  init() {
    simulationLifecycleFramework.executeHook(this.simulationId, "onInit");
    this.resize();
    this.reset();
    this.initDragToggling();
  }

  resize() {
    const isAttached = this.canvas.parentNode !== null;
    if (isAttached) {
      let targetWidth = window.innerWidth;
      let targetHeight = window.innerHeight;
      if (
        targetWidth <= 0 ||
        targetHeight <= 0 ||
        targetWidth > 5000 ||
        targetHeight > 5000
      ) {
        const rect = this.canvas.getBoundingClientRect();
        targetWidth = rect.width;
        targetHeight = rect.height;
      }
      if (
        targetWidth <= 0 ||
        targetHeight <= 0 ||
        targetWidth > 5000 ||
        targetHeight > 5000
      ) {
        const parent = this.canvas.parentElement;
        if (parent) {
          const parentRect = parent.getBoundingClientRect();
          targetWidth = parentRect.width;
          targetHeight = parentRect.height;
        }
      }
      if (targetWidth <= 0 || targetHeight <= 0) {
        targetWidth = 800;
        targetHeight = 600;
      }
      this.canvas.width = targetWidth;
      this.canvas.height = targetHeight;
    } else {
      this.canvas.width = this.canvas.width || 800;
      this.canvas.height = this.canvas.height || 600;
    }

    if (this.canvas.width <= 0 || this.canvas.height <= 0) {
      if (typeof Logger !== "undefined")
        Logger.warn("Canvas dimensions are invalid, using fallback values");
      this.canvas.width = 800;
      this.canvas.height = 600;
    }

    const targetCells = 100;
    const minDimension = Math.min(this.canvas.width, this.canvas.height);
    this.cellSize = Math.max(1, Math.floor(minDimension / targetCells));
    this.cols = Math.max(1, Math.floor(this.canvas.width / this.cellSize));
    this.rows = Math.max(1, Math.floor(this.canvas.height / this.cellSize));
    const gridPixelWidth = this.cols * this.cellSize;
    const gridPixelHeight = this.rows * this.cellSize;
    this.gridOffsetX = Math.floor((this.canvas.width - gridPixelWidth) / 2);
    this.gridOffsetY = Math.floor((this.canvas.height - gridPixelHeight) / 2);
    this.clearCaches();
    simulationLifecycleFramework.executeHook(this.simulationId, "onResize");
  }

  resizePreserveState() {
    const preservedState = this.getState();
    this.resize();
    this.setState(preservedState);
  }

  getState() {
    const baseState = {
      generation: this.generation,
      cellCount: this.cellCount,
      isRunning: this.isRunning,
      trailLength: this.trailLength,
      trailEnabled: this.trailEnabled,
    };
    if (
      this.stateManager &&
      typeof this.stateManager.serialize === "function"
    ) {
      const extra = this.stateManager.serialize(this) || {};
      return { ...baseState, ...extra };
    }
    return baseState;
  }

  setState(state) {
    this.generation = state.generation || 0;
    this.cellCount = state.cellCount || 0;
    this.isRunning = state.isRunning || false;
    this.trailLength = state.trailLength || 30;
    this.trailEnabled =
      state.trailEnabled !== undefined ? state.trailEnabled : true;
    if (
      this.stateManager &&
      typeof this.stateManager.deserialize === "function"
    ) {
      this.stateManager.deserialize(this, state);
    }
  }

  start() {
    this.isRunning = true;
    this.stateManager.setState({ isRunning: true });
    simulationLifecycleFramework.executeHook(this.simulationId, "onStart");
    if (this.animationManager) {
      this.animationManager.start((time) => this.animate(time));
    } else {
      this.animate();
    }
  }

  pause() {
    this.isRunning = false;
    this.stateManager.setState({ isRunning: false });
    simulationLifecycleFramework.executeHook(this.simulationId, "onPause");
    if (this.animationManager) this.animationManager.stop();
  }

  reset() {
    this.generation = 0;
    this.cellCount = 0;
    this.clearFadeStates();
    this.stateManager.setState({ generation: 0, cellCount: 0 });
    simulationLifecycleFramework.executeHook(this.simulationId, "onReset");
  }

  clear() {
    this.generation = 0;
    this.cellCount = 0;
    this.clearFadeStates();
    this.stateManager.setState({ cellCount: 0 });
    simulationLifecycleFramework.executeHook(this.simulationId, "onClear");
  }

  animate(currentTime = 0) {
    if (!this.isRunning) return;
    this.frameCount++;
    if (this.frameCount % this.fpsUpdateInterval === 0) {
      const now =
        typeof currentTime === "number" && currentTime > 0
          ? currentTime
          : typeof performance !== "undefined"
          ? performance.now()
          : Date.now();
      if (!this.lastFpsTime) {
        this.lastFpsTime = now;
        this.fpsInitialized = false;
      } else {
        const elapsed = now - this.lastFpsTime;
        const safeElapsed = elapsed > 0 ? elapsed : 1;
        const fps = Math.round((this.fpsUpdateInterval * 1000) / safeElapsed);
        this.fps = Number.isFinite(fps) && fps >= 0 ? fps : 0;
        this.fpsInitialized = true;
        this.lastFpsTime = now;
      }
    }
    if (currentTime - this.lastUpdateTime >= this.updateInterval) {
      this.update();
      this.lastUpdateTime = currentTime;
    }
    this.draw();
    if (this.animationManager) return;
    requestAnimationFrame((time) => this.animate(time));
  }

  update() {
    simulationLifecycleFramework.executeHook(this.simulationId, "onUpdate");
  }

  draw() {
    simulationLifecycleFramework.executeHook(this.simulationId, "onDraw");
  }

  getStats() {
    return {
      generation: this.generation,
      cellCount: this.cellCount,
      fps: this.fpsInitialized ? this.fps : "-",
    };
  }

  setBrightness(value) {
    this.brightness = Math.max(0.1, Math.min(2.0, value));
    this.colorCache.clear();
  }

  setShowDirectionIndicator(enabled) {
    this.showDirectionIndicator = !!enabled;
  }
  getShowDirectionIndicator() {
    return !!this.showDirectionIndicator;
  }

  setFadeOutCycles(cycles) {
    this.fadeOutCycles = Math.max(1, Math.min(20, cycles));
  }
  getFadeOutCycles() {
    return this.fadeOutCycles;
  }

  updateFadeStates(grid) {
    if (this.constructor.name === "ConwayGameOfLife") return;
    const currentGeneration = this.generation;
    if (window.DEBUG_FADE && currentGeneration > 0) {
      if (typeof Logger !== "undefined")
        Logger.debug(
          `updateFadeStates called for generation ${currentGeneration}`
        );
    }
    if (!this.initialInactiveCells) {
      this.initialInactiveCells = new Set();
    }
    if (currentGeneration === 0) {
      this.initialInactiveCells.clear();
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (!grid[row][col]) this.initialInactiveCells.add(`${row},${col}`);
        }
      }
      return;
    }
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cellKey = `${row},${col}`;
        const isActive = grid[row][col];
        if (isActive) {
          this.cellBrightness.set(cellKey, 1);
          this.initialInactiveCells.delete(cellKey);
        } else {
          const brightness = this.cellBrightness.get(cellKey);
          if (brightness === undefined) {
            if (!this.initialInactiveCells.has(cellKey)) {
              this.cellBrightness.set(cellKey, 1);
            }
          } else if (brightness > 0) {
            const newBrightness = Math.max(0, brightness - this.fadeDecrement);
            this.cellBrightness.set(cellKey, newBrightness);
          }
        }
      }
    }
  }

  getCellFadeFactor(row, col, isActive = null) {
    return this.getCellBrightness(row, col);
  }

  clearFadeStates() {
    this.cellBrightness.clear();
  }

  updateCellBrightness() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cellKey = `${row},${col}`;
        const currentBrightness = this.cellBrightness.get(cellKey) || 0;
        const newBrightness = Math.max(
          0,
          currentBrightness - this.fadeDecrement
        );
        this.cellBrightness.set(cellKey, newBrightness);
      }
    }
  }

  setActiveCellBrightness(grid) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (grid[row][col]) {
          const cellKey = `${row},${col}`;
          this.cellBrightness.set(cellKey, 1);
        }
      }
    }
  }

  getCellBrightness(row, col) {
    const cellKey = `${row},${col}`;
    return this.cellBrightness.get(cellKey) || 0;
  }

  setFadeDecrement(decrement) {
    this.fadeDecrement = Math.max(0.01, Math.min(1.0, decrement));
  }
  getFadeDecrement() {
    return this.fadeDecrement;
  }

  applyToggleBrightness(row, col, isActiveAfter) {
    const cellKey = `${row},${col}`;
    if (isActiveAfter) {
      this.cellBrightness.set(cellKey, 1);
      return;
    }
    const currentBrightness = this.cellBrightness.get(cellKey);
    this.cellBrightness.set(
      cellKey,
      currentBrightness === undefined ? 1 : currentBrightness
    );
  }

  resetBrightnessFromActiveGrid(isActivePredicate) {
    this.cellBrightness.clear();
    if (!this.initialInactiveCells) this.initialInactiveCells = new Set();
    this.initialInactiveCells.clear();
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (isActivePredicate(row, col)) {
          const cellKey = `${row},${col}`;
          this.cellBrightness.set(cellKey, 1);
        }
      }
    }
  }

  applyBrightness(color) {
    const cacheKey = `${color}-${this.brightness}`;
    if (this.colorCache.has(cacheKey)) return this.colorCache.get(cacheKey);
    let r,
      g,
      b,
      a = 1;
    if (color.startsWith("rgb")) {
      const match = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      if (match) {
        r = parseInt(match[1]);
        g = parseInt(match[2]);
        b = parseInt(match[3]);
        a = match[4] ? parseFloat(match[4]) : 1;
      }
    } else if (color.startsWith("#")) {
      const hex = color.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    }
    if (r !== undefined && g !== undefined && b !== undefined) {
      r = Math.min(255, Math.max(0, Math.round(r * this.brightness)));
      g = Math.min(255, Math.max(0, Math.round(g * this.brightness)));
      b = Math.min(255, Math.max(0, Math.round(b * this.brightness)));
      const result = `rgba(${r}, ${g}, ${b}, ${a})`;
      this.colorCache.set(cacheKey, result);
      if (this.colorCache.size > this.maxCacheSize) {
        const firstKey = this.colorCache.keys().next().value;
        this.colorCache.delete(firstKey);
      }
      return result;
    }
    return color;
  }

  clearCaches() {
    this.renderCache.clear();
    this.colorCache.clear();
  }

  createGrid(rows, cols, defaultValue = false) {
    if (
      !Number.isInteger(rows) ||
      rows <= 0 ||
      !Number.isInteger(cols) ||
      cols <= 0
    ) {
      if (typeof Logger !== "undefined")
        Logger.warn(
          `Invalid grid dimensions: rows=${rows}, cols=${cols}. Using minimum size of 1x1.`
        );
      rows = Math.max(1, Math.floor(rows) || 1);
      cols = Math.max(1, Math.floor(cols) || 1);
    }
    return Array(rows)
      .fill()
      .map(() => Array(cols).fill(defaultValue));
  }

  createGrids(rows, cols, defaultValue = false) {
    return {
      current: this.createGrid(rows, cols, defaultValue),
      next: this.createGrid(rows, cols, defaultValue),
    };
  }
  swapGrids(grids) {
    [grids.current, grids.next] = [grids.next, grids.current];
  }

  countLiveCells(grid) {
    let count = 0;
    for (let row = 0; row < grid.length; row++) {
      const rowData = grid[row];
      for (let col = 0; col < rowData.length; col++) {
        if (rowData[col]) count++;
      }
    }
    return count;
  }

  countNeighbours(grid, row, col, rows, cols, wrapAround = true) {
    let count = 0;
    if (wrapAround) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = (row + dr + rows) % rows;
          const nc = (col + dc + cols) % cols;
          if (grid[nr][nc]) count++;
        }
      }
    } else {
      const startRow = Math.max(0, row - 1);
      const endRow = Math.min(rows - 1, row + 1);
      const startCol = Math.max(0, col - 1);
      const endCol = Math.min(cols - 1, col + 1);
      for (let nr = startRow; nr <= endRow; nr++) {
        for (let nc = startCol; nc <= endCol; nc++) {
          if (nr === row && nc === col) continue;
          if (grid[nr][nc]) count++;
        }
      }
    }
    return count;
  }

  drawGrid(grid, cellRenderer = null) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let row = 0; row < grid.length; row++) {
      const rowData = grid[row];
      for (let col = 0; col < rowData.length; col++) {
        const x = this.gridOffsetX + col * this.cellSize;
        const y = this.gridOffsetY + row * this.cellSize;
        const isActive = rowData[col];
        if (cellRenderer && typeof cellRenderer === "function") {
          cellRenderer(x, y, row, col, isActive);
        } else {
          this.drawCell(x, y, null, isActive);
        }
      }
    }
  }

  randomizeGrid(
    grid,
    density = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    for (let row = 0; row < grid.length; row++) {
      const rowData = grid[row];
      for (let col = 0; col < rowData.length; col++) {
        rowData[col] = Math.random() < density;
      }
    }
    return this.countLiveCells(grid);
  }

  randomize(
    likelihood = typeof AppConstants !== "undefined"
      ? AppConstants.SimulationDefaults.COVERAGE_DEFAULT
      : 0.3
  ) {
    if (typeof Logger !== "undefined")
      Logger.warn(`randomize() not implemented for ${this.simulationId}`);
  }

  screenToGrid(x, y) {
    const localX = x - this.gridOffsetX;
    const localY = y - this.gridOffsetY;
    return {
      col: Math.floor(localX / this.cellSize),
      row: Math.floor(localY / this.cellSize),
    };
  }
  gridToScreen(col, row) {
    return {
      x: this.gridOffsetX + col * this.cellSize,
      y: this.gridOffsetY + row * this.cellSize,
    };
  }
  isValidGridPosition(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  toggleCell(x, y) {
    if (typeof Logger !== "undefined")
      Logger.warn(
        `toggleCell not implemented for ${this.simulationId} simulation`
      );
  }

  initDragToggling() {
    this.isDragging = false;
    this.dragStartPos = null;
    this.lastDragPos = null;
    this.toggledCells = new Set();
    this.boundMouseDown = this.handleMouseDown.bind(this);
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseUp = this.handleMouseUp.bind(this);
    this.canvas.addEventListener("mousedown", this.boundMouseDown);
    this.canvas.addEventListener("mousemove", this.boundMouseMove);
    this.canvas.addEventListener("mouseup", this.boundMouseUp);
    this.canvas.addEventListener("mouseleave", this.boundMouseUp);
  }
  handleMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.isDragging = true;
    this.dragStartPos = { x, y };
    this.lastDragPos = { x, y };
    this.toggledCells.clear();
    this.toggleCellAtPosition(x, y);
  }
  handleMouseMove(e) {
    if (!this.isDragging) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this.toggleCellsAlongPath(this.lastDragPos.x, this.lastDragPos.y, x, y);
    this.lastDragPos = { x, y };
  }
  handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.dragStartPos = null;
    this.lastDragPos = null;
    this.toggledCells.clear();
  }

  toggleCellAtPosition(x, y) {
    const gridPos = this.screenToGrid(x, y);
    if (gridPos && this.isValidGridPosition(gridPos.row, gridPos.col)) {
      const cellKey = `${gridPos.row},${gridPos.col}`;
      if (!this.toggledCells.has(cellKey)) {
        this.toggleCell(x, y);
        this.toggledCells.add(cellKey);
        if (window.app && window.app.updateUI) window.app.updateUI();
      }
    }
  }

  toggleCellsAlongPath(startX, startY, endX, endY) {
    const startGrid = this.screenToGrid(startX, startY);
    const endGrid = this.screenToGrid(endX, endY);
    if (!startGrid || !endGrid) return;
    const points = this.getLinePoints(
      startGrid.col,
      startGrid.row,
      endGrid.col,
      endGrid.row
    );
    for (const point of points) {
      if (this.isValidGridPosition(point.row, point.col)) {
        const screenPos = this.gridToScreen(point.col, point.row);
        this.toggleCellAtPosition(screenPos.x, screenPos.y);
      }
    }
  }

  getLinePoints(col0, row0, col1, row1) {
    const points = [];
    const dx = Math.abs(col1 - col0);
    const dy = Math.abs(row1 - row0);
    const sx = col0 < col1 ? 1 : -1;
    const sy = row0 < row1 ? 1 : -1;
    let err = dx - dy;
    let col = col0,
      row = row0;
    while (true) {
      points.push({ row: row, col: col });
      if (col === col1 && row === row1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        col += sx;
      }
      if (e2 < dx) {
        err += dx;
        row += sy;
      }
    }
    return points;
  }

  getGradientColor(x, y, startColor, endColor) {
    const currentTime = this.isRunning ? Date.now() : null;
    return this.colourScheme.getColourAtPosition(
      x,
      y,
      this.canvas.width,
      this.canvas.height,
      80,
      50,
      currentTime
    );
  }

  interpolateColor(color1, color2, factor) {
    if (typeof ColorUtils !== "undefined") {
      return ColorUtils.interpolateColor(color1, color2, factor);
    }
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const f = clamp(factor);
    const parse = (c) =>
      c.startsWith("#")
        ? [
            parseInt(c.slice(1, 3), 16),
            parseInt(c.slice(3, 5), 16),
            parseInt(c.slice(5, 7), 16),
          ]
        : (c.match(/\d+/g) || []).slice(0, 3).map(Number);
    const a = parse(color1);
    const b = parse(color2);
    if (!a || !b || a.length < 3 || b.length < 3) return color1;
    const out = a.map((c1, i) => Math.round(c1 + (b[i] - c1) * f));
    return `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
  }

  setGlowEffect(color, intensity = 15) {
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = intensity;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }
  clearGlowEffect() {
    this.ctx.shadowColor = "transparent";
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
  }

  drawCell(x, y, color = null, isActive = null) {
    const { col, row } = this.screenToGrid(x, y);
    let cellBrightness = this.getCellBrightness(row, col);
    if (cellBrightness === 0 && isActive !== false) {
      cellBrightness = 1.0;
    }
    if (cellBrightness === 0) return;
    if (!color) color = this.getGradientColor(x, y);
    const brightColor = this.applyBrightness(color);
    let finalColor = brightColor;
    if (cellBrightness < 1) {
      finalColor = this.interpolateColor(
        brightColor,
        "#000000",
        1 - cellBrightness
      );
    }
    this.ctx.fillStyle = finalColor;
    this.setGlowEffect(finalColor, 20 * this.brightness * cellBrightness);
    this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
    this.clearGlowEffect();
  }

  drawActor(x, y, radius, color = null) {
    if (!color) {
      const currentTime = this.isRunning ? Date.now() : null;
      color = this.colourScheme.getColourAtPosition(
        x,
        y,
        this.canvas.width,
        this.canvas.height,
        90,
        60,
        currentTime
      );
    }
    color = this.applyBrightness(color);
    this.ctx.fillStyle = color;
    this.setGlowEffect(color, 25 * this.brightness);
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.clearGlowEffect();
  }

  drawDirectionIndicator(
    x,
    y,
    angle,
    length = 8,
    color = "#ffffff",
    lineWidth = 1
  ) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
    this.ctx.stroke();
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
}

if (typeof window !== "undefined") {
  window.BaseSimulation = BaseSimulation;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { BaseSimulation };
}
