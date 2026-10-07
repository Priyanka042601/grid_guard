import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  as: Component = 'div',
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <Component
      className={`bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm transition-all duration-150 ${
        interactive
          ? 'hover:border-slate-700 hover:bg-slate-850 cursor-pointer focus-within:ring-2 focus-within:ring-amber-400'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
