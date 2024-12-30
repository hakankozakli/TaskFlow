'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/session-provider';
import { motion } from 'framer-motion';
import { HeroBadge } from './hero-badge';
import { HeroStats } from './hero-stats';
import { HeroPreview } from './hero-preview';

export function HeroSection() {
  const router = useRouter();
  const { session } = useSession();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding?plan=free');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(75,163,195,0.1),rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <HeroBadge />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-3xl"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              A Better Way to <span className="text-primary">Get Work Done</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              The all-in-one platform that makes teamwork click. Manage projects, automate workflows, and celebrate success together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={handleGetStarted}
            >
              {session ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => router.push('#pricing')}
            >
              View Pricing
            </Button>
          </motion.div>

          <HeroPreview />
          <HeroStats />
        </div>
      </div>
    </section>
  );
}