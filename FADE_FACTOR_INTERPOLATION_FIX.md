# Fade Factor Interpolation Fix

## Problem

The fade-to-black effect was showing a backwards progression: 100% → 20% → 40% → 60% → 80% → 0% instead of the expected 100% → 80% → 60% → 40% → 20% → 0%.

Additionally, when the page was first loaded, all cells appeared lit, and when a cell was toggled, it would be fully lit for a moment then immediately turn fully dark.

## Root Cause

The issue was in the `drawCell` method in `simulations.js`. The fade factor calculation was correct:

```javascript
fadeFactor = 1 - (fadeCount / this.fadeOutCycles)
```

This produces the correct progression:
- `fadeCount = 0`: `fadeFactor = 1` (100% brightness)
- `fadeCount = 1`: `fadeFactor = 0.8` (80% brightness)
- `fadeCount = 2`: `fadeFactor = 0.6` (60% brightness)
- etc.

However, the color interpolation was using the fade factor incorrectly:

```javascript
// INCORRECT - this was backwards
finalColor = this.interpolateColor(brightColor, '#000000', fadeFactor);
```

The `interpolateColor` function treats the factor as "how much to move towards the second color". So:
- `fadeFactor = 1` meant "100% towards black" (making it black)
- `fadeFactor = 0` meant "0% towards black" (keeping it bright)

This was the opposite of what we wanted.

## Solution

Fixed the interpolation by inverting the fade factor:

```javascript
// CORRECT - now fadeFactor = 1 means full brightness, fadeFactor = 0 means black
finalColor = this.interpolateColor(brightColor, '#000000', 1 - fadeFactor);
```

Now:
- `fadeFactor = 1` → `1 - 1 = 0` → "0% towards black" → full brightness
- `fadeFactor = 0.8` → `1 - 0.8 = 0.2` → "20% towards black" → 80% brightness
- `fadeFactor = 0` → `1 - 0 = 1` → "100% towards black" → black

## Expected Behavior

After this fix:
1. **Initial Load**: Cells should appear at their correct brightness levels (not all lit)
2. **Fade Progression**: When a cell is deactivated, it should fade smoothly: 100% → 80% → 60% → 40% → 20% → 0%
3. **Cell Toggle**: When a cell is toggled, it should immediately show the correct brightness level
4. **Activation**: When a cell is activated, it should immediately show full brightness

## Testing

Use `test-fade-factor-fix.html` to verify the fix:

1. Start the test with any simulation type
2. Watch the debug log for fade progression
3. Toggle cell [1,1] to see the fade effect
4. Verify the progression follows: 100% → 80% → 60% → 40% → 20% → 0%

## Files Modified

- `simulations.js`: Fixed the fade factor interpolation in `drawCell` method
- `test-fade-factor-fix.html`: New test page to verify the fix

## Related Issues

This fix addresses:
- The backwards fade progression (100% → 20% → 40% → 60% → 80% → 0%)
- All cells appearing lit on page load
- Cells immediately turning dark when toggled
- Disconnect between console logs (correct) and visual effect (incorrect) 