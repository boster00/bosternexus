'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/libs/api';
import { toast } from 'react-hot-toast';

export default function LoadPageModal({ isOpen, onClose, onSelect, userId }) {
  const [webpages, setWebpages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      loadWebpages();
    }
  }, [isOpen, userId]);

  const loadWebpages = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/webpages/list');
      if (response.success) {
        setWebpages(response.webpages || []);
      } else {
        toast.error(response.error || 'Failed to load webpages');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (webpageId, e) => {
    e.stopPropagation(); // Prevent triggering the onSelect
    
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    setDeletingId(webpageId);
    try {
      const response = await apiClient.post('/webpages/delete', {
        webpageId,
      });

      if (response.success) {
        toast.success('Page deleted successfully');
        // Reload the list
        loadWebpages();
      } else {
        toast.error(response.error || 'Failed to delete page');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredWebpages = webpages.filter(wp =>
    wp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wp.url_key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Load Page</h2>
            <button
              onClick={onClose}
              className="btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by name or URL key..."
            className="input input-bordered w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : filteredWebpages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No pages found matching your search' : 'No pages saved yet'}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWebpages.map((webpage) => (
                <div
                  key={webpage.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div 
                      onClick={() => onSelect(webpage)}
                      className="cursor-pointer flex-1"
                    >
                      <div className="font-semibold">{webpage.name}</div>
                      <div className="text-sm text-gray-500">/{webpage.url_key}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Updated: {new Date(webpage.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(webpage.id, e)}
                      disabled={deletingId === webpage.id}
                      className="btn btn-sm btn-error flex-shrink-0"
                    >
                      {deletingId === webpage.id ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          Deleting...
                        </>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
