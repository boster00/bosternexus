'use client';

import { useState } from 'react';

export default function AddSectionModal({ isOpen, onClose, onSelect, sections, categories, sectionsByCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');

  if (!isOpen) return null;

  const categorySections = sectionsByCategory[selectedCategory] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Add New Section</h2>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs Row - Horizontal at Top */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                  selectedCategory === category
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content - Full Width, Only Selected Category */}
        <div className="flex-1 overflow-y-auto p-6">
          <div key={selectedCategory} id={`category-${selectedCategory}`}>
            <h2 className="text-xl font-bold mb-4">{selectedCategory}</h2>
            <div className="space-y-6">
              {categorySections.map((section, index) => (
                <div
                  key={`${selectedCategory}-${index}`}
                  id={`section-${section.name}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-orange-400 transition-colors"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg mb-2">{section.name}</h3>
                    <button
                      onClick={() => onSelect(Object.keys(sections).find(key => sections[key] === section))}
                      className="btn btn-primary btn-sm"
                    >
                      Use This Section
                    </button>
                  </div>
                  <div
                    className="border-t pt-3 mt-3"
                    dangerouslySetInnerHTML={{ __html: section.html }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
