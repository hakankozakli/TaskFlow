'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth/session-provider';
import { motion } from 'framer-motion';

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
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(75,163,195,0.1),rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-3xl"
          >
            <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span>Introducing AI-Powered Project Management</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Transform Your <span className="text-primary">Workflow</span> with Intelligent Project Management
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Streamline collaboration, boost productivity, and deliver projects faster with our AI-powered platform.
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-5xl mt-12"
          >
            <div className="aspect-video rounded-xl overflow-hidden border bg-card shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                alt="Dashboard Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/10" />
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="bg-primary/10 backdrop-blur-sm rounded-full px-6 py-2 text-sm text-primary">
                Trusted by 10,000+ teams worldwide
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}