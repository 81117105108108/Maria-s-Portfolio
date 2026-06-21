'use client';

import React from 'react';
import type { DashboardStats as DashboardStatsType } from '@/types';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'text-brand-600 bg-brand-100',
    },
    {
      label: 'Published',
      value: stats.publishedProjects,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600 bg-green-100',
    },
    {
      label: 'Drafts',
      value: stats.draftProjects,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      color: 'text-amber-600 bg-amber-100',
    },
    {
      label: 'Total Images',
      value: stats.totalImages,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-blue-600 bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-lg border border-brand-200 p-5 flex items-center gap-4"
        >
          <div className={`p-3 rounded-lg ${card.color}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-900">{card.value}</p>
            <p className="text-sm text-brand-500">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
