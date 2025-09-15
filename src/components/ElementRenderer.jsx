import { iconComponentMap } from '../utils/iconMap.jsx';
import { useEffect, useRef } from 'react';

function ElementRenderer({
  el,
  glowColor,
  isPowerOn,
  selected,
  textareaRefs,
  setElements,
  _saveToHistory,
  _deleteSelected,
  brightness,
  glowMode,
  currentTime,
  isEditing,
  setIsEditing,
  textGlowIntensity = 1.0,
  _borderRadius = 20,
  _backgroundColor = 'transparent',
}) {
  const safeBrightness = typeof brightness === 'number' && !isNaN(brightness) ? brightness : 100;
  const elementOpacity = isPowerOn ? Math.max(0.1, Math.min(1, safeBrightness / 100)) : 0.3;
  const glowIntensity = Math.max(0, Math.min(1, safeBrightness / 100)) * 0.8;

  // Apply reduction to glow intensity for text
  const effectiveTextGlowIntensity = textGlowIntensity || glowIntensity * 0.5;

  // Calculate dynamic effects for text
  const getTextGlowEffect = () => {
    if (!isPowerOn) return 'none';

    switch (glowMode) {
      case 'rainbow': {
        return `0 0 ${1.5 * effectiveTextGlowIntensity}px currentColor, 0 0 ${3 * effectiveTextGlowIntensity}px currentColor`;
      }

      case 'breathing': {
        const breath = (Math.sin(currentTime * Math.PI) + 1) / 2;
        return `0 0 ${1.5 * effectiveTextGlowIntensity * breath}px ${glowColor}, 0 0 ${3 * effectiveTextGlowIntensity * breath}px ${glowColor}`;
      }

      case 'chase':
        return `0 0 ${1.5 * effectiveTextGlowIntensity}px ${glowColor}, 0 0 ${3 * effectiveTextGlowIntensity}px ${glowColor}`;

      default:
        return `0 0 ${1.2 * effectiveTextGlowIntensity}px ${glowColor}, 0 0 ${2.25 * effectiveTextGlowIntensity}px ${glowColor}`;
    }
  };

  const getIconGlowEffect = () => {
    if (!isPowerOn) return 'none';

    switch (glowMode) {
      case 'rainbow': {
        return `drop-shadow(0 0 ${1.5 * effectiveTextGlowIntensity}px currentColor) drop-shadow(0 0 ${3 * effectiveTextGlowIntensity}px currentColor)`;
      }

      case 'breathing': {
        const breath = (Math.sin(currentTime * Math.PI) + 1) / 2;
        return `drop-shadow(0 0 ${1.5 * effectiveTextGlowIntensity * breath}px ${glowColor}) drop-shadow(0 0 ${3 * effectiveTextGlowIntensity * breath}px ${glowColor})`;
      }

      case 'chase':
        return `drop-shadow(0 0 ${1.5 * effectiveTextGlowIntensity}px ${glowColor}) drop-shadow(0 0 ${3 * effectiveTextGlowIntensity}px ${glowColor})`;

      default:
        return `drop-shadow(0 0 ${1.2 * effectiveTextGlowIntensity}px ${glowColor}) drop-shadow(0 0 ${2.25 * effectiveTextGlowIntensity}px ${glowColor})`;
    }
  };

  // Use a ref to track if we need to select text on focus
  const selectOnFocusRef = useRef(false);

  // Event handlers for text editing
  const onTextBlur = _e => {
    if (setIsEditing) {
      setIsEditing(false);
    }
  };

  const onTextKeyDown = _e => {
    if (_e.key === 'Enter' && _e.shiftKey) {
      // Shift+Enter exits editing mode
      _e.preventDefault();
      _e.target.blur();
    }
    // Regular Enter key now creates new lines (default textarea behavior)
    if (_e.key === 'Escape') {
      _e.preventDefault();
      _e.target.blur();
    }
  };

  // Effect to select text when entering edit mode
  useEffect(() => {
    if (isEditing && el.type === 'text') {
      const textarea = textareaRefs.current[el.id];
      if (textarea) {
        // Small delay to ensure the textarea is focused and ready
        setTimeout(() => {
          textarea.select();
        }, 10);
      }
    }
  }, [isEditing, el.id, el.type, textareaRefs]);

  if (el.type === 'text') {
    // Get text alignment class
    const getTextAlignmentClass = () => {
      switch (el.textAlign || 'center') {
        case 'left':
          return 'text-left';
        case 'right':
          return 'text-right';
        case 'center':
        default:
          return 'text-center';
      }
    };

    // Get font class from font name
    const getFontClass = fontFamily => {
      const fontMap = {
        Orbitron: 'font-orbitron',
        'Russo One': 'font-russo-one',
        Play: 'font-play',
        Rajdhani: 'font-rajdhani',
        'Chakra Petch': 'font-chakra',
        Audiowide: 'font-audiowide',
        Teko: 'font-teko',
        Aldrich: 'font-aldrich',
        Quantico: 'font-quantico',
        Oxanium: 'font-oxanium',
        'Press Start 2P': 'font-press-start',
        VT323: 'font-vt323',
        'Share Tech Mono': 'font-share-tech',
        Iceland: 'font-iceland',
        Syncopate: 'font-syncopate',
        Wallpoet: 'font-wallpoet',
        'Nova Square': 'font-nova-square',
        Michroma: 'font-michroma',
        'Stalinist One': 'font-stalinist',
        'Rubik Mono One': 'font-rubik-mono',
        'Faster One': 'font-faster-one',
        Monoton: 'font-monoton',
      };
      return fontMap[fontFamily] || '';
    };

    const fontClass = getFontClass(el.fontFamily);

    return (
      <textarea
        ref={ref => (textareaRefs.current[el.id] = ref)}
        defaultValue={el.content}
        data-text-element='true'
        data-element-type='text'
        className={`w-full h-full resize-none bg-transparent outline-none ${getTextAlignmentClass()} ${fontClass}`}
        style={{
          fontFamily: fontClass ? undefined : el.fontFamily, // Only use inline fontFamily if no class available
          fontSize: el.fontSize,
          fontWeight: el.fontWeight || 'normal',
          fontStyle: el.fontStyle || 'normal',
          color: isPowerOn ? glowColor : '#555',
          opacity: elementOpacity,
          textShadow: getTextGlowEffect(),
          border: selected ? '1px dashed cyan' : 'none',
          transition: 'all 0.3s ease',
          animation: glowMode === 'rainbow' ? 'rainbowText 3s linear infinite' : 'none',
          cursor: isEditing ? 'text' : 'pointer',
          pointerEvents: 'auto', // Always allow clicks so we can handle them properly
          whiteSpace: 'pre-wrap', // Preserve line breaks and wrap text
          overflow: 'hidden', // Hide scrollbars
          wordWrap: 'break-word', // Break long words if needed
        }}
        onBlur={onTextBlur}
        onKeyDown={onTextKeyDown}
        onChange={e => {
          // Update element content when text changes
          if (setElements) {
            setElements(prev =>
              prev.map(elem => (elem.id === el.id ? { ...elem, content: e.target.value } : elem))
            );
          }
        }}
        readOnly={!isEditing}
        onClick={e => {
          // If we're editing, allow normal textarea interaction
          if (isEditing) {
            // Don't propagate when actively editing to prevent interference
            e.stopPropagation();
            return;
          }

          // If not editing, we need to allow the parent to handle selection first
          // Don't stop propagation so parent can select the element
          // The parent will then call setIsEditing if appropriate
        }}
        onDoubleClick={e => {
          // Double click should always try to enable editing
          e.stopPropagation();
          if (!isEditing && setIsEditing) {
            setIsEditing(true);
            setTimeout(() => {
              e.target.focus();
              e.target.select();
            }, 10);
          }
        }}
        onFocus={e => {
          // Select all text when the textarea receives focus
          if (selectOnFocusRef.current) {
            e.target.select();
            selectOnFocusRef.current = false;
          }
        }}
      />
    );
  }

  // Helper function to safely parse color values
  const parseColorValue = (colorStr, startIndex, length) => {
    if (!colorStr || typeof colorStr !== 'string' || !colorStr.startsWith('#')) {
      return 0; // Default to 0 if color is invalid
    }
    const value = parseInt(colorStr.slice(startIndex, startIndex + length), 16);
    return isNaN(value) ? 0 : value / 255;
  };

  if (el.type === 'icon' && el.iconKey && iconComponentMap[el.iconKey]) {
    const IconComp = iconComponentMap[el.iconKey];
    return (
      <div
        className='w-full h-full flex items-center justify-center relative'
        data-element-type='icon'
        data-icon-key={el.iconKey}
        style={{
          backgroundColor: 'transparent',
          opacity: elementOpacity,
          transition: 'all 0.3s ease',
          cursor: 'move',
          border: selected ? '1px dashed cyan' : 'none',
          animation: glowMode === 'rainbow' ? 'rainbowText 3s linear infinite' : 'none',
          pointerEvents: 'auto',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          borderRadius: '4px',
        }}
      >
        <>
          {/* SVG Filter Definition */}
          <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
              <filter id='coloredInvert'>
                <feColorMatrix
                  type='matrix'
                  values='-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0'
                />
                <feComponentTransfer>
                  <feFuncR type='discrete' tableValues={`0 ${parseColorValue(glowColor, 1, 2)}`} />
                  <feFuncG type='discrete' tableValues={`0 ${parseColorValue(glowColor, 3, 2)}`} />
                  <feFuncB type='discrete' tableValues={`0 ${parseColorValue(glowColor, 5, 2)}`} />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>

          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              filter: isPowerOn ? getIconGlowEffect() : 'none',
            }}
          >
            <IconComp
              style={{
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                color: '#000',
                filter: isPowerOn
                  ? glowMode === 'rainbow'
                    ? 'invert(1)'
                    : 'url(#coloredInvert)'
                  : 'brightness(0.7)',
                animation: glowMode === 'rainbow' ? 'rainbowText 3s linear infinite' : 'none',
              }}
            />
          </div>
        </>
      </div>
    );
  }

  return null;
}

export default ElementRenderer;
