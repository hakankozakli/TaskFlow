'use client';

import { Check } from 'lucide-react';

interface Step {
  title: string;
  description: string;
}

interface ProgressWizardProps {
  steps: Step[];
  currentStep: number;
}

export function ProgressWizard({ steps, currentStep }: ProgressWizardProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index !== steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index < currentStep
                  ? 'bg-primary border-primary text-primary-foreground'
                  : index === currentStep
                  ? 'border-primary text-primary'
                  : 'border-muted text-muted-foreground'
              }`}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`h-[2px] flex-1 mx-4 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h3 className="font-medium">{steps[currentStep].title}</h3>
        <p className="text-sm text-muted-foreground">
          {steps[currentStep].description}
        </p>
      </div>
    </div>
  );
}