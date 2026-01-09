'use client';

import UtilitiesReference from '../UtilitiesReference';

/**
 * ReferencesModal - Shows Effects/Utilities content
 * Displays the full scrollable utilities reference guide
 */
export default function ReferencesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold">Effects / Utilities Reference</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <UtilitiesReference />
        </div>
      </div>
    </div>
  );
}
