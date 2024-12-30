import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ORGANIZATION_SIZES, INDUSTRIES } from '@/lib/constants/onboarding';
import { createOrganization } from '@/lib/services/organization-service';
import { validateOrganizationData } from '@/lib/services/organization-validation';
import { toast } from 'sonner';
import { Loader2, Building2, Users, Briefcase } from 'lucide-react';

export function OrganizationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    size: '',
    industry: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      const validatedData = validateOrganizationData(formData);
      
      // Create organization
      await createOrganization(validatedData);
      
      toast.success('Organization created successfully');
      
      // Use a small delay to ensure the database updates are complete
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error('Organization creation error:', error);
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component remains the same...
}