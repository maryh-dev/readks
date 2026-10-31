import React, { useState, useEffect, useRef } from 'react';
import { Book, STATUS_CONFIG, BookStatus, BookNote } from '../types/book';
import { BookCover } from './BookCover';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  X,
  Edit3,
  Trash2,
  ArrowRight,
  Calendar,
  User,
  BookOpen,
  MessageSquare,
  Plus,
  Check,
  Quote,
} from 'lucide-react';

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onDeleteRequest: (book: Book) => void;
  onStatusChange: (bookId: string, status: BookStatus) => void;
  onAdvanceStatus: (bookId: string) => void;
  onAddNote: (bookId: string, content: string) => Promise<void>;
  onUpdateNote: (bookId: string, noteId: string, content: string) => Promise<void>;
  onDeleteNote: (bookId: string, noteId: string) => Promise<void>;
}

export const BookModal: React.FC<BookModalProps> = ({
  book,
  isOpen,
  onClose,
  onEdit,
  onDeleteRequest,
  onStatusChange,
  onAdvanceStatus,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'notes'>('info');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const modalContainerRef = useFocusTrap({
    isOpen,
    onClose,
  });

  // Reset do formulário de anotação ao trocar de livro
  useEffect(() => {
    setNewNoteContent('');
    setEditingNoteId(null);
    setEditingNoteText('');
    setActiveTab('info');
  }, [book?.id]);

  if (!isOpen || !book) return null;

  const currentStatusConfig = STATUS_CONFIG[book.status];
  const nextConfig = STATUS_CONFIG[currentStatusConfig.nextStatus];
  const notesCount = book.notes?.length || 0;

  const handleSaveNewNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || isSubmittingNote) return;

    setIsSubmittingNote(true);
    await onAddNote(book.id, newNoteContent.trim());
    setNewNoteContent('');
    setIsSubmittingNote(false);
  };

  const handleStartEditNote = (note: BookNote) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.content);
  };

  const handleSaveEditNote = async (noteId: string) => {
    if (!editingNoteText.trim()) return;
    await onUpdateNote(book.id, noteId, editingNoteText.trim());
    setEditingNoteId(null);
    setEditingNoteText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B1326]/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      role="presentation"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-white dark:bg-[#121C35] rounded-2xl shadow-xl border border-[#E2DDD1] dark:border-[#223459] overflow-hidden z-10 max-h-[90vh] flex flex-col text-[#24201C] dark:text-[#F1F5F9] focus:outline-none"
      >
        {/* Cabeçalho do Modal com Navegação entre Detalhes e Anotações */}
        <div className="px-6 py-3.5 border-b border-[#E2DDD1] dark:border-[#223459] flex items-center justify-between bg-[#F6F4EE]/80 dark:bg-[#0B1326]/70">
          <div role="tablist" aria-label="Seções do livro" className="flex items-center gap-2">
            <button
              role="tab"
              id="tab-info"
              aria-selected={activeTab === 'info'}
              aria-controls="panel-info"
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm sm:text-base font-sans transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                activeTab === 'info'
                  ? 'bg-white dark:bg-[#182544] text-[#24201C] dark:text-[#F1F5F9] shadow-2xs font-semibold border border-[#E2DDD1]/80 dark:border-[#2F477A]'
                  : 'text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9]'
              }`}
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              <span>Visão Geral</span>
            </button>
            <button
              role="tab"
              id="tab-notes"
              aria-selected={activeTab === 'notes'}
              aria-controls="panel-notes"
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm sm:text-base font-sans transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                activeTab === 'notes'
                  ? 'bg-white dark:bg-[#182544] text-[#24201C] dark:text-[#F1F5F9] shadow-2xs font-semibold border border-[#E2DDD1]/80 dark:border-[#2F477A]'
                  : 'text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9]'
              }`}
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>Anotações Pessoais</span>
              {notesCount > 0 && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#EDE9E0] dark:bg-[#1A2A4C] text-[#24201C] dark:text-[#F1F5F9] font-semibold">
                  {notesCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar detalhes do livro"
            className="p-2 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-base">
          {activeTab === 'info' ? (
            /* ABA 1: VISÃO GERAL DO LIVRO */
            <div id="panel-info" role="tabpanel" aria-labelledby="tab-info" className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              {/* Coluna da Capa */}
              <div className="sm:col-span-4 flex justify-center">
                <div className="w-44 sm:w-full max-w-[210px] shadow-lg rounded-lg overflow-hidden">
                  <BookCover
                    coverUrl={book.coverUrl}
                    title={book.title}
                    author={book.author}
                    aspectRatio="3:4"
                  />
                </div>
              </div>

              {/* Coluna de Informações */}
              <div className="sm:col-span-8 flex flex-col justify-between">
                <div>
                  <h2 id="book-modal-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#24201C] dark:text-[#F1F5F9] leading-snug">
                    {book.title}
                  </h2>

                  <div className="flex items-center gap-2 mt-2.5 text-base sm:text-lg text-[#5A544C] dark:text-[#9CB2D1]">
                    <User className="w-4.5 h-4.5 text-[#7E776E] dark:text-[#6F86A8]" aria-hidden="true" />
                    <span>
                      {book.author ? (
                        <span className="font-semibold text-[#24201C] dark:text-[#F1F5F9]">
                          <span className="sr-only">Autor: </span>{book.author}
                        </span>
                      ) : (
                        <span className="italic text-[#7E776E] dark:text-[#6F86A8]">Autor não especificado</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm text-[#7E776E] dark:text-[#6F86A8]">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <span>
                      Adicionado em{' '}
                      {new Date(book.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Seletor Rápido de Status */}
                  <fieldset className="mt-5 p-4 bg-[#F6F4EE] dark:bg-[#182544] rounded-xl border border-[#E2DDD1] dark:border-[#253963]">
                    <legend className="text-sm font-semibold text-[#24201C] dark:text-[#F1F5F9] mb-2.5 font-sans">
                      Alterar status de leitura:
                    </legend>
                    <div role="radiogroup" aria-label="Selecione o novo status de leitura" className="grid grid-cols-3 gap-2.5">
                      {(['nao_iniciado', 'lendo', 'lido'] as BookStatus[]).map(
                        (statusKey) => {
                          const isSelected = book.status === statusKey;
                          const config = STATUS_CONFIG[statusKey];
                          return (
                            <button
                              key={statusKey}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              onClick={() => onStatusChange(book.id, statusKey)}
                              className={`px-3 py-2 rounded-xl text-sm font-sans transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                                isSelected
                                  ? 'bg-white dark:bg-[#203158] text-[#24201C] dark:text-[#F1F5F9] border border-[#E2DDD1] dark:border-[#38BDF8] shadow-2xs font-semibold ring-1 ring-[#1E293B] dark:ring-[#38BDF8]'
                                  : 'bg-transparent text-[#5A544C] dark:text-[#9CB2D1] border-transparent hover:bg-white/50 dark:hover:bg-[#1E2E4F] hover:text-[#24201C] dark:hover:text-[#F1F5F9]'
                              }`}
                            >
                              <span className="flex items-center justify-center gap-1.5">
                                <span
                                  className={`w-2 h-2 rounded-full ${config.dotColor}`}
                                  aria-hidden="true"
                                />
                                <span className="truncate">{config.label}</span>
                              </span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </fieldset>

                  {/* Sinopse / Descrição com leitura confortável */}
                  <div className="mt-5">
                    <h3 className="font-sans text-xs sm:text-sm font-bold text-[#7E776E] dark:text-[#9CB2D1] uppercase tracking-wider mb-2">
                      Sinopse da Obra
                    </h3>
                    {book.description ? (
                      <p className="font-sans text-base sm:text-lg text-[#3A352F] dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line font-normal">
                        {book.description}
                      </p>
                    ) : (
                      <p className="font-sans text-base text-[#7E776E] dark:text-[#6F86A8] italic">
                        Nenhuma descrição cadastrada para este livro.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ABA 2: ANOTAÇÕES PESSOAIS */
            <div id="panel-notes" role="tabpanel" aria-labelledby="tab-notes" className="space-y-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#24201C] dark:text-[#F1F5F9] mb-1">
                  Suas anotações sobre "{book.title}"
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] leading-relaxed">
                  Espaço pessoal para registrar pensamentos, trechos marcantes ou reflexões durante a leitura.
                </p>
              </div>

              {/* Formulário para Nova Anotação */}
              <form onSubmit={handleSaveNewNote} className="space-y-3">
                <label htmlFor="new-book-note-input" className="sr-only">
                  Escrever nova anotação sobre o livro
                </label>
                <textarea
                  id="new-book-note-input"
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Escreva uma reflexão, quote favorito ou resumo do capítulo..."
                  className="w-full px-4 py-3 text-base font-sans rounded-xl border border-[#E2DDD1] dark:border-[#223459] bg-[#F6F4EE]/60 dark:bg-[#0B1326] text-[#24201C] dark:text-[#F1F5F9] placeholder-[#7E776E] dark:placeholder-[#6F86A8] focus:outline-none focus:ring-2 focus:ring-[#C06338]/20 dark:focus:ring-[#38BDF8]/20 focus:border-[#C06338] dark:focus:border-[#38BDF8] transition-colors resize-y leading-relaxed"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNoteContent.trim() || isSubmittingNote}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] disabled:opacity-40 text-[#F7F5F0] dark:bg-[#F1F5F9] dark:text-[#0B1326] dark:hover:bg-white text-sm font-semibold rounded-xl shadow-2xs transition-all cursor-pointer font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Adicionar anotação</span>
                  </button>
                </div>
              </form>

              {/* Lista de Anotações Existentes */}
              <div className="space-y-4 pt-2">
                {book.notes && book.notes.length > 0 ? (
                  book.notes.map((note) => {
                    const isEditing = editingNoteId === note.id;
                    return (
                      <div
                        key={note.id}
                        className="p-5 rounded-2xl border border-[#E2DDD1] dark:border-[#223459] bg-[#F6F4EE]/40 dark:bg-[#182544] shadow-2xs space-y-2.5"
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <label htmlFor={`edit-note-${note.id}`} className="sr-only">
                              Editar anotação
                            </label>
                            <textarea
                              id={`edit-note-${note.id}`}
                              rows={3}
                              value={editingNoteText}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                              className="w-full px-4 py-2.5 text-base font-sans rounded-xl border border-[#E2DDD1] dark:border-[#2F477A] bg-white dark:bg-[#0B1326] text-[#24201C] dark:text-[#F1F5F9] focus:outline-none leading-relaxed"
                            />
                            <div className="flex justify-end gap-2.5 font-sans">
                              <button
                                type="button"
                                onClick={() => setEditingNoteId(null)}
                                className="px-3.5 py-1.5 text-sm text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] rounded-lg cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditNote(note.id)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E293B] text-white dark:bg-[#F1F5F9] dark:text-[#0B1326] rounded-xl text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338]"
                              >
                                <Check className="w-4 h-4" aria-hidden="true" />
                                <span>Salvar anotação</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#7E776E] dark:text-[#6F86A8] font-mono">
                                <Quote className="w-3.5 h-3.5 text-[#C06338] dark:text-[#E07A48]" aria-hidden="true" />
                                <span>
                                  {new Date(note.createdAt).toLocaleDateString('pt-BR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditNote(note)}
                                  aria-label="Editar anotação"
                                  className="p-1.5 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338]"
                                >
                                  <Edit3 className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteNote(book.id, note.id)}
                                  aria-label="Excluir anotação"
                                  className="p-1.5 text-[#7E776E] hover:text-rose-600 dark:text-[#9CB2D1] dark:hover:text-rose-400 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                                >
                                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                            <p className="font-sans text-base text-[#24201C] dark:text-[#F1F5F9] whitespace-pre-line leading-relaxed">
                              {note.content}
                            </p>
                          </>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 px-4 border border-dashed border-[#E2DDD1] dark:border-[#223459] rounded-2xl">
                    <MessageSquare className="w-10 h-10 text-[#7E776E] dark:text-[#6F86A8] mx-auto mb-2.5 opacity-60" aria-hidden="true" />
                    <p className="font-sans text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1]">
                      Nenhuma anotação registrada ainda para este livro.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com botões de Ação */}
        <div className="px-6 py-4 bg-[#F6F4EE]/80 dark:bg-[#0B1326]/70 border-t border-[#E2DDD1] dark:border-[#223459] flex flex-wrap items-center justify-between gap-3 font-sans">
          <button
            type="button"
            onClick={() => {
              onClose();
              onDeleteRequest(book);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-4 py-2.5 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            <span>Excluir livro</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onAdvanceStatus(book.id);
              }}
              aria-label={`Mudar status para: ${nextConfig.label}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#EDE9E0] hover:bg-[#E2DDD1] dark:bg-[#182544] dark:hover:bg-[#203158] border border-[#E2DDD1] dark:border-[#263C66] text-[#24201C] dark:text-[#F1F5F9] text-sm font-semibold rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <span>{currentStatusConfig.nextActionLabel}</span>
              <ArrowRight className="w-4 h-4 text-[#7E776E] dark:text-[#9CB2D1]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(book);
              }}
              aria-label={`Editar dados de "${book.title}"`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-white dark:bg-[#F1F5F9] dark:text-[#0B1326] dark:hover:bg-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
              <span>Editar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
