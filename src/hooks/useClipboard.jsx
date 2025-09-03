import { useCallback } from "react";

export default function useClipboard(elements, setElements) {
  const copy = useCallback(
    (elementId) => {
      const el = elements.find((e) => e.id === elementId);
      if (el) {
        navigator.clipboard.writeText(JSON.stringify(el));
      }
    },
    [elements]
  );

  const paste = useCallback(
    async (x = 50, y = 50) => {
      try {
        const text = await navigator.clipboard.readText();
        const parsed = JSON.parse(text);
        if (parsed && parsed.id) {
          const newElement = {
            ...parsed,
            id: Date.now(),
            x,
            y,
          };
          setElements((prev) => [...prev, newElement]);
        }
      } catch (err) {
        console.warn("Clipboard paste failed", err);
      }
    },
    [setElements]
  );

  return { copy, paste };
}
