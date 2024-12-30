'use client';

import { motion } from 'framer-motion';
import { 
  Kanban, 
  Bot, 
  LineChart, 
  Clock, 
  Users, 
  Shield,
  Zap,
  GitBranch,
  MessageSquare 
} from 'lucide-react';

const features = [
  {
    icon: Kanban,
    title: 'Visual Project Management',
    description: 'Intuitive kanban boards and timeline views for effortless project tracking.'
  },
  {
    icon: Bot,
    title: 'AI Assistant',
    description: 'Smart task prioritization and workload balancing powered by advanced AI.'
  },
  {
    icon: Zap,
    title: 'Automation',
    description: 'Automate repetitive tasks and workflows to save time and reduce errors.'
  },
  {
    icon: GitBranch,
    title: 'Version Control',
    description: 'Track changes and maintain complete history of your project evolution.'
  },
  {
    icon: MessageSquare,
    title: 'Team Chat',
    description: 'Built-in real-time messaging and collaboration tools for your team.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with role-based access control and audit logs.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="features">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(75,163,195,0.1),rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help your team stay organized, focused, and productive.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
              <div className="absolute top-6 right-6 w-20 h-20 bg-primary/5 rounded-full blur-2xl -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}