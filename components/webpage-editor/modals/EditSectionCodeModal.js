'use client';

import { useState, useEffect } from 'react';
import { validateSectionHTML } from '@/libs/webpage-editor/domUtils';

export default function EditSectionCodeModal({ isOpen, onClose, section, onSave }) {
  const [html, setHtml] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTemplate, setAiTemplate] = useState('none');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && section) {
      setHtml(section.html || '');
      setAiPrompt('');
      setAiTemplate('none');
      setError(null);
    }
  }, [isOpen, section]);

  const handleSave = () => {
    // Validate HTML
    const validation = validateSectionHTML(html);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSave(html);
    onClose();
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter an AI prompt');
      return;
    }

    // TODO: Implement AI content generation
    // For MVP, show placeholder
    setError('AI content generation coming soon. For now, edit the HTML directly.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit Section as Code</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left: HTML Editor */}
          <div className="flex-1 p-6 border-r border-gray-200 flex flex-col">
            <label className="label">
              <span className="label-text font-semibold">HTML Code</span>
            </label>
            <textarea
              value={html}
              onChange={(e) => {
                setHtml(e.target.value);
                setError(null);
              }}
              className="textarea textarea-bordered flex-1 font-mono text-sm"
              placeholder="Enter HTML code for the section..."
            />
            {error && (
              <div className="mt-2 text-sm text-red-600">{error}</div>
            )}
          </div>

          {/* Right: AI Assistant */}
          <div className="w-80 p-6 flex flex-col">
            <label className="label">
              <span className="label-text font-semibold">AI Assistant</span>
            </label>
            <select
              className="select select-bordered mb-4"
              value={aiTemplate}
              onChange={(e) => setAiTemplate(e.target.value)}
            >
              <option value="none">None</option>
              <option value="replace-contents">Replace Contents</option>
            </select>

            {aiTemplate === 'replace-contents' && (
              <>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="textarea textarea-bordered flex-1 mb-4"
                  placeholder="Describe what you want the content to say..."
                />
                <button
                  onClick={handleAIGenerate}
                  className="btn btn-primary w-full"
                >
                  Generate Content
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={handleSave} className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
