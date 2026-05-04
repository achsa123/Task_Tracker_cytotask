import React from 'react';

type BadgeVariant = 'gray' | 'blue' | 'green' | 'yellow' | 'red';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function Badge({ variant = 'gray', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
