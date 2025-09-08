import { Rnd } from 'react-rnd';
import { useRef, useState, useEffect } from 'react';
import useHistory from '../hooks/useHistory';
import useClipboard from '../hooks/useClipboard';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import useSnapping from '../hooks/useSnapping';
import './Panel.css';
import { findNearbyFreeSpace as _findNearbyFreeSpace } from '../utils/collision';
import ElementRenderer from './ElementRenderer';
import SnappingGuides from './SnappingGuides';
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
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Set default glowMode to rainbow if not provided
  const effectiveGlowMode = glowMode || 'rainbow';

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
    panelWidth: width,
    panelHeight: height,
  });

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

          // Update position without collision detection during normal movement
          const updatedElements = elements.map(el =>
            el.id === elementId ? { ...el, x: newX, y: newY } : el
          );
          setElements(updatedElements);
          saveToHistory(updatedElements);
        }
      }
    };

    window.addEventListener('moveElement', handleMoveElement);
    return () => window.removeEventListener('moveElement', handleMoveElement);
  }, [elements, selectedElement, width, height, setElements, saveToHistory]);

  // Snapping
  const [guides, setGuides] = useState([]);
  const [distanceIndicators, setDistanceIndicators] = useState([]);
  const { applySnapping, clearGuides } = useSnapping({
    elements,
    width,
    height,
    setGuides,
    setDistanceIndicators,
  });

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
      className={`relative flex items-center justify-center ${isDragging ? 'dragging-active' : ''}`}
      style={{ width, height }}
      onClick={() => {
        setSelectedElement(null);
        setIsEditing(false);
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
        {elements.map(el => {
          // Ensure all required properties exist and are valid numbers
          const safeElement = {
            ...el,
            width: typeof el.width === 'number' && !isNaN(el.width) ? el.width : 100,
            height: typeof el.height === 'number' && !isNaN(el.height) ? el.height : 100,
            x: typeof el.x === 'number' && !isNaN(el.x) ? el.x : 0,
            y: typeof el.y === 'number' && !isNaN(el.y) ? el.y : 0,
          };

          return (
            <Rnd
              key={safeElement.id}
              size={{ width: safeElement.width, height: safeElement.height }}
              position={{ x: safeElement.x, y: safeElement.y }}
              bounds='parent'
              className='element-wrapper'
              data-element-id={safeElement.id}
              onDragStart={(_e, _d) => {
                setIsDragging(true);
                setSelectedElement(el.id);
              }}
              onDrag={(e, d) => {
                // Get the current element from state to ensure we have the latest dimensions
                let currentElement = elements.find(elem => elem.id === safeElement.id);
                if (!currentElement) return;

                // Get the actual current size from the DOM element in case state hasn't updated yet
                const domElement = e.target.closest('.element-wrapper');
                if (domElement) {
                  const computedStyle = window.getComputedStyle(domElement);
                  const currentWidth = parseInt(computedStyle.width);
                  const currentHeight = parseInt(computedStyle.height);

                  // Create an element object with the most current dimensions
                  currentElement = {
                    ...currentElement,
                    width: currentWidth,
                    height: currentHeight,
                  };
                }

                // Apply snapping using the current element's updated dimensions
                applySnapping(currentElement, d.x, d.y);

                // Don't update element position during drag - let react-rnd handle it naturally
                // This prevents the drift issue by keeping the element following the mouse cursor
                // The snapping guides are shown via the applySnapping call above
              }}
              onDragStop={(_e, _d) => {
                setIsDragging(false);

                // Get the current element from state to ensure we have the latest dimensions
                const currentElement = elements.find(elem => elem.id === safeElement.id);
                if (!currentElement) return;

                const snapped = applySnapping(currentElement, _d.x, _d.y);

                // Update position without collision detection during normal dragging
                setElements(prev => {
                  const updated = prev.map(x =>
                    x.id === safeElement.id ? { ...x, ...snapped } : x
                  );
                  saveToHistory(updated);
                  return updated;
                });
                clearGuides();
              }}
              onResize={(e, dir, ref, delta, pos) => {
                // Log what's happening during resize to debug
                console.log('onResize:', {
                  element: safeElement.id,
                  type: safeElement.type,
                  direction: dir,
                  newWidth: ref.style.width,
                  newHeight: ref.style.height,
                  delta,
                  pos,
                });
              }}
              onResizeStop={(e, dir, ref, delta, pos) => {
                const newWidth = +ref.style.width;
                const newHeight = +ref.style.height;

                console.log('onResizeStop:', {
                  element: safeElement.id,
                  type: safeElement.type,
                  direction: dir,
                  finalWidth: newWidth,
                  finalHeight: newHeight,
                  delta,
                  pos,
                });

                // Temporarily disable collision detection for resize to debug the issue
                // TODO: Re-enable with proper collision detection once we identify the problem

                // Always update the element size
                setElements(prev => {
                  const updated = prev.map(x =>
                    x.id === safeElement.id
                      ? {
                          ...x,
                          x: pos.x,
                          y: pos.y,
                          width: newWidth,
                          height: newHeight,
                        }
                      : x
                  );
                  saveToHistory(updated);
                  return updated;
                });
              }}
              onClick={e => handleElementClick(e, safeElement)}
              onDoubleClick={e => handleElementClick(e, safeElement)}
              disableDragging={isEditing}
              enableResizing={{
                top: !isEditing,
                right: !isEditing,
                bottom: !isEditing,
                left: !isEditing,
                topRight: !isEditing,
                bottomRight: !isEditing,
                bottomLeft: !isEditing,
                topLeft: !isEditing,
              }}
            >
              <ElementRenderer
                el={safeElement}
                glowColor={getCurrentGlowColor()}
                isPowerOn={isPowerOn}
                selected={selectedElement === safeElement.id}
                textareaRefs={textareaRefs}
                setElements={setElements}
                saveToHistory={saveToHistory}
                deleteSelected={deleteSelected}
                brightness={brightness}
                glowMode={effectiveGlowMode}
                currentTime={t}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                textGlowIntensity={textGlowIntensity}
                borderRadius={borderRadius}
              />
            </Rnd>
          );
        })}

        <SnappingGuides guides={guides} />
        <DistanceIndicators indicators={distanceIndicators} />
      </div>
    </div>
  );
}
