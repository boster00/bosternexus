'use client';

import { useState, useEffect } from 'react';

export default function SavePageModal({ isOpen, onClose, onSave, serverError }) {
  const [name, setName] = useState('');
  const [urlKey, setUrlKey] = useState('');
  const [errors, setErrors] = useState({});

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setName('');
      setUrlKey('');
    }
  }, [isOpen]);

  // Display server-side errors
  useEffect(() => {
    if (serverError) {
      // Check if error is about URL key
      if (serverError.includes('already taken') || serverError.includes('URL key')) {
        setErrors({ urlKey: serverError });
      } else {
        setErrors({ general: serverError });
      }
    }
  }, [serverError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate url_key
    if (!urlKey.trim()) {
      newErrors.urlKey = 'URL key is required';
    } else if (!/^[a-z0-9-]+$/.test(urlKey)) {
      newErrors.urlKey = 'URL key can only contain lowercase letters, numbers, and hyphens';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call onSave with the values
    onSave(name.trim(), urlKey.trim());
    
    // Reset form
    setName('');
    setUrlKey('');
    setErrors({});
  };

  const handleClose = () => {
    setName('');
    setUrlKey('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Save New Page</h2>
        
        {errors.general && (
          <div className="alert alert-error mb-4">
            <span>{errors.general}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Page Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
              placeholder="Enter page name"
              autoFocus
            />
            {errors.name && (
              <p className="text-error text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              URL Key
            </label>
            <input
              type="text"
              value={urlKey}
              onChange={(e) => setUrlKey(e.target.value.toLowerCase())}
              className={`input input-bordered w-full ${errors.urlKey ? 'input-error' : ''}`}
              placeholder="e.g., my-page"
            />
            {errors.urlKey && (
              <p className="text-error text-xs mt-1">{errors.urlKey}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>

          <div className="flex justify-end space-x-2">
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
