'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      </motion.div>
      <motion.div 
        style={{ y: y3 }}
        className="absolute inset-0"
      >
        <svg
          className="absolute w-full h-full opacity-30 dark:opacity-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="circles" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="20" cy="20" r="20" fill="url(#circles)" />
          <circle cx="80" cy="30" r="15" fill="url(#circles)" />
          <circle cx="40" cy="70" r="25" fill="url(#circles)" />
          <circle cx="75" cy="75" r="20" fill="url(#circles)" />
        </svg>
      </motion.div>
    </div>
  );
}