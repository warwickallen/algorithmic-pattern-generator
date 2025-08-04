# Fade Initial State Fix - Version 4

## Problem
When the simulation is first started after loading the page or after clicking the Reset button, all the inactive cells become lit, then fade back to black. This does not happen if the simulation has already been running, then is paused, then is restarted.

## Root Cause Analysis
The issue was in the timing of when `updateFadeStates()` was called relative to when `this.generation` was incremented:

1. In all simulation `update()` methods, `this.generation++` was called at the very beginning
2. Then the simulation logic ran
3. Finally, `this.updateFadeStates()` was called at the end
4. This meant that when `updateFadeStates()` was called, `this.generation` was already 1 (or higher)
5. Since `currentGeneration === 1`, the generation 0 logic was skipped, and `this.initialInactiveCells` was never populated
6. When processing inactive cells, the condition `if (!this.initialInactiveCells.has(cellKey))` was always true (because the Set was empty), so fade data was created for all inactive cells

## Solution
Move the `updateFadeStates()` call to the very beginning of each simulation's `update()` method, **before** `this.generation++` is called. This ensures that:

1. On the first call to `update()` (when simulation starts), `this.generation` is still 0
2. `updateFadeStates()` processes generation 0 correctly, populating `this.initialInactiveCells`
3. Then `this.generation++` increments it to 1
4. On subsequent calls, `updateFadeStates()` correctly identifies initially inactive cells

## Code Changes

### ConwayGameOfLife.update()
```javascript
update() {
    // Update fade states before incrementing generation
    // This ensures we can properly track initial inactive cells on generation 0
    this.updateFadeStates(this.grids.current);
    
    this.generation++;
    
    // ... rest of simulation logic ...
}
```

### TermiteAlgorithm.update()
```javascript
update() {
    // Create a virtual grid for fade state tracking
    const virtualGrid = this.createGrid(this.rows, this.cols, false);
    
    // Mark active cells in virtual grid
    this.woodChips.forEach(chipKey => {
        const [x, y] = chipKey.split(',').map(Number);
        const { col, row } = this.screenToGrid(x, y);
        if (this.isValidGridPosition(row, col)) {
            virtualGrid[row][col] = true;
        }
    });
    
    // Update fade states before incrementing generation
    // This ensures we can properly track initial inactive cells on generation 0
    this.updateFadeStates(virtualGrid);
    
    this.generation++;
    
    // ... rest of simulation logic ...
}
```

### LangtonsAnt.update()
```javascript
update() {
    // Update fade states before incrementing generation
    // This ensures we can properly track initial inactive cells on generation 0
    this.updateFadeStates(this.grid);
    
    this.generation++;
    
    // ... rest of simulation logic ...
}
```

## Expected Behavior
1. **Initial Load**: All inactive cells remain black when the simulation starts
2. **Reset**: All inactive cells remain black after clicking Reset
3. **Toggle to Active**: Cell becomes fully bright instantly
4. **Toggle to Inactive**: Cell starts fading from 80% brightness (for 5 cycles)
5. **Restart After Pause**: No unexpected lighting of inactive cells
6. **No TypeError**: The `initialInactiveCells` Set is always properly initialized

## Testing
Use `test-fade-initial-state-simple.html` to verify:
- Initial state: Cell [1,1] should have `fadeFactor=0, fadeData=null`
- After starting: Cell [1,1] should still have `fadeFactor=0, fadeData=null`
- After reset: Cell [1,1] should have `fadeFactor=0, fadeData=null`

All tests should show "✓ PASS" for cells remaining black, and no TypeError should occur.

## Previous Versions
- **Version 1**: Initial attempt with `isFirstGeneration` check (failed)
- **Version 2**: Introduction of `initialInactiveCells` Set (failed due to timing issue)
- **Version 3**: Fixed `TypeError` by ensuring Set initialization (failed due to timing issue)
- **Version 4**: Fixed timing issue by moving `updateFadeStates()` before `generation++` (current) 