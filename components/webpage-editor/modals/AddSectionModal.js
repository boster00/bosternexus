'use client';

import { useState } from 'react';
import { getSectionLibrary } from '@/libs/webpage-editor/htmlTemplates';

export default function AddSectionModal({ isOpen, onClose, onSelect }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const sections = getSectionLibrary();

  const handleSelect = (section) => {
    setSelectedTemplate(section);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate.template);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Add New Section</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => handleSelect(section)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate?.id === section.id
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold mb-2">{section.name}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedTemplate}
            className="btn btn-primary"
          >
            Add Section
          </button>
        </div>
      </div>
    </div>
  );
}
