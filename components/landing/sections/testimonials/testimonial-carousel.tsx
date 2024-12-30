'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    quote: "TaskFlow has transformed how we manage projects. The AI features are a game-changer.",
    author: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
  },
  {
    quote: "The automation capabilities have saved us countless hours of manual work.",
    author: "Michael Rodriguez",
    role: "Product Lead",
    company: "InnovateLabs",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
  },
  {
    quote: "Best project management platform we've ever used. The interface is intuitive and powerful.",
    author: "Emily Watson",
    role: "Operations Director",
    company: "GlobalTech",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
  }
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden py-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-primary/10 pointer-events-none">
        <Quote size={400} />
      </div>
      
      <div className="relative container mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-4xl mx-auto"
          >
            <blockquote className="text-2xl font-medium mb-8">
              "{testimonials[current].quote}"
            </blockquote>
            
            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonials[current].image}
                alt={testimonials[current].author}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-medium">{testimonials[current].author}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonials[current].role}, {testimonials[current].company}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}