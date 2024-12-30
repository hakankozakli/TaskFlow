'use client';

import { AICrew } from '@/types/ai-crew';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Play, Pause, Settings } from 'lucide-react';
import { useState } from 'react';
import { AICrewDialog } from './ai-crew-dialog';
import { useAICrewStore } from '@/lib/stores/use-ai-crew-store';

interface AICrewCardProps {
  crew: AICrew;
}

export function AICrewCard({ crew }: AICrewCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const toggleStatus = useAICrewStore((state) => state.toggleStatus);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                {crew.name}
                <Badge variant={crew.status === 'active' ? 'default' : 'secondary'}>
                  {crew.status}
                </Badge>
              </CardTitle>
              <CardDescription>{crew.description}</CardDescription>
            </div>
            <Bot className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{crew.tasksCompleted}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{crew.successRate}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Capabilities</div>
              <div className="flex flex-wrap gap-2">
                {crew.capabilities.map((capability) => (
                  <Badge key={capability} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => toggleStatus(crew.id)}
              >
                {crew.status === 'active' ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEdit(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AICrewDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        crew={crew}
      />
    </>
  );
}