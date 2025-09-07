import { iconComponentMap } from "../utils/iconMap.jsx";
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

    // Get font class from font name
    const getFontClass = (fontFamily) => {
      const fontMap = {
        "Orbitron": "font-orbitron",
        "Russo One": "font-russo-one", 
        "Play": "font-play",
        "Rajdhani": "font-rajdhani",
        "Chakra Petch": "font-chakra",
        "Audiowide": "font-audiowide",
        "Teko": "font-teko",
        "Aldrich": "font-aldrich",
        "Quantico": "font-quantico",
        "Oxanium": "font-oxanium",
        "Press Start 2P": "font-press-start",
        "VT323": "font-vt323",
        "Share Tech Mono": "font-share-tech",
        "Iceland": "font-iceland",
        "Syncopate": "font-syncopate",
        "Wallpoet": "font-wallpoet",
        "Nova Square": "font-nova-square",
        "Michroma": "font-michroma",
        "Stalinist One": "font-stalinist",
        "Rubik Mono One": "font-rubik-mono",
        "Faster One": "font-faster-one",
        "Monoton": "font-monoton"
      };
      return fontMap[fontFamily] || '';
    };

    const fontClass = getFontClass(el.fontFamily);

    return (
      <textarea
        ref={(ref) => (textareaRefs.current[el.id] = ref)}
        defaultValue={el.content}
        data-text-element="true"
        data-element-type="text"
        className={`w-full h-full resize-none bg-transparent outline-none ${getTextAlignmentClass()} ${fontClass}`}
        style={{
          fontFamily: fontClass ? undefined : el.fontFamily, // Only use inline fontFamily if no class available
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
        className="w-full h-full flex items-center justify-center relative"
        style={{
          backgroundColor: "transparent",
          opacity: elementOpacity,
          transition: "all 0.3s ease",
          cursor: "move",
          border: selected ? "1px dashed cyan" : "none",
          animation: glowMode === "rainbow" ? "rainbowText 3s linear infinite" : "none",
          pointerEvents: "auto",
          transform: "translate3d(0, 0, 0)",
          willChange: "transform",
          borderRadius: "4px",
        }}
      >
        <>
          {/* SVG Filter Definition */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id="coloredInvert">
                <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"/>
                <feComponentTransfer>
                  <feFuncR type="discrete" tableValues={`0 ${parseInt(glowColor.slice(1, 3), 16) / 255}`}/>
                  <feFuncG type="discrete" tableValues={`0 ${parseInt(glowColor.slice(3, 5), 16) / 255}`}/>
                  <feFuncB type="discrete" tableValues={`0 ${parseInt(glowColor.slice(5, 7), 16) / 255}`}/>
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
          
          <div style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            filter: isPowerOn ? 
              `drop-shadow(0 0 ${8 * textGlowIntensity}px ${glowColor}) drop-shadow(0 0 ${15 * textGlowIntensity}px ${glowColor})` : 
              "none"
          }}>
            <IconComp style={{ 
              width: '100%', 
              height: '100%', 
              pointerEvents: "none",
              color: "#000",
              filter: isPowerOn ? "url(#coloredInvert)" : "brightness(0.7)"
            }} />
          </div>
        </>
      </div>
    );
  }

  return null;
}