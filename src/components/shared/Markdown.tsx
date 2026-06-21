'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        h1: ({ children, ...props }) => (
          <h1 className="text-2xl font-display font-bold text-brand-900 mt-8 mb-4" {...props}>
            {children}
          </h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-xl font-display font-semibold text-brand-800 mt-6 mb-3" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-lg font-display font-semibold text-brand-800 mt-5 mb-2" {...props}>
            {children}
          </h3>
        ),
        p: ({ children, ...props }) => (
          <p className="text-base text-brand-700 leading-relaxed mb-4" {...props}>
            {children}
          </p>
        ),
        a: ({ children, href, ...props }) => (
          <a
            href={href}
            className="text-brand-600 hover:text-brand-800 underline underline-offset-2 transition-colors"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            {...props}
          >
            {children}
          </a>
        ),
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-inside text-brand-700 mb-4 space-y-1" {...props}>
            {children}
          </ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-inside text-brand-700 mb-4 space-y-1" {...props}>
            {children}
          </ol>
        ),
        li: ({ children, ...props }) => (
          <li className="text-base leading-relaxed" {...props}>
            {children}
          </li>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote
            className="border-l-4 border-brand-300 pl-4 py-2 mb-4 italic text-brand-600"
            {...props}
          >
            {children}
          </blockquote>
        ),
        code: ({ children, ...props }) => (
          <code
            className="bg-brand-100 text-brand-800 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
          >
            {children}
          </code>
        ),
        pre: ({ children, ...props }) => (
          <pre
            className="bg-brand-900 text-brand-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm"
            {...props}
          >
            {children}
          </pre>
        ),
        hr: (props) => <hr className="my-8 border-brand-200" {...props} />,
        img: ({ src, alt, ...props }) => (
          <img
            src={src}
            alt={alt || ''}
            className="rounded-lg max-w-full h-auto my-4"
            loading="lazy"
            {...props}
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
