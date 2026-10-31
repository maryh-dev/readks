import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-stone-900/95 dark:bg-stone-800 text-stone-100 text-sm sm:text-base font-medium shadow-lg border border-stone-700/60 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2"
    >
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
      <span>Modo offline ativo · Seus livros e anotações estão salvos localmente.</span>
    </aside>
  );
};
