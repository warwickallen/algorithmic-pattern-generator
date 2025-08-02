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
        
        this.update();
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
}

// Conway's Game of Life
class ConwayGameOfLife extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.grid = [];
        this.nextGrid = [];
    }
    
    init() {
        super.init();
        this.initGrids();
    }
    
    resize() {
        super.resize();
        this.initGrids();
    }
    
    initGrids() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
        this.nextGrid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    }
    
    reset() {
        super.reset();
        this.initGrids();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.initGrids();
        this.draw();
    }
    
    update() {
        this.generation++;
        this.cellCount = 0;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const neighbours = this.countNeighbours(row, col);
                const isAlive = this.grid[row][col];
                
                if (isAlive) {
                    this.nextGrid[row][col] = neighbours === 2 || neighbours === 3;
                } else {
                    this.nextGrid[row][col] = neighbours === 3;
                }
                
                if (this.nextGrid[row][col]) {
                    this.cellCount++;
                }
            }
        }
        
        // Swap grids
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    }
    
    countNeighbours(row, col) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                
                const nr = (row + dr + this.rows) % this.rows;
                const nc = (col + dc + this.cols) % this.cols;
                
                if (this.grid[nr][nc]) {
                    count++;
                }
            }
        }
        return count;
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff00';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    this.ctx.fillRect(
                        col * this.cellSize,
                        row * this.cellSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
    }
    
    toggleCell(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
            this.grid[row][col] = !this.grid[row][col];
            this.cellCount = this.grid.flat().filter(cell => cell).length;
            this.draw();
        }
    }
}

// Termite Algorithm
class TermiteAlgorithm extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.termites = [];
        this.woodChips = new Set();
        this.maxTermites = 50;
    }
    
    init() {
        super.init();
        this.initTermites();
        this.initWoodChips();
    }
    
    resize() {
        super.resize();
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
    
    reset() {
        super.reset();
        this.initTermites();
        this.initWoodChips();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.woodChips.clear();
        this.termites.forEach(termite => termite.carrying = false);
        this.draw();
    }
    
    update() {
        this.generation++;
        this.cellCount = this.woodChips.size;
        
        this.termites.forEach(termite => {
            // Move termite
            const speed = 2;
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
        this.ctx.fillStyle = '#8B4513';
        this.woodChips.forEach(chipKey => {
            const [x, y] = chipKey.split(',').map(Number);
            this.ctx.fillRect(x, y, this.cellSize - 1, this.cellSize - 1);
        });
        
        // Draw termites
        this.ctx.fillStyle = '#FF0000';
        this.termites.forEach(termite => {
            this.ctx.beginPath();
            this.ctx.arc(termite.x, termite.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw direction indicator
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(termite.x, termite.y);
            this.ctx.lineTo(
                termite.x + Math.cos(termite.angle) * 8,
                termite.y + Math.sin(termite.angle) * 8
            );
            this.ctx.stroke();
        });
    }
}

// Langton's Ant
class LangtonsAnt extends BaseSimulation {
    constructor(canvas, ctx) {
        super(canvas, ctx);
        this.ant = { x: 0, y: 0, direction: 0 }; // 0: up, 1: right, 2: down, 3: left
        this.grid = [];
        this.rules = ['R', 'L']; // Standard Langton's ant rules
    }
    
    init() {
        super.init();
        this.initGrid();
        this.resetAnt();
    }
    
    resize() {
        super.resize();
        this.initGrid();
        this.resetAnt();
    }
    
    initGrid() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    }
    
    resetAnt() {
        this.ant.x = Math.floor(this.cols / 2);
        this.ant.y = Math.floor(this.rows / 2);
        this.ant.direction = 0;
    }
    
    reset() {
        super.reset();
        this.initGrid();
        this.resetAnt();
        this.draw();
    }
    
    clear() {
        super.clear();
        this.initGrid();
        this.resetAnt();
        this.draw();
    }
    
    update() {
        this.generation++;
        
        // Get current cell state
        const currentCell = this.grid[this.ant.y][this.ant.x];
        
        // Flip the cell
        this.grid[this.ant.y][this.ant.x] = !currentCell;
        
        // Update cell count
        this.cellCount = this.grid.flat().filter(cell => cell).length;
        
        // Turn based on cell state
        const rule = this.rules[currentCell ? 1 : 0];
        if (rule === 'R') {
            this.ant.direction = (this.ant.direction + 1) % 4;
        } else {
            this.ant.direction = (this.ant.direction + 3) % 4;
        }
        
        // Move forward
        switch (this.ant.direction) {
            case 0: this.ant.y = (this.ant.y - 1 + this.rows) % this.rows; break; // Up
            case 1: this.ant.x = (this.ant.x + 1) % this.cols; break; // Right
            case 2: this.ant.y = (this.ant.y + 1) % this.rows; break; // Down
            case 3: this.ant.x = (this.ant.x - 1 + this.cols) % this.cols; break; // Left
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.ctx.fillStyle = '#FFFFFF';
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.grid[row][col]) {
                    this.ctx.fillRect(
                        col * this.cellSize,
                        row * this.cellSize,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
        
        // Draw ant
        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(
            this.ant.x * this.cellSize + this.cellSize / 2,
            this.ant.y * this.cellSize + this.cellSize / 2,
            this.cellSize / 3,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Draw direction indicator
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(
            this.ant.x * this.cellSize + this.cellSize / 2,
            this.ant.y * this.cellSize + this.cellSize / 2
        );
        
        const directionX = Math.cos(this.ant.direction * Math.PI / 2) * this.cellSize / 2;
        const directionY = Math.sin(this.ant.direction * Math.PI / 2) * this.cellSize / 2;
        
        this.ctx.lineTo(
            this.ant.x * this.cellSize + this.cellSize / 2 + directionX,
            this.ant.y * this.cellSize + this.cellSize / 2 + directionY
        );
        this.ctx.stroke();
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