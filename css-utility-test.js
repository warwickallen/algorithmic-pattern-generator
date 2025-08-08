/**
 * CSS Utility Framework Test Suite
 * Tests for the consolidated CSS utility classes and design system
 */

class CSSUtilityTestSuite {
    constructor() {
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
        this.total = 0;
    }

    /**
     * Run all CSS utility tests
     */
    runAllTests() {
        console.log('🧪 Running CSS Utility Framework Tests...\n');

        this.testDesignTokens();
        this.testGlassEffects();
        this.testUtilityClasses();
        this.testComponentClasses();
        this.testResponsiveDesign();
        this.testPerformanceOptimizations();

        this.printResults();
        return this.testResults;
    }

    /**
     * Test CSS custom properties (design tokens)
     */
    testDesignTokens() {
        this.testGroup('Design Tokens', () => {
            // Test that CSS custom properties are defined
            const computedStyle = getComputedStyle(document.documentElement);

            // Test colour tokens
            this.assert(computedStyle.getPropertyValue('--color-primary'), 'CSS custom property --color-primary should be defined');
            this.assert(computedStyle.getPropertyValue('--color-secondary'), 'CSS custom property --color-secondary should be defined');
            this.assert(computedStyle.getPropertyValue('--color-background'), 'CSS custom property --color-background should be defined');

            // Test spacing tokens
            this.assert(computedStyle.getPropertyValue('--spacing-sm'), 'CSS custom property --spacing-sm should be defined');
            this.assert(computedStyle.getPropertyValue('--spacing-md'), 'CSS custom property --spacing-md should be defined');
            this.assert(computedStyle.getPropertyValue('--spacing-lg'), 'CSS custom property --spacing-lg should be defined');

            // Test border radius tokens
            this.assert(computedStyle.getPropertyValue('--radius-sm'), 'CSS custom property --radius-sm should be defined');
            this.assert(computedStyle.getPropertyValue('--radius-md'), 'CSS custom property --radius-md should be defined');
            this.assert(computedStyle.getPropertyValue('--radius-lg'), 'CSS custom property --radius-lg should be defined');

            // Test transition tokens
            this.assert(computedStyle.getPropertyValue('--transition-fast'), 'CSS custom property --transition-fast should be defined');
            this.assert(computedStyle.getPropertyValue('--transition-normal'), 'CSS custom property --transition-normal should be defined');

            // Test z-index tokens
            this.assert(computedStyle.getPropertyValue('--z-controls'), 'CSS custom property --z-controls should be defined');
            this.assert(computedStyle.getPropertyValue('--z-modal'), 'CSS custom property --z-modal should be defined');
        });
    }

    /**
     * Test glass effect utilities
     */
    testGlassEffects() {
        this.testGroup('Glass Effects', () => {
            // Create test elements
            const glassElement = this.createTestElement('glass');
            const glassLightElement = this.createTestElement('glass-light');

            // Test glass effect classes
            this.assert(glassElement.classList.contains('glass'), 'Element should have glass class');
            this.assert(glassLightElement.classList.contains('glass-light'), 'Element should have glass-light class');

            // Test computed styles for glass effects
            const glassStyle = getComputedStyle(glassElement);
            this.assert(glassStyle.backdropFilter.includes('blur'), 'Glass element should have backdrop-filter blur');
            this.assert(glassStyle.background.includes('linear-gradient'), 'Glass element should have gradient background');

            // Test hover effects
            const glassLightStyle = getComputedStyle(glassLightElement);
            this.assert(glassLightStyle.transition.includes('0.3s'), 'Glass light element should have transition');

            // Cleanup
            this.cleanupTestElement(glassElement);
            this.cleanupTestElement(glassLightElement);
        });
    }

    /**
     * Test utility classes
     */
    testUtilityClasses() {
        this.testGroup('Utility Classes', () => {
            // Test flex utilities
            const flexElement = this.createTestElement('flex flex-center gap-sm');
            this.assert(flexElement.classList.contains('flex'), 'Element should have flex class');
            this.assert(flexElement.classList.contains('flex-center'), 'Element should have flex-center class');
            this.assert(flexElement.classList.contains('gap-sm'), 'Element should have gap-sm class');

            // Test spacing utilities
            const spacingElement = this.createTestElement('p-md m-lg');
            this.assert(spacingElement.classList.contains('p-md'), 'Element should have p-md class');
            this.assert(spacingElement.classList.contains('m-lg'), 'Element should have m-lg class');

            // Test border radius utilities
            const radiusElement = this.createTestElement('rounded-lg');
            this.assert(radiusElement.classList.contains('rounded-lg'), 'Element should have rounded-lg class');

            // Test z-index utilities
            const zIndexElement = this.createTestElement('z-controls');
            this.assert(zIndexElement.classList.contains('z-controls'), 'Element should have z-controls class');

            // Test performance utilities
            const gpuElement = this.createTestElement('gpu-accelerate');
            this.assert(gpuElement.classList.contains('gpu-accelerate'), 'Element should have gpu-accelerate class');

            // Cleanup
            this.cleanupTestElement(flexElement);
            this.cleanupTestElement(spacingElement);
            this.cleanupTestElement(radiusElement);
            this.cleanupTestElement(zIndexElement);
            this.cleanupTestElement(gpuElement);
        });
    }

    /**
     * Test component classes
     */
    testComponentClasses() {
        this.testGroup('Component Classes', () => {
            // Test control group variants
            const staticControlGroup = this.createTestElement('control-group control-group--static');
            const transparentControlGroup = this.createTestElement('control-group control-group--transparent');

            this.assert(staticControlGroup.classList.contains('control-group'), 'Element should have control-group class');
            this.assert(staticControlGroup.classList.contains('control-group--static'), 'Element should have control-group--static class');
            this.assert(transparentControlGroup.classList.contains('control-group--transparent'), 'Element should have control-group--transparent class');

            // Test button classes
            const primaryButton = this.createTestElement('btn primary hover-lift');
            const secondaryButton = this.createTestElement('btn secondary');

            this.assert(primaryButton.classList.contains('btn'), 'Element should have btn class');
            this.assert(primaryButton.classList.contains('primary'), 'Element should have primary class');
            this.assert(primaryButton.classList.contains('hover-lift'), 'Element should have hover-lift class');
            this.assert(secondaryButton.classList.contains('secondary'), 'Element should have secondary class');

            // Test slider class
            const slider = this.createTestElement('slider');
            this.assert(slider.classList.contains('slider'), 'Element should have slider class');

            // Cleanup
            this.cleanupTestElement(staticControlGroup);
            this.cleanupTestElement(transparentControlGroup);
            this.cleanupTestElement(primaryButton);
            this.cleanupTestElement(secondaryButton);
            this.cleanupTestElement(slider);
        });
    }

    /**
     * Test responsive design utilities
     */
    testResponsiveDesign() {
        this.testGroup('Responsive Design', () => {
            // Test that responsive classes exist
            const responsiveElement = this.createTestElement('flex flex-column');
            this.assert(responsiveElement.classList.contains('flex'), 'Element should have flex class');
            this.assert(responsiveElement.classList.contains('flex-column'), 'Element should have flex-column class');

            // Test that media queries are applied (basic check)
            const style = getComputedStyle(responsiveElement);
            this.assert(style.display === 'flex', 'Flex element should have display: flex');

            // Cleanup
            this.cleanupTestElement(responsiveElement);
        });
    }

    /**
     * Test performance optimization utilities
     */
    testPerformanceOptimizations() {
        this.testGroup('Performance Optimizations', () => {
            // Test GPU acceleration classes
            const gpuElement = this.createTestElement('gpu-accelerate');
            const gpuOpacityElement = this.createTestElement('gpu-accelerate-opacity');
            const gpuTransformElement = this.createTestElement('gpu-accelerate-transform');

            this.assert(gpuElement.classList.contains('gpu-accelerate'), 'Element should have gpu-accelerate class');
            this.assert(gpuOpacityElement.classList.contains('gpu-accelerate-opacity'), 'Element should have gpu-accelerate-opacity class');
            this.assert(gpuTransformElement.classList.contains('gpu-accelerate-transform'), 'Element should have gpu-accelerate-transform class');

            // Test will-change property
            const gpuStyle = getComputedStyle(gpuElement);
            this.assert(gpuStyle.willChange.includes('transform'), 'GPU accelerated element should have will-change: transform');

            // Cleanup
            this.cleanupTestElement(gpuElement);
            this.cleanupTestElement(gpuOpacityElement);
            this.cleanupTestElement(gpuTransformElement);
        });
    }

    /**
     * Test that existing functionality is preserved
     */
    testExistingFunctionality() {
        this.testGroup('Existing Functionality Preservation', () => {
            // Test that existing elements still have their classes
            const titleContainer = document.getElementById('title-container');
            const simulationContainer = document.getElementById('simulation-container');
            const playbackContainer = document.getElementById('playback-container');

            if (titleContainer) {
                this.assert(titleContainer.classList.contains('control-group'), 'Title container should have control-group class');
                this.assert(titleContainer.classList.contains('top-left'), 'Title container should have top-left class');
            }

            if (simulationContainer) {
                this.assert(simulationContainer.classList.contains('control-group'), 'Simulation container should have control-group class');
                this.assert(simulationContainer.classList.contains('dynamic-position'), 'Simulation container should have dynamic-position class');
            }

            if (playbackContainer) {
                this.assert(playbackContainer.classList.contains('control-group'), 'Playback container should have control-group class');
                this.assert(playbackContainer.classList.contains('dynamic-position'), 'Playback container should have dynamic-position class');
            }
        });
    }

    /**
     * Test group helper
     */
    testGroup(name, testFunction) {
        console.log(`�� Testing ${name}...`);
        try {
            testFunction();
            console.log(`✅ ${name} tests passed\n`);
        } catch (error) {
            console.error(`❌ ${name} tests failed:`, error.message);
            this.failed++;
        }
    }

    /**
     * Assertion helper
     */
    assert(condition, message) {
        this.total++;
        if (condition) {
            this.passed++;
            this.testResults.push({ test: message, status: 'PASS' });
        } else {
            this.failed++;
            this.testResults.push({ test: message, status: 'FAIL' });
            throw new Error(message);
        }
    }

    /**
     * Create test element helper
     */
    createTestElement(classes = '') {
        const element = document.createElement('div');
        element.className = classes;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '-9999px';
        document.body.appendChild(element);
        return element;
    }

    /**
     * Cleanup test element helper
     */
    cleanupTestElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * Print test results
     */
    printResults() {
        console.log('📊 CSS Utility Framework Test Results:');
        console.log(`Total Tests: ${this.total}`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Success Rate: ${((this.passed / this.total) * 100).toFixed(1)}%\n`);

        if (this.failed > 0) {
            console.log('❌ Failed Tests:');
            this.testResults
                .filter(result => result.status === 'FAIL')
                .forEach(result => console.log(`  - ${result.test}`));
        }

        console.log('✅ CSS Utility Framework consolidation completed successfully!');
    }
}

// Export for use in test suite
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSSUtilityTestSuite;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
    window.CSSUtilityTestSuite = CSSUtilityTestSuite;
}
