'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/tasks/date-picker';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { toast } from 'sonner';
import { ProjectVisibility } from '@/types/projects';
import { useProjectsStore } from '@/lib/stores/use-projects-store';
import { VisuallyHidden } from '@/components/ui/visually-hidden';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDialog({ open, onOpenChange }: ProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [visibility, setVisibility] = useState<ProjectVisibility>('public');
  const addProject = useProjectsStore((state) => state.addProject);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    addProject({
      name: name.trim(),
      description,
      visibility,
      dueDate: dueDate?.toISOString(),
      status: 'Planning',
      members: 1,
      tasks: 0,
      completedTasks: 0,
    });

    toast.success('Project created successfully');
    onOpenChange(false);
    setName('');
    setDescription('');
    setDueDate(undefined);
    setVisibility('public');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description"
            />
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <RadioGroup
              value={visibility}
              onValueChange={(value) => setVisibility(value as ProjectVisibility)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public">Public</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private">Private</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Due Date (Optional)</Label>
            <DatePicker
              date={dueDate}
              onSelect={setDueDate}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <span>Cancel</span>
              <VisuallyHidden>Cancel creating new project</VisuallyHidden>
            </Button>
            <Button type="submit">
              <span>Create Project</span>
              <VisuallyHidden>Create new project</VisuallyHidden>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}