'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

type Settings = Record<string, string>;

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load settings.' }))
      .finally(() => setLoading(false));
  }, []);

  async function saveSettings(section: string, updates: Settings) {
    setSaving(section);
    setMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updates }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server error (${res.status})`);
      }

      setSettings((prev) => ({ ...prev, ...updates }));
      setMessage({ type: 'success', text: `${section} settings saved!` });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save. Try again.';
      setMessage({ type: 'error', text: msg });
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-brand-200 p-6 text-center text-sm text-brand-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Message */}
      {message && (
        <div
          className={`p-3 rounded-md border text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Homepage Content */}
      <div className="bg-white rounded-lg border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-2">Homepage Content</h2>
        <p className="text-sm text-brand-500 mb-4">
          Edit the hero section text that appears on your public homepage.
        </p>

        <div className="space-y-4">
          <Input
            label="Hero Title"
            value={settings.home_hero_title ?? ''}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, home_hero_title: e.target.value }))
            }
            placeholder="Maria's Portfolio"
          />
          <Input
            label="Hero Description"
            value={settings.home_hero_description ?? ''}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, home_hero_description: e.target.value }))
            }
            placeholder="A curated collection of 3D modeling and creative work."
          />
          <Textarea
            label="About Snippet"
            rows={4}
            value={settings.home_about_snippet ?? ''}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, home_about_snippet: e.target.value }))
            }
            placeholder="Brief text shown below 'About' on the homepage."
          />
        </div>

        <div className="mt-4">
          <Button
            onClick={() =>
              saveSettings('Homepage', {
                home_hero_title: settings.home_hero_title ?? '',
                home_hero_description: settings.home_hero_description ?? '',
                home_about_snippet: settings.home_about_snippet ?? '',
              })
            }
            loading={saving === 'Homepage'}
          >
            Save Homepage
          </Button>
        </div>
      </div>

      {/* About Page */}
      <div className="bg-white rounded-lg border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-2">About Page</h2>
        <p className="text-sm text-brand-500 mb-4">
          Write your about page content using Markdown. This replaces the placeholder text on the public About page.
        </p>

        <Textarea
          label="About Content (Markdown)"
          name="aboutContent"
          rows={16}
          value={settings.about_content ?? ''}
          onChange={(e) => setSettings((prev) => ({ ...prev, about_content: e.target.value }))}
          placeholder="Write your about page content here... Use **bold**, *italic*, ## headings, etc."
        />

        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={() => saveSettings('About page', { about_content: settings.about_content ?? '' })}
            loading={saving === 'About page'}
          >
            Save About Page
          </Button>
          <span className="text-xs text-brand-400">Supports Markdown formatting</span>
        </div>
      </div>

      {/* Site Colors */}
      <div className="bg-white rounded-lg border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-2">Site Colors</h2>
        <p className="text-sm text-brand-500 mb-4">
          Customize the site&apos;s primary and accent color. Pick a hex color or type it directly.
        </p>

        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                label="Primary Color"
                value={settings.site_primary_color ?? '#8a7658'}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, site_primary_color: e.target.value }))
                }
                placeholder="#8a7658"
              />
            </div>
            <input
              type="color"
              value={settings.site_primary_color || '#8a7658'}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, site_primary_color: e.target.value }))
              }
              className="w-10 h-10 rounded border border-brand-300 cursor-pointer mb-0.5"
              title="Pick primary color"
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <Input
                label="Accent Color"
                value={settings.site_accent_color ?? '#1a1a2e'}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, site_accent_color: e.target.value }))
                }
                placeholder="#1a1a2e"
              />
            </div>
            <input
              type="color"
              value={settings.site_accent_color || '#1a1a2e'}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, site_accent_color: e.target.value }))
              }
              className="w-10 h-10 rounded border border-brand-300 cursor-pointer mb-0.5"
              title="Pick accent color"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button
            onClick={() =>
              saveSettings('Colors', {
                site_primary_color: settings.site_primary_color ?? '#8a7658',
                site_accent_color: settings.site_accent_color ?? '#1a1a2e',
              })
            }
            loading={saving === 'Colors'}
          >
            Save Colors
          </Button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-lg border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-2">Change Password</h2>
        <p className="text-sm text-brand-500">
          Password changes are managed through the server CLI. Contact your administrator to update your password.
        </p>
      </div>
    </div>
  );
}
