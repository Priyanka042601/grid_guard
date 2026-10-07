import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[48px]',
  }[size];

  const variantStyles = {
    primary:
      'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-sm font-semibold border border-brand-400/30',
    secondary:
      'bg-slate-800 hover:bg-slate-700 active:bg-slate-750 text-slate-100 border border-slate-700 hover:border-slate-600',
    outline:
      'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-700 hover:border-slate-500',
    danger:
      'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold border border-red-500/40',
    ghost:
      'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-slate-100 border-none',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        />
      ) : (
        leftIcon && <span aria-hidden="true">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </button>
  );
};
