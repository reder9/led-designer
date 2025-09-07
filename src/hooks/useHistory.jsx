import { useRef } from 'react';

export default function useHistory(elements, setElements) {
  const historyRef = useRef([elements]);
  const pointerRef = useRef(0);

  const saveToHistory = newElements => {
    const history = historyRef.current.slice(0, pointerRef.current + 1);
    history.push([...newElements]); // Make sure to create a new array
    historyRef.current = history;
    pointerRef.current = history.length - 1;
  };

  const undo = () => {
    if (pointerRef.current > 0) {
      pointerRef.current -= 1;
      setElements([...historyRef.current[pointerRef.current]]);
    }
  };

  const redo = () => {
    if (pointerRef.current < historyRef.current.length - 1) {
      pointerRef.current += 1;
      setElements([...historyRef.current[pointerRef.current]]);
    }
  };

  return {
    saveToHistory,
    undo,
    redo,
    history: historyRef.current,
    pointer: pointerRef.current,
  };
}
