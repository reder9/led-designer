import { useCallback } from 'react';

export default function useClipboard({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
  saveToHistory,
}) {
  const copy = useCallback(() => {
    if (selectedElement) {
      const el = elements.find(e => e.id === selectedElement);
      if (el) {
        // Create a copy for clipboard
        const clipboardData = {
          ...el,
          _isClipboardElement: true,
          _sourceApp: 'led-panel-designer',
        };
        navigator.clipboard.writeText(JSON.stringify(clipboardData));

        // Visual feedback
        const element = document.querySelector(`[data-element-id="${selectedElement}"]`);
        if (element) {
          element.style.animation = 'flash 0.3s';
          setTimeout(() => {
            if (element) element.style.animation = '';
          }, 300);
        }
      }
    }
  }, [elements, selectedElement]);

  const cut = useCallback(() => {
    if (selectedElement) {
      const el = elements.find(e => e.id === selectedElement);
      if (el) {
        // Copy to clipboard first
        const clipboardData = {
          ...el,
          _isClipboardElement: true,
          _sourceApp: 'led-panel-designer',
        };
        navigator.clipboard.writeText(JSON.stringify(clipboardData));

        // Remove from elements
        const updatedElements = elements.filter(e => e.id !== selectedElement);
        setElements(updatedElements);
        setSelectedElement(null);
        saveToHistory(updatedElements);
      }
    }
  }, [elements, selectedElement, setElements, setSelectedElement, saveToHistory]);

  const paste = useCallback(
    async (x, y) => {
      try {
        const text = await navigator.clipboard.readText();
        const parsed = JSON.parse(text);

        // Validate it's from our app (support multiple app name variants)
        const validAppNames = ['led-panel-designer', 'led-designer'];
        if (parsed && parsed._isClipboardElement && validAppNames.includes(parsed._sourceApp)) {
          // Remove clipboard metadata
          const { _isClipboardElement, _sourceApp, ...elementData } = parsed;

          // Calculate paste position
          let pasteX = x ?? 50;
          let pasteY = y ?? 50;

          // If no specific position provided, paste near original or offset from existing elements
          if (x === undefined || y === undefined) {
            pasteX = elementData.x + 20;
            pasteY = elementData.y + 20;

            // Make sure it doesn't go outside bounds
            if (pasteX > 750) pasteX = 50;
            if (pasteY > 350) pasteY = 50;
          }

          const newElement = {
            ...elementData,
            id: Date.now() + Math.random(), // Ensure unique ID
            x: pasteX,
            y: pasteY,
          };

          const updatedElements = [...elements, newElement];
          setElements(updatedElements);
          setSelectedElement(newElement.id);
          saveToHistory(updatedElements);

          return newElement;
        } else {
          console.warn('Clipboard content validation failed:', {
            hasClipboardFlag: !!parsed._isClipboardElement,
            sourceApp: parsed._sourceApp,
            expectedApps: ['led-panel-designer', 'led-designer'],
          });
        }
      } catch (err) {
        console.warn('Clipboard paste failed:', err);
      }
    },
    [elements, setElements, setSelectedElement, saveToHistory]
  );

  const duplicate = useCallback(() => {
    if (selectedElement) {
      const el = elements.find(e => e.id === selectedElement);
      if (el) {
        // Function to check if a position overlaps with existing elements
        const isPositionOccupied = (x, y, elementWidth = 100, elementHeight = 50) => {
          return elements.some(existing => {
            if (existing.id === el.id) return false; // Don't check against self

            const buffer = 20; // Minimum spacing between elements
            return (
              x < existing.x + elementWidth + buffer &&
              x + elementWidth + buffer > existing.x &&
              y < existing.y + elementHeight + buffer &&
              y + elementHeight + buffer > existing.y
            );
          });
        };

        // Try to find a good position
        let newX = el.x;
        let newY = el.y;
        let attempts = 0;
        const maxAttempts = 20;

        // Start with the preferred offset position
        let offsetX = 60;
        let offsetY = 60;

        while (attempts < maxAttempts) {
          // Calculate potential position
          const testX = el.x + offsetX;
          const testY = el.y + offsetY;

          // Check bounds first
          if (testX >= 0 && testX <= 700 && testY >= 0 && testY <= 300) {
            if (!isPositionOccupied(testX, testY)) {
              newX = testX;
              newY = testY;
              break;
            }
          }

          // Try different positions in a spiral pattern
          attempts++;
          const angle = attempts * 45 * (Math.PI / 180); // 45 degree increments
          const radius = 60 + Math.floor(attempts / 8) * 40; // Expand search radius
          offsetX = Math.cos(angle) * radius;
          offsetY = Math.sin(angle) * radius;
        }

        // If we couldn't find a good spot, just use a random position
        if (attempts >= maxAttempts) {
          newX = Math.random() * 600 + 50;
          newY = Math.random() * 250 + 50;
        }

        const newElement = {
          ...el,
          id: Date.now() + Math.random(),
          x: newX,
          y: newY,
        };

        const updatedElements = [...elements, newElement];
        setElements(updatedElements);
        setSelectedElement(newElement.id);
        saveToHistory(updatedElements);
      }
    }
  }, [elements, selectedElement, setElements, setSelectedElement, saveToHistory]);

  return { copy, cut, paste, duplicate };
}
