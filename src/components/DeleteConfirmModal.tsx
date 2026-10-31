import React, { useRef } from 'react';
import { Book } from '../types/book';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface DeleteConfirmModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (bookId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  book,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Hook de controle estrito de foco com foco inicial no botão cancelar por segurança
  const modalContainerRef = useFocusTrap({
    isOpen,
    onClose,
    initialFocusRef: cancelButtonRef,
  });

  if (!isOpen || !book) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B1326]/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
      role="presentation"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={modalContainerRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
        tabIndex={-1}
        className="relative w-full max-w-md bg-white dark:bg-[#121C35] rounded-2xl shadow-xl border border-[#E2DDD1] dark:border-[#223459] p-6 z-10 space-y-4 text-[#24201C] dark:text-[#F1F5F9] focus:outline-none"
      >
        <div className="flex items-start justify-between">
          <div
            className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-900/50"
            aria-hidden="true"
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onClose}
            aria-label="Cancelar e fechar aviso de exclusão"
            className="p-1 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338]"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div>
          <h2 id="delete-dialog-title" className="font-serif text-xl sm:text-2xl font-bold text-[#24201C] dark:text-[#F1F5F9]">
            Excluir livro da estante?
          </h2>
          <p id="delete-dialog-desc" className="font-sans text-base sm:text-lg text-[#5A544C] dark:text-[#CBD5E1] mt-3 leading-relaxed">
            Tem certeza de que deseja remover{' '}
            <strong className="text-[#24201C] dark:text-[#F1F5F9] font-bold">"{book.title}"</strong>
            {book.author ? ` de ${book.author}` : ''} da sua biblioteca? Esta ação apagará também todas as anotações pessoais associadas a este livro e não poderá ser desfeita.
          </p>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-end gap-3 font-sans">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm sm:text-base font-medium text-[#5A544C] dark:text-[#9CB2D1] hover:text-[#24201C] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(book.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>Sim, excluir definitivamente</span>
          </button>
        </div>
      </div>
    </div>
  );
};
