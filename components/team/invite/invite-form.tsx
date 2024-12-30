'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTeamInvites } from '@/hooks/use-team-invites';
import { toast } from 'sonner';

interface InviteFormProps {
  teamId: string;
}

export function InviteForm({ teamId }: InviteFormProps) {
  const [email, setEmail] = useState('');
  const { sendInvite } = useTeamInvites();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await sendInvite(teamId, email.trim());
      setEmail('');
      toast.success('Invitation sent successfully');
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="Enter email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button type="submit">
        Invite
      </Button>
    </form>
  );
}