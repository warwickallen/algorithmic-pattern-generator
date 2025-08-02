// Base simulation class with performance optimization
class BaseSimulation {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.isRunning = false;
        this.generation = 0;
        this.cellCount = 0;
        this.fps = 0;
        this.lastTime = 0;
        this.frameCount = 0;
        this.fpsUpdateInterval = 30; // Update FPS every 30 frames
        this.brightness = 1.0; // Default brightness
        
        // Performance optimization properties
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / 30; // Default 30 FPS
        this.renderCache = new Map(); // Cache for rendered elements
        this.colorCache = new Map(); // Cache for brightness-adjusted colors
        this.maxCacheSize = 1000; // Limit cache size to prevent memory leaks
    }
    
    init() {
        this.resize();
        this.reset();
    }
    
    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.cellSize = Math.min(this.canvas.width, this.canvas.height) / 100;
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
        
        // Clear caches on resize
        this.clearCaches();
    }
    
    // New method for preserving state during resize
    resizePreserveState() {
        // Store current state before resize
        const preservedState = this.getState();
        
        // Perform resize
        this.resize();
        
        // Restore state after resize
        this.setState(preservedState);
    }
    
    // Override these methods in subclasses to preserve specific state
    getState() {
        // Default implementation - override in subclasses
        return {
            generation: this.generation,
            cellCount: this.cellCount,
            isRunning: this.isRunning
        };
    }
    
    setState(state) {
        // Default implementation - override in subclasses
        this.generation = state.generation || 0;
        this.cellCount = state.cellCount || 0;
        this.isRunning = state.isRunning || false;
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    pause() {
        this.isRunning = false;
    }
    
    reset() {
        this.generation = 0;
        this.cellCount = 0;
        this.isRunning = false;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cellCount = 0;
    }
    
    animate(currentTime = 0) {
        if (!this.isRunning) return;
        
        // Calculate FPS
        this.frameCount++;
        if (this.frameCount % this.fpsUpdateInterval === 0) {
            this.fps = Math.round((this.fpsUpdateInterval * 1000) / (currentTime - this.lastTime));
            this.lastTime = currentTime;
        }
        
        // For all simulations, control update frequency based on speed
        if (currentTime - this.lastUpdateTime >= this.updateInterval) {
            this.update();
            this.lastUpdateTime = currentTime;
        }
        
        this.draw();
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    update() {
        // Override in subclasses
    }
    
    draw() {
        // Override in subclasses
    }
    
    getStats() {
        return {
            generation: this.generation,
            cellCount: this.cellCount,
            fps: this.fps
        };
    }
    
    setBrightness(value) {
        this.brightness = Math.max(0.1, Math.min(2.0, value));
        // Clear color cache when brightness changes
        this.colorCache.clear();
    }
    
    // Optimized brightness application with caching
    applyBrightness(color) {
        // Check cache first
        const cacheKey = `${color}-${this.brightness}`;
        if (this.colorCache.has(cacheKey)) {
            return this.colorCache.get(cacheKey);
        }
        
        // Parse the color (supports rgb, rgba, and hex formats)
        let r, g, b, a = 1;
        
        if (color.startsWith('rgb')) {
            // Handle rgb(r, g, b) or rgba(r, g, b, a) format
            const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            if (match) {
                r = parseInt(match[1]);
                g = parseInt(match[2]);
                b = parseInt(match[3]);
                a = match[4] ? parseFloat(match[4]) : 1;
            }
        } else if (color.startsWith('#')) {
            // Handle hex format
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
            // Apply brightness
            r = Math.min(255, Math.max(0, Math.round(r * this.brightness)));
            g = Math.min(255, Math.max(0, Math.round(g * this.brightness)));
            b = Math.min(255, Math.max(0, Math.round(b * this.brightness)));
            
            const result = `rgba(${r}, ${g}, ${b}, ${a})`;
            
            // Cache the result
            this.colorCache.set(cacheKey, result);
            
            // Limit cache size
            if (this.colorCache.size > this.maxCacheSize) {
                const firstKey = this.colorCache.keys().next().value;
                this.colorCache.delete(firstKey);
            }
            
            return result;
        }
        
        // Return original color if parsing failed
        return color;
    }
    
    // Cache management
    clearCaches() {
        this.renderCache.clear();
        this.colorCache.clear();
    }
    
    // Common grid utilities with performance optimization
    createGrid(rows, cols, defaultValue = false) {
        return Array(rows).fill().map(() => Array(cols).fill(defaultValue));
    }
    
    createGrids(rows, cols, defaultValue = false) {
        return {
            current: this.createGrid(rows, cols, defaultValue),
            next: this.createGrid(rows, cols, defaultValue)
        };
    }
    
    swapGrids(grids) {
        [grids.current, grids.next] = [grids.next, grids.current];
    }
    
    // Optimized cell counting
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
    
    // Common neighbour counting utility with boundary checking optimization
    countNeighbours(grid, row, col, rows, cols, wrapAround = true) {
        let count = 0;
        
        if (wrapAround) {
            // Optimized wrap-around version
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    
                    const nr = (row + dr + rows) % rows;
                    const nc = (col + dc + cols) % cols;
                    
                    if (grid[nr][nc]) {
                        count++;
                    }
                }
            }
        } else {
            // Optimized bounded version
            const startRow = Math.max(0, row - 1);
            const endRow = Math.min(rows - 1, row + 1);
            const startCol = Math.max(0, col - 1);
            const endCol = Math.min(cols - 1, col + 1);
            
            for (let nr = startRow; nr <= endRow; nr++) {
                for (let nc = startCol; nc <= endCol; nc++) {
                    if (nr === row && nc === col) continue;
                    if (grid[nr][nc]) {
                        count++;
                    }
                }
            }
        }
        
        return count;
    }
    
    // Optimized grid rendering utility
    drawGrid(grid, cellRenderer = null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Use more efficient iteration
        for (let row = 0; row < grid.length; row++) {
            const rowData = grid[row];
            for (let col = 0; col < rowData.length; col++) {
                if (rowData[col]) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    
                    if (cellRenderer && typeof cellRenderer === 'function') {
                        cellRenderer(x, y, row, col, rowData[col]);
                    } else {
                        this.drawCell(x, y);
                    }
                }
            }
        }
    }
    
    // Common random grid generation utility
    randomizeGrid(grid, density = 0.3) {
        for (let row = 0; row < grid.length; row++) {
            const rowData = grid[row];
            for (let col = 0; col < rowData.length; col++) {
                rowData[col] = Math.random() < density;
            }
        }
        return this.countLiveCells(grid);
    }
    
    // Common cell coordinate conversion utilities
    screenToGrid(x, y) {
        return {
            col: Math.floor(x / this.cellSize),
            row: Math.floor(y / this.cellSize)
        };
    }
    
    gridToScreen(col, row) {
        return {
            x: col * this.cellSize,
            y: row * this.cellSize
        };
    }
    
    isValidGridPosition(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    // Gradient colour utilities with caching
    getGradientColor(x, y, startColor, endColor) {
        const maxX = this.canvas.width;
        const maxY = this.canvas.height;
        
        // Normalize position (0 to 1)
        const normX = x / maxX;
        const normY = y / maxY;
        
        // Combine X and Y for diagonal gradient effect
        const factor = (normX + normY) / 2;
        
        return this.interpolateColor(startColor, endColor, factor);
    }
    
    interpolateColor(color1, color2, factor) {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * factor);
        const g = Math.round(g1 + (g2 - g1) * factor);
        const b = Math.round(b1 + (b2 - b1) * factor);
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    // Glow effect utility with performance optimization
    setGlowEffect(color, intensity = 15) {
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = intensity;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
    
    clearGlowEffect() {
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }
    
    // Common cell rendering method with caching
    drawCell(x, y, color = null) {
        if (!color) {
            color = this.getGradientColor(x, y, '#00ff00', '#4a90e2');
        }
        
        // Apply brightness to the color
        color = this.applyBrightness(color);
        
        this.ctx.fillStyle = color;
        this.setGlowEffect(color, 20 * this.brightness);
        
        this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
        
        this.clearGlowEffect();
    }
    
    // Common actor rendering method (for termites and ants) with caching
    drawActor(x, y, radius, color = null) {
        if (!color) {
            color = this.getGradientColor(x, y, '#ff6b35', '#ff4757');
        }
        
        // Apply brightness to the color
        color = this.applyBrightness(color);
        
        this.ctx.fillStyle = color;
        this.setGlowEffect(color, 25 * this.brightness);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.clearGlowEffect();
    }
    
    // Common direction indicator rendering
    drawDirectionIndicator(x, y, angle, length = 8, color = '#ffffff', lineWidth = 1) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(
            x + Math.cos(angle) * length,
            y + Math.sin(angle) * length
        );
        this.ctx.stroke();
    }
    
    // Set speed with validation
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
}



// Conway's Game of Life
class ConwayGameOfLife extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.grids = null;
        this.speed = 30; // FPS for simulation speed
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / this.speed; // milliseconds between updates
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
        this.initData();
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
    
    // Override to preserve grid data
    getState() {
        const state = super.getState();
        if (this.grids) {
            state.grids = {
                current: this.grids.current.map(row => [...row]),
                next: this.grids.next.map(row => [...row])
            };
        }
        return state;
    }
    
    setState(state) {
        super.setState(state);
        if (state.grids && this.grids) {
            // Copy the preserved grid data to the new grid dimensions
            const oldCurrent = state.grids.current;
            const oldNext = state.grids.next;
            
            // Clear the new grids
            this.initGrids();
            
            // Copy data from old grids to new grids, handling size differences
            const minRows = Math.min(oldCurrent.length, this.rows);
            const minCols = Math.min(oldCurrent[0]?.length || 0, this.cols);
            
            for (let row = 0; row < minRows; row++) {
                for (let col = 0; col < minCols; col++) {
                    this.grids.current[row][col] = oldCurrent[row][col];
                    this.grids.next[row][col] = oldNext[row][col];
                }
            }
            
            // Update cell count
            this.cellCount = this.countLiveCells(this.grids.current);
        }
    }
    
    update() {
        this.generation++;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbours = this.countNeighbours(this.grids.current, row, col, this.rows, this.cols);
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
        
        // Update cell count
        this.cellCount = this.countLiveCells(this.grids.current);
    }
    
    draw() {
        this.drawGrid(this.grids.current);
    }
    
    toggleCell(x, y) {
        const { col, row } = this.screenToGrid(x, y);
        
        if (this.isValidGridPosition(row, col)) {
            this.grids.current[row][col] = !this.grids.current[row][col];
            this.cellCount = this.countLiveCells(this.grids.current);
            this.draw();
        }
    }
    
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
    
    randomize() {
        // Clear existing pattern
        this.initGrids();
        
        // Fill with random cells (30% density)
        this.cellCount = this.randomizeGrid(this.grids.current, 0.3);
        this.generation = 0;
        this.draw();
    }
}

// Termite Algorithm
class TermiteAlgorithm extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.termites = [];
        this.woodChips = new Set();
        this.maxTermites = 50;
        this.speed = 30; // steps per second
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / this.speed; // milliseconds between updates
    }
    
    init() {
        super.init();
        this.initData();
    }
    
    initData() {
        this.initTermites();
        this.initWoodChips();
    }
    
    initTermites() {
        this.termites = [];
        for (let i = 0; i < this.maxTermites; i++) {
            this.termites.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                angle: Math.random() * Math.PI * 2,
                carrying: false
            });
        }
    }
    
    initWoodChips() {
        this.woodChips.clear();
        const numChips = Math.floor((this.cols * this.rows) * 0.3);
        
        for (let i = 0; i < numChips; i++) {
            const x = Math.floor(Math.random() * this.cols) * this.cellSize;
            const y = Math.floor(Math.random() * this.rows) * this.cellSize;
            this.woodChips.add(`${x},${y}`);
        }
    }
    
    // Override lifecycle methods
    reset() {
        super.reset();
        this.initData();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.woodChips.clear();
        this.termites.forEach(termite => termite.carrying = false);
        this.draw();
    }
    
    resize() {
        super.resize();
        this.initData();
    }
    
    update() {
        this.generation++;
        this.cellCount = this.woodChips.size;
        
        this.termites.forEach(termite => {
            // Move termite
            const speed = 2; // Base movement speed
            termite.x += Math.cos(termite.angle) * speed;
            termite.y += Math.sin(termite.angle) * speed;
            
            // Wrap around edges
            termite.x = (termite.x + this.canvas.width) % this.canvas.width;
            termite.y = (termite.y + this.canvas.height) % this.canvas.height;
            
            // Check for wood chips
            const gridX = Math.floor(termite.x / this.cellSize) * this.cellSize;
            const gridY = Math.floor(termite.y / this.cellSize) * this.cellSize;
            const chipKey = `${gridX},${gridY}`;
            
            if (termite.carrying) {
                // Drop wood chip if on empty space
                if (!this.woodChips.has(chipKey)) {
                    this.woodChips.add(chipKey);
                    termite.carrying = false;
                }
            } else {
                // Pick up wood chip if on wood chip
                if (this.woodChips.has(chipKey)) {
                    this.woodChips.delete(chipKey);
                    termite.carrying = true;
                }
            }
            
            // Random direction change
            if (Math.random() < 0.1) {
                termite.angle += (Math.random() - 0.5) * Math.PI / 2;
            }
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw wood chips
        this.woodChips.forEach(chipKey => {
            const [x, y] = chipKey.split(',').map(Number);
            this.drawCell(x, y);
        });
        
        // Draw termites
        this.termites.forEach(termite => {
            this.drawActor(termite.x, termite.y, 3);
            this.drawDirectionIndicator(termite.x, termite.y, termite.angle);
        });
    }
    
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
    
    setTermiteCount(count) {
        this.maxTermites = count;
        this.initTermites();
    }
    
    randomize() {
        this.woodChips.clear();
        const numChips = Math.floor((this.cols * this.rows) * 0.3);
        
        for (let i = 0; i < numChips; i++) {
            const x = Math.floor(Math.random() * this.cols) * this.cellSize;
            const y = Math.floor(Math.random() * this.rows) * this.cellSize;
            this.woodChips.add(`${x},${y}`);
        }
        
        // Reset termites to not carrying anything
        this.termites.forEach(termite => termite.carrying = false);
        
        // Redraw to show the new random pattern
        this.draw();
    }
}

// Langton's Ant
class LangtonsAnt extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.ants = [{ x: 0, y: 0, direction: 0 }]; // 0: up, 1: right, 2: down, 3: left
        this.grid = [];
        this.rules = ['R', 'L']; // Standard Langton's ant rules
        this.speed = 30; // steps per second
        this.lastUpdateTime = 0;
        this.updateInterval = 1000 / this.speed; // milliseconds between updates
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
        this.ants = [{ 
            x: Math.floor(this.cols / 2), 
            y: Math.floor(this.rows / 2), 
            direction: 0 
        }];
    }
    
    // Override lifecycle methods
    reset() {
        super.reset();
        this.initData();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.initData();
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
    
    // Override to preserve grid and ant data
    getState() {
        const state = super.getState();
        if (this.grid) {
            state.grid = this.grid.map(row => [...row]);
        }
        if (this.ants) {
            state.ants = this.ants.map(ant => ({ ...ant }));
        }
        return state;
    }
    
    setState(state) {
        super.setState(state);
        if (state.grid && this.grid) {
            // Copy the preserved grid data to the new grid dimensions
            const oldGrid = state.grid;
            
            // Clear the new grid
            this.initGrid();
            
            // Copy data from old grid to new grid, handling size differences
            const minRows = Math.min(oldGrid.length, this.rows);
            const minCols = Math.min(oldGrid[0]?.length || 0, this.cols);
            
            for (let row = 0; row < minRows; row++) {
                for (let col = 0; col < minCols; col++) {
                    this.grid[row][col] = oldGrid[row][col];
                }
            }
        }
        
        if (state.ants && this.ants) {
            // Restore ant positions, adjusting for new grid size
            this.ants = state.ants.map(ant => ({
                x: Math.min(ant.x, this.cols - 1),
                y: Math.min(ant.y, this.rows - 1),
                direction: ant.direction
            }));
        }
        
        // Update cell count
        this.cellCount = this.countLiveCells(this.grid);
    }
    
    update() {
        this.generation++;
        
        // Update each ant
        this.ants.forEach(ant => {
            // Get current cell state
            const currentCell = this.grid[ant.y][ant.x];
            
            // Flip the cell
            this.grid[ant.y][ant.x] = !currentCell;
            
            // Turn based on cell state
            const rule = this.rules[currentCell ? 1 : 0];
            if (rule === 'R') {
                ant.direction = (ant.direction + 1) % 4;
            } else {
                ant.direction = (ant.direction + 3) % 4;
            }
            
            // Move forward
            switch (ant.direction) {
                case 0: ant.y = (ant.y - 1 + this.rows) % this.rows; break; // Up
                case 1: ant.x = (ant.x + 1) % this.cols; break; // Right
                case 2: ant.y = (ant.y + 1) % this.rows; break; // Down
                case 3: ant.x = (ant.x - 1 + this.cols) % this.cols; break; // Left
            }
        });
        
        // Update cell count
        this.cellCount = this.countLiveCells(this.grid);
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid using common utility
        this.drawGrid(this.grid);
        
        // Draw each ant
        this.ants.forEach(ant => {
            const antX = ant.x * this.cellSize + this.cellSize / 2;
            const antY = ant.y * this.cellSize + this.cellSize / 2;
            this.drawActor(antX, antY, this.cellSize / 3);
            
            // Draw direction indicator using common utility
            const directionAngle = ant.direction * Math.PI / 2;
            this.drawDirectionIndicator(antX, antY, directionAngle, this.cellSize / 2, '#ffffff', 2);
        });
    }
    
    setSpeed(stepsPerSecond) {
        this.speed = Math.max(1, Math.min(60, stepsPerSecond));
        this.updateInterval = 1000 / this.speed;
    }
    
    addAnt() {
        // Add a new ant at a random position
        const newAnt = {
            x: Math.floor(Math.random() * this.cols),
            y: Math.floor(Math.random() * this.rows),
            direction: Math.floor(Math.random() * 4)
        };
        this.ants.push(newAnt);
        
        // Draw immediately so the ant is visible even when paused
        this.draw();
    }
    
    randomize() {
        // Clear existing pattern
        this.initGrid();
        
        // Fill with random cells (50% density of white cells)
        this.cellCount = this.randomizeGrid(this.grid, 0.5);
        this.generation = 0;
        this.draw();
    }
}

// Simulation factory
class SimulationFactory {
    static createSimulation(type, canvas, ctx) {
        switch (type) {
            case 'conway':
                return new ConwayGameOfLife(canvas, ctx);
            case 'termite':
                return new TermiteAlgorithm(canvas, ctx);
            case 'langton':
                return new LangtonsAnt(canvas, ctx);
            default:
                throw new Error(`Unknown simulation type: ${type}`);
        }
    }
} 