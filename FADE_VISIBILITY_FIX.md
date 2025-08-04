# Fade-to-Black Visibility Fix

## Problem
The fade-to-black effect was not visible even at 1 step/second simulation speed. Users reported that cells appeared to change to black instantly instead of fading gradually.

## Root Cause Analysis
The issue was in the `drawGrid` method in `BaseSimulation`. The method was only rendering **active cells** (cells where `grid[row][col]` is true), but the fade effect needed to render **all cells** (both active and inactive) to be visible.

### Original Problematic Code:
```javascript
drawGrid(grid, cellRenderer = null) {
    // ... clear canvas and update fade states ...
    
    for (let row = 0; row < grid.length; row++) {
        const rowData = grid[row];
        for (let col = 0; col < rowData.length; col++) {
            if (rowData[col]) {  // ❌ Only rendered active cells!
                const x = col * this.cellSize;
                const y = row * this.cellSize;
                // ... render cell ...
            }
        }
    }
}
```

This meant that inactive cells that were fading were never rendered, so the fade effect was invisible.

## Solution

### 1. Modified `drawGrid` to Render All Cells
```javascript
drawGrid(grid, cellRenderer = null) {
    // ... clear canvas and update fade states ...
    
    for (let row = 0; row < grid.length; row++) {
        const rowData = grid[row];
        for (let col = 0; col < rowData.length; col++) {
            const x = col * this.cellSize;
            const y = row * this.cellSize;
            const isActive = rowData[col];  // ✅ Pass cell state
            
            if (cellRenderer && typeof cellRenderer === 'function') {
                cellRenderer(x, y, row, col, isActive);
            } else {
                this.drawCell(x, y, null, isActive);  // ✅ Pass isActive parameter
            }
        }
    }
}
```

### 2. Enhanced `getCellFadeFactor` Method
The method now accepts an `isActive` parameter to properly determine fade factors:

```javascript
getCellFadeFactor(row, col, isActive = null) {
    const cellKey = `${row},${col}`;
    const fadeData = this.cellFadeStates.get(cellKey);
    
    if (isActive === null) {
        // Backward compatibility: assume active if no fade data
        if (!fadeData) {
            return 1; // Full brightness
        }
    } else if (isActive) {
        // Active cells should have no fade data and return full brightness
        return 1;
    } else {
        // Inactive cells: if no fade data, they're black; if fading, calculate fade factor
        if (!fadeData) {
            return 0; // Black
        }
    }
    
    const fadeCount = fadeData.fadeCount || 0;
    return Math.max(0, 1 - (fadeCount / this.fadeOutCycles));
}
```

### 3. Updated `drawCell` Method
The method now accepts an `isActive` parameter and skips rendering completely faded cells:

```javascript
drawCell(x, y, color = null, isActive = null) {
    const { col, row } = this.screenToGrid(x, y);
    const fadeFactor = this.getCellFadeFactor(row, col, isActive);
    
    // If cell is completely faded (fadeFactor = 0), don't render anything
    if (fadeFactor === 0) {
        return;
    }
    
    // ... rest of rendering logic with fade effect ...
}
```

## Key Changes Made

1. **`BaseSimulation.drawGrid()`**: Now renders all cells, not just active ones
2. **`BaseSimulation.getCellFadeFactor()`**: Added `isActive` parameter for proper fade calculation
3. **`BaseSimulation.drawCell()`**: Added `isActive` parameter and early return for fully faded cells
4. **Test updates**: Updated `test-suite.html` to use new method signatures

## Testing

Created `test-fade-fix.html` to verify the fade effect is now visible:
- Set speed to 1 step/second
- Set fade cycles to 3-5
- Randomize a pattern and start the simulation
- Observe gradual fade effect as cells die

## Result
The fade-to-black effect is now clearly visible at slow simulation speeds, with cells gradually transitioning from their active color to black over the specified number of cycles. 