import React, { useEffect } from 'react';
import { Check, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200 font-sans"
    >
      <div className="flex items-center gap-3 px-4.5 py-3.5 bg-[#1E293B] dark:bg-[#182544] text-[#F7F5F0] dark:text-[#F1F5F9] rounded-xl shadow-lg border border-[#334155] dark:border-[#2F477A] text-sm sm:text-base font-semibold">
        {toast.type === 'info' ? (
          <Info className="w-5 h-5 text-[#38BDF8] shrink-0" aria-hidden="true" />
        ) : (
          <Check className="w-5 h-5 text-[#34D399] shrink-0" aria-hidden="true" />
        )}
        <span>{toast.message}</span>
        <button
          type="button"
          onClick={onDismiss}
          className="text-[#94A3B8] hover:text-white ml-2 p-1 cursor-pointer rounded-md focus-visible:ring-2 focus-visible:ring-white"
          aria-label="Dispensar aviso"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
};
