import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export function AnimatedButton({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`px-6 py-3 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
        variant === 'primary'
          ? 'btn-primary'
          : 'bg-[#171b26] border border-[#4a4455] text-[#dfe2f1] hover:bg-[#262a35] rounded-xl'
      } ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}