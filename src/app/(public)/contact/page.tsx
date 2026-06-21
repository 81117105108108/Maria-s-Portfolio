'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-page py-12 md:py-16 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-brand-900 mb-2">
          Contact
        </h1>
        <p className="text-brand-500 mb-8">
          Have a project in mind? Let&apos;s talk about it.
        </p>

        <div className="mb-8 p-4 rounded-lg bg-brand-50 border border-brand-200">
          <p className="text-sm text-brand-600">
            <strong>Alternative:</strong> Message me on Discord{' '}
            <a
              href="https://discord.com/users/mariadantalion"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              mariadantalion
            </a>
          </p>
        </div>

        {success && (
          <div className="p-4 mb-6 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
            Thank you! Your message has been sent. I&apos;ll get back to you soon.
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Name"
            name="name"
            type="text"
            placeholder="Your name"
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="your@email.com"
            required
          />
          <Textarea
            label="Message"
            name="message"
            placeholder="Tell me about your project..."
            rows={6}
            required
          />
          <Button type="submit" loading={loading}>
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
