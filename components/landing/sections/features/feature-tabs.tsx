'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Zap, Users } from 'lucide-react';

const features = {
  ai: {
    title: 'AI-Powered Insights',
    description: 'Let AI handle the heavy lifting',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    benefits: [
      'Smart task prioritization',
      'Automated resource allocation',
      'Predictive analytics',
    ]
  },
  automation: {
    title: 'Workflow Automation',
    description: 'Save time with smart automation',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
    benefits: [
      'Custom workflow builder',
      'Trigger-based actions',
      'Integration with 100+ tools',
    ]
  },
  collaboration: {
    title: 'Team Collaboration',
    description: 'Work better together',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop',
    benefits: [
      'Real-time updates',
      'Team chat and comments',
      'File sharing and versioning',
    ]
  }
};

export function FeatureTabs() {
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <div className="mt-16">
      <Tabs defaultValue="ai" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-12">
          <TabsTrigger value="ai" className="gap-2">
            <Bot className="h-4 w-4" />
            AI
          </TabsTrigger>
          <TabsTrigger value="automation" className="gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="gap-2">
            <Users className="h-4 w-4" />
            Collaboration
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4">{features[activeTab].title}</h3>
              <p className="text-muted-foreground mb-6">{features[activeTab].description}</p>
              <ul className="space-y-4">
                {features[activeTab].benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden border shadow-2xl">
                <img
                  src={features[activeTab].image}
                  alt={features[activeTab].title}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="absolute -z-10 inset-0 bg-primary/20 blur-2xl rounded-full" />
            </div>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}