import React from 'react';

export default function ExportModal({ isVisible, progress = 0 }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-600 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gray-800 rounded-full flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-cyan-400 animate-spin" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Exporting Your Design
          </h3>
          <p className="text-gray-400 text-sm">
            Preparing your LED panel for export...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
              <div className="absolute right-0 top-0 w-4 h-full bg-white/30 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="text-center">
          <div className="space-y-2 text-sm text-gray-300">
            {progress < 25 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <span>Analyzing design elements...</span>
              </div>
            )}
            {progress >= 25 && progress < 50 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <span>Optimizing text rendering...</span>
              </div>
            )}
            {progress >= 50 && progress < 75 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span>Capturing high-quality image...</span>
              </div>
            )}
            {progress >= 75 && (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                <span>Finalizing export...</span>
              </div>
            )}
          </div>
        </div>

        {/* Subtle animation background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/10 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}
