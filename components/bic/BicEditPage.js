'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/libs/api';
import { toast } from 'react-hot-toast';

export default function BicEditPage({ article }) {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState(article.html_content || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiClient.put(`/bic/articles/update/${article.id}`, {
        html_content: htmlContent,
      });

      if (response.success) {
        toast.success('Article updated');
        router.push(`/bic/${article.url}`);
        router.refresh();
      } else {
        toast.error('Failed to update article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(error.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit: {article.name}</h1>
          <p className="text-sm opacity-70">/{article.url}</p>
        </div>
        <Link href={`/bic/${article.url}`} className="btn btn-ghost">
          Cancel
        </Link>
      </div>

      <div className="card card-border bg-base-100 p-6">
        <label className="label">
          <span className="label-text font-semibold">HTML Content</span>
        </label>
        <textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          className="textarea textarea-bordered w-full font-mono text-sm"
          rows={30}
          placeholder="Enter HTML content here..."
        />
        <div className="label">
          <span className="label-text-alt">
            Raw HTML editor. Content will be rendered as-is on the article page.
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link href={`/bic/${article.url}`} className="btn btn-ghost">
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            'Update Article'
          )}
        </button>
      </div>
    </div>
  );
}

