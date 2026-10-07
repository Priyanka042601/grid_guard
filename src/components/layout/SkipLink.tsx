import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-xl focus:ring-4 focus:ring-amber-300 focus:outline-none transition-all"
    >
      Skip to main content
    </a>
  );
};
