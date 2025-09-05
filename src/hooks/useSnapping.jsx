import { useCallback } from "react";

/**
 * Snapping hook:
 * - Computes snapping guides + distance indicators while dragging/resizing
 * - Returns snapping helpers
 */
export default function useSnapping({
  elements,
  width,
  height,
  setGuides,
  setDistanceIndicators,
}) {
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
    const snapToGrid = (value) => Math.round(value / gridSize) * gridSize;
    
    // --- Panel center snap lines ---
    const panelCenterX = width / 2 - el.width / 2;
    const panelCenterY = height / 2 - el.height / 2;

    // Check center snapping first
    if (Math.abs(x - panelCenterX) < snapTolerance) {
      x = panelCenterX;
      guides.push({ orientation: "vertical", position: width / 2 });
    }

    if (Math.abs(y - panelCenterY) < snapTolerance) {
      y = panelCenterY;
      guides.push({ orientation: "horizontal", position: height / 2 });
    }

    // --- Snap relative to other elements ---
    elements.forEach((other) => {
      if (other.id === el.id) return;

      // Edge alignments
      const alignments = [
        { el: x, other: other.x }, // Left edges
        { el: x + el.width, other: other.x + other.width }, // Right edges
        { el: x, other: other.x + other.width }, // Left to right
        { el: x + el.width, other: other.x }, // Right to left
        { el: x + el.width / 2, other: other.x + other.width / 2 } // Centers
      ];

      alignments.forEach(({el: elX, other: otherX}) => {
        if (Math.abs(elX - otherX) < snapTolerance) {
          x = otherX - (elX - x);
          guides.push({ orientation: "vertical", position: otherX });
        }
      });

      // Same for vertical alignments
      const verticalAlignments = [
        { el: y, other: other.y }, // Top edges
        { el: y + el.height, other: other.y + other.height }, // Bottom edges
        { el: y, other: other.y + other.height }, // Top to bottom
        { el: y + el.height, other: other.y }, // Bottom to top
        { el: y + el.height / 2, other: other.y + other.height / 2 } // Centers
      ];

      verticalAlignments.forEach(({el: elY, other: otherY}) => {
        if (Math.abs(elY - otherY) < snapTolerance) {
          y = otherY - (elY - y);
          guides.push({ orientation: "horizontal", position: otherY });
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
