import { useEffect } from "react";

export default function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onDelete,
}) {
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            onUndo && onUndo();
            break;
          case "y":
            e.preventDefault();
            onRedo && onRedo();
            break;
          case "c":
            e.preventDefault();
            onCopy && onCopy();
            break;
          case "v":
            e.preventDefault();
            onPaste && onPaste();
            break;
          default:
            break;
        }
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDelete && onDelete();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onUndo, onRedo, onCopy, onPaste, onDelete]);
}
