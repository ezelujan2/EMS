import React from 'react';
import { motion } from 'framer-motion';

export function GarabatoSparkle({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={`pointer-events-none ${className}`}
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ 
        rotate: [0, 15, -15, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      <path d="m2 12 20 0" />
      <path d="m19.07 4.93-14.14 14.14" />
      <path d="m4.93 4.93 14.14 14.14" />
    </motion.svg>
  );
}

export function GarabatoSmiley({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={`pointer-events-none ${className}`}
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ 
        y: [0, -10, 0],
        rotate: [-5, 5, -5]
      }}
      transition={{ 
        duration: 5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <circle cx="30" cy="30" r="25" />
      <path d="M20 25a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
      <path d="M40 25a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
      <path d="M20 40c3.5 4.5 9.5 6.5 15.5 4.5 2.5-1 4.5-2.5 6-4.5" />
    </motion.svg>
  );
}

export function GarabatoCloud({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={`pointer-events-none ${className}`}
      width="80"
      height="60"
      viewBox="0 0 80 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ 
        x: [0, 15, 0],
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <path d="M25 45c-8 0-15-7-15-15 0-7.5 5.5-14 13-14.8A17 17 0 0 1 54 10.2c5.5 0 10 4 11 9.2A11 11 0 0 1 65 40l-40 5" />
    </motion.svg>
  );
}

export function GarabatoHighlight({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      className={`pointer-events-none ${className}`}
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ 
        duration: 1.5,
        ease: "easeInOut"
      }}
    >
      <path d="M5 25 Q 30 10, 60 20 T 115 15" />
    </motion.svg>
  );
}
