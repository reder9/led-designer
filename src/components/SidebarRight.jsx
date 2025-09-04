import React, { useEffect } from "react";

export default function SidebarRight({
  glowMode,
  setGlowMode,
  glowColor,
  setGlowColor,
  isPowerOn,
  setIsPowerOn,
  brightness,
  setBrightness,
  speed,
  setSpeed,
}) {
  const colorPresets = [
    { name: "Cyan", value: "#00faff" },
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#00ff00" },
    { name: "Blue", value: "#0000ff" },
    { name: "Purple", value: "#ff00ff" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Orange", value: "#ff7700" },
    { name: "Pink", value: "#ff1493" },
    { name: "White", value: "#ffffff" },
  ];

  const effects = [
    { id: "rainbow", label: "🌈 Rainbow" },
    { id: "breathing", label: "💨 Breathing" },
    { id: "chase", label: "⚡ Chase" },
    { id: "fade", label: "🌅 Fade" },
    { id: "strobe", label: "💡 Strobe" },
    { id: "flash", label: "✨ Flash" },
    { id: "jump", label: "🚀 Jump" },
    { id: "smooth", label: "🌊 Smooth" },
  ];

  // Set default to rainbow effect on initial load
  useEffect(() => {
    if (!glowMode) {
      setGlowMode("rainbow");
      setSpeed(3); // Set to normal speed (level 3)
    }
  }, [glowMode, setGlowMode, setSpeed]);

  const togglePower = () => setIsPowerOn(!isPowerOn);

  const handleColorPreset = (color) => {
    setGlowColor(color);
    setGlowMode("solid");
    setSpeed(3); // Reset to normal speed when switching to solid color
  };

  // Handle speed changes with proper validation - now only 5 levels
  const handleSpeedChange = (newSpeed) => {
    // Ensure speed is within valid range (1-5)
    const clampedSpeed = Math.max(1, Math.min(5, newSpeed));
    setSpeed(clampedSpeed);
  };

  // Handle brightness changes with realistic LED range (20-100%)
  const handleBrightnessChange = (newBrightness) => {
    // Ensure brightness is within realistic LED range (20-100%)
    const clampedBrightness = Math.max(20, Math.min(100, newBrightness));
    setBrightness(clampedBrightness);
  };

  const decreaseSpeed = () => {
    handleSpeedChange(speed - 1);
  };

  const increaseSpeed = () => {
    handleSpeedChange(speed + 1);
  };

  // Brightness control with reasonable steps
  const decreaseBrightness = () => {
    handleBrightnessChange(brightness - 10); // 10% steps
  };

  const increaseBrightness = () => {
    handleBrightnessChange(brightness + 10); // 10% steps
  };

  // Handle effect change - set to normal speed when changing effects
  const handleEffectChange = (effectId) => {
    setGlowMode(effectId);
    setSpeed(3); // Reset to normal speed (level 3)
  };

  // Only show speed control for effects that use it
  const shouldShowSpeedControl = [
    "rainbow", "breathing", "chase", "fade", 
    "strobe", "flash", "jump", "smooth"
  ].includes(glowMode);

  // Speed level descriptions
  const getSpeedLabel = (speedLevel) => {
    switch(speedLevel) {
      case 1: return "Slow";
      case 2: return "Medium";
      case 3: return "Normal";
      case 4: return "Fast";
      case 5: return "Very Fast";
      default: return "";
    }
  };

  return (
    <aside className="w-80 bg-gray-800 p-6 flex flex-col">
      {/* Disclaimer at the top */}
      <div className="mb-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-600/50">
        <div className="text-xs text-yellow-300 text-center">
          <div className="font-bold mb-1">⚠️ Note:</div>
          <div>This remote shows possible LED effects. Your actual remote may have different functions or require app customization for similar effects.</div>
        </div>
      </div>

      {/* Remote Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">LED IR Remote</h2>
        <div className="w-16 h-4 bg-red-600 mx-auto rounded-full mb-1"></div>
        <div className="text-xs text-gray-400">IR Transmitter</div>
      </div>

      <div className="bg-black rounded-2xl p-6 shadow-2xl border-2 border-gray-700 flex-1">
        {/* Power */}
        <div className="text-center mb-6">
          <button
            onClick={togglePower}
            className={`w-16 h-16 rounded-full text-white font-bold text-sm shadow-lg transition ${
              isPowerOn
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            POWER
          </button>
        </div>

        {/* Always visible color presets */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Solid Colors</label>
          <div className="grid grid-cols-3 gap-3">
            {colorPresets.map((color, index) => (
              <button
                key={index}
                onClick={() => handleColorPreset(color.value)}
                className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
                disabled={!isPowerOn}
              />
            ))}
          </div>
        </div>

        {/* Special Effects */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Special Effects</label>
          <div className="grid grid-cols-2 gap-3">
            {effects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => handleEffectChange(effect.id)}
                disabled={!isPowerOn}
                className={`px-3 py-2 rounded-lg font-bold text-sm text-white shadow-md transition ${
                  glowMode === effect.id
                    ? "bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {effect.label}
              </button>
            ))}
          </div>
        </div>

        {/* Brightness */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Brightness</label>
          <div className="flex items-center gap-2">
            <button
              onClick={decreaseBrightness}
              disabled={!isPowerOn || brightness <= 20}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              –
            </button>
            <input
              type="range"
              min="20"
              max="100"
              value={brightness}
              onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
              className="flex-1"
              disabled={!isPowerOn}
            />
            <button
              onClick={increaseBrightness}
              disabled={!isPowerOn || brightness >= 100}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center">
            {brightness === 20 && "Dim"}
            {brightness === 50 && "Medium"}
            {brightness === 75 && "Bright"}
            {brightness === 100 && "Max"}
          </div>
        </div>

        {/* Speed (for effects) - Only show for applicable effects */}
        {shouldShowSpeedControl && (
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">Effect Speed</label>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseSpeed}
                disabled={!isPowerOn || speed <= 1}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                –
              </button>
              <div className="flex-1 text-center">
                <span className="text-white text-sm">{getSpeedLabel(speed)}</span>
                <div className="text-xs text-gray-400 mt-1">
                  Level {speed}/5
                </div>
              </div>
              <button
                onClick={increaseSpeed}
                disabled={!isPowerOn || speed >= 5}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <div className="mt-2">
              <input
                type="range"
                min="1"
                max="5"
                value={speed}
                onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                className="w-full"
                disabled={!isPowerOn}
              />
            </div>
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Mode:</span>
          <span className="text-white text-sm capitalize">{glowMode || "rainbow"}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-gray-400">Brightness:</span>
          <span className="text-white text-sm">{brightness}%</span>
        </div>
        {shouldShowSpeedControl && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-400">Speed:</span>
            <span className="text-white text-sm">{getSpeedLabel(speed)}</span>
          </div>
        )}
        {!isPowerOn && (
          <div className="text-xs text-red-400 mt-1 text-center">⚫ Power Off</div>
        )}
      </div>
    </aside>
  );
}