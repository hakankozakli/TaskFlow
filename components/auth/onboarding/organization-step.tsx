'use client';

import { useState } from 'react';
import { useAuthSession } from '@/hooks/use-auth-session';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORGANIZATION_SIZES, INDUSTRIES } from '@/lib/constants/onboarding';
import { createOrganization } from '@/lib/services/organization';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface OrganizationStepProps {
  onComplete: () => void;
}

export function OrganizationStep({ onComplete }: OrganizationStepProps) {
  const { session, loading: sessionLoading } = useAuthSession();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    industry: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error('Please sign in to continue');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Organization name is required');
      return;
    }

    setIsLoading(true);

    try {
      await createOrganization(formData);
      toast.success('Organization created successfully');
      onComplete();
    } catch (error: any) {
      console.error('Organization creation error:', error);
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter organization name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Organization Size</Label>
        <Select
          value={formData.size}
          onValueChange={(value) => setFormData({ ...formData, size: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select organization size" />
          </SelectTrigger>
          <SelectContent>
            {ORGANIZATION_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size} employees
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={formData.industry}
          onValueChange={(value) => setFormData({ ...formData, industry: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || !session}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Organization...
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </form>
  );
}