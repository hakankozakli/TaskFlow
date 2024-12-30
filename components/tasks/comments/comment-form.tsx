'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCommentsStore } from '@/lib/stores/use-comments-store';
import { toast } from 'sonner';
import { MentionsInput, Mention } from 'react-mentions';
import { useTeamStore } from '@/lib/stores/use-team-store';

const mentionsInputStyle = {
  control: {
    backgroundColor: 'var(--background)',
    fontSize: 14,
    fontWeight: 'normal',
  },
  input: {
    margin: 0,
    padding: '12px 16px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    minHeight: '100px',
    width: '100%',
  },
  suggestions: {
    list: {
      backgroundColor: 'var(--background)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      fontSize: 14,
    },
    item: {
      padding: '8px 16px',
      '&focused': {
        backgroundColor: 'var(--accent)',
      },
    },
  },
};

interface CommentFormProps {
  taskId: string;
}

export function CommentForm({ taskId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const addComment = useCommentsStore((state) => state.addComment);
  const teams = useTeamStore((state) => state.teams);
  
  // Get all team members for mentions
  const teamMembers = teams.flatMap(team => team.members).map(member => ({
    id: member.id,
    display: member.name,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    // Extract mentions from content
    const mentions = content.match(/@\[(.*?)\]\(.*?\)/g)?.map(mention => {
      const match = mention.match(/@\[(.*?)\]\((.*?)\)/);
      return match ? match[1] : '';
    }) || [];

    addComment(taskId, { content: content.trim(), mentions });
    setContent('');
    toast.success('Comment added');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <MentionsInput
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={mentionsInputStyle}
        placeholder="Write a comment... (Use @ to mention team members)"
        className="min-h-[100px]"
      >
        <Mention
          trigger="@"
          data={teamMembers}
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--primary-foreground)',
            padding: '2px 4px',
            borderRadius: '4px',
          }}
        />
      </MentionsInput>
      <div className="flex justify-end">
        <Button type="submit">Add Comment</Button>
      </div>
    </form>
  );
}