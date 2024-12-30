import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/sections/hero/hero-section';
import { FeaturesSection } from '@/components/landing/sections/features/features-section';
import { FeatureTabs } from '@/components/landing/sections/features/feature-tabs';
import { TestimonialCarousel } from '@/components/landing/sections/testimonials/testimonial-carousel';
import { PricingSection } from '@/components/landing/pricing-section';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <FeatureTabs />
        <TestimonialCarousel />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}