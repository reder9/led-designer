import React from 'react';
import { iconComponentMap } from '../../utils/iconMap.jsx';

export default function IconControls({
  selectedIcon,
  selectedElement,
  setElements,
  setSelectedElement,
  updateIconContent,
  elements,
}) {
  const categories = {
    Streaming: {
      emoji: '🎥',
      filter: (name) => name.includes('twitch') || name.includes('youtube') || name.includes('stream'),
    },
    Gaming: {
      emoji: '🎮',
      filter: (name) => name.includes('game') || name.includes('controller') || name.includes('play'),
    },
    Social: {
      emoji: '💬',
      filter: (name) => name.includes('social') || name.includes('chat') || name.includes('message'),
    },
    Other: {
      emoji: '✨',
      filter: (name) => 
        !name.includes('twitch') && 
        !name.includes('game') && 
        !name.includes('social'),
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-blue-400">Icon Controls</h3>
        <button
          onClick={() => {
            setElements(elements.filter(el => el.id !== selectedElement));
            setSelectedElement(null);
          }}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
          title="Delete Icon"
        >
          Delete
        </button>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-blue-400 mb-3">Available Icons</h4>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          <div className="space-y-4">
            {Object.entries(categories).map(([categoryName, { emoji, filter }]) => (
              <div key={categoryName} className="icon-category">
                <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                  <span>{emoji}</span>
                  <span>{categoryName}</span>
                </h5>
                <div className="icon-grid">
                  {Object.entries(iconComponentMap)
                    .filter(([name]) => filter(name))
                    .map(([iconName, Icon]) => (
                      <button
                        key={iconName}
                        onClick={() => updateIconContent(iconName)}
                        className={`icon-item ${
                          selectedIcon?.content === iconName ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        title={iconName.replace(/-/g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase())}
                      >
                        <div className="icon-preview">
                          <Icon />
                        </div>
                        <div className="icon-label">
                          {iconName.split('-').pop()}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
