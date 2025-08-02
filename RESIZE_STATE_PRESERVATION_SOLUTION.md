# Resize State Preservation Solution

## Problem Description

The "Conway's Game of Life" and "Langton's Ant" simulations were experiencing a critical issue where the simulation area would get completely cleared when the screen resized, including when the "Immersive Mode" button was clicked. This was happening because:

1. The `resize()` method in both simulations was calling `initData()` which reinitialised all simulation data
2. For Conway's Game of Life, this meant creating new empty grids
3. For Langton's Ant, this meant clearing the grid and resetting ant positions
4. The immersive mode toggle and window resize events were triggering these destructive resize operations

## Root Cause Analysis

The issue was in the `BaseSimulation.resize()` method and its overrides in the specific simulation classes:

```javascript
// BaseSimulation.resize() - called on window resize
resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    // ... recalculate dimensions ...
    this.clearCaches();
}

// ConwayGameOfLife.resize() - destructive
resize() {
    super.resize();
    this.initData(); // This creates new empty grids!
}

// LangtonsAnt.resize() - destructive  
resize() {
    super.resize();
    this.initData(); // This clears grid and resets ants!
}
```

## Solution Implementation

### 1. Added State Preservation Framework

Created a new method `resizePreserveState()` in the `BaseSimulation` class that preserves simulation state during resize operations:

```javascript
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
```

### 2. Conway's Game of Life State Preservation

Extended the `ConwayGameOfLife` class to preserve grid state:

```javascript
// Override to preserve grid state during resize
resizePreserveState() {
    const preservedState = this.getState();
    this.resize();
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
        // Copy preserved grid data to new grid dimensions
        const oldCurrent = state.grids.current;
        const oldNext = state.grids.next;
        
        this.initGrids(); // Clear new grids
        
        // Copy data handling size differences
        const minRows = Math.min(oldCurrent.length, this.rows);
        const minCols = Math.min(oldCurrent[0]?.length || 0, this.cols);
        
        for (let row = 0; row < minRows; row++) {
            for (let col = 0; col < minCols; col++) {
                this.grids.current[row][col] = oldCurrent[row][col];
                this.grids.next[row][col] = oldNext[row][col];
            }
        }
        
        this.cellCount = this.countLiveCells(this.grids.current);
    }
}
```

### 3. Langton's Ant State Preservation

Extended the `LangtonsAnt` class to preserve both grid and ant state:

```javascript
// Override to preserve grid and ant state during resize
resizePreserveState() {
    const preservedState = this.getState();
    this.resize();
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
        // Copy preserved grid data to new grid dimensions
        const oldGrid = state.grid;
        this.initGrid();
        
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
    
    this.cellCount = this.countLiveCells(this.grid);
}
```

### 4. Updated Application Event Handlers

Modified the main application (`app.js`) to use the new state-preserving resize method:

```javascript
// Window resize handler
const throttledResize = PerformanceOptimizer.throttle(() => {
    if (this.currentSimulation) {
        this.currentSimulation.resizePreserveState(); // Use state-preserving resize
        this.currentSimulation.draw();
    }
}, 250);

// Immersive mode toggle
setTimeout(() => {
    if (this.currentSimulation) {
        this.currentSimulation.resizePreserveState(); // Use state-preserving resize
        this.currentSimulation.draw();
    }
}, 300);
```

## Key Features of the Solution

### 1. **Minimal Change Principle**
- Added new methods without modifying existing `resize()` functionality
- Existing reset/clear operations still work as expected
- Backward compatible with existing code

### 2. **Robust State Preservation**
- Handles grid size changes gracefully
- Preserves ant positions and directions
- Maintains generation counts and cell counts
- Handles edge cases where new grid is smaller than old grid

### 3. **Performance Optimised**
- Uses efficient array copying with spread operators
- Maintains existing performance optimisations
- Minimal memory overhead for state preservation

### 4. **Extensible Design**
- Framework can be easily extended to other simulations
- Clear separation between base functionality and simulation-specific state
- Easy to add new state properties in the future

## Testing

Created a comprehensive test file (`test-resize-preservation.html`) that:

1. **Tests Conway's Game of Life**:
   - Verifies grid patterns are preserved during resize
   - Checks cell count remains consistent
   - Tests immersive mode toggle

2. **Tests Langton's Ant**:
   - Verifies ant positions and directions are preserved
   - Checks grid state is maintained
   - Tests ant count consistency

3. **Provides Visual Feedback**:
   - Success/error status messages
   - Real-time state validation
   - Interactive test controls

## Benefits

1. **Improved User Experience**: Simulations no longer lose state during resize operations
2. **Better Immersive Mode**: Users can toggle immersive mode without losing progress
3. **Responsive Design**: Window resizing works seamlessly across all screen sizes
4. **Maintainable Code**: Clear separation of concerns and extensible architecture
5. **Performance**: Minimal overhead with efficient state preservation

## Future Considerations

1. **Termite Algorithm**: Could be extended to preserve termite positions and wood chip locations
2. **Additional Simulations**: New simulations can easily implement state preservation
3. **Advanced State**: Could preserve more complex state like simulation history or patterns
4. **Memory Management**: Could add state compression for very large grids

This solution effectively addresses the original issue while maintaining code quality and performance standards. 