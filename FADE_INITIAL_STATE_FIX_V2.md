# Fade Initial State Fix - Version 2

## Problem
When the simulation is first started after loading the page or after clicking the Reset button, all the inactive cells become lit, then fade back to black. This does not happen if the simulation has already been running, then is paused, then is restarted.

## Root Cause Analysis
The previous fix using `isFirstGeneration` check was insufficient because:
1. On generation 0, no fade data was created (correct)
2. On generation 1 (when simulation starts), `isFirstGeneration` was false, so fade data was created for ALL inactive cells
3. This included cells that were initially inactive and should remain black

The issue was that we needed to track which cells were initially inactive (at generation 0) and never create fade data for them, regardless of the current generation.

## Solution
1. **Initial State Tracking**: Added `this.initialInactiveCells` Set to track cells that were inactive from the very beginning (generation 0)
2. **Generation 0 Processing**: On generation 0, populate the `initialInactiveCells` Set and return early without processing fade states
3. **Conditional Fade Data Creation**: Only create fade data for inactive cells if they are NOT in the `initialInactiveCells` Set
4. **State Management**: Clear `initialInactiveCells` when `clearFadeStates()` is called (during reset/clear operations)
5. **Dynamic Updates**: Remove cells from `initialInactiveCells` when they become active

## Code Changes

### BaseSimulation.updateFadeStates(grid)
```javascript
// If this is the first generation (generation 0), initialize the initial state tracking
if (currentGeneration === 0) {
    // Initialize tracking of cells that were inactive from the start
    if (!this.initialInactiveCells) {
        this.initialInactiveCells = new Set();
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (!grid[row][col]) {
                    this.initialInactiveCells.add(`${row},${col}`);
                }
            }
        }
    }
    return; // Don't process fade states on generation 0
}

// ... rest of the method ...

if (isActive) {
    // Cell is active - remove fade state (instant full brightness)
    this.cellFadeStates.delete(cellKey);
    // Remove from initial inactive set if it was there
    this.initialInactiveCells.delete(cellKey);
} else {
    // Cell is inactive - check if we need to increment fade count
    const fadeData = this.cellFadeStates.get(cellKey);
    if (!fadeData) {
        // Only create fade data if this cell was not initially inactive
        if (!this.initialInactiveCells.has(cellKey)) {
            // First time seeing this inactive cell - start fade
            this.cellFadeStates.set(cellKey, {
                fadeCount: 1,
                lastUpdateGeneration: currentGeneration
            });
        }
        // If it was initially inactive, don't create fade data - cell remains black
    }
    // ... rest of fade logic ...
}
```

### BaseSimulation.clearFadeStates()
```javascript
clearFadeStates() {
    this.cellFadeStates.clear();
    this.initialInactiveCells = null;
}
```

## Expected Behavior
1. **Initial Load**: All inactive cells remain black when the simulation starts
2. **Reset**: All inactive cells remain black after clicking Reset
3. **Toggle to Active**: Cell becomes fully bright instantly
4. **Toggle to Inactive**: Cell starts fading from 80% brightness (for 5 cycles)
5. **Restart After Pause**: No unexpected lighting of inactive cells

## Testing
Use `test-fade-initial-state-simple.html` to verify:
- Initial state: Cell [1,1] should have `fadeFactor=0, fadeData=null`
- After starting: Cell [1,1] should still have `fadeFactor=0, fadeData=null`
- After reset: Cell [1,1] should have `fadeFactor=0, fadeData=null`

All tests should show "✓ PASS" for cells remaining black. 