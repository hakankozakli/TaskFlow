'use client';

import { useUserStore } from '@/lib/stores/use-user-store';
import { UserCard } from './user-card';
import { UserEmpty } from './user-empty';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { UserDialog } from './user-dialog';

export function UserList() {
  const users = useUserStore((state) => state.users);
  const [showNewUser, setShowNewUser] = useState(false);

  return (
    <div className="space-y-6">
      {users.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <Button onClick={() => setShowNewUser(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-card rounded-lg border">
          <UserEmpty onAddUser={() => setShowNewUser(true)} />
        </div>
      )}

      <UserDialog
        open={showNewUser}
        onOpenChange={setShowNewUser}
      />
    </div>
  );
}