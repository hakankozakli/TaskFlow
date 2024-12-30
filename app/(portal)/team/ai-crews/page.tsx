'use client';

import { AICrewList } from '@/components/team/ai-crews/ai-crew-list';
import { AICrewEmpty } from '@/components/team/ai-crews/ai-crew-empty';
import { useAICrewStore } from '@/lib/stores/use-ai-crew-store';

export default function AICrewsPage() {
  const crews = useAICrewStore((state) => state.crews);

  return (
    <div className="space-y-6">
      {crews.length > 0 ? (
        <AICrewList />
      ) : (
        <AICrewEmpty />
      )}
    </div>
  );
}