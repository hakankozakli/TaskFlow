import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <h2 className="text-2xl font-bold">Project Not Found</h2>
      <p className="text-muted-foreground">The project you're looking for doesn't exist.</p>
      <Button asChild>
        <Link href="/projects">Back to Projects</Link>
      </Button>
    </div>
  );
}