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
    const guides = [];
    const distanceIndicators = [];

    // --- Panel center snap lines ---
    const panelCenterX = width / 2 - el.width / 2;
    const panelCenterY = height / 2 - el.height / 2;

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

      // Snap vertically
      if (Math.abs(other.x - x) < snapTolerance) {
        x = other.x;
        guides.push({ orientation: "vertical", position: other.x });
      }

      // Snap horizontally
      if (Math.abs(other.y - y) < snapTolerance) {
        y = other.y;
        guides.push({ orientation: "horizontal", position: other.y });
      }
    });

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
