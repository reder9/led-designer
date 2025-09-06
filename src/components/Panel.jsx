import { Rnd } from "react-rnd";
import { useRef, useState, useEffect } from "react";
import useHistory from "../hooks/useHistory";
import useClipboard from "../hooks/useClipboard";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useSnapping from "../hooks/useSnapping";
import "./Panel.css";
import { createContextMenu } from "../utils/contextMenu";
import ElementRenderer from "./ElementRenderer";
import SnappingGuides from "./SnappingGuides";
import DistanceIndicators from "./DistanceIndicators";

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
}) {
  const textareaRefs = useRef({});
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Set default glowMode to rainbow if not provided
  const effectiveGlowMode = glowMode || "rainbow";

  // Helper function to find nearby free space when collision occurs
  const findNearbyFreeSpace = (preferredX, preferredY, elementWidth, elementHeight) => {
    const gridSize = 20;
    const panelWidth = width;
    const panelHeight = height;
    const padding = 10;

    // Try positions in a spiral pattern around the preferred location
    for (let radius = 0; radius < 200; radius += gridSize) {
      for (let angle = 0; angle < 360; angle += 45) {
        const x = Math.max(padding, Math.min(panelWidth - elementWidth - padding, 
          preferredX + radius * Math.cos(angle * Math.PI / 180)));
        const y = Math.max(padding, Math.min(panelHeight - elementHeight - padding, 
          preferredY + radius * Math.sin(angle * Math.PI / 180)));

        // Check if this position is free
        const wouldCollide = elements.some(otherEl => {
          const thisRect = {
            left: x,
            right: x + elementWidth,
            top: y,
            bottom: y + elementHeight
          };
          
          const otherRect = {
            left: otherEl.x,
            right: otherEl.x + otherEl.width,
            top: otherEl.y,
            bottom: otherEl.y + otherEl.height
          };

          const buffer = 2;
          return !(thisRect.right + buffer <= otherRect.left || 
                  thisRect.left >= otherRect.right + buffer || 
                  thisRect.bottom + buffer <= otherRect.top || 
                  thisRect.top >= otherRect.bottom + buffer);
        });

        if (!wouldCollide) {
          return { x, y };
        }
      }
    }

    // Fallback to top-left corner
    return { x: padding, y: padding };
  };

  // Animation clock
  useEffect(() => {
    if (!isPowerOn) return;
    const interval = setInterval(() => setCurrentTime((t) => t + 0.05), 50);
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

  // Delete functionality
  const deleteSelected = () => {
    if (selectedElement) {
      const updatedElements = elements.filter(el => el.id !== selectedElement);
      setElements(updatedElements);
      setSelectedElement(null);
      saveToHistory(updatedElements);
    }
  };

  // Layer management
  const bringToFront = () => {
    if (selectedElement) {
      const elementIndex = elements.findIndex(el => el.id === selectedElement);
      if (elementIndex !== -1 && elementIndex !== elements.length - 1) {
        const element = elements[elementIndex];
        const newElements = [
          ...elements.slice(0, elementIndex),
          ...elements.slice(elementIndex + 1),
          element
        ];
        setElements(newElements);
        saveToHistory(newElements);
      }
    }
  };

  const sendToBack = () => {
    if (selectedElement) {
      const elementIndex = elements.findIndex(el => el.id === selectedElement);
      if (elementIndex !== -1 && elementIndex !== 0) {
        const element = elements[elementIndex];
        const newElements = [
          element,
          ...elements.slice(0, elementIndex),
          ...elements.slice(elementIndex + 1)
        ];
        setElements(newElements);
        saveToHistory(newElements);
      }
    }
  };

  // Element movement
  useEffect(() => {
    const handleMoveElement = (e) => {
      const { direction, distance, elementId } = e.detail;
      if (elementId === selectedElement) {
        const element = elements.find(el => el.id === elementId);
        if (element) {
          let newX = element.x;
          let newY = element.y;
          
          switch (direction) {
            case "ArrowUp":
              newY = Math.max(0, element.y - distance);
              break;
            case "ArrowDown":
              newY = Math.min(height - element.height, element.y + distance);
              break;
            case "ArrowLeft":
              newX = Math.max(0, element.x - distance);
              break;
            case "ArrowRight":
              newX = Math.min(width - element.width, element.x + distance);
              break;
          }
          
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
    bringToFront,
    sendToBack,
  });

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setSelectedElement(id);
    
    createContextMenu(e.pageX, e.pageY, {
      onCopy: copy,
      onCut: cut,
      onPaste: () => paste(e.offsetX, e.offsetY),
      onDuplicate: duplicate,
      onDelete: deleteSelected,
      onBringToFront: bringToFront,
      onSendToBack: sendToBack,
      hasSelectedElement: !!selectedElement,
      canPaste: true,
    });
  };

  const handlePanelContextMenu = (e) => {
    e.preventDefault();
    
    createContextMenu(e.pageX, e.pageY, {
      onPaste: () => paste(e.nativeEvent.offsetX, e.nativeEvent.offsetY),
      hasSelectedElement: false,
      canPaste: true,
    });
  };

  const handleElementClick = (e, el) => {
    e.stopPropagation();
    setSelectedElement(el.id);
    
    // If double click, enable editing
    if (e.detail === 2 && el.type === "text") {
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

  const hexToRgb = (hex) => {
    const h = hex.replace("#", "");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  };

  const palette = [
    "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff",
    "#ffffff", "#ff7700", "#ff1493", "#00faff",
  ];

  const paletteAt = (i) => palette[((i % palette.length) + palette.length) % palette.length];

  // Background glow per mode
  const getGlowBackground = () => {
    if (!isPowerOn) return "transparent";

    switch (effectiveGlowMode) {
      case "solid":
        return glowColor;
      case "rainbow":
        return `conic-gradient(from ${t * 60}deg, red, orange, yellow, green, cyan, blue, violet, red)`;
      case "breathing": {
        const { r, g, b } = hexToRgb(glowColor);
        const alpha = ((Math.sin(t * 0.9 * Math.PI) + 1) / 2);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      case "chase":
        return `conic-gradient(from ${t * 145}deg, ${glowColor}, transparent 20%, ${glowColor} 40%)`;
      case "fade": {
        const hue = (t * 40) % 360;
        return `hsl(${hue}, 100%, 50%)`;
      }
      case "smooth": {
        const hue = (t * 40) % 360;
        return `hsl(${hue}, 100%, 55%)`;
      }
      case "strobe": {
        const on = Math.floor(t * 3) % 2 === 0;
        const { r, g, b } = hexToRgb(glowColor);
        return `rgba(${r}, ${g}, ${b}, ${on ? 1 : 0})`;
      }
      case "flash": {
        const idx = Math.floor(t * 4);
        return paletteAt(idx);
      }
      case "jump": {
        const idx = Math.floor(t * 1);
        return paletteAt(idx);
      }
      default:
        return glowColor;
    }
  };

  // Color passed to ElementRenderer
  const getCurrentGlowColor = () => {
    if (!isPowerOn) return "#555";

    switch (effectiveGlowMode) {
      case "solid":
        return glowColor;
      case "rainbow": {
        const hue = (t * 45) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case "breathing":
        return glowColor;
      case "chase": {
        const hue = (t * 90) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case "fade": {
        const hue = (t * 30) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case "smooth": {
        const hue = (t * 11.25) % 360;
        return `hsl(${hue}, 100%, 70%)`;
      }
      case "strobe": {
        const on = Math.floor(t * 3) % 2 === 0;
        return on ? glowColor : "#000000";
      }
      case "flash": {
        const idx = Math.floor(t * 4);
        return paletteAt(idx);
      }
      case "jump": {
        const idx = Math.floor(t * 1);
        return paletteAt(idx);
      }
      default:
        return glowColor;
    }
  };

  return (
    <div
      id="panel-wrapper"
      className="relative flex items-center justify-center"
      style={{ width, height }}
      onClick={() => {
        setSelectedElement(null);
        setIsEditing(false);
      }}
      onContextMenu={handlePanelContextMenu}
    >
      {/* Smooth, colorful LED-style glow border */}
      {showLedBorder && isPowerOn && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            borderRadius: roundedEdges ? `${borderRadius}px` : "0px",
            background: getGlowBackground(),
            filter: "blur(20px)",
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
          className="absolute inset-0 rounded-2xl z-8"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 60%)",
            boxShadow: "inset 0 0 15px rgba(255, 255, 255, 0.2)",
            opacity: (brightness / 100) * 0.4,
            borderRadius: roundedEdges ? `${borderRadius}px` : "0px",
          }}
        />
      )}

      {/* Opaque panel */}
      <div
        id="panel-inner"
        className="absolute inset-0 bg-black z-15"
        style={{
          borderRadius: roundedEdges ? `${borderRadius}px` : "0px",
          opacity: isPowerOn ? 0.95 : 0.3,
          border: "2px solid rgba(255,255,255,0.3)", // Clean border without glow for export
        }}
      >
        {elements.map((el) => (
          <Rnd
            key={el.id}
            size={{ width: el.width, height: el.height }}
            position={{ x: el.x, y: el.y }}
            bounds="parent"
            className="element-wrapper"
            data-element-id={el.id}
            onDragStart={(e, d) => {
              setIsDragging(true);
              setSelectedElement(el.id);
            }}
            onDrag={(e, d) => {
              const snapped = applySnapping(el, d.x, d.y);
              
              // Check for collisions with other elements during drag
              const wouldCollide = elements.some(otherEl => {
                if (otherEl.id === el.id) return false;
                
                const thisRect = {
                  left: snapped.x,
                  right: snapped.x + el.width,
                  top: snapped.y,
                  bottom: snapped.y + el.height
                };
                
                const otherRect = {
                  left: otherEl.x,
                  right: otherEl.x + otherEl.width,
                  top: otherEl.y,
                  bottom: otherEl.y + otherEl.height
                };

                // Check for overlap with a small buffer to prevent touching
                const buffer = 2;
                return !(thisRect.right + buffer <= otherRect.left || 
                        thisRect.left >= otherRect.right + buffer || 
                        thisRect.bottom + buffer <= otherRect.top || 
                        thisRect.top >= otherRect.bottom + buffer);
              });

              // Only update position if no collision
              if (!wouldCollide) {
                setElements(prev => 
                  prev.map(x => x.id === el.id ? { ...x, x: snapped.x, y: snapped.y } : x)
                );
              }
            }}
            onDragStop={(e, d) => {
              setIsDragging(false);
              const snapped = applySnapping(el, d.x, d.y);

              // Check for collisions with other elements
              const wouldCollide = elements.some(otherEl => {
                if (otherEl.id === el.id) return false;
                
                const thisRect = {
                  left: snapped.x,
                  right: snapped.x + el.width,
                  top: snapped.y,
                  bottom: snapped.y + el.height
                };
                
                const otherRect = {
                  left: otherEl.x,
                  right: otherEl.x + otherEl.width,
                  top: otherEl.y,
                  bottom: otherEl.y + otherEl.height
                };

                // Check for overlap with buffer
                const buffer = 2;
                return !(thisRect.right + buffer <= otherRect.left || 
                        thisRect.left >= otherRect.right + buffer || 
                        thisRect.bottom + buffer <= otherRect.top || 
                        thisRect.top >= otherRect.bottom + buffer);
              });

              if (wouldCollide) {
                // If there would be a collision, find a nearby free space
                const freeSpace = findNearbyFreeSpace(snapped.x, snapped.y, el.width, el.height);
                setElements((prev) => {
                  const updated = prev.map((x) =>
                    x.id === el.id ? { ...x, x: freeSpace.x, y: freeSpace.y } : x
                  );
                  saveToHistory(updated);
                  return updated;
                });
              } else {
                // If no collision, update position
                setElements((prev) => {
                  const updated = prev.map((x) =>
                    x.id === el.id ? { ...x, ...snapped } : x
                  );
                  saveToHistory(updated);
                  return updated;
                });
              }
              clearGuides();
            }}
            onResizeStop={(e, dir, ref, delta, pos) => {
              // Check if the new size/position would cause collision
              const wouldCollide = elements.some(otherEl => {
                if (otherEl.id === el.id) return false;

                const thisRect = {
                  left: pos.x,
                  right: pos.x + parseInt(ref.style.width),
                  top: pos.y,
                  bottom: pos.y + parseInt(ref.style.height)
                };

                const otherRect = {
                  left: otherEl.x,
                  right: otherEl.x + otherEl.width,
                  top: otherEl.y,
                  bottom: otherEl.y + otherEl.height
                };

                return !(thisRect.right < otherRect.left || 
                        thisRect.left > otherRect.right || 
                        thisRect.bottom < otherRect.top || 
                        thisRect.top > otherRect.bottom);
              });

              if (wouldCollide) {
                // If there would be a collision, revert to original size/position
                setElements(prev => [...prev]);
              } else {
                // If no collision, update size and position
                setElements((prev) => {
                  const updated = prev.map((x) =>
                    x.id === el.id
                      ? {
                          ...x,
                          x: pos.x,
                          y: pos.y,
                          width: +ref.style.width,
                          height: +ref.style.height,
                        }
                      : x
                  );
                  saveToHistory(updated);
                  return updated;
                });
              }
            }}
            onClick={(e) => handleElementClick(e, el)}
            onDoubleClick={(e) => handleElementClick(e, el)}
            onContextMenu={(e) => handleContextMenu(e, el.id)}
            disableDragging={isEditing}
            enableResizing={{
              top: !isEditing,
              right: !isEditing,
              bottom: !isEditing,
              left: !isEditing,
              topRight: !isEditing,
              bottomRight: !isEditing,
              bottomLeft: !isEditing,
              topLeft: !isEditing
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
              currentTime={t}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          </Rnd>
        ))}

        <SnappingGuides guides={guides} />
        <DistanceIndicators indicators={distanceIndicators} />
      </div>
    </div>
  );
}