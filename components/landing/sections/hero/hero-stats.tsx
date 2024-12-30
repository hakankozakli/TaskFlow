'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '152,000+', label: 'Customers' },
  { value: '200+', label: 'Templates' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
];

export function HeroStats() {
  return (
    <div className="mx-auto mt-16 max-w-5xl grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.1 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="text-3xl font-bold text-primary">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}