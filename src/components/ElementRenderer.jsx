import { iconComponentMap } from "../utils/iconMap";
import { useEffect, useRef } from "react";

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
  currentTime = 0,
  isEditing,
  setIsEditing,
  onTextBlur,
  onTextKeyDown,
}) {
  const safeBrightness = typeof brightness === 'number' && !isNaN(brightness) ? brightness : 100;
  const elementOpacity = isPowerOn ? Math.max(0.1, Math.min(1, safeBrightness / 100)) : 0.3;
  const glowIntensity = Math.max(0, Math.min(1, safeBrightness / 100)) * 0.8;
  
  // Apply reduction to glow intensity for text
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

  // Use a ref to track if we need to select text on focus
  const selectOnFocusRef = useRef(false);

  // Effect to select text when entering edit mode
  useEffect(() => {
    if (isEditing && el.type === "text") {
      const textarea = textareaRefs.current[el.id];
      if (textarea) {
        // Small delay to ensure the textarea is focused and ready
        setTimeout(() => {
          textarea.select();
        }, 10);
      }
    }
  }, [isEditing, el.id, el.type, textareaRefs]);

  if (el.type === "text") {
    // Get text alignment class
    const getTextAlignmentClass = () => {
      switch (el.textAlign || "center") {
        case "left": return "text-left";
        case "right": return "text-right";
        case "center": 
        default: return "text-center";
      }
    };

    return (
      <textarea
        ref={(ref) => (textareaRefs.current[el.id] = ref)}
        defaultValue={el.content}
        className={`w-full h-full resize-none bg-transparent outline-none ${getTextAlignmentClass()}`}
        style={{
          fontFamily: el.fontFamily,
          fontSize: el.fontSize,
          fontWeight: el.fontWeight || "normal",
          fontStyle: el.fontStyle || "normal",
          color: isPowerOn ? glowColor : "#555",
          opacity: elementOpacity,
          textShadow: getTextGlowEffect(),
          border: selected ? "1px dashed cyan" : "none",
          transition: "all 0.3s ease",
          animation: glowMode === "rainbow" ? "rainbowText 3s linear infinite" : "none",
          cursor: isEditing ? "text" : "default",
          pointerEvents: isEditing ? "auto" : "none",
        }}
        onBlur={onTextBlur}
        onKeyDown={onTextKeyDown}
        readOnly={!isEditing}
        onClick={(e) => {
          // Prevent click from propagating to parent when editing
          if (isEditing) {
            e.stopPropagation();
          }
        }}
        onDoubleClick={(e) => {
          // Prevent double click from propagating to parent when editing
          if (isEditing) {
            e.stopPropagation();
          }
        }}
        onFocus={(e) => {
          // Select all text when the textarea receives focus
          if (selectOnFocusRef.current) {
            e.target.select();
            selectOnFocusRef.current = false;
          }
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
          cursor: "move",
        }}
      >
        <IconComp className="w-3/4 h-3/4" />
      </div>
    );
  }

  return null;
}