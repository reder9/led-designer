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
      const panelCenterX = width / 2 - el.width / 2;
      const panelCenterY = height / 2 - el.height / 2;

      // --- Panel thirds snap lines ---
      const panelThirdX1 = width / 3 - el.width / 2;
      const panelThirdX2 = (width * 2) / 3 - el.width / 2;
      const panelThirdY1 = height / 3 - el.height / 2;
      const panelThirdY2 = (height * 2) / 3 - el.height / 2;

      // Check center snapping first
      if (Math.abs(x - panelCenterX) < snapTolerance) {
        x = panelCenterX;
        guides.push({ orientation: 'vertical', position: width / 2, type: 'active' });
      }

      if (Math.abs(y - panelCenterY) < snapTolerance) {
        y = panelCenterY;
        guides.push({ orientation: 'horizontal', position: height / 2, type: 'active' });
      }

      // Check thirds snapping
      if (Math.abs(x - panelThirdX1) < snapTolerance) {
        x = panelThirdX1;
        guides.push({ orientation: 'vertical', position: width / 3, type: 'active' });
      }

      if (Math.abs(x - panelThirdX2) < snapTolerance) {
        x = panelThirdX2;
        guides.push({ orientation: 'vertical', position: (width * 2) / 3, type: 'active' });
      }

      if (Math.abs(y - panelThirdY1) < snapTolerance) {
        y = panelThirdY1;
        guides.push({ orientation: 'horizontal', position: height / 3, type: 'active' });
      }

      if (Math.abs(y - panelThirdY2) < snapTolerance) {
        y = panelThirdY2;
        guides.push({ orientation: 'horizontal', position: (height * 2) / 3, type: 'active' });
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
