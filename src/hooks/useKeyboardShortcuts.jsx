// Updated useKeyboardShortcuts hook
import { useEffect } from "react";

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
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if user is typing in a text input/textarea
      const target = e.target;
      const isTextInput = target.tagName === "TEXTAREA" || 
                          target.tagName === "INPUT" || 
                          target.isContentEditable;
      
      // Don't handle shortcuts if user is editing text (unless it's Escape)
      if (isTextInput && e.key !== "Escape") {
        return; // Allow normal text editing behavior
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      switch (e.key) {
        case "Delete":
        case "Backspace":
          // Only prevent default if not editing and we have a selected element
          if (selectedElement && !isEditing) {
            e.preventDefault();
            deleteSelected();
          }
          break;
        case "z":
          if (ctrlOrCmd && !e.shiftKey) {
            e.preventDefault();
            undo();
          }
          break;
        case "Z":
          if (ctrlOrCmd && e.shiftKey) {
            e.preventDefault();
            redo();
          }
          break;
        case "c":
          if (ctrlOrCmd && selectedElement) {
            e.preventDefault();
            copy();
          }
          break;
        case "x":
          if (ctrlOrCmd && selectedElement) {
            e.preventDefault();
            cut();
          }
          break;
        case "v":
          if (ctrlOrCmd) {
            e.preventDefault();
            paste();
          }
          break;
        case "d":
          if (ctrlOrCmd && selectedElement) {
            e.preventDefault();
            duplicate();
          }
          break;
        case "Escape":
          if (isEditing) {
            e.preventDefault();
            setIsEditing(false);
          } else if (selectedElement) {
            e.preventDefault();
            setSelectedElement(null);
          }
          break;
        case "Enter":
          if (selectedElement && !isEditing) {
            e.preventDefault();
            setIsEditing(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
  ]);
}