'use client';

import { OrganizationForm } from '@/components/organizations/organization-form';
import Image from 'next/image';

export function OrganizationOnboarding() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Set Up Your Organization
            </h1>
            <p className="text-muted-foreground">
              Tell us about your organization to get started
            </p>
          </div>
          
          <OrganizationForm 
            onComplete={() => window.location.href = '/dashboard'}
            redirectUrl="/dashboard"
          />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
          alt="Office workspace"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg text-white">
              "TaskFlow has transformed how our team collaborates and manages projects. 
              It's become an essential part of our daily workflow."
            </p>
            <footer className="text-sm text-white/80">
              Sarah Chen, Product Manager at TechCorp
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}