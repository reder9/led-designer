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
      const snapTolerance = 15; // Increased tolerance for better UX
      const gridSize = 20; // Grid size for snapping
      const guides = [];
      const distanceIndicators = [];

      // --- Grid snapping ---
      const snapToGrid = value => Math.round(value / gridSize) * gridSize;

      // --- Panel division snap lines ---
      // Horizontal divisions (vertical lines)
      const panelHalfX = width / 2 - el.width / 2; // Center
      const panelThirdX = width / 3 - el.width / 2; // Left third
      const panelTwoThirdX = (2 * width) / 3 - el.width / 2; // Right third

      // Vertical divisions (horizontal lines)
      const panelHalfY = height / 2 - el.height / 2; // Center
      const panelThirdY = height / 3 - el.height / 2; // Top third
      const panelTwoThirdY = (2 * height) / 3 - el.height / 2; // Bottom third

      // Check horizontal division snapping (creates vertical guides)
      const horizontalDivisions = [
        { pos: panelHalfX, guideLine: width / 2, name: 'center' },
        { pos: panelThirdX, guideLine: width / 3, name: 'third' },
        { pos: panelTwoThirdX, guideLine: (2 * width) / 3, name: 'two-third' },
      ];

      horizontalDivisions.forEach(({ pos, guideLine }) => {
        if (Math.abs(x - pos) < snapTolerance) {
          x = pos;
          guides.push({ orientation: 'vertical', position: guideLine });
        }
      });

      // Check vertical division snapping (creates horizontal guides)
      const verticalDivisions = [
        { pos: panelHalfY, guideLine: height / 2, name: 'center' },
        { pos: panelThirdY, guideLine: height / 3, name: 'third' },
        { pos: panelTwoThirdY, guideLine: (2 * height) / 3, name: 'two-third' },
      ];

      verticalDivisions.forEach(({ pos, guideLine }) => {
        if (Math.abs(y - pos) < snapTolerance) {
          y = pos;
          guides.push({ orientation: 'horizontal', position: guideLine });
        }
      });

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
            guides.push({ orientation: 'vertical', position: otherX });
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
            guides.push({ orientation: 'horizontal', position: otherY });
          }
        });
      });

      // If no snapping occurred, snap to grid
      if (!guides.length) {
        x = snapToGrid(x);
        y = snapToGrid(y);
      }

      // Update state
      setGuides(guides);
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
