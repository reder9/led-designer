import { iconComponentMap } from '../utils/iconMap.jsx';
import React, { useRef, useEffect, useState } from 'react';
import { isTablet } from 'react-device-detect';
import TextareaAutosize from 'react-textarea-autosize';

function ElementRenderer({
  el,
  glowColor,
  isPowerOn,
  selected,
  textareaRefs,
  setElements,
  setSelectedElement,
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
  isMobile = false,
}) {
  const safeBrightness = typeof brightness === 'number' && !isNaN(brightness) ? brightness : 100;
  const elementOpacity = isPowerOn ? Math.max(0.1, Math.min(1, safeBrightness / 100)) : 0.3;
  const glowIntensity = Math.max(0, Math.min(1, safeBrightness / 100)) * 0.8;

  // Enhanced mobile detection
  const isActuallyMobile = isMobile || isTablet;

  // State for mobile input management
  const [mobileInputFocused, setMobileInputFocused] = useState(false);

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

      case 'fade': {
        const hue = (currentTime * 30) % 360;
        const fadeColor = `hsl(${hue}, 100%, 70%)`;
        return `invert(1) drop-shadow(0 0 ${1.2 * effectiveTextGlowIntensity}px ${fadeColor}) drop-shadow(0 0 ${2.25 * effectiveTextGlowIntensity}px ${fadeColor})`;
      }

      case 'smooth': {
        const hue = (currentTime * 11.25) % 360;
        const smoothColor = `hsl(${hue}, 100%, 70%)`;
        return `invert(1) drop-shadow(0 0 ${1.2 * effectiveTextGlowIntensity}px ${smoothColor}) drop-shadow(0 0 ${2.25 * effectiveTextGlowIntensity}px ${smoothColor})`;
      }

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
      <div
        className={`relative w-full h-full ${isActuallyMobile ? 'touch-target' : ''}`}
        style={{
          transform: `rotate(${el.rotation || 0}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <TextareaAutosize
          ref={ref => (textareaRefs.current[el.id] = ref)}
          defaultValue={el.content}
          data-text-element='true'
          data-element-type='text'
          minRows={1}
          maxRows={isActuallyMobile ? 5 : 10}
          className={`w-full h-full resize-none bg-transparent outline-none ${getTextAlignmentClass()} ${fontClass}`}
          style={{
            fontFamily: fontClass ? undefined : el.fontFamily,
            fontSize: el.fontSize,
            fontWeight: el.fontWeight || 'normal',
            fontStyle: el.fontStyle || 'normal',
            color: isPowerOn ? glowColor : '#666',
            opacity: elementOpacity,
            textShadow: isPowerOn ? getTextGlowEffect() : 'none',
            border: 'none',
            transition: 'all 0.3s ease',
            animation:
              isPowerOn && glowMode === 'rainbow' ? 'rainbowText 3s linear infinite' : 'none',
            cursor: isEditing ? 'text' : isActuallyMobile ? 'pointer' : 'move',
            pointerEvents: 'auto', // Always allow pointer events so mobile editing can work
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            wordWrap: 'break-word',
            // Enhanced mobile properties
            WebkitUserSelect:
              isActuallyMobile && (isEditing || mobileInputFocused) ? 'text' : 'none',
            userSelect: isActuallyMobile && (isEditing || mobileInputFocused) ? 'text' : 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
            // Better mobile input handling
            touchAction: isActuallyMobile ? (isEditing ? 'auto' : 'manipulation') : 'auto',
            // Prevent zoom on double tap for mobile
            ...(isActuallyMobile && {
              fontSize: `max(${el.fontSize}, 16px)`, // Prevent iOS zoom on input
            }),
          }}
          // Enhanced mobile input attributes
          inputMode={isActuallyMobile ? 'text' : undefined}
          autoCapitalize={isActuallyMobile ? 'sentences' : undefined}
          autoComplete='off'
          spellCheck={isActuallyMobile}
          autoCorrect={isActuallyMobile ? 'on' : 'off'}
          onBlur={e => {
            setMobileInputFocused(false);
            if (onTextBlur) onTextBlur(e);
          }}
          onFocus={e => {
            if (isActuallyMobile) {
              setMobileInputFocused(true);
              // Prevent parent scrolling when focused on mobile
              e.target.parentElement.style.overflow = 'visible';
              // Auto scroll to keep input in view
              setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 100);
            }
            if (selectOnFocusRef.current) {
              e.target.select();
              selectOnFocusRef.current = false;
            }
          }}
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

            // Mobile-friendly editing: single tap to edit on mobile devices
            if (isActuallyMobile && selected && setIsEditing) {
              e.stopPropagation();
              setIsEditing(true);
              setTimeout(() => {
                e.target.focus();
                e.target.select();
              }, 100); // Slightly longer timeout for mobile
              return;
            }

            // Desktop behavior: need parent to handle selection first
            // Don't stop propagation so parent can select the element
          }}
          onTouchEnd={e => {
            // Mobile touch handling for better responsiveness
            if (isActuallyMobile && !isEditing && selected && setIsEditing) {
              e.preventDefault();
              e.stopPropagation();
              setIsEditing(true);
              setTimeout(() => {
                const target = e.target;
                target.focus();
                target.setSelectionRange(target.value.length, target.value.length); // Place cursor at end
              }, 150); // Longer timeout for touch devices
            }
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
        />

        {/* Delete Button - Only show when selected */}
        {selected && (
          <button
            className='absolute -top-8 -right-8 w-7 h-7 bg-white hover:bg-gray-100 text-red-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md border border-gray-200 z-10'
            onClick={e => {
              e.stopPropagation();
              if (setElements) {
                setElements(prev => prev.filter(elem => elem.id !== el.id));
                // Clear selection since we're deleting the selected element
                if (setSelectedElement) {
                  setSelectedElement(null);
                }
              }
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </button>
        )}
      </div>
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
          border: 'none',
          animation: glowMode === 'rainbow' ? 'rainbowText 3s linear infinite' : 'none',
          pointerEvents: 'auto',
          transform: `rotate(${el.rotation || 0}deg) translate3d(0, 0, 0)`,
          transformOrigin: 'center center',
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
                color: isPowerOn ? '#000' : '#666', // Lighter grey when power is off for visibility
                filter: isPowerOn
                  ? glowMode === 'rainbow'
                    ? 'invert(1)'
                    : 'url(#coloredInvert)'
                  : 'invert(1)', // Invert when off to make grey icons visible on black background
                animation:
                  isPowerOn && glowMode === 'rainbow' ? 'rainbowText 3s linear infinite' : 'none', // No animation when power is off
              }}
            />
          </div>
        </>

        {/* Delete Button - Only show when selected */}
        {selected && (
          <button
            className='absolute -top-8 -right-8 w-7 h-7 bg-white hover:bg-gray-100 text-red-500 hover:text-red-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md border border-gray-200 z-10'
            onClick={e => {
              e.stopPropagation();
              if (setElements) {
                setElements(prev => prev.filter(elem => elem.id !== el.id));
                // Clear selection since we're deleting the selected element
                if (setSelectedElement) {
                  setSelectedElement(null);
                }
              }
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return null;
}

export default ElementRenderer;
