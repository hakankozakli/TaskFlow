'use client';

import { useState } from 'react';
import { Tag } from '@/types/projects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, X } from 'lucide-react';

const colorOptions = [
  { name: 'Red', value: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { name: 'Green', value: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { name: 'Blue', value: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'Purple', value: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { name: 'Yellow', value: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
];

interface TagPickerProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
}

export function TagPicker({ tags, onChange }: TagPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

  const addTag = () => {
    if (newTagName.trim()) {
      onChange([
        ...tags,
        {
          id: crypto.randomUUID(),
          name: newTagName.trim(),
          color: selectedColor,
        },
      ]);
      setNewTagName('');
      setIsOpen(false);
    }
  };

  const removeTag = (tagId: string) => {
    onChange(tags.filter(tag => tag.id !== tagId));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <Badge
            key={tag.id}
            className={`${tag.color} cursor-default flex items-center gap-1`}
            variant="secondary"
          >
            {tag.name}
            <X
              className="h-3 w-3 cursor-pointer hover:text-foreground/80"
              onClick={() => removeTag(tag.id)}
            />
          </Badge>
        ))}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-6">
              <Plus className="h-4 w-4" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={e => setNewTagName(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {colorOptions.map(color => (
                  <Button
                    key={color.value}
                    variant="outline"
                    size="sm"
                    className={`w-6 h-6 p-0 ${color.value} ${
                      selectedColor === color.value ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedColor(color.value)}
                  />
                ))}
              </div>
              <Button onClick={addTag} className="w-full">
                Add Tag
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}