// Enhanced useKeyboardShortcuts hook
import { useEffect } from 'react';

export default function useKeyboardShortcuts({
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
  selectAll,
  deselect,
  bringToFront,
  sendToBack,
}) {
  useEffect(() => {
    const handleKeyDown = e => {
      // Check if user is typing in a text input/textarea
      const target = e.target;
      const isTextInput =
        target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.isContentEditable;

      // Don't handle shortcuts if user is editing text (unless it's specific keys)
      if (isTextInput && !['Escape', 'Tab'].includes(e.key)) {
        return; // Allow normal text editing behavior
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;
      const shiftKey = e.shiftKey;
      const _altKey = e.altKey;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          // Only prevent default if not editing and we have a selected element
          if (selectedElement && !isEditing) {
            e.preventDefault();
            deleteSelected();
          }
          break;

        // Undo/Redo
        case 'z':
          if (ctrlOrCmd && !shiftKey) {
            e.preventDefault();
            undo();
          }
          break;
        case 'Z':
        case 'y':
          if ((ctrlOrCmd && shiftKey && e.key === 'Z') || (ctrlOrCmd && e.key === 'y')) {
            e.preventDefault();
            redo();
          }
          break;

        // Clipboard operations
        case 'c':
          if (ctrlOrCmd && selectedElement) {
            e.preventDefault();
            copy();
          }
          break;
        case 'x':
          if (ctrlOrCmd && selectedElement) {
            e.preventDefault();
            cut();
          }
          break;
        case 'v':
          if (ctrlOrCmd) {
            e.preventDefault();
            paste();
          }
          break;
        case 'd':
          if (ctrlOrCmd && selectedElement) {
            e.preventDefault();
            duplicate();
          }
          break;

        // Selection
        case 'a':
          if (ctrlOrCmd && selectAll) {
            e.preventDefault();
            selectAll();
          }
          break;

        // Layer management
        case ']':
          if (ctrlOrCmd && selectedElement && bringToFront) {
            e.preventDefault();
            bringToFront();
          }
          break;
        case '[':
          if (ctrlOrCmd && selectedElement && sendToBack) {
            e.preventDefault();
            sendToBack();
          }
          break;

        // Movement with arrow keys
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          if (selectedElement && !isEditing) {
            e.preventDefault();
            moveElement(e.key, shiftKey ? 10 : 1);
          }
          break;

        // Other shortcuts
        case 'Escape':
          if (isEditing) {
            e.preventDefault();
            setIsEditing(false);
          } else if (selectedElement) {
            e.preventDefault();
            setSelectedElement(null);
          }
          break;
        case 'Enter':
          if (selectedElement && !isEditing) {
            e.preventDefault();
            setIsEditing(true);
          }
          break;
        case 'Tab':
          if (!isTextInput) {
            e.preventDefault();
            // Could implement tab to next element
          }
          break;
      }
    };

    // Helper function to move selected element
    const moveElement = (direction, distance) => {
      if (!selectedElement) return;

      // This would need to be implemented in the Panel component
      // For now, we'll emit a custom event
      const event = new CustomEvent('moveElement', {
        detail: { direction, distance, elementId: selectedElement },
      });
      window.dispatchEvent(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
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
    selectAll,
    deselect,
    bringToFront,
    sendToBack,
  ]);
}
