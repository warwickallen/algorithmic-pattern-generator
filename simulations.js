// Base simulation class
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
        
        // For Conway's Game of Life and Langton's Ant, control update frequency based on speed
        if (this.constructor.name === 'ConwayGameOfLife' || this.constructor.name === 'LangtonsAnt') {
            if (currentTime - this.lastUpdateTime >= this.updateInterval) {
                this.update();
                this.lastUpdateTime = currentTime;
            }
        } else {
            this.update();
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
    
    // Common grid utilities
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
    
    countLiveCells(grid) {
        return grid.flat().filter(cell => cell).length;
    }
    
    // Common neighbour counting utility
    countNeighbours(grid, row, col, rows, cols, wrapAround = true) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                
                let nr, nc;
                if (wrapAround) {
                    nr = (row + dr + rows) % rows;
                    nc = (col + dc + cols) % cols;
                } else {
                    nr = row + dr;
                    nc = col + dc;
                    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                }
                
                if (grid[nr][nc]) {
                    count++;
                }
            }
        }
        return count;
    }
    
    // Common grid rendering utility
    drawGrid(grid, cellRenderer = null) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col]) {
                    const x = col * this.cellSize;
                    const y = row * this.cellSize;
                    
                    if (cellRenderer && typeof cellRenderer === 'function') {
                        cellRenderer(x, y, row, col, grid[row][col]);
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
            for (let col = 0; col < grid[row].length; col++) {
                grid[row][col] = Math.random() < density;
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
    
    // Gradient colour utilities
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
    
    // Glow effect utility
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
    
    // Common cell rendering method
    drawCell(x, y, color = null) {
        if (!color) {
            color = this.getGradientColor(x, y, '#00ff00', '#4a90e2');
        }
        
        this.ctx.fillStyle = color;
        this.setGlowEffect(color, 20);
        
        this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
        
        this.clearGlowEffect();
    }
    
    // Common actor rendering method (for termites and ants)
    drawActor(x, y, radius, color = null) {
        if (!color) {
            color = this.getGradientColor(x, y, '#ff6b35', '#ff4757');
        }
        
        this.ctx.fillStyle = color;
        this.setGlowEffect(color, 25);
        
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
    
    setSpeed(fps) {
        this.speed = Math.max(1, Math.min(60, fps));
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
        this.speedMultiplier = 1.0;
        this.baseSpeed = 2;
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
            const speed = this.baseSpeed * this.speedMultiplier;
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
    
    setSpeed(multiplier) {
        this.speedMultiplier = multiplier;
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