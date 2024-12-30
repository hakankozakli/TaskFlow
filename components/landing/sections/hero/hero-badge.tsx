'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm"
    >
      <Sparkles className="h-4 w-4 text-primary mr-2" />
      <span className="font-medium">New: AI-Powered Workflow Automation</span>
      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Beta</span>
    </motion.div>
  );
}