'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

export function SettingsForm() {
  const [aboutContent, setAboutContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setAboutContent(data.about_content ?? '');
      })
      .catch(() => {
        setMessage({ type: 'error', text: 'Failed to load settings.' });
      })
      .finally(() => setLoading(false));
  }, []);

  async function saveAbout() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'about_content', value: aboutContent }),
      });

      if (!res.ok) throw new Error('Failed to save');

      setMessage({ type: 'success', text: 'About page updated!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Try again.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-2">About Page</h2>
        <p className="text-sm text-brand-500 mb-4">
          Write your about page content using Markdown. This replaces the placeholder text on the public About page.
        </p>

        {loading ? (
          <p className="text-sm text-brand-400">Loading...</p>
        ) : (
          <>
            {message && (
              <div
                className={`p-3 mb-4 rounded-md border text-sm ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            <Textarea
              label="About Content (Markdown)"
              name="aboutContent"
              rows={16}
              value={aboutContent}
              onChange={(e) => setAboutContent(e.target.value)}
              placeholder="Write your about page content here... Use **bold**, *italic*, ## headings, etc."
            />

            <div className="mt-4 flex items-center gap-3">
              <Button onClick={saveAbout} loading={saving}>
                Save About Page
              </Button>
              <span className="text-xs text-brand-400">Supports Markdown formatting</span>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-lg border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-2">Change Password</h2>
        <p className="text-sm text-brand-500">
          Password changes are managed through the server CLI. Contact your administrator to update your password.
        </p>
      </div>
    </div>
  );
}
