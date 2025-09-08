import { useCallback } from 'react';

/**
 * Snapping hook:
 * - Computes snapping guides + distance indicators while dragging/resizing
 * - Returns snapping helpers
 */
export default function useSnapping({ elements, width, height, setGuides, setDistanceIndicators }) {
  // Clears snapping state
  const clearGuides = useCallback(() => {
    setGuides([]);
    setDistanceIndicators([]);
  }, [setGuides, setDistanceIndicators]);

  // Apply snapping logic
  const applySnapping = useCallback(
    (el, x, y) => {
      const snapTolerance = 10;
      const gridSize = 20; // Grid size for snapping
      const guides = [];
      const distanceIndicators = [];

      // --- Grid snapping ---
      const snapToGrid = value => Math.round(value / gridSize) * gridSize;

      // --- Panel center snap lines ---
      const panelCenterX = width / 2;
      const panelCenterY = height / 2;

      // Try to get actual DOM element dimensions for more accurate centering
      let elementWidth = el.width;
      const elementHeight = el.height;

      // For text elements, get the actual visual width from the DOM
      if (el.type === 'text') {
        const domElement = document.querySelector(`[data-element-id="${el.id}"]`);
        if (domElement) {
          const textArea = domElement.querySelector('textarea');
          if (textArea && el.content && el.content.trim()) {
            // Create a temporary span to measure the actual rendered text width
            const measureSpan = document.createElement('span');
            measureSpan.style.visibility = 'hidden';
            measureSpan.style.position = 'absolute';
            measureSpan.style.whiteSpace = 'nowrap';
            measureSpan.style.font = window.getComputedStyle(textArea).font;
            measureSpan.textContent = el.content;

            document.body.appendChild(measureSpan);
            const actualTextWidth = measureSpan.getBoundingClientRect().width;
            document.body.removeChild(measureSpan);

            // Use actual text width plus minimal padding for centering
            elementWidth = actualTextWidth + 20; // 10px padding on each side
          }
        }
      }

      // Calculate element center positions using potentially adjusted dimensions
      const elementCenterX = x + elementWidth / 2;
      const elementCenterY = y + elementHeight / 2;

      // --- Panel thirds snap lines ---
      const panelThirdX1 = width / 3;
      const panelThirdX2 = (width * 2) / 3;
      const panelThirdY1 = height / 3;
      const panelThirdY2 = (height * 2) / 3;

      // Check center snapping first (snap element center to panel center)
      if (Math.abs(elementCenterX - panelCenterX) < snapTolerance) {
        x = panelCenterX - elementWidth / 2;
        guides.push({ orientation: 'vertical', position: panelCenterX, type: 'active' });
      }

      if (Math.abs(elementCenterY - panelCenterY) < snapTolerance) {
        y = panelCenterY - elementHeight / 2;
        guides.push({ orientation: 'horizontal', position: panelCenterY, type: 'active' });
      }

      // Check thirds snapping (snap element center to panel thirds)
      if (Math.abs(elementCenterX - panelThirdX1) < snapTolerance) {
        x = panelThirdX1 - elementWidth / 2;
        guides.push({ orientation: 'vertical', position: panelThirdX1, type: 'active' });
      }

      if (Math.abs(elementCenterX - panelThirdX2) < snapTolerance) {
        x = panelThirdX2 - elementWidth / 2;
        guides.push({ orientation: 'vertical', position: panelThirdX2, type: 'active' });
      }

      if (Math.abs(elementCenterY - panelThirdY1) < snapTolerance) {
        y = panelThirdY1 - elementHeight / 2;
        guides.push({ orientation: 'horizontal', position: panelThirdY1, type: 'active' });
      }

      if (Math.abs(elementCenterY - panelThirdY2) < snapTolerance) {
        y = panelThirdY2 - elementHeight / 2;
        guides.push({ orientation: 'horizontal', position: panelThirdY2, type: 'active' });
      }

      // --- Snap relative to other elements ---
      elements.forEach(other => {
        if (other.id === el.id) return;

        // Edge alignments
        const alignments = [
          { el: x, other: other.x }, // Left edges
          { el: x + el.width, other: other.x + other.width }, // Right edges
          { el: x, other: other.x + other.width }, // Left to right
          { el: x + el.width, other: other.x }, // Right to left
          { el: x + el.width / 2, other: other.x + other.width / 2 }, // Centers
        ];

        alignments.forEach(({ el: elX, other: otherX }) => {
          if (Math.abs(elX - otherX) < snapTolerance) {
            x = otherX - (elX - x);
            guides.push({ orientation: 'vertical', position: otherX, type: 'element' });
          }
        });

        // Same for vertical alignments
        const verticalAlignments = [
          { el: y, other: other.y }, // Top edges
          { el: y + el.height, other: other.y + other.height }, // Bottom edges
          { el: y, other: other.y + other.height }, // Top to bottom
          { el: y + el.height, other: other.y }, // Bottom to top
          { el: y + el.height / 2, other: other.y + other.height / 2 }, // Centers
        ];

        verticalAlignments.forEach(({ el: elY, other: otherY }) => {
          if (Math.abs(elY - otherY) < snapTolerance) {
            y = otherY - (elY - y);
            guides.push({ orientation: 'horizontal', position: otherY, type: 'element' });
          }
        });
      });

      // If no snapping occurred, snap to grid
      if (!guides.length) {
        x = snapToGrid(x);
        y = snapToGrid(y);
      }

      // Add static guide lines for panel divisions (always show)
      const staticGuides = [
        // Center guides
        { orientation: 'vertical', position: width / 2, type: 'static-center' },
        { orientation: 'horizontal', position: height / 2, type: 'static-center' },
        // Third guides
        { orientation: 'vertical', position: width / 3, type: 'static-third' },
        { orientation: 'vertical', position: (width * 2) / 3, type: 'static-third' },
        { orientation: 'horizontal', position: height / 3, type: 'static-third' },
        { orientation: 'horizontal', position: (height * 2) / 3, type: 'static-third' },
      ];

      // Combine static guides with active snapping guides
      const allGuides = [...staticGuides, ...guides];

      // Update state
      setGuides(allGuides);
      setDistanceIndicators(distanceIndicators);

      return { x, y };
    },
    [elements, width, height, setGuides, setDistanceIndicators]
  );

  return {
    applySnapping,
    clearGuides,
  };
}
