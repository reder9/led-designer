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
  brightness = 100,
  glowMode,
  currentTime = 0, // Add currentTime prop
}) {
  const safeBrightness = typeof brightness === 'number' && !isNaN(brightness) ? brightness : 100;
  const elementOpacity = isPowerOn ? Math.max(0.1, Math.min(1, safeBrightness / 100)) : 0.3;
  const glowIntensity = Math.max(0, Math.min(1, safeBrightness / 100)) * 0.8;
  
  // Apply 75% reduction to glow intensity for text
  const textGlowIntensity = glowIntensity * 0.5;

  // Calculate dynamic effects for text
  const getTextGlowEffect = () => {
    if (!isPowerOn) return "none";
    
    switch (glowMode) {
      case "rainbow":
        return `0 0 ${10 * textGlowIntensity}px currentColor, 0 0 ${20 * textGlowIntensity}px currentColor`;
      
      case "breathing":
        const breath = (Math.sin(currentTime * Math.PI) + 1) / 2;
        return `0 0 ${10 * textGlowIntensity * breath}px ${glowColor}, 0 0 ${20 * textGlowIntensity * breath}px ${glowColor}`;
      
      case "chase":
        return `0 0 ${10 * textGlowIntensity}px ${glowColor}, 0 0 ${20 * textGlowIntensity}px ${glowColor}`;
      
      default:
        return `0 0 ${8 * textGlowIntensity}px ${glowColor}, 0 0 ${15 * textGlowIntensity}px ${glowColor}`;
    }
  };

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
          opacity: elementOpacity,
          textShadow: getTextGlowEffect(),
          border: selected ? "1px dashed cyan" : "none",
          transition: "all 0.3s ease",
          animation: glowMode === "rainbow" ? "rainbowText 3s linear infinite" : "none",
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
          opacity: elementOpacity,
          filter: isPowerOn 
            ? `drop-shadow(0 0 ${8 * glowIntensity}px ${glowColor}) 
               brightness(${1 + glowIntensity * 0.5})`
            : "none",
          transition: "all 0.3s ease",
        }}
      >
        <IconComp className="w-3/4 h-3/4" />
      </div>
    );
  }

  return null;
}