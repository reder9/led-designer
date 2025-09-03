import { Rnd } from "react-rnd";
import { useRef, useState } from "react";
import useHistory from "../hooks/useHistory";
import useClipboard from "../hooks/useClipboard";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useSnapping from "../hooks/useSnapping";
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
  width,
  height,
}) {
  const textareaRefs = useRef({});
  const [isDragging, setIsDragging] = useState(false);

  // History + clipboard hooks
  const { saveToHistory, undo, redo, history } = useHistory(elements, setElements);
  const { copy, cut, paste, duplicate, deleteSelected } = useClipboard({
    elements,
    setElements,
    selectedElement,
    setSelectedElement,
    saveToHistory,
  });

  // Snapping state + logic
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
  });

  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setSelectedElement(id);
    createContextMenu(e.pageX, e.pageY);
  };

  return (
    <div
      id="panel-container"
      className="relative flex items-center justify-center"
      style={{
        width,
        height,
        backgroundColor: "black",
        borderRadius: roundedEdges ? "20px" : "0px",
        boxShadow: isPowerOn ? `0 0 40px 15px ${glowColor}` : "none",
        transition: "box-shadow 0.3s ease",
        opacity: isPowerOn ? 1 : 0.3,
      }}
      onClick={() => setSelectedElement(null)}
    >
      {elements.map((el) => (
        <Rnd
          key={el.id}
          size={{ width: el.width, height: el.height }}
          position={{ x: el.x, y: el.y }}
          bounds="parent"
          onDragStart={() => setIsDragging(true)}
          onDrag={(e, d) => {
            // Preview snapping guides only, don't update elements yet
            applySnapping(el, d.x, d.y);
          }}
          onDragStop={(e, d) => {
            setIsDragging(false);

            // Final snapped position
            const snapped = applySnapping(el, d.x, d.y);

            // Use functional update to get the latest state
            setElements((prevElements) => {
              const updatedElements = prevElements.map((x) =>
                x.id === el.id ? { ...x, ...snapped } : x
              );
              
              // Save history with the updated elements
              saveToHistory(updatedElements);
              return updatedElements;
            });

            clearGuides();
          }}
          onResizeStop={(e, dir, ref, delta, pos) => {
            setElements((prevElements) => {
              const updatedElements = prevElements.map((x) =>
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
              
              // Save history with the updated elements
              saveToHistory(updatedElements);
              return updatedElements;
            });
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElement(el.id);
          }}
          onContextMenu={(e) => handleContextMenu(e, el.id)}
        >
          <ElementRenderer
            el={el}
            glowColor={glowColor}
            isPowerOn={isPowerOn}
            selected={selectedElement === el.id}
            textareaRefs={textareaRefs}
            setElements={setElements}
            saveToHistory={saveToHistory}
            deleteSelected={deleteSelected}
          />
        </Rnd>
      ))}

      <SnappingGuides guides={guides} />
      <DistanceIndicators indicators={distanceIndicators} />
    </div>
  );
}