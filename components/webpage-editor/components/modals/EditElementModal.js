'use client';

import { useState, useEffect } from 'react';
import { getElementAttributes, setElementAttributes } from '../../utils/editorCommands';

export default function EditElementModal({ isOpen, onClose, element, onUpdate }) {
  const [html, setHtml] = useState('');
  const [attributes, setAttributes] = useState({});

  useEffect(() => {
    if (element && isOpen) {
      setHtml(element.innerHTML || '');
      setAttributes(getElementAttributes(element));
    }
  }, [element, isOpen]);

  const handleAttributeChange = (name, value) => {
    const newAttributes = { ...attributes, [name]: value };
    setAttributes(newAttributes);
    if (element) {
      setElementAttributes(element, { [name]: value });
      if (onUpdate) {
        onUpdate(html, newAttributes);
      }
    }
  };

  const handleRemoveAttribute = (name) => {
    const newAttributes = { ...attributes };
    delete newAttributes[name];
    setAttributes(newAttributes);
    if (element) {
      element.removeAttribute(name);
      if (onUpdate) {
        onUpdate(html, newAttributes);
      }
    }
  };

  const handleHTMLChange = (newHTML) => {
    setHtml(newHTML);
    if (element) {
      element.innerHTML = newHTML;
      if (onUpdate) {
        onUpdate(newHTML, attributes);
      }
    }
  };

  const handleAddAttribute = () => {
    const name = prompt('Attribute name:');
    if (name) {
      const value = prompt('Attribute value:') || '';
      handleAttributeChange(name, value);
    }
  };

  if (!isOpen || !element) return null;

  const elementInfo = element.tagName.toLowerCase();
  const elementId = element.id || '(no id)';
  const elementClass = element.className || '(no class)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Edit Element</h2>
            <p className="text-sm text-gray-600 mt-1">
              Node: {elementInfo} | ID: {elementId} | Class: {elementClass}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - HTML Textarea */}
          <div className="w-1/2 border-r border-gray-200 p-6 flex flex-col">
            <h3 className="font-semibold mb-2">HTML</h3>
            <textarea
              value={html}
              onChange={(e) => handleHTMLChange(e.target.value)}
              className="textarea textarea-bordered flex-1 font-mono text-sm"
              placeholder="HTML content..."
            />
          </div>

          {/* Right Panel - Attributes Table */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Attributes</h3>
              <button
                onClick={handleAddAttribute}
                className="btn btn-sm btn-primary"
              >
                + Add Attribute
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Value</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(attributes).map((name) => (
                    <tr key={name}>
                      <td className="font-mono text-sm">{name}</td>
                      <td>
                        <input
                          type="text"
                          value={attributes[name]}
                          onChange={(e) => handleAttributeChange(name, e.target.value)}
                          className="input input-bordered input-sm w-full"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemoveAttribute(name)}
                          className="btn btn-sm btn-error"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {Object.keys(attributes).length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-gray-500">
                        No attributes. Click "Add Attribute" to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
