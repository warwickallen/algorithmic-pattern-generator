/**
 * Dynamic Layout Manager
 * Positions control groups dynamically to avoid overlapping
 */

class DynamicLayoutManager {
    constructor() {
        this.margin = 8; // Minimum space between elements (reduced from 20px)
        this.topMargin = 20; // Top margin from viewport edge
        this.leftMargin = 20; // Left margin from viewport edge
        this.positionedElements = []; // Track positioned elements
        this.isMobile = window.innerWidth <= 768;

        // Elements to position in order (following element-layout.yaml)
        this.elementsToPosition = [
            'simulation-container',
            'playback-container',
            'action-container',
            'termites-container',
            'display-container'
        ];

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.positionElements());
        } else {
            this.positionElements();
        }

        // Handle window resize
        window.addEventListener('resize', (typeof PerformanceUtils !== 'undefined' ? PerformanceUtils.throttle(() => {
            this.isMobile = window.innerWidth <= 768;
            this.positionElements();
        }, 250) : this.debounce(() => {
            this.isMobile = window.innerWidth <= 768;
            this.positionElements();
        }, 250)));

        // Handle content changes that might affect element sizes
        this.observeContentChanges();
    }

    positionElements() {
        // Reset positioned elements
        this.positionedElements = [];

        // Add the title as a positioned element to prevent overlap
        this.addTitleAsPositionedElement();

        // Position each element in order
        this.elementsToPosition.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                this.positionElement(element);
            }
        });
    }

    positionElement(element) {
        // Skip elements that are hidden (check both inline style and computed style)
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.display === 'none' ||
            (element.hasAttribute('data-simulation') && !element.classList.contains('active'))) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const elementWidth = rect.width;
        const elementHeight = rect.height;

        // Skip elements with zero dimensions (hidden elements)
        if (elementWidth === 0 || elementHeight === 0) {
            return;
        }

        // Start from top-left
        let x = this.leftMargin;
        let y = this.topMargin;

        // Find the best position that doesn't overlap
        const position = this.findBestPosition(x, y, elementWidth, elementHeight);

        // Apply position
        element.style.left = position.x + 'px';
        element.style.top = position.y + 'px';

        // Add to positioned elements
        this.positionedElements.push({
            x: position.x,
            y: position.y,
            width: elementWidth,
            height: elementHeight
        });
    }

    findBestPosition(startX, startY, width, height) {
        let x = startX;
        let y = startY;

        // Try to fit on current row first
        while (this.wouldOverlap(x, y, width, height)) {
            // Try moving right on the same row
            const rightPosition = this.findRightPosition(x, y, width, height);
            if (rightPosition) {
                return rightPosition;
            }

            // If can't fit on current row, move to next row
            y += height + this.margin;
            x = this.leftMargin;

            // Check if we're going off screen
            if (y + height > window.innerHeight - this.margin) {
                // If we can't fit vertically, try to find any available space
                const availablePosition = this.findAnyAvailablePosition(width, height);
                if (availablePosition) {
                    return availablePosition;
                }
                // If no space found, force position at left margin
                return { x: this.leftMargin, y: this.topMargin };
            }
        }

        return { x, y };
    }

    findRightPosition(currentX, currentY, width, height) {
        // Find the rightmost edge of existing elements on this row
        let maxX = currentX;
        for (const element of this.positionedElements) {
            // More precise row detection - check if elements are on the same row
            if (Math.abs(element.y - currentY) < 10) { // Same row tolerance
                maxX = Math.max(maxX, element.x + element.width);
            }
        }

        let x = maxX + this.margin;

        // Check if we can fit to the right
        if (x + width <= window.innerWidth - this.margin) {
            if (!this.wouldOverlap(x, currentY, width, height)) {
                return { x, y: currentY };
            }
        }

        return null;
    }

    findAnyAvailablePosition(width, height) {
        // Try to find any available space in the viewport
        for (let y = this.topMargin; y <= window.innerHeight - height - this.margin; y += this.margin) {
            for (let x = this.leftMargin; x <= window.innerWidth - width - this.margin; x += this.margin) {
                if (!this.wouldOverlap(x, y, width, height)) {
                    return { x, y };
                }
            }
        }

        return null;
    }

    wouldOverlap(x, y, width, height) {
        // Check if this position would overlap with any positioned element
        for (const element of this.positionedElements) {
            if (this.rectanglesOverlap(
                x, y, width, height,
                element.x, element.y, element.width, element.height
            )) {
                return true;
            }
        }

        // Check if it would go off screen
        if (x + width > window.innerWidth - this.margin ||
            y + height > window.innerHeight - this.margin) {
            return true;
        }

        return false;
    }

    addTitleAsPositionedElement() {
        const titleContainer = document.getElementById('title-container');
        if (titleContainer) {
            const rect = titleContainer.getBoundingClientRect();
            this.positionedElements.push({
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                id: 'title-container'
            });
        }
    }

    rectanglesOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        // Use full margin for complete separation
        const padding = this.margin;

        return !(x1 + w1 + padding < x2 ||
                x2 + w2 + padding < x1 ||
                y1 + h1 + padding < y2 ||
                y2 + h2 + padding < y1);
    }

    observeContentChanges() {
        // Use MutationObserver to watch for changes in the control groups
        const observer = new MutationObserver((typeof PerformanceUtils !== 'undefined' ? PerformanceUtils.debounce(() => {
            this.positionElements();
        }, 100) : this.debounce(() => {
            this.positionElements();
        }, 100)));

        // Observe all dynamic position elements
        this.elementsToPosition.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                observer.observe(element, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Public method to reposition elements when visibility changes
    repositionElements() {
        this.positionElements();
    }
}

// Initialize the layout manager when the script loads
const layoutManager = new DynamicLayoutManager();
window.layoutManager = layoutManager;
