'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Github, Slack, Figma } from 'lucide-react';
import { toast } from 'sonner';

export function IntegrationSettings() {
  const handleConnect = (service: string) => {
    toast.success(`Connected to ${service}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          <CardDescription>
            Connect your GitHub repositories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Github className="h-6 w-6" />
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-muted-foreground">
                  Access your repositories and pull requests
                </p>
              </div>
            </div>
            <Button onClick={() => handleConnect('GitHub')}>Connect</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slack Integration</CardTitle>
          <CardDescription>
            Get notifications in your Slack workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Slack className="h-6 w-6" />
              <div>
                <p className="font-medium">Slack</p>
                <p className="text-sm text-muted-foreground">
                  Send notifications to your channels
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect('Slack')}>
              Configure
            </Button>
          </div>
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notifications">Channel notifications</Label>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="mentions">Direct mentions</Label>
              <Switch id="mentions" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Figma Integration</CardTitle>
          <CardDescription>
            Access your Figma designs directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Figma className="h-6 w-6" />
              <div>
                <p className="font-medium">Figma</p>
                <p className="text-sm text-muted-foreground">
                  View and comment on designs
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={() => handleConnect('Figma')}>
              Connect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}