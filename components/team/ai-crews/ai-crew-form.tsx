'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useAICrewStore } from '@/lib/stores/use-ai-crew-store';
import { AICrew } from '@/types/ai-crew';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  capabilities: z.array(z.string()).min(1, 'At least one capability is required'),
});

interface AICrewFormProps {
  crew?: AICrew;
  onComplete: () => void;
}

export function AICrewForm({ crew, onComplete }: AICrewFormProps) {
  const { addCrew, updateCrew } = useAICrewStore();
  const [capability, setCapability] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: crew || {
      name: '',
      description: '',
      capabilities: [],
    },
  });

  const addCapability = () => {
    if (!capability.trim()) return;
    const current = form.getValues('capabilities');
    if (!current.includes(capability.trim())) {
      form.setValue('capabilities', [...current, capability.trim()]);
    }
    setCapability('');
  };

  const removeCapability = (cap: string) => {
    const current = form.getValues('capabilities');
    form.setValue('capabilities', current.filter(c => c !== cap));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (crew) {
      updateCrew(crew.id, values);
      toast.success('AI Crew updated successfully');
    } else {
      addCrew(values);
      toast.success('AI Crew created successfully');
    }
    onComplete();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., Frontend Development Crew" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Describe the crew's purpose and expertise"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capabilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capabilities</FormLabel>
              <FormDescription>
                Add the technical capabilities of this AI crew
              </FormDescription>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={capability}
                    onChange={(e) => setCapability(e.target.value)}
                    placeholder="e.g., React, TypeScript, API Integration"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCapability();
                      }
                    }}
                  />
                  <Button type="button" onClick={addCapability}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value.map((cap) => (
                    <Badge key={cap} variant="secondary" className="gap-1">
                      {cap}
                      <button
                        type="button"
                        onClick={() => removeCapability(cap)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">
            {crew ? 'Update Crew' : 'Create Crew'}
          </Button>
        </div>
      </form>
    </Form>
  );
}