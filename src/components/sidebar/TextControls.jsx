import React from 'react';

export default function TextControls({
  selectedText,
  toggleBold,
  toggleItalic,
  setTextAlignment,
  fontOptions,
  updateFontFamily,
  fontFamily,
  fontSize,
  fontSizeInput,
  handleFontSizeInputChange,
  handleFontSizeInputBlur,
  handleFontSizeInputKeyPress,
  decrementFontSize,
  incrementFontSize,
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-blue-400">Text Settings</h3>
      
      {/* Font Size Controls - Centered and First */}
      <div>
        <label className="text-sm text-gray-400 mb-2 block text-center">Font Size</label>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={decrementFontSize}
            disabled={fontSize <= 8}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <input
            type="text"
            value={fontSizeInput}
            onChange={handleFontSizeInputChange}
            onBlur={handleFontSizeInputBlur}
            onKeyPress={handleFontSizeInputKeyPress}
            className="w-16 p-1 text-center bg-gray-800 border border-gray-700 rounded text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
          />
          <button
            onClick={incrementFontSize}
            disabled={fontSize >= 200}
            className="w-8 h-8 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
        <div className="text-xs text-gray-400 text-center mt-2">{fontSize}px</div>
      </div>

      {/* Bold/Italic Controls */}
      <div className="flex gap-2">
        <button
          onClick={toggleBold}
          className={`flex-1 px-2 py-1 rounded ${
            selectedText.fontWeight === "bold" ? "bg-cyan-600" : "bg-gray-700 hover:bg-gray-600"
          } transition`}
          title="Bold"
        >
          <span className={`font-bold ${selectedText.fontWeight === "bold" ? "text-white" : "text-gray-300"}`}>
            B
          </span>
        </button>
        
        <button
          onClick={toggleItalic}
          className={`flex-1 px-2 py-1 rounded ${
            selectedText.fontStyle === "italic" ? "bg-cyan-600" : "bg-gray-700 hover:bg-gray-600"
          } transition`}
          title="Italic"
        >
          <span className={`italic ${selectedText.fontStyle === "italic" ? "text-white" : "text-gray-300"}`}>
            I
          </span>
        </button>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Text Alignment</label>
        <div className="flex gap-1">
          {["left", "center", "right"].map((alignment) => (
            <button
              key={alignment}
              onClick={() => setTextAlignment(alignment)}
              className={`flex-1 px-2 py-1 rounded ${
                selectedText.textAlign === alignment ? "bg-cyan-600" : "bg-gray-700 hover:bg-gray-600"
              } transition`}
              title={`Align ${alignment}`}
            >
              <span className="text-white text-sm">
                {alignment === "left" ? "◀" : alignment === "center" ? "●" : "▶"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <label className="text-sm text-gray-400 mb-1 block">Font Family</label>
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          {["Gaming", "Retro", "Tech", "Decorative", "System"].map(category => (
            <div key={category} className="mb-4">
              <h3 className="text-white text-sm font-semibold mb-2">{category}</h3>
              <div className="space-y-2">
                {fontOptions
                  .filter(font => font.category === category)
                  .map(font => (
                    <div
                      key={font.name}
                      onClick={() => updateFontFamily(font.name)}
                      className={`p-2 rounded cursor-pointer transition ${
                        fontFamily === font.name
                          ? "bg-cyan-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      <div
                        className={`${font.style} text-sm`}
                        style={{
                          fontFamily: font.style ? undefined : font.name,
                          fontSize: font.category === "Retro" ? "14px" : "16px"
                        }}
                      >
                        {font.name}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
