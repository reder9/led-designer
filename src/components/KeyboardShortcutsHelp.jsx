import React, { useState, useEffect } from 'react';

export default function KeyboardShortcutsHelp() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = e => {
      // Show help when F1 is pressed or Ctrl+? or Cmd+?
      if (e.key === 'F1' || ((e.ctrlKey || e.metaKey) && e.key === '/')) {
        e.preventDefault();
        setIsVisible(true);
      } else if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const shortcuts = [
    {
      category: 'Clipboard',
      items: [
        { keys: ['Ctrl', 'C'], action: 'Copy selected element' },
        { keys: ['Ctrl', 'X'], action: 'Cut selected element' },
        { keys: ['Ctrl', 'V'], action: 'Paste element' },
        { keys: ['Ctrl', 'D'], action: 'Duplicate selected element' },
      ],
    },
    {
      category: 'History',
      items: [
        { keys: ['Ctrl', 'Z'], action: 'Undo last action' },
        { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo action' },
        { keys: ['Ctrl', 'Y'], action: 'Redo action (alternative)' },
      ],
    },
    {
      category: 'Selection',
      items: [
        { keys: ['Delete'], action: 'Delete selected element' },
        { keys: ['Backspace'], action: 'Delete selected element' },
        { keys: ['Escape'], action: 'Deselect element / Stop editing' },
        { keys: ['Enter'], action: 'Start editing text element' },
      ],
    },
    {
      category: 'Movement',
      items: [
        { keys: ['Arrow Keys'], action: 'Move selected element by 1px' },
        { keys: ['Shift', '+ Arrow'], action: 'Move selected element by 10px' },
      ],
    },
    {
      category: 'Layers',
      items: [
        { keys: ['Ctrl', ']'], action: 'Bring element to front' },
        { keys: ['Ctrl', '['], action: 'Send element to back' },
      ],
    },
    { category: 'Context Menu', items: [{ keys: ['Right Click'], action: 'Open context menu' }] },
  ];

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className='fixed bottom-3 right-4 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white p-2.5 rounded-full shadow-lg hover:shadow-cyan-500/25 border border-cyan-400/20 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 z-40 group'
        title='Keyboard Shortcuts (F1)'
      >
        <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-50'></div>
        <svg
          className='w-4 h-4 relative z-10 group-hover:rotate-6 transition-transform duration-300'
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
            clipRule='evenodd'
          />
        </svg>
        <div className='absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse'></div>
      </button>
    );
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm'>
      <div className='bg-gray-800 border border-gray-600 rounded-2xl shadow-2xl max-w-4xl max-h-[80vh] overflow-auto custom-scrollbar'>
        {/* Header */}
        <div className='sticky top-0 bg-gray-800 border-b border-gray-600 p-6 flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-white flex items-center gap-3'>
            <svg className='w-6 h-6 text-cyan-400' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z'
                clipRule='evenodd'
              />
            </svg>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className='text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg'
          >
            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {shortcuts.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className='bg-gray-900 rounded-xl p-4 border border-gray-700'
              >
                <h3 className='text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2'>
                  <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
                  {category.category}
                </h3>
                <div className='space-y-3'>
                  {category.items.map((shortcut, shortcutIndex) => (
                    <div key={shortcutIndex} className='flex justify-between items-center'>
                      <div className='flex gap-1'>
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className='px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs font-mono text-gray-200'>
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className='text-gray-400 mx-1'>+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <span className='text-gray-300 text-sm ml-4'>{shortcut.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div className='mt-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-xl p-4'>
            <h4 className='text-cyan-400 font-semibold mb-2 flex items-center gap-2'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                  clipRule='evenodd'
                />
              </svg>
              Pro Tips
            </h4>
            <div className='text-gray-300 text-sm space-y-1'>
              <p>• Right-click on elements or empty space for context menus</p>
              <p>• Use Shift + Arrow keys for faster movement</p>
              <p>• Press F1 or Ctrl+/ to open this help anytime</p>
              <p>• Context menus show available actions for the current selection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
