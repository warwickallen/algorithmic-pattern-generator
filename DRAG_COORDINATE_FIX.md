# Drag Coordinate Fix

## Problem Description

The user reported that when dragging to toggle cells, the wrong cells were being toggled. Specifically:
- When dragging horizontally, a vertical line was drawn at a different location on the canvas
- When dragging vertically, a horizontal line was drawn at a different location on the canvas

This indicated that the x and y coordinates were being transposed somewhere in the drag functionality.

## Root Cause Analysis

The issue was in the `toggleCellsAlongPath` method in `simulations.js`. The problem was in how parameters were passed to the `getLinePoints` method:

### Original Code (Incorrect)
```javascript
const points = this.getLinePoints(startGrid.row, startGrid.col, endGrid.row, endGrid.col);
```

### The Problem
The `getLinePoints` method expects parameters in the order `(col0, row0, col1, row1)` - grid coordinates where the first parameter is the column (x-coordinate) and the second is the row (y-coordinate). However, the original code was passing `(row, col, row, col)` which transposed the coordinates.

## Solution

### 1. Fixed Parameter Order
Changed the parameter order in `toggleCellsAlongPath`:

```javascript
// Before (incorrect)
const points = this.getLinePoints(startGrid.row, startGrid.col, endGrid.row, endGrid.col);

// After (correct)
const points = this.getLinePoints(startGrid.col, startGrid.row, endGrid.col, endGrid.row);
```

### 2. Improved Method Signature
Updated the `getLinePoints` method signature to make the parameter order clearer:

```javascript
// Before
getLinePoints(x0, y0, x1, y1) {

// After
getLinePoints(col0, row0, col1, row1) {
```

### 3. Updated Variable Names
Changed variable names within `getLinePoints` to match the grid coordinate system:

```javascript
// Before
let x = x0, y = y0;
points.push({ row: y, col: x });

// After
let col = col0, row = row0;
points.push({ row: row, col: col });
```

## Coordinate Flow

The corrected coordinate flow is now:

1. **Screen coordinates** → `toggleCellsAlongPath(startX, startY, endX, endY)`
2. **Convert to grid** → `screenToGrid()` → `{ col, row }`
3. **Pass to line algorithm** → `getLinePoints(startCol, startRow, endCol, endRow)`
4. **Get grid points** → Returns `[{ row, col }, { row, col }, ...]`
5. **Convert back to screen** → `gridToScreen(point.col, point.row)` → `{ x, y }`
6. **Toggle cells** → `toggleCellAtPosition(screenX, screenY)`

## Testing

### Manual Testing
Created `test-drag-fix.html` for interactive testing:
- Load different simulations
- Test horizontal and vertical drags
- Verify that horizontal drags create horizontal lines
- Verify that vertical drags create vertical lines

### Automated Testing
Added `Drag Coordinate Fix` test to `test-suite.html`:
- Tests horizontal drag specifically (x changes, y stays same)
- Tests vertical drag specifically (y changes, x stays same)
- Verifies that both directions work correctly

## Files Modified

1. **`simulations.js`**:
   - Fixed parameter order in `toggleCellsAlongPath`
   - Updated `getLinePoints` method signature and variable names

2. **`test-suite.html`**:
   - Added comprehensive coordinate fix test

3. **`test-drag-fix.html`** (new):
   - Interactive test page for manual verification

## Verification

The fix ensures that:
- ✅ Horizontal drags create horizontal lines of toggled cells
- ✅ Vertical drags create vertical lines of toggled cells
- ✅ Single-click toggling continues to work correctly
- ✅ All three simulations (Conway, Termite, Langton) work with the fix
- ✅ No performance impact on existing functionality

## Impact

This fix resolves the coordinate transposition bug that was preventing proper drag-to-toggle functionality across all simulations. The drag feature now works as expected, allowing users to draw lines of cells by clicking and dragging in any direction. 