import { useCallback } from 'react';
import { checkCollision, findNearbyFreeSpace } from '../utils/collision';

/**
 * Collision prevention hook that provides utilities for preventing element overlap
 * @param {Array} elements - Array of all elements
 * @param {number} panelWidth - Panel width
 * @param {number} panelHeight - Panel height
 * @returns {Object} Collision prevention utilities
 */
export default function useCollisionPrevention(elements, panelWidth, panelHeight) {
  /**
   * Check if moving an element to a new position would cause collision
   * @param {string} elementId - ID of element being moved
   * @param {number} newX - New X position
   * @param {number} newY - New Y position
   * @param {number} newWidth - New width (optional, uses current if not provided)
   * @param {number} newHeight - New height (optional, uses current if not provided)
   * @returns {boolean} True if collision would occur
   */
  const wouldCollide = useCallback(
    (elementId, newX, newY, newWidth = null, newHeight = null) => {
      const currentElement = elements.find(el => el.id === elementId);
      if (!currentElement) return false;

      const newRect = {
        x: newX,
        y: newY,
        width: newWidth || currentElement.width,
        height: newHeight || currentElement.height,
      };

      const otherElements = elements.filter(el => el.id !== elementId);
      return otherElements.some(otherEl => checkCollision(newRect, otherEl, 5));
    },
    [elements]
  );

  /**
   * Get safe position for an element, preventing overlaps
   * @param {string} elementId - ID of element being moved
   * @param {number} preferredX - Preferred X position
   * @param {number} preferredY - Preferred Y position
   * @param {number} width - Element width (optional, uses current if not provided)
   * @param {number} height - Element height (optional, uses current if not provided)
   * @returns {Object|null} Safe position {x, y} or null if no space available
   */
  const getSafePosition = useCallback(
    (elementId, preferredX, preferredY, width = null, height = null) => {
      const currentElement = elements.find(el => el.id === elementId);
      if (!currentElement) return null;

      const elementWidth = width || currentElement.width;
      const elementHeight = height || currentElement.height;

      // Check if preferred position is already safe
      if (!wouldCollide(elementId, preferredX, preferredY, elementWidth, elementHeight)) {
        return { x: preferredX, y: preferredY };
      }

      // Find nearby free space
      const otherElements = elements.filter(el => el.id !== elementId);
      return findNearbyFreeSpace(
        preferredX,
        preferredY,
        elementWidth,
        elementHeight,
        otherElements,
        panelWidth,
        panelHeight
      );
    },
    [elements, panelWidth, panelHeight, wouldCollide]
  );

  /**
   * Get safe resize dimensions that don't cause overlaps
   * @param {string} elementId - ID of element being resized
   * @param {number} newWidth - Desired new width
   * @param {number} newHeight - Desired new height
   * @param {number} x - Current X position (optional)
   * @param {number} y - Current Y position (optional)
   * @returns {Object} Safe dimensions {width, height, x, y}
   */
  const getSafeResize = useCallback(
    (elementId, newWidth, newHeight, x = null, y = null) => {
      const currentElement = elements.find(el => el.id === elementId);
      if (!currentElement) return null;

      const currentX = x !== null ? x : currentElement.x;
      const currentY = y !== null ? y : currentElement.y;

      // Check if desired size is safe
      if (!wouldCollide(elementId, currentX, currentY, newWidth, newHeight)) {
        return { width: newWidth, height: newHeight, x: currentX, y: currentY };
      }

      // Try progressively smaller sizes
      for (let scale = 0.9; scale > 0.3; scale -= 0.1) {
        const scaledWidth = Math.max(20, newWidth * scale);
        const scaledHeight = Math.max(20, newHeight * scale);

        if (!wouldCollide(elementId, currentX, currentY, scaledWidth, scaledHeight)) {
          return { width: scaledWidth, height: scaledHeight, x: currentX, y: currentY };
        }
      }

      // If no safe size found, return current dimensions
      return {
        width: currentElement.width,
        height: currentElement.height,
        x: currentX,
        y: currentY,
      };
    },
    [elements, wouldCollide]
  );

  /**
   * Find the best position for a new element without overlapping
   * @param {number} width - Element width
   * @param {number} height - Element height
   * @param {number} preferredX - Preferred X position (optional, defaults to center)
   * @param {number} preferredY - Preferred Y position (optional, defaults to center)
   * @returns {Object|null} Position {x, y} or null if no space available
   */
  const findSpaceForNewElement = useCallback(
    (width, height, preferredX = null, preferredY = null) => {
      const startX = preferredX !== null ? preferredX : (panelWidth - width) / 2;
      const startY = preferredY !== null ? preferredY : (panelHeight - height) / 2;

      return findNearbyFreeSpace(startX, startY, width, height, elements, panelWidth, panelHeight);
    },
    [elements, panelWidth, panelHeight]
  );

  /**
   * Validate and correct element positions to prevent overlaps
   * This can be used to fix existing overlaps or validate imported layouts
   * @param {Array} elementsToValidate - Array of elements to validate
   * @returns {Array} Array of corrected elements
   */
  const validateAndCorrectPositions = useCallback(
    elementsToValidate => {
      const correctedElements = [];

      elementsToValidate.forEach(element => {
        // Check if current position is valid
        const hasCollision = correctedElements.some(existingEl =>
          checkCollision(element, existingEl, 5)
        );

        if (hasCollision) {
          // Find free space for this element
          const freeSpace = findNearbyFreeSpace(
            element.x,
            element.y,
            element.width,
            element.height,
            correctedElements,
            panelWidth,
            panelHeight
          );

          if (freeSpace) {
            correctedElements.push({ ...element, x: freeSpace.x, y: freeSpace.y });
          } else {
            // If no space found, keep original position (edge case)
            correctedElements.push(element);
          }
        } else {
          // No collision, keep original position
          correctedElements.push(element);
        }
      });

      return correctedElements;
    },
    [panelWidth, panelHeight]
  );

  return {
    wouldCollide,
    getSafePosition,
    getSafeResize,
    findSpaceForNewElement,
    validateAndCorrectPositions,
  };
}
