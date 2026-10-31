import React from 'react';
import { Book, STATUS_CONFIG, ViewMode } from '../types/book';
import { BookCover } from './BookCover';
import { ArrowRight, Edit3, Trash2, BookOpen, MessageSquare } from 'lucide-react';

interface BookCardProps {
  book: Book;
  viewMode?: ViewMode;
  onOpenDetails: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDeleteRequest: (book: Book) => void;
  onAdvanceStatus: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  viewMode = 'grid',
  onOpenDetails,
  onEdit,
  onDeleteRequest,
  onAdvanceStatus,
}) => {
  const statusInfo = STATUS_CONFIG[book.status];
  const nextConfig = STATUS_CONFIG[statusInfo.nextStatus];
  const notesCount = book.notes?.length || 0;
  const titleId = `book-title-${book.id}`;

  // VISUALIZAÇÃO EM LISTA EDITORIAL COMPACTA
  if (viewMode === 'list') {
    return (
      <article
        aria-labelledby={titleId}
        className="group bg-white dark:bg-[#121C35] rounded-xl border border-[#E2DDD1] dark:border-[#223459] p-3.5 sm:p-4 shadow-2xs hover:shadow-sm hover:border-[#CCC5B7] dark:hover:border-[#2F477A] transition-all flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div
            onClick={() => onOpenDetails(book)}
            className="w-12 sm:w-14 shrink-0 cursor-pointer shadow-xs rounded-sm overflow-hidden"
            aria-hidden="true"
          >
            <BookCover
              coverUrl={book.coverUrl}
              title={book.title}
              author={book.author}
              aspectRatio="3:4"
              showShadow={false}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 text-sm">
              <span
                className={`w-2.5 h-2.5 rounded-full ${statusInfo.dotColor} shrink-0`}
                aria-hidden="true"
              />
              <span className={`font-semibold ${statusInfo.badgeText}`}>
                <span className="sr-only">Status: </span>
                {statusInfo.label}
              </span>
              {notesCount > 0 && (
                <>
                  <span className="text-[#CCC5B7] dark:text-[#2D4166]" aria-hidden="true">·</span>
                  <span className="text-xs sm:text-sm text-[#7E776E] dark:text-[#9CB2D1] flex items-center gap-1 font-sans">
                    <MessageSquare className="w-3.5 h-3.5 text-[#C06338] dark:text-[#E07A48]" aria-hidden="true" />
                    <span>{notesCount} {notesCount === 1 ? 'anotação' : 'anotações'}</span>
                  </span>
                </>
              )}
            </div>

            <h3
              id={titleId}
              onClick={() => onOpenDetails(book)}
              className="font-serif text-lg sm:text-xl font-bold text-[#24201C] dark:text-[#F1F5F9] truncate cursor-pointer hover:text-[#C06338] dark:hover:text-[#38BDF8] transition-colors leading-snug"
            >
              {book.title}
            </h3>

            <p className="font-sans text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] truncate mt-1">
              {book.author ? `por ${book.author}` : 'Autor não especificado'}
            </p>
          </div>
        </div>

        {/* Ações da Linha */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onAdvanceStatus(book.id)}
            aria-label={`Avançar status de "${book.title}". Mudar para ${nextConfig.label}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#24201C] dark:text-[#F1F5F9] hover:bg-[#EAE4D8] dark:hover:bg-[#1B294A] bg-[#EDE9E0] dark:bg-[#182544] px-3 py-2 rounded-xl transition-colors cursor-pointer border border-[#E2DDD1] dark:border-[#263C66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
          >
            <span>{statusInfo.nextActionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#7E776E] dark:text-[#9CB2D1]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onOpenDetails(book)}
            aria-label={`Ver detalhes e anotações do livro "${book.title}"`}
            className="p-2 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
          >
            <BookOpen className="w-4.5 h-4.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(book)}
            aria-label={`Editar informações do livro "${book.title}"`}
            className="p-2 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
          >
            <Edit3 className="w-4.5 h-4.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => onDeleteRequest(book)}
            aria-label={`Excluir livro "${book.title}" da estante`}
            className="p-2 text-[#7E776E] hover:text-rose-600 dark:text-[#9CB2D1] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Trash2 className="w-4.5 h-4.5" aria-hidden="true" />
          </button>
        </div>
      </article>
    );
  }

  // VISUALIZAÇÃO PADRÃO EM GRADE COM CAPA EM DESTAQUE
  return (
    <article
      aria-labelledby={titleId}
      className="group bg-white dark:bg-[#121C35] rounded-2xl border border-[#E2DDD1] dark:border-[#223459] shadow-xs hover:shadow-md hover:border-[#CCC5B7] dark:hover:border-[#2F477A] transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Topo / Área da Capa com fundo acolhedor */}
      <div
        onClick={() => onOpenDetails(book)}
        className="cursor-pointer p-4 pb-2 bg-[#F6F4EE]/60 dark:bg-[#0B1326]/60 flex justify-center group-hover:bg-[#EFECE4]/60 dark:group-hover:bg-[#16223F]/60 transition-colors"
        aria-hidden="true"
      >
        <div className="w-36 sm:w-44 transition-transform duration-200 group-hover:-translate-y-1">
          <BookCover
            coverUrl={book.coverUrl}
            title={book.title}
            author={book.author}
            aspectRatio="3:4"
          />
        </div>
      </div>

      {/* Conteúdo / Detalhes do Livro */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status de leitura */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`w-2.5 h-2.5 rounded-full ${statusInfo.dotColor} shrink-0`}
                aria-hidden="true"
              />
              <span className={`font-semibold ${statusInfo.badgeText}`}>
                <span className="sr-only">Status: </span>
                {statusInfo.label}
              </span>
            </div>

            {/* Ação rápida para avançar status */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAdvanceStatus(book.id);
              }}
              aria-label={`Mudar status de "${book.title}" para ${nextConfig.label}`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5A544C] dark:text-[#9CB2D1] hover:text-[#24201C] dark:hover:text-[#F1F5F9] bg-[#EDE9E0] dark:bg-[#182544] hover:bg-[#E2DDD1] dark:hover:bg-[#203158] px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-[#E2DDD1] dark:border-[#263C66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <span>{statusInfo.nextActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7E776E] dark:text-[#9CB2D1]" aria-hidden="true" />
            </button>
          </div>

          {/* Título do Livro em Lora */}
          <h3
            id={titleId}
            onClick={() => onOpenDetails(book)}
            className="font-serif text-lg sm:text-xl font-bold text-[#24201C] dark:text-[#F1F5F9] leading-snug line-clamp-2 hover:text-[#C06338] dark:hover:text-[#38BDF8] cursor-pointer transition-colors"
          >
            {book.title}
          </h3>

          {/* Nome do Autor em DM Sans */}
          <p className="font-sans text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] mt-1 line-clamp-1">
            {book.author ? (
              <span>por <strong className="font-medium text-[#24201C] dark:text-[#E2E8F0]">{book.author}</strong></span>
            ) : (
              <span className="italic text-[#7E776E] dark:text-[#6F86A8]">Autor não especificado</span>
            )}
          </p>

          {/* Descrição resumida com altura de linha 1.55 confortável */}
          {book.description && (
            <p className="font-sans text-sm sm:text-base text-[#5A544C] dark:text-[#CBD5E1] mt-3 line-clamp-3 leading-relaxed font-normal">
              {book.description}
            </p>
          )}
        </div>

        {/* Rodapé do card */}
        <div className="pt-4 mt-4 border-t border-[#EDE9E0] dark:border-[#1E2E4F] flex items-center justify-between text-sm sm:text-base text-[#7E776E] dark:text-[#9CB2D1]">
          <button
            type="button"
            onClick={() => onOpenDetails(book)}
            aria-label={`Ver detalhes e anotações do livro "${book.title}"`}
            className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold text-[#5A544C] dark:text-[#9CB2D1] hover:text-[#24201C] dark:hover:text-[#F1F5F9] hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] rounded-md px-1 py-0.5"
          >
            <BookOpen className="w-4 h-4 text-[#7E776E] dark:text-[#6F86A8]" aria-hidden="true" />
            <span>Ver detalhes</span>
            {notesCount > 0 && (
              <span className="ml-1 text-xs font-mono font-semibold text-[#C06338] dark:text-[#E07A48]">
                ({notesCount})
              </span>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(book);
              }}
              aria-label={`Editar informações do livro "${book.title}"`}
              className="p-2 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteRequest(book);
              }}
              aria-label={`Excluir livro "${book.title}" da estante`}
              className="p-2 text-[#7E776E] hover:text-rose-600 dark:text-[#9CB2D1] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
