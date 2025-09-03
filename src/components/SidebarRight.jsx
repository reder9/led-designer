import React, { useState, useEffect } from "react";

export default function SidebarRight({
  glowColor,
  setGlowColor,
  isRainbowEffect,
  setIsRainbowEffect,
  isPowerOn,
  setIsPowerOn,
  brightness,
  setBrightness
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

  // Rainbow colors array
  const rainbowColors = [
    "#ff0000", // Red
    "#ff7700", // Orange
    "#ffff00", // Yellow
    "#00ff00", // Green
    "#0000ff", // Blue
    "#ff00ff", // Purple
    "#ff1493", // Pink
  ];

  const [rainbowIndex, setRainbowIndex] = useState(0);
  const [effectSpeed, setEffectSpeed] = useState(50); // Default speed (0-100)

  // Convert speed value (0-100) to interval time (50-2000ms)
  const getSpeedInterval = () => {
    // Invert so higher value = faster (lower interval)
    return 2000 - (effectSpeed * 19.5);
  };

  // Handle rainbow color cycling
  useEffect(() => {
    let intervalId;
    
    if (isRainbowEffect && isPowerOn) {
      intervalId = setInterval(() => {
        setRainbowIndex(prevIndex => (prevIndex + 1) % rainbowColors.length);
        setGlowColor(rainbowColors[rainbowIndex]);
      }, getSpeedInterval());
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRainbowEffect, isPowerOn, rainbowIndex, effectSpeed]);

  const togglePower = () => {
    setIsPowerOn(!isPowerOn);
    if (isPowerOn) {
      setIsRainbowEffect(false);
    }
  };

  const handleColorPreset = (color) => {
    setGlowColor(color);
    setIsRainbowEffect(false);
  };

  const toggleRainbowEffect = () => {
    if (isRainbowEffect) {
      setIsRainbowEffect(false);
    } else {
      setIsRainbowEffect(true);
      // Start with the first rainbow color
      setGlowColor(rainbowColors[0]);
      setRainbowIndex(0);
    }
  };

  // Get the current glow color for display
  const displayColor = isRainbowEffect ? rainbowColors[rainbowIndex] : glowColor;

  // Get speed description based on value
  const getSpeedDescription = () => {
    if (effectSpeed < 20) return "Very Slow";
    if (effectSpeed < 40) return "Slow";
    if (effectSpeed < 60) return "Medium";
    if (effectSpeed < 80) return "Fast";
    return "Very Fast";
  };

  return (
    <aside className="w-80 bg-gray-800 p-6 flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">LED IR Remote</h2>
        <div className="w-16 h-4 bg-red-600 mx-auto rounded-full mb-1"></div>
        <div className="text-xs text-gray-400">IR Transmitter</div>
      </div>

      <div className="bg-black rounded-2xl p-6 shadow-2xl border-2 border-gray-700 flex-1">
        <div className="text-center mb-6">
          <button
            onClick={togglePower}
            className={`w-16 h-16 rounded-full text-white font-bold text-sm shadow-lg transition ${
              isPowerOn ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            POWER
          </button>
        </div>

        {/* Color Presets */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {colorPresets.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorPreset(color.value)}
              className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg hover:scale-110 transition-transform"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>

        {/* Rainbow Button */}
        <div className="text-center mb-6">
          <button
            onClick={toggleRainbowEffect}
            className={`px-4 py-2 rounded-lg font-bold text-white shadow-lg transition-all ${
              isRainbowEffect
                ? "bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500 animate-pulse"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            🌈 RAINBOW
          </button>
        </div>

        {/* Effect Speed Control - Only show when rainbow effect is active */}
        {isRainbowEffect && (
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">
              Rainbow Speed: {getSpeedDescription()}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">🐢</span>
              <input
                type="range"
                min="0"
                max="100"
                value={effectSpeed}
                onChange={(e) => setEffectSpeed(parseInt(e.target.value))}
                className="flex-1"
                disabled={!isPowerOn}
              />
              <span className="text-white text-sm">🐇</span>
            </div>
          </div>
        )}

        {/* Brightness */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Brightness</label>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">-</span>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(parseInt(e.target.value))}
              className="flex-1"
              disabled={!isPowerOn}
            />
            <span className="text-white text-sm">+</span>
          </div>
        </div>
      </div>

      {/* Current Color */}
      <div className="mt-4 p-3 bg-gray-900 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Current:</span>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-gray-600"
              style={{ backgroundColor: displayColor }}
            ></div>
            <span className="text-white text-sm">{displayColor}</span>
          </div>
        </div>
        {isRainbowEffect && (
          <div className="text-xs text-green-400 mt-1 text-center">
            🌈 Rainbow Mode Active
            <div className="h-1 w-full bg-gray-700 mt-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500"
                style={{ 
                  width: `${((rainbowIndex + 1) / rainbowColors.length) * 100}%`,
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
            <div className="text-xs text-blue-300 mt-1">
              Speed: {getSpeedDescription()} ({Math.round(getSpeedInterval())}ms)
            </div>
          </div>
        )}
        {!isPowerOn && <div className="text-xs text-red-400 mt-1 text-center">⚫ Power Off</div>}
      </div>
    </aside>
  );
}