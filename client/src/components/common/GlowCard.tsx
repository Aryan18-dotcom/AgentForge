import React from 'react';
import { useMouseGlow } from '../../hooks/useMouseGlow';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className = '', ...props }: GlowCardProps) {
  const { handleMouseMove } = useMouseGlow();

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`glass-card relative overflow-hidden group border border-[#1f2937] bg-[#111827]/40 ${className}`}
      {...props}
    >
      {/* Hidden layer providing the design system's mouse-glow overlay interaction */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(210, 187, 255, 0.06), transparent 40%)'
        }}
      />
      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}