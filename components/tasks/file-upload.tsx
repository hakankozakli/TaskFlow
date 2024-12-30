'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { FileAttachment } from '@/types/projects';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface FileUploadProps {
  value: FileAttachment[];
  onChange: (files: FileAttachment[]) => void;
}

export function FileUpload({ value, onChange }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: FileAttachment[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));

    onChange([...value, ...newAttachments]);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(file => file.id !== id));
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          isDragging ? 'border-primary' : 'border-border'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          or drag and drop files here
        </p>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                {file.type === 'image' ? (
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                ) : (
                  <FileText className="h-4 w-4 text-orange-500" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(file.size)}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}