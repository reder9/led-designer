/**
 * Utility functions for collision detection and free space finding
 */

/**
 * Find nearby free space using spiral search pattern
 * @param {number} preferredX - Preferred X position
 * @param {number} preferredY - Preferred Y position
 * @param {number} elementWidth - Width of element to place
 * @param {number} elementHeight - Height of element to place
 * @param {Array} elements - Array of existing elements
 * @param {number} panelWidth - Panel width
 * @param {number} panelHeight - Panel height
 * @returns {Object|null} - {x, y} position or null if no space found
 */
export const findNearbyFreeSpace = (
  preferredX,
  preferredY,
  elementWidth,
  elementHeight,
  elements,
  panelWidth,
  panelHeight
) => {
  const gridSize = 20;
  const padding = 10;

  // Try positions in a spiral pattern around the preferred location
  for (let radius = 0; radius < 200; radius += gridSize) {
    for (let angle = 0; angle < 360; angle += 45) {
      const x = Math.max(
        padding,
        Math.min(
          panelWidth - elementWidth - padding,
          preferredX + radius * Math.cos((angle * Math.PI) / 180)
        )
      );
      const y = Math.max(
        padding,
        Math.min(
          panelHeight - elementHeight - padding,
          preferredY + radius * Math.sin((angle * Math.PI) / 180)
        )
      );

      // Check if this position is free
      const wouldCollide = elements.some(otherEl => {
        const thisRect = {
          left: x,
          right: x + elementWidth,
          top: y,
          bottom: y + elementHeight,
        };

        const otherRect = {
          left: otherEl.x,
          right: otherEl.x + otherEl.width,
          top: otherEl.y,
          bottom: otherEl.y + otherEl.height,
        };

        const buffer = 5;
        return !(
          thisRect.right + buffer <= otherRect.left ||
          thisRect.left >= otherRect.right + buffer ||
          thisRect.bottom + buffer <= otherRect.top ||
          thisRect.top >= otherRect.bottom + buffer
        );
      });

      if (!wouldCollide) {
        return { x, y };
      }
    }
  }

  // If no free space found, try a grid search as final fallback
  for (let y = padding; y < panelHeight - elementHeight - padding; y += gridSize) {
    for (let x = padding; x < panelWidth - elementWidth - padding; x += gridSize) {
      const wouldCollide = elements.some(otherEl => {
        const thisRect = {
          left: x,
          right: x + elementWidth,
          top: y,
          bottom: y + elementHeight,
        };

        const otherRect = {
          left: otherEl.x,
          right: otherEl.x + otherEl.width,
          top: otherEl.y,
          bottom: otherEl.y + otherEl.height,
        };

        const buffer = 5;
        return !(
          thisRect.right + buffer <= otherRect.left ||
          thisRect.left >= otherRect.right + buffer ||
          thisRect.bottom + buffer <= otherRect.top ||
          thisRect.top >= otherRect.bottom + buffer
        );
      });

      if (!wouldCollide) {
        return { x, y };
      }
    }
  }

  return null; // No free space available
};

/**
 * Check if two rectangles would collide
 * @param {Object} rect1 - {x, y, width, height}
 * @param {Object} rect2 - {x, y, width, height}
 * @param {number} buffer - Buffer space between elements
 * @returns {boolean} - True if collision would occur
 */
export const checkCollision = (rect1, rect2, buffer = 5) => {
  const thisRect = {
    left: rect1.x,
    right: rect1.x + rect1.width,
    top: rect1.y,
    bottom: rect1.y + rect1.height,
  };

  const otherRect = {
    left: rect2.x,
    right: rect2.x + rect2.width,
    top: rect2.y,
    bottom: rect2.y + rect2.height,
  };

  return !(
    thisRect.right + buffer <= otherRect.left ||
    thisRect.left >= otherRect.right + buffer ||
    thisRect.bottom + buffer <= otherRect.top ||
    thisRect.top >= otherRect.bottom + buffer
  );
};
