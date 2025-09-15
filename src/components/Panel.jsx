import { useRef, useState, useEffect, useCallback } from 'react';
import Moveable from 'react-moveable';
import useHistory from '../hooks/useHistory';
import useClipboard from '../hooks/useClipboard';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import useSnapping from '../hooks/useSnapping';
import useCollisionPrevention from '../hooks/useCollisionPrevention';
import './Panel.css';
import ElementRenderer from './ElementRenderer';
import SnappingGuides from './SnappingGuides';
import StaticGuides from './StaticGuides';
import DistanceIndicators from './DistanceIndicators';

export default function Panel({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
  glowColor,
  isPowerOn,
  roundedEdges,
  borderRadius = 20,
  width,
  height,
  glowMode,
  brightness,
  speed = 5,
  showLedBorder = true,
  textGlowIntensity = 1.0,
}) {
  const textareaRefs = useRef({});
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Set default glowMode to rainbow if not provided
  const effectiveGlowMode = glowMode || 'rainbow';

  // Auto-enter edit mode for new text elements with _autoEdit flag
  useEffect(() => {
    const selectedEl = elements.find(el => el.id === selectedElement);
    if (selectedEl && selectedEl._autoEdit && selectedEl.type === 'text' && !isEditing) {
      setIsEditing(true);
      // Remove the _autoEdit flag
      setElements(prev =>
        prev.map(el => (el.id === selectedElement ? { ...el, _autoEdit: undefined } : el))
      );
      // Focus the textarea
      setTimeout(() => {
        const textarea = textareaRefs.current[selectedElement];
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      }, 100);
    }
  }, [selectedElement, elements, isEditing, setElements]);

  // Helper function to find nearby free space when collision occurs
  const _findNearbyFreeSpace = (preferredX, preferredY, elementWidth, elementHeight) => {
    const gridSize = 20;
    const panelWidth = width;
    const panelHeight = height;
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

    // Ultimate fallback - return null to indicate no space available
    return null;
  };

  // Animation clock
  useEffect(() => {
    if (!isPowerOn) return;
    const interval = setInterval(() => setCurrentTime(t => t + 0.05), 50);
    return () => clearInterval(interval);
  }, [isPowerOn]);

  // History + clipboard
  const { saveToHistory, undo, redo } = useHistory(elements, setElements);
  const { copy, cut, paste, duplicate } = useClipboard({
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    saveToHistory,
  });

  // Snapping functionality
  const [guides, setGuides] = useState([]);
  const [_distanceIndicators, setDistanceIndicators] = useState([]);
  const { applySnapping: _applySnapping, clearGuides: _clearGuides } = useSnapping({
    elements,
    width,
    height,
    setGuides,
    setDistanceIndicators,
  });

  // Collision prevention functionality
  const { getSafePosition, getSafeResize, validateAndCorrectPositions } = useCollisionPrevention(
    elements,
    width,
    height
  );

  // Function to fix all overlapping elements
  const fixOverlaps = useCallback(() => {
    const correctedElements = validateAndCorrectPositions(elements);
    if (JSON.stringify(correctedElements) !== JSON.stringify(elements)) {
      setElements(correctedElements);
      saveToHistory(correctedElements);
    }
  }, [elements, validateAndCorrectPositions, setElements, saveToHistory]);

  // Auto-fix overlaps on mount (useful for imported layouts)
  useEffect(() => {
    if (elements.length > 1) {
      const timer = setTimeout(() => {
        fixOverlaps();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [elements.length, fixOverlaps]);

  // Delete functionality
  const deleteSelected = () => {
    if (selectedElement) {
      const updatedElements = elements.filter(el => el.id !== selectedElement);
      setElements(updatedElements);
      setSelectedElement(null);
      saveToHistory(updatedElements);
    }
  };

  // Element movement
  useEffect(() => {
    const handleMoveElement = e => {
      const { direction, distance, elementId } = e.detail;
      if (elementId === selectedElement) {
        const element = elements.find(el => el.id === elementId);
        if (element) {
          let newX = element.x;
          let newY = element.y;

          switch (direction) {
            case 'ArrowUp':
              newY = Math.max(0, element.y - distance);
              break;
            case 'ArrowDown':
              newY = Math.min(height - element.height, element.y + distance);
              break;
            case 'ArrowLeft':
              newX = Math.max(0, element.x - distance);
              break;
            case 'ArrowRight':
              newX = Math.min(width - element.width, element.x + distance);
              break;
          }

          // Check for collisions with other elements
          const wouldCollide = elements.some(otherEl => {
            if (otherEl.id === element.id) return false;

            const thisRect = {
              left: newX,
              right: newX + element.width,
              top: newY,
              bottom: newY + element.height,
            };

            const otherRect = {
              left: otherEl.x,
              right: otherEl.x + otherEl.width,
              top: otherEl.y,
              bottom: otherEl.y + otherEl.height,
            };

            // Check for overlap with buffer
            const buffer = 5;
            return !(
              thisRect.right + buffer <= otherRect.left ||
              thisRect.left >= otherRect.right + buffer ||
              thisRect.bottom + buffer <= otherRect.top ||
              thisRect.top >= otherRect.bottom + buffer
            );
          });

          // Only update position if no collision would occur
          if (!wouldCollide) {
            const updatedElements = elements.map(el =>
              el.id === elementId ? { ...el, x: newX, y: newY } : el
            );
            setElements(updatedElements);
            saveToHistory(updatedElements);
          }
          // If there would be a collision, simply don't move the element
        }
      }
    };

    window.addEventListener('moveElement', handleMoveElement);
    return () => window.removeEventListener('moveElement', handleMoveElement);
  }, [elements, selectedElement, width, height, setElements, saveToHistory]);

  // React-moveable state
  const [isDragging, setIsDragging] = useState(false);
  const moveableRefs = useRef({});

  // Generate snapping guidelines for react-moveable (including element centers)
  const getSnapGuides = () => {
    const horizontalGuides = [
      height / 3, // Third
      height / 2, // Half/Center
      (2 * height) / 3, // Two thirds
    ];

    const verticalGuides = [
      width / 3, // Third
      width / 2, // Half/Center
      (2 * width) / 3, // Two thirds
    ];

    // Add element centers to guidelines for better snapping
    elements.forEach(el => {
      if (el.id !== selectedElement) {
        // Add horizontal center line (vertical guide)
        verticalGuides.push(el.x + el.width / 2);

        // Add vertical center line (horizontal guide)
        horizontalGuides.push(el.y + el.height / 2);

        // Optionally add edge positions for comprehensive snapping
        verticalGuides.push(el.x, el.x + el.width);
        horizontalGuides.push(el.y, el.y + el.height);
      }
    });

    return {
      horizontal: horizontalGuides,
      vertical: verticalGuides,
    };
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    undo,
    redo,
    deleteSelected,
    copy,
    cut,
    paste,
    duplicate,
    selectedElement,
    isEditing,
    setIsEditing,
    setSelectedElement,
  });

  const handleElementClick = (e, el) => {
    e.stopPropagation();

    // If it's already selected text element, enable editing on single click
    if (el.type === 'text' && selectedElement === el.id && !isEditing) {
      setIsEditing(true);
      // Focus the textarea after a small delay to ensure it's rendered
      setTimeout(() => {
        const textarea = textareaRefs.current[el.id];
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      }, 50);
      return;
    }

    // Select the element
    setSelectedElement(el.id);

    // If double click, enable editing
    if (e.detail === 2 && el.type === 'text') {
      setIsEditing(true);
      // Focus the textarea after a small delay to ensure it's rendered
      setTimeout(() => {
        const textarea = textareaRefs.current[el.id];
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      }, 50);
    }
  };

  // Helpers
  const clampSpeed = Math.max(1, Math.min(10, Number(speed) || 5));

  const getEffectiveSpeed = (baseMultiplier = 1) => {
    const baseSpeed = 1.5;
    const speedFactor = clampSpeed / 5;
    return baseSpeed * speedFactor * baseMultiplier;
  };

  const t = currentTime * getEffectiveSpeed();

  const hexToRgb = hex => {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  };

  const palette = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffffff',
    '#ff7700',
    '#ff1493',
    '#00faff',
  ];

  const paletteAt = i => palette[((i % palette.length) + palette.length) % palette.length];

  // Background glow per mode
  const getGlowBackground = () => {
    if (!isPowerOn) return 'transparent';

    switch (effectiveGlowMode) {
      case 'solid':
        return glowColor;
      case 'rainbow':
        return `conic-gradient(from ${t * 60}deg, red, orange, yellow, green, cyan, blue, violet, red)`;
      case 'breathing': {
        const { r, g, b } = hexToRgb(glowColor);
        const alpha = (Math.sin(t * 0.9 * Math.PI) + 1) / 2;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      case 'chase':
        return `conic-gradient(from ${t * 145}deg, ${glowColor}, transparent 20%, ${glowColor} 40%)`;
      case 'fade': {
        const hue = (t * 40) % 360;
        return `hsl(${hue}, 100%, 50%)`;
      }
      case 'smooth': {
        const hue = (t * 40) % 360;
        return `hsl(${hue}, 100%, 55%)`;
      }
      case 'strobe': {
        const on = Math.floor(t * 3) % 2 === 0;
        const { r, g, b } = hexToRgb(glowColor);
        return `rgba(${r}, ${g}, ${b}, ${on ? 1 : 0})`;
      }
      case 'flash': {
        const idx = Math.floor(t * 4);
        return paletteAt(idx);
      }
      case 'pulse': {
        const { r, g, b } = hexToRgb(glowColor);
        const alpha = ((Math.sin(t * 2 * Math.PI) + 1) / 2) * 0.8 + 0.2;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      case 'jump': {
        const idx = Math.floor(t * 1);
        return paletteAt(idx);
      }
      default:
        return glowColor;
    }
  };

  // Color passed to ElementRenderer
  const getCurrentGlowColor = () => {
    if (!isPowerOn) return '#555';

    switch (effectiveGlowMode) {
      case 'solid':
        return glowColor;
      case 'rainbow': {
        const hue = (t * 45) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case 'breathing':
        return glowColor;
      case 'chase': {
        const hue = (t * 90) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case 'fade': {
        const hue = (t * 30) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case 'smooth': {
        const hue = (t * 11.25) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case 'strobe': {
        const on = Math.floor(t * 3) % 2 === 0;
        return on ? glowColor : '#000000';
      }
      case 'flash': {
        const idx = Math.floor(t * 4);
        return paletteAt(idx);
      }
      case 'pulse': {
        return glowColor; // Keep consistent color, let the background handle the pulsing
      }
      case 'jump': {
        const idx = Math.floor(t * 1);
        return paletteAt(idx);
      }
      default:
        return glowColor;
    }
  };

  return (
    <div
      id='panel-wrapper'
      className='relative flex items-center justify-center'
      style={{ width, height }}
      onClick={e => {
        // Only deselect if clicking on the background (not on an element)
        if (e.target === e.currentTarget) {
          setSelectedElement(null);
          setIsEditing(false);
        }
      }}
    >
      {/* Smooth, colorful LED-style glow border */}
      {showLedBorder && isPowerOn && (
        <div
          className='absolute inset-0 rounded-2xl pointer-events-none'
          style={{
            borderRadius: roundedEdges ? `${borderRadius}px` : '0px',
            background: getGlowBackground(),
            filter: 'blur(20px)',
            boxShadow: `
              0 0 18px ${glowColor},
              0 0 40px ${glowColor},
              0 0 65px ${glowColor}
            `,
            opacity: brightness / 100,
          }}
        />
      )}

      {/* Subtle inner glow */}
      {isPowerOn && (
        <div
          className='absolute inset-0 rounded-2xl z-8'
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)',
            boxShadow: 'inset 0 0 15px rgba(255, 255, 255, 0.2)',
            opacity: (brightness / 100) * 0.4,
            borderRadius: roundedEdges ? `${borderRadius}px` : '0px',
          }}
        />
      )}

      {/* Opaque panel */}
      <div
        id='panel-inner'
        className='absolute inset-0 bg-black z-15'
        style={{
          borderRadius: roundedEdges ? `${borderRadius}px` : '0px',
          opacity: isPowerOn ? 0.95 : 0.3,
          border: '2px solid rgba(255,255,255,0.3)', // Clean border without glow for export
        }}
      >
        {elements.map(el => (
          <div
            key={el.id}
            ref={ref => {
              if (ref) {
                moveableRefs.current[el.id] = ref;
              }
            }}
            className='element-wrapper'
            data-element-id={el.id}
            onClick={e => handleElementClick(e, el)}
            onDoubleClick={e => handleElementClick(e, el)}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              width: el.width,
              height: el.height,
              cursor:
                el.type === 'text'
                  ? isEditing && selectedElement === el.id
                    ? 'text'
                    : 'pointer'
                  : selectedElement === el.id
                    ? 'move'
                    : 'pointer',
            }}
          >
            <ElementRenderer
              el={el}
              glowColor={getCurrentGlowColor()}
              isPowerOn={isPowerOn}
              selected={selectedElement === el.id}
              textareaRefs={textareaRefs}
              setElements={setElements}
              saveToHistory={saveToHistory}
              deleteSelected={deleteSelected}
              brightness={brightness}
              glowMode={effectiveGlowMode}
              currentTime={currentTime}
              isEditing={isEditing && selectedElement === el.id} // Only the selected element is editing
              setIsEditing={setIsEditing}
              textGlowIntensity={textGlowIntensity}
              borderRadius={borderRadius}
            />
          </div>
        ))}

        {/* Show static guides when not dragging */}
        <StaticGuides width={width} height={height} showGuides={!isDragging} />

        {/* Active snapping guides when dragging */}
        <SnappingGuides guides={guides} />

        {/* React-moveable controller */}
        {selectedElement && moveableRefs.current[selectedElement] && (
          <Moveable
            target={moveableRefs.current[selectedElement]}
            container={null}
            origin={false}
            /* Draggable */
            draggable={!isEditing}
            throttleDrag={1}
            onDragStart={() => {
              setIsDragging(true);
            }}
            onDrag={({ target, left, top }) => {
              const selectedEl = elements.find(el => el.id === selectedElement);
              if (!selectedEl) return;

              // Apply custom snapping logic first using the existing hook reference
              const snappedPosition = _applySnapping(selectedEl, left, top);

              // Get safe position using collision prevention hook
              const safePosition = getSafePosition(
                selectedElement,
                snappedPosition.x,
                snappedPosition.y
              );

              if (safePosition) {
                // Update visual position
                target.style.left = `${safePosition.x}px`;
                target.style.top = `${safePosition.y}px`;

                // Update element position in state
                setElements(prev =>
                  prev.map(el =>
                    el.id === selectedElement ? { ...el, x: safePosition.x, y: safePosition.y } : el
                  )
                );
              } else {
                // No safe position found, revert to current position
                target.style.left = `${selectedEl.x}px`;
                target.style.top = `${selectedEl.y}px`;
              }
            }}
            onDragEnd={({ target }) => {
              setIsDragging(false);
              const left = parseInt(target.style.left);
              const top = parseInt(target.style.top);

              // Save to history
              setElements(prev => {
                const updated = prev.map(el =>
                  el.id === selectedElement ? { ...el, x: left, y: top } : el
                );
                saveToHistory(updated);
                return updated;
              });
            }}
            /* Resizable */
            resizable={!isEditing}
            throttleResize={1}
            onResizeStart={() => {
              setIsDragging(true);
            }}
            onResize={({ target, width: newWidth, height: newHeight, left, top }) => {
              const selectedEl = elements.find(el => el.id === selectedElement);
              if (!selectedEl) return;

              // Get safe resize dimensions using collision prevention hook
              const safeDimensions = getSafeResize(selectedElement, newWidth, newHeight, left, top);

              if (safeDimensions) {
                // Apply safe dimensions
                target.style.width = `${safeDimensions.width}px`;
                target.style.height = `${safeDimensions.height}px`;
                target.style.left = `${safeDimensions.x}px`;
                target.style.top = `${safeDimensions.y}px`;
              } else {
                // Fallback to original dimensions
                target.style.width = `${selectedEl.width}px`;
                target.style.height = `${selectedEl.height}px`;
                target.style.left = `${selectedEl.x}px`;
                target.style.top = `${selectedEl.y}px`;
              }
            }}
            onResizeEnd={({ target }) => {
              setIsDragging(false);
              const newWidth = parseInt(target.style.width);
              const newHeight = parseInt(target.style.height);
              const left = parseInt(target.style.left);
              const top = parseInt(target.style.top);

              // Save to history with collision-checked values
              setElements(prev => {
                const updated = prev.map(el =>
                  el.id === selectedElement
                    ? { ...el, x: left, y: top, width: newWidth, height: newHeight }
                    : el
                );
                saveToHistory(updated);
                return updated;
              });
            }}
            /* Snappable */
            snappable={true}
            snapThreshold={15}
            horizontalGuidelines={getSnapGuides().horizontal}
            verticalGuidelines={getSnapGuides().vertical}
            /* elementGuidelines removed - now using custom guidelines that include centers */
            /* Bounds */
            bounds={{ left: 0, top: 0, right: width, bottom: height }}
            /* Styling */
            renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
          />
        )}
      </div>
    </div>
  );
}
