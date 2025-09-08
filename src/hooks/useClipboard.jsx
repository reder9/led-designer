import { useCallback } from 'react';
import { findNearbyFreeSpace } from '../utils/collision';

export default function useClipboard({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
  saveToHistory,
  panelWidth,
  panelHeight,
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

        // Visual feedback - subtle glow effect without changing element size/opacity
        const element = document.querySelector(`[data-element-id="${selectedElement}"]`);
        if (element) {
          element.style.animation = 'copyFeedback 0.4s ease-out';
          setTimeout(() => {
            if (element) element.style.animation = '';
          }, 400);
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

          // Calculate paste position with collision detection
          const pasteX = x ?? elementData.x + 20;
          const pasteY = y ?? elementData.y + 20;

          // Find a free space for the pasted element
          const freeSpace = findNearbyFreeSpace(
            pasteX,
            pasteY,
            elementData.width,
            elementData.height,
            elements,
            panelWidth || 800,
            panelHeight || 400
          );

          if (!freeSpace) {
            console.warn('No free space available for paste operation');
            return null;
          }

          const newElement = {
            ...elementData,
            id: Date.now() + Math.random(), // Ensure unique ID
            x: freeSpace.x,
            y: freeSpace.y,
            // Ensure required properties exist and are valid
            width:
              typeof elementData.width === 'number' && !isNaN(elementData.width)
                ? elementData.width
                : 100,
            height:
              typeof elementData.height === 'number' && !isNaN(elementData.height)
                ? elementData.height
                : 100,
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
    [elements, setElements, setSelectedElement, saveToHistory, panelWidth, panelHeight]
  );

  const duplicate = useCallback(() => {
    if (selectedElement) {
      const el = elements.find(e => e.id === selectedElement);
      if (el) {
        // Find a free space for the duplicated element
        const freeSpace = findNearbyFreeSpace(
          el.x + 20,
          el.y + 20,
          el.width,
          el.height,
          elements,
          panelWidth || 800,
          panelHeight || 400
        );

        if (!freeSpace) {
          console.warn('No free space available for duplicate operation');
          return;
        }

        const newElement = {
          ...el,
          id: Date.now() + Math.random(),
          x: freeSpace.x,
          y: freeSpace.y,
          // Ensure required properties exist and are valid
          width: typeof el.width === 'number' && !isNaN(el.width) ? el.width : 100,
          height: typeof el.height === 'number' && !isNaN(el.height) ? el.height : 100,
        };

        const updatedElements = [...elements, newElement];
        setElements(updatedElements);
        setSelectedElement(newElement.id);
        saveToHistory(updatedElements);
      }
    }
  }, [
    elements,
    selectedElement,
    setElements,
    setSelectedElement,
    saveToHistory,
    panelWidth,
    panelHeight,
  ]);

  return { copy, cut, paste, duplicate };
}
