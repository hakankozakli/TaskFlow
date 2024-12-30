'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface OnboardingStepsProps {
  currentStep: number;
  onComplete: () => void;
}

export function OnboardingSteps({ currentStep, onComplete }: OnboardingStepsProps) {
  const [step, setStep] = useState(currentStep);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    teamSize: '',
    goals: '',
  });

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      toast.success('Setup completed successfully!');
      onComplete();
    } catch (error) {
      toast.error('Failed to save setup data');
    }
  };

  const steps = [
    {
      title: 'Personal Information',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="Enter your company name"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Team Information',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Your Role</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g., Project Manager, Developer"
            />
          </div>
          <div>
            <Label htmlFor="teamSize">Team Size</Label>
            <Input
              id="teamSize"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              placeholder="How many people are in your team?"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Project Goals',
      fields: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="goals">What are your main goals?</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              placeholder="Tell us what you want to achieve..."
              rows={4}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between mb-8">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center ${
              i !== steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {i + 1}
            </div>
            {i !== steps.length - 1 && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  i < step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{steps[step].title}</h2>
        {steps[step].fields}
      </div>

      <div className="flex justify-end gap-4">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
          >
            Previous
          </Button>
        )}
        <Button onClick={handleNext}>
          {step === steps.length - 1 ? 'Complete Setup' : 'Next'}
        </Button>
      </div>
    </div>
  );
}