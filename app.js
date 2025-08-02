// Main application class
class AlgorithmicPatternGenerator {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentSimulation = null;
        this.currentType = 'conway';
        this.isImmersive = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.createSimulation(this.currentType);
        this.updateUI();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (this.currentSimulation) {
                this.currentSimulation.resize();
                this.currentSimulation.draw();
            }
        });
    }
    
    setupEventListeners() {
        // Simulation selector
        document.getElementById('simulation-select').addEventListener('change', (e) => {
            this.switchSimulation(e.target.value);
        });
        
        // Control buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startSimulation();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.pauseSimulation();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetSimulation();
        });
        
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearSimulation();
        });
        
        // Immersive mode toggle
        document.getElementById('immersive-btn').addEventListener('click', () => {
            this.toggleImmersiveMode();
        });
        
        // Canvas interactions
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    createSimulation(type) {
        if (this.currentSimulation) {
            this.currentSimulation.pause();
        }
        
        this.currentType = type;
        this.currentSimulation = SimulationFactory.createSimulation(type, this.canvas, this.ctx);
        this.currentSimulation.init();
        this.updateUI();
    }
    
    switchSimulation(type) {
        this.createSimulation(type);
    }
    
    startSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.start();
            this.updateUI();
        }
    }
    
    pauseSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.pause();
            this.updateUI();
        }
    }
    
    resetSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.reset();
            this.updateUI();
        }
    }
    
    clearSimulation() {
        if (this.currentSimulation) {
            this.currentSimulation.clear();
            this.updateUI();
        }
    }
    
    toggleImmersiveMode() {
        this.isImmersive = !this.isImmersive;
        document.getElementById('app').classList.toggle('immersive', this.isImmersive);
        
        const btn = document.getElementById('immersive-btn');
        if (this.isImmersive) {
            btn.textContent = 'Exit Immersive';
        } else {
            btn.textContent = i18n.t('immersive-btn');
        }
        
        // Resize canvas when toggling immersive mode
        setTimeout(() => {
            if (this.currentSimulation) {
                this.currentSimulation.resize();
                this.currentSimulation.draw();
            }
        }, 300);
    }
    
    handleCanvasClick(e) {
        if (!this.currentSimulation) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Only allow cell toggling for Conway's Game of Life
        if (this.currentType === 'conway' && this.currentSimulation.toggleCell) {
            this.currentSimulation.toggleCell(x, y);
            this.updateUI();
        }
    }
    
    handleKeyboard(e) {
        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (this.currentSimulation?.isRunning) {
                    this.pauseSimulation();
                } else {
                    this.startSimulation();
                }
                break;
            case 'r':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.resetSimulation();
                }
                break;
            case 'c':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.clearSimulation();
                }
                break;
            case 'i':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleImmersiveMode();
                }
                break;
            case 'Escape':
                if (this.isImmersive) {
                    this.toggleImmersiveMode();
                }
                break;
        }
    }
    
    updateUI() {
        if (!this.currentSimulation) return;
        
        const stats = this.currentSimulation.getStats();
        const isRunning = this.currentSimulation.isRunning;
        
        // Update button states
        document.getElementById('start-btn').disabled = isRunning;
        document.getElementById('pause-btn').disabled = !isRunning;
        
        // Update stats
        document.getElementById('generation-count').textContent = stats.generation;
        document.getElementById('cell-count').textContent = stats.cellCount;
        document.getElementById('fps').textContent = stats.fps;
        
        // Update simulation selector
        document.getElementById('simulation-select').value = this.currentType;
    }
    
    // Update stats continuously
    startStatsUpdate() {
        setInterval(() => {
            this.updateUI();
        }, 100);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AlgorithmicPatternGenerator();
    app.startStatsUpdate();
    
    // Make app globally accessible for debugging
    window.app = app;
}); 