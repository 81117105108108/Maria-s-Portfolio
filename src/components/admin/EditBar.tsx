'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CMS_DEFAULTS } from '@/lib/constants';

type AuthState = 'loading' | 'ready' | 'denied';

export function EditBar() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [open, setOpen] = useState(false);
  const [panelLoaded, setPanelLoaded] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  // Auth check — only admins see the edit button
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((session) => {
        if (session?.user && session.user.role !== 'user') {
          setAuthState('ready');
        } else {
          setAuthState('denied');
        }
      })
      .catch(() => {
        setAuthState('denied');
      });
  }, []);

  // Load settings from DB when panel opens
  useEffect(() => {
    if (!open || panelLoaded) return;
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: Record<string, string>) => {
        setSettings(data);
        setDraft(data);
        setLoadError(false);
        setPanelLoaded(true);
      })
      .catch(() => {
        setLoadError(true);
        setPanelLoaded(true);
      });
  }, [open, panelLoaded]);

  // Auto-clear message after 3s
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  // Revert CSS vars to saved values when panel closes
  const closePanel = useCallback(() => {
    setOpen(false);
    setPanelLoaded(false);
    setMessage(null);
    setLoadError(false);
    if (settings.site_primary_color) {
      document.documentElement.style.setProperty('--color-primary', settings.site_primary_color);
    }
    if (settings.site_accent_color) {
      document.documentElement.style.setProperty('--color-accent', settings.site_accent_color);
    }
  }, [settings]);

  const updateDraft = useCallback((key: string, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Update draft + apply CSS variable immediately for live color preview
  const updateColorLive = useCallback((key: string, value: string) => {
    updateDraft(key, value);
    const cssVar = key === 'site_primary_color' ? '--color-primary' : '--color-accent';
    document.documentElement.style.setProperty(cssVar, value);
  }, [updateDraft]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: draft }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || 'Failed to save settings');
        return;
      }
      setSettings({ ...draft });
      setMessage('Settings saved successfully');
      router.refresh();
    } catch {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const handleResetPreview = useCallback(() => {
    setDraft({ ...settings });
    if (settings.site_primary_color) {
      document.documentElement.style.setProperty('--color-primary', settings.site_primary_color);
    }
    if (settings.site_accent_color) {
      document.documentElement.style.setProperty('--color-accent', settings.site_accent_color);
    }
  }, [settings]);

  const handleResetDefaults = useCallback(async (section: string) => {
    const keys = section === 'homepage'
      ? ['home_hero_title', 'home_hero_description']
      : ['site_primary_color', 'site_accent_color'];

    const updates: Record<string, string> = {};
    for (const key of keys) {
      updates[key] = CMS_DEFAULTS[key] || '';
    }

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updates }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || 'Failed to reset');
        return;
      }
      setDraft((prev) => ({ ...prev, ...updates }));
      setSettings((prev) => ({ ...prev, ...updates }));
      // Apply color defaults live
      for (const [key, value] of Object.entries(updates)) {
        if (key === 'site_primary_color') {
          document.documentElement.style.setProperty('--color-primary', value);
        } else if (key === 'site_accent_color') {
          document.documentElement.style.setProperty('--color-accent', value);
        }
      }
      setMessage(`${section} reset to defaults`);
      router.refresh();
    } catch {
      setMessage('Failed to reset');
    } finally {
      setSaving(false);
    }
  }, [router]);

  // Don't render anything for non-admins
  if (authState !== 'ready') return null;

  return (
    <>
      {/* Floating edit button — only visible to admins */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#1a1a2e] px-4 py-3 text-white shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Edit site"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        <span className="text-sm font-medium">Edit Site</span>
      </button>

      {/* Overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={closePanel}
          aria-hidden="true"
        />
      )}

      {/* Slide panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-96 bg-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Edit Site</h2>
            <button
              onClick={closePanel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close panel"
            >
              <span className="text-xl leading-none">✕</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loadError && (
              <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                Failed to load settings. Showing empty values.
              </div>
            )}

            {!panelLoaded ? (
              <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                Loading...
              </div>
            ) : (
              <div className="space-y-6">
                {/* Homepage section */}
                <div>
                  <div className="mb-4 border-b border-gray-200 pb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Homepage</h3>
                    <button
                      onClick={() => handleResetDefaults('homepage')}
                      disabled={saving}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      Reset to default
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Hero Title
                      </label>
                      <input
                        type="text"
                        value={draft.home_hero_title || ''}
                        onChange={(e) => updateDraft('home_hero_title', e.target.value)}
                        placeholder="Maria's Portfolio"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        Hero Description
                      </label>
                      <input
                        type="text"
                        value={draft.home_hero_description || ''}
                        onChange={(e) => updateDraft('home_hero_description', e.target.value)}
                        placeholder="A curated collection of 3D modeling and creative work."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Colors section */}
                <div>
                  <div className="mb-4 border-b border-gray-200 pb-2 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">
                      Colors <span className="text-xs font-normal text-gray-400">(live preview)</span>
                    </h3>
                    <button
                      onClick={() => handleResetDefaults('colors')}
                      disabled={saving}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                      Reset to default
                    </button>
                  </div>
                  <div className="space-y-4">
                    {/* Primary Color */}
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                          Primary Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={draft.site_primary_color || ''}
                            onChange={(e) => updateColorLive('site_primary_color', e.target.value)}
                            placeholder="#8a7658"
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="color"
                            value={draft.site_primary_color || '#8a7658'}
                            onChange={(e) => updateColorLive('site_primary_color', e.target.value)}
                            className="h-9 w-9 cursor-pointer rounded border border-gray-300"
                          />
                          <div
                            className="h-6 w-6 rounded border border-gray-200"
                            style={{ backgroundColor: draft.site_primary_color || '#8a7658' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={draft.site_accent_color || ''}
                            onChange={(e) => updateColorLive('site_accent_color', e.target.value)}
                            placeholder="#1a1a2e"
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="color"
                            value={draft.site_accent_color || '#1a1a2e'}
                            onChange={(e) => updateColorLive('site_accent_color', e.target.value)}
                            className="h-9 w-9 cursor-pointer rounded border border-gray-300"
                          />
                          <div
                            className="h-6 w-6 rounded border border-gray-200"
                            style={{ backgroundColor: draft.site_accent_color || '#1a1a2e' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Swatch preview row */}
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded border border-gray-200"
                          style={{ backgroundColor: draft.site_primary_color || '#8a7658' }}
                        />
                        <span className="text-xs text-gray-500">Primary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded border border-gray-200"
                          style={{ backgroundColor: draft.site_accent_color || '#1a1a2e' }}
                        />
                        <span className="text-xs text-gray-500">Accent</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`rounded-md px-3 py-2 text-sm ${
                      message.includes('Failed')
                        ? 'bg-red-50 text-red-700'
                        : 'bg-green-50 text-green-700'
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer buttons */}
          {panelLoaded && (
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleResetPreview}
                className="mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Reset Preview
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
