import { iconComponentMap } from "../utils/iconMap";

export default function ElementRenderer({
  el,
  glowColor,
  isPowerOn,
  selected,
  textareaRefs,
  setElements,
  saveToHistory,
  deleteSelected,
}) {
  if (el.type === "text") {
    return (
      <textarea
        ref={(ref) => (textareaRefs.current[el.id] = ref)}
        defaultValue={el.content}
        className="w-full h-full resize-none bg-transparent outline-none text-center"
        style={{
          fontFamily: el.fontFamily,
          fontSize: el.fontSize,
          color: isPowerOn ? glowColor : "#555",
          textShadow: isPowerOn ? `0 0 10px ${glowColor}` : "none",
          border: selected ? "1px dashed cyan" : "none",
        }}
        onBlur={(e) => {
          setElements((els) =>
            els.map((x) => (x.id === el.id ? { ...x, content: e.target.value } : x))
          );
          saveToHistory(el);
        }}
      />
    );
  }

  if (el.type === "icon" && el.iconKey && iconComponentMap[el.iconKey]) {
    const IconComp = iconComponentMap[el.iconKey];
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          color: isPowerOn ? glowColor : "#555",
          filter: isPowerOn ? `drop-shadow(0 0 8px ${glowColor})` : "none",
        }}
      >
        <IconComp className="w-3/4 h-3/4" />
      </div>
    );
  }

  return null;
}
