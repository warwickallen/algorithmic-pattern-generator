# Algorithmic Pattern Generator - Enhancement Requirements

## Overview
This document outlines the requirements for enhancing the Algorithmic Pattern Generator web application. Requirements are ordered to ensure testable increments and clean code implementation.

## Design Principles
- The apps must be aesthetically pleasing.
- Aim for DRY code.

## Phase 1: Core Layout and Visual Foundation

### 1.1 Full-Window Simulation Display
**Priority**: Critical
**Description**: Make the simulation canvas occupy the entire window with floating controls.

**Requirements**:
- Canvas should fill 100% of viewport width and height
- Remove canvas border and background styling that creates a "box" appearance
- Ensure canvas is positioned absolutely to cover the entire window
- Controls should float over the simulation area using z-index layering

**Acceptance Criteria**:
- [ ] Canvas fills entire browser window
- [ ] No visible borders or background boxes around simulation
- [ ] Controls remain visible and functional over simulation
- [ ] Responsive design maintained across different screen sizes

**Test Cases**:
- Open app in different browser window sizes
- Verify canvas covers entire viewport
- Confirm controls remain accessible

### 1.2 Fix Dropdown Visibility Issue
**Priority**: Critical
**Description**: Resolve white text on white background in simulation selector dropdown.

**Requirements**:
- Ensure dropdown text is visible against background
- Maintain consistent styling with other controls
- Preserve hover effects and focus states

**Acceptance Criteria**:
- [ ] Dropdown text is clearly visible
- [ ] Consistent styling with other form elements
- [ ] Hover and focus states work correctly

**Test Cases**:
- Open dropdown and verify text visibility
- Test hover and focus interactions
- Check across different browsers

### 1.3 Implement Auto-Language Detection
**Priority**: High
**Description**: Automatically detect and set language based on browser settings.

**Requirements**:
- Detect browser language preference on page load
- Map browser language codes to supported app languages
- Fall back to default language if browser language not supported
- Maintain manual language selection capability

**Acceptance Criteria**:
- [ ] Language automatically detected from browser settings
- [ ] Graceful fallback to default language
- [ ] Manual language selection still works
- [ ] Language preference persists across sessions

**Test Cases**:
- Test with different browser language settings
- Verify fallback behavior for unsupported languages
- Confirm manual override functionality

## Phase 2: Visual Styling and User Experience

### 2.1 Match Original App Colours and Styling
**Priority**: High
**Description**: Update colours and styling to match the original applications.

**Requirements**:
- Research and document original app colour schemes.
  The original apps are:
  1. [Conway's Game of Life](https://claude.ai/public/artifacts/8b6755f3-4d39-4750-9ef6-b0c55ee558b2)
  2. [Termite Algorithm](https://claude.ai/public/artifacts/bf273c2c-1feb-4695-96b4-f901c5db55e7)
  3. [Langton's Ant](https://claude.ai/public/artifacts/0335d57c-dfc7-429f-94a5-c8bdbb75fd39)
- Update CSS to match original visual design
- Maintain accessibility standards
- Ensure consistency across all three simulations

**Acceptance Criteria**:
- [ ] Colours match original applications
- [ ] Visual consistency maintained
- [ ] Accessibility requirements met
- [ ] Responsive design preserved

**Test Cases**:
- Compare with original app screenshots
- Test accessibility with screen readers
- Verify visual consistency across simulations

### 2.2 Add Immersive Mode Exit Hint
**Priority**: Medium
**Description**: Provide user guidance on how to exit immersive mode.

**Requirements**:
- Display hint text when entering immersive mode
- Hint should fade out after a few seconds
- Include Escape key instruction
- Position hint prominently but non-intrusively

**Acceptance Criteria**:
- [ ] Hint appears when entering immersive mode
- [ ] Hint includes Escape key instruction
- [ ] Hint fades out automatically
- [ ] Hint is visible but not obstructive

**Test Cases**:
- Enter immersive mode and verify hint appears
- Confirm hint fades out appropriately
- Test Escape key functionality

### 2.3 Implement Title Fade Animation
**Priority**: Low
**Description**: Make the title fade from view after 5 seconds.

**Requirements**:
- Start fade animation 5 seconds after page load
- Smooth transition over 2-3 seconds
- Title should become nearly invisible but not completely gone
- Animation should be CSS-based for performance

**Acceptance Criteria**:
- [ ] Title starts fading after 5 seconds
- [ ] Smooth transition animation
- [ ] Title remains slightly visible
- [ ] Animation doesn't interfere with other functionality

**Test Cases**:
- Wait 5 seconds and observe fade animation
- Verify smooth transition
- Confirm no interference with other elements

## Phase 3: Simulation-Specific Controls

### 3.1 Conway's Game of Life Controls
**Priority**: High
**Description**: Add missing controls for Conway's Game of Life simulation.

**Requirements**:
- **Speed Slider**: Control simulation update rate
  - Range: 1-60 FPS (or equivalent)
  - Default: 30 FPS
  - Keyboard shortcuts: "," (decrease), "." (increase)
- **Random Button**: Fill grid with random live/dead cells
  - 30% density of live cells
  - Clear existing pattern before randomising
- **Learn Button**: Display educational modal
  - Modal with Conway's Game of Life explanation
  - Rules and examples
  - Closeable modal interface

**Acceptance Criteria**:
- [ ] Speed slider controls simulation speed
- [ ] Keyboard shortcuts work for speed control
- [ ] Random button creates random pattern
- [ ] Learn button opens educational modal
- [ ] Controls only appear for Conway simulation

**Test Cases**:
- Adjust speed slider and verify simulation speed changes
- Test "," and "." keyboard shortcuts
- Click Random button and verify random pattern
- Open Learn modal and verify content

### 3.2 Termite Algorithm Controls
**Priority**: High
**Description**: Add missing controls for Termite Algorithm simulation.

**Requirements**:
- **Speed Slider**: Control termite movement speed
  - Range: 0.5x to 3x speed
  - Default: 1x speed
  - Keyboard shortcuts: "," (decrease), "." (increase)
- **Termites Slider**: Control number of termites
  - Range: 10-100 termites
  - Default: 50 termites
  - Real-time adjustment
- **Random Button**: Fill area with random wood chips
  - 30% density of chips
  - Clear existing chips before randomising
- **Learn Button**: Display educational modal
  - Modal with Termite Algorithm explanation
  - Behaviour patterns and examples

**Acceptance Criteria**:
- [ ] Speed slider controls termite movement
- [ ] Termites slider adjusts termite count
- [ ] Random button creates random chip distribution
- [ ] Learn button opens educational modal
- [ ] Controls only appear for Termite simulation

**Test Cases**:
- Adjust speed and verify termite movement changes
- Change termite count and verify number updates
- Click Random and verify chip distribution
- Open Learn modal and verify content

### 3.3 Langton's Ant Controls
**Priority**: High
**Description**: Add missing controls for Langton's Ant simulation.

**Requirements**:
- **Speed Slider**: Control ant movement speed
  - Range: 1-60 steps per second
  - Default: 30 steps per second
  - Keyboard shortcuts: "," (decrease), "." (increase)
- **Add Ant Button**: Add new ant to simulation
  - Button click adds ant at random position
  - Keyboard shortcut "a" adds ant under mouse pointer
  - Support multiple ants simultaneously
- **Random Button**: Fill grid with random white/black cells
  - 50% density of white cells
  - Clear existing pattern before randomising
- **Learn Button**: Display educational modal
  - Modal with Langton's Ant explanation
  - Rules and highway formation

**Acceptance Criteria**:
- [ ] Speed slider controls ant movement
- [ ] Add Ant button creates new ant
- [ ] "a" key adds ant
- [ ] Random button creates random cell pattern
- [ ] Learn button opens educational modal
- [ ] Controls only appear for Langton's Ant simulation

**Test Cases**:
- Adjust speed and verify ant movement changes
- Click Add Ant button and verify new ant appears at random position
- Press "a" key and verify ant addition under mouse pointer
- Test adding ants outside canvas bounds (should clamp to nearest valid position)
- Click Random and verify random pattern
- Open Learn modal and verify content

### 3.4 Brightness Control
**Priority**: Medium
**Description**: Add user control to adjust the brightness of activated cells across all simulations.

**Requirements**:
- **Brightness Slider**: Control the visual intensity of activated cells
  - Range: 0.1 to 2.0 (10% to 200% brightness)
  - Default: 1.0 (100% brightness)
  - Real-time adjustment without simulation restart
  - Keyboard shortcuts: "[" (decrease), "]" (increase)
- **Reset Button**: Return brightness to default value
  - Button click resets to 100% brightness
  - Keyboard shortcut "r" also resets brightness
- **Visual Feedback**: Display current brightness value
  - Show percentage or multiplier value
  - Update in real-time as slider moves

**Acceptance Criteria**:
- [ ] Brightness slider affects all activated cells
- [ ] Real-time adjustment without simulation interruption
- [ ] Keyboard shortcuts work for brightness control
- [ ] Reset button returns to default brightness
- [ ] Visual feedback shows current brightness value
- [ ] Control appears for all simulations

**Test Cases**:
- Adjust brightness slider and verify cell intensity changes
- Test "[" and "]" keyboard shortcuts
- Click Reset button and verify brightness returns to default
- Verify brightness control works across all three simulations
- Check that brightness changes are applied immediately

## Phase 4: Modal System and Educational Content

### 4.1 Modal System Implementation
**Priority**: Medium
**Description**: Create reusable modal system for educational content.

**Requirements**:
- Reusable modal component
- Backdrop overlay
- Close button and Escape key support
- Smooth animations
- Responsive design

**Acceptance Criteria**:
- [ ] Modal opens and closes smoothly
- [ ] Backdrop overlay works
- [ ] Close button and Escape key functional
- [ ] Responsive across screen sizes
- [ ] Reusable for all simulations

**Test Cases**:
- Open and close modals
- Test Escape key functionality
- Verify responsive behavior

### 4.2 Educational Content Creation
**Priority**: Medium
**Description**: Create educational content for each simulation.

**Requirements**:
- **Conway's Game of Life Content**:
  - Rules explanation
  - Common patterns (glider, blinker, etc.)
  - Historical context
- **Termite Algorithm Content**:
  - Algorithm explanation
  - Emergent behavior patterns
  - Real-world applications
- **Langton's Ant Content**:
  - Rules explanation
  - Highway formation
  - Mathematical significance

**Acceptance Criteria**:
- [ ] Each simulation has educational content
- [ ] Content is clear and informative
- [ ] Content is properly formatted
- [ ] Content is accessible

**Test Cases**:
- Open each Learn modal
- Verify content accuracy
- Test accessibility features

## Phase 5: Code Quality and DRY Principles

### 5.1 Refactor for DRY Implementation
**Priority**: Medium
**Description**: Ensure code follows DRY principles across all new features.

**Requirements**:
- Shared control components where possible
- Common modal system
- Unified styling approach
- Shared keyboard handling
- Common slider component

**Acceptance Criteria**:
- [ ] No code duplication in controls
- [ ] Shared components used appropriately
- [ ] Consistent styling patterns
- [ ] Maintainable code structure

**Test Cases**:
- Review code for duplication
- Verify shared components work
- Test maintainability

### 5.2 Performance Optimization
**Priority**: Low
**Description**: Ensure new features don't impact performance.

**Requirements**:
- Efficient modal rendering
- Optimized slider updates
- Smooth animations
- Minimal memory usage

**Acceptance Criteria**:
- [ ] No performance degradation
- [ ] Smooth animations
- [ ] Efficient memory usage
- [ ] Responsive user interface

**Test Cases**:
- Monitor performance metrics
- Test with multiple modals open
- Verify smooth operation

## Implementation Order

1. **Phase 1**: Core layout fixes (1.1, 1.2, 1.3)
2. **Phase 2**: Visual improvements (2.1, 2.2, 2.3)
3. **Phase 3**: Simulation controls (3.1, 3.2, 3.3)
4. **Phase 4**: Modal system (4.1, 4.2)
5. **Phase 5**: Code quality (5.1, 5.2)

## Testing Strategy

Each phase should be completed and tested before moving to the next. This ensures:
- Incremental validation
- Early bug detection
- Clean code structure
- Maintainable implementation

## Success Criteria

The enhanced application should:
- Provide full-window simulation experience
- Include all original app controls
- Maintain visual consistency with originals
- Support multiple languages automatically
- Provide educational content
- Follow DRY programming principles
- Maintain excellent performance 