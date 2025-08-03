# Termite Algorithm Coverage Fix

## Problem
When the Coverage slider was set to 100% in the Termite Algorithm, only approximately 95% of cells were being activated, unlike Conway's Game of Life and Langton's Ant which achieved 100% coverage.

## Root Cause
The Termite Algorithm used a different randomization approach than the other simulations:

### Original Termite Algorithm Approach (Problematic)
```javascript
randomize(likelihood = 0.3) {
    this.woodChips.clear();
    const numChips = Math.floor((this.cols * this.rows) * likelihood);
    
    for (let i = 0; i < numChips; i++) {
        const x = Math.floor(Math.random() * this.cols) * this.cellSize;
        const y = Math.floor(Math.random() * this.rows) * this.cellSize;
        this.woodChips.add(`${x},${y}`);
    }
    // ...
}
```

This approach:
- Calculated the total number of wood chips to place: `numChips = Math.floor((this.cols * this.rows) * likelihood)`
- Randomly placed that many chips across the grid
- **Problem**: When `likelihood = 1.0`, it placed exactly `this.cols * this.rows` chips, but since placement was random, some positions could receive multiple chips (collisions) while others received none
- **Result**: Approximately 95% coverage instead of 100%

### Other Simulations Approach (Working)
```javascript
// Conway's Game of Life and Langton's Ant
randomize(likelihood = 0.3) {
    // ...
    this.cellCount = this.randomizeGrid(this.grid, likelihood);
    // ...
}

// BaseSimulation.randomizeGrid method
randomizeGrid(grid, density = 0.3) {
    for (let row = 0; row < grid.length; row++) {
        const rowData = grid[row];
        for (let col = 0; col < rowData.length; col++) {
            rowData[col] = Math.random() < density;
        }
    }
    return this.countLiveCells(grid);
}
```

This approach:
- Iterates through each cell individually
- Sets each cell to active with probability `Math.random() < density`
- **Result**: When `likelihood = 1.0`, every cell has a 100% chance of being set to active

## Solution
Modified the Termite Algorithm's `randomize` method to use the same cell-by-cell approach as the other simulations:

### Fixed Termite Algorithm Approach
```javascript
randomize(likelihood = 0.3) {
    this.woodChips.clear();
    
    // Use the same approach as other simulations for consistent coverage
    for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
            if (Math.random() < likelihood) {
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                this.woodChips.add(`${x},${y}`);
            }
        }
    }
    
    // Reset termites to not carrying anything
    this.termites.forEach(termite => termite.carrying = false);
    
    // Redraw to show the new random pattern
    this.draw();
}
```

## Result
- **Before**: 100% coverage slider resulted in ~95% actual coverage
- **After**: 100% coverage slider now results in 100% actual coverage
- **Consistency**: All three simulations now behave identically with respect to the Coverage slider

## Technical Details
The fix ensures that:
1. Each cell position is evaluated individually
2. Each cell has exactly `likelihood` probability of receiving a wood chip
3. No collisions occur (each position can only receive one chip)
4. When `likelihood = 1.0`, every cell position receives a wood chip
5. The behavior is now consistent across all simulations 