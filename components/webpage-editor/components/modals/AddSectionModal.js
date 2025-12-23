'use client';

import { useState } from 'react';

export default function AddSectionModal({ isOpen, onClose, onSelect, sections, categories, sectionsByCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');

  if (!isOpen) return null;

  const categorySections = sectionsByCategory[selectedCategory] || [];

  const scrollToSection = (sectionName) => {
    const element = document.getElementById(`section-${sectionName}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Category Tabs */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <h3 className="font-semibold mb-3">Sections</h3>
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category}>
                    <a
                      href={`#category-${category}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(category);
                        scrollToSection(category);
                      }}
                      className={`block p-2 rounded hover:bg-gray-200 cursor-pointer ${
                        selectedCategory === category ? 'bg-gray-200 font-semibold' : ''
                      }`}
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel - Section Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {categories.map((category) => (
              <div key={category} id={`category-${category}`} className="mb-8">
                <h2 className="text-xl font-bold mb-4">{category}</h2>
                <div className="space-y-6">
                  {sectionsByCategory[category]?.map((section, index) => (
                    <div
                      key={`${category}-${index}`}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
