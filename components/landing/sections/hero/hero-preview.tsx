'use client';

import { motion } from 'framer-motion';

export function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative w-full max-w-6xl mt-16"
    >
      <div className="aspect-[16/9] rounded-xl overflow-hidden border bg-card shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
          alt="Platform Preview"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/10" />
      </div>
      
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-primary/10 backdrop-blur-sm rounded-full px-8 py-3 text-sm font-medium">
          Trusted by over 180,000 teams worldwide
        </div>
      </div>

      <div className="absolute -right-8 -top-8 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -left-8 -bottom-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
    </motion.div>
  );
}