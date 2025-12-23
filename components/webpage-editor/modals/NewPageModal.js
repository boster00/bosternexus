'use client';

import { useState, useEffect } from 'react';

export default function NewPageModal({ isOpen, onClose, onCreate }) {
  const [htmlContent, setHtmlContent] = useState('');

  // Clear content when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setHtmlContent('');
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trim the HTML content
    const trimmedContent = htmlContent.trim();
    
    // Call onCreate with the content (empty string means use default)
    onCreate(trimmedContent || null);
    
    // Reset form
    setHtmlContent('');
    onClose();
  };

  const handleClose = () => {
    setHtmlContent('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-xl font-bold mb-4">Create New Page</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="mb-4 flex-1 min-h-0 flex flex-col">
            <label className="block text-sm font-medium mb-2">
              Paste HTML Content (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Paste existing HTML content here, or leave blank to create a new page with placeholder content.
            </p>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="textarea textarea-bordered w-full flex-1 font-mono text-sm"
              placeholder="Paste HTML content here, or leave blank for default placeholder..."
              style={{ minHeight: '200px', resize: 'vertical' }}
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Create Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
