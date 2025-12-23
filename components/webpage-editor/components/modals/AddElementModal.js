'use client';

import { useState } from 'react';

export default function AddElementModal({ isOpen, onClose, onSelect, onPasteHTML, elements, categories, elementsByCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [pasteHTML, setPasteHTML] = useState('');

  if (!isOpen) return null;

  const handlePaste = () => {
    if (pasteHTML.trim()) {
      onPasteHTML(pasteHTML.trim());
      setPasteHTML('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Element</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Paste HTML Option */}
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <h3 className="font-semibold mb-2">Paste Custom HTML</h3>
            <textarea
              value={pasteHTML}
              onChange={(e) => setPasteHTML(e.target.value)}
              className="textarea textarea-bordered w-full h-24 font-mono text-sm"
              placeholder="Paste your HTML here..."
            />
            <button
              onClick={handlePaste}
              disabled={!pasteHTML.trim()}
              className="btn btn-primary btn-sm mt-2"
            >
              Insert HTML
            </button>
          </div>

          <div className="divider">OR</div>

          {/* Elements by Category */}
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {elementsByCategory[category]?.map((element, index) => (
                    <div
                      key={`${category}-${index}`}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-400 transition-colors"
                    >
                      <div className="mb-2">
                        <h4 className="font-medium">{element.name}</h4>
                      </div>
                      <div
                        className="border-t pt-2 mt-2 text-sm"
                        dangerouslySetInnerHTML={{ __html: element.html }}
                      />
                      <button
                        onClick={() => onSelect(Object.keys(elements).find(key => elements[key] === element))}
                        className="btn btn-primary btn-sm w-full mt-3"
                      >
                        Use This Element
                      </button>
                    </div>
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
