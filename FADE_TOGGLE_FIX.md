# Fade Toggle Fix

## Problem

The fade-to-black effect was showing an incorrect pattern when cells were toggled: 100% → 0% → 100% → 80% → 60% → 40% → 20% → 0%

This pattern indicated that:
1. Cell starts at 100% brightness (active)
2. Cell is deactivated → immediately goes to 0% (black)
3. Cell is reactivated → immediately goes to 100% (bright)
4. Cell is deactivated again → starts proper fade: 80% → 60% → 40% → 20% → 0%

The expected pattern should be: 100% → 80% → 60% → 40% → 20% → 0%

## Root Cause

The issue was in the `toggleCell` methods of all simulations. When a cell was toggled:

1. The grid state was changed
2. `draw()` was called immediately
3. `drawGrid()` was called, which called `drawCell()` for all cells
4. `drawCell()` called `getCellFadeFactor()` with the current grid state
5. But `updateFadeStates()` hadn't been called yet, so the fade states were out of sync

This caused the fade state management to be inconsistent with the actual grid state, leading to the incorrect visual pattern.

## Solution

Fixed the `toggleCell` methods in all three simulations to call `updateFadeStates()` before `draw()`:

### Conway's Game of Life
```javascript
toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);
    
    if (this.isValidGridPosition(row, col)) {
        this.grids.current[row][col] = !this.grids.current[row][col];
        this.cellCount = this.countLiveCells(this.grids.current);
        
        // Update fade states before drawing to ensure proper fade behavior
        this.updateFadeStates(this.grids.current);
        this.draw();
    }
}
```

### Termite Algorithm
```javascript
toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);
    
    if (this.isValidGridPosition(row, col)) {
        const gridX = col * this.cellSize;
        const gridY = row * this.cellSize;
        const chipKey = `${gridX},${gridY}`;
        
        if (this.woodChips.has(chipKey)) {
            this.woodChips.delete(chipKey);
        } else {
            this.woodChips.add(chipKey);
        }
        
        this.cellCount = this.woodChips.size;
        
        // Update fade states before drawing to ensure proper fade behavior
        const virtualGrid = this.createGrid(this.rows, this.cols, false);
        this.woodChips.forEach(chipKey => {
            const [x, y] = chipKey.split(',').map(Number);
            const { col, row } = this.screenToGrid(x, y);
            if (this.isValidGridPosition(row, col)) {
                virtualGrid[row][col] = true;
            }
        });
        this.updateFadeStates(virtualGrid);
        this.draw();
    }
}
```

### Langton's Ant
```javascript
toggleCell(x, y) {
    const { col, row } = this.screenToGrid(x, y);
    
    if (this.isValidGridPosition(row, col)) {
        this.grid[row][col] = !this.grid[row][col];
        this.cellCount = this.countLiveCells(this.grid);
        
        // Update fade states before drawing to ensure proper fade behavior
        this.updateFadeStates(this.grid);
        this.draw();
    }
}
```

## Expected Behavior

After this fix:
1. **Cell Toggle**: When a cell is toggled, it should immediately show the correct brightness level
2. **Fade Progression**: When a cell is deactivated, it should fade smoothly: 100% → 80% → 60% → 40% → 20% → 0%
3. **No Incorrect Jumps**: The cell should not jump to 0% then back to 100% before starting the fade
4. **Consistent State**: The fade states should always be in sync with the grid state

## Testing

Use `test-fade-toggle-fix.html` to verify the fix:

1. Start the test with Conway's Game of Life
2. Watch the debug log for fade progression
3. Toggle cell [1,1] to see the fade effect
4. Verify the progression follows: 100% → 80% → 60% → 40% → 20% → 0%
5. Confirm that the incorrect pattern (100% → 0% → 100% → 80% → 60% → 40% → 20% → 0%) no longer occurs

## Files Modified

- `simulations.js`: Fixed `toggleCell` methods in all three simulation classes
- `test-fade-toggle-fix.html`: New test page to verify the fix

## Related Issues

This fix addresses:
- The incorrect fade pattern when toggling cells
- The "all cells are lit" issue on page load (related to fade state sync)
- The "fully lit for a moment, then immediately turns fully dark" issue when toggling cells
- Inconsistent fade state management across all simulations 