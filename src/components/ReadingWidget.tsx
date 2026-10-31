import React from 'react';
import { Book, STATUS_CONFIG } from '../types/book';
import { BookCover } from './BookCover';
import { Bookmark, Clock, BookOpen, CheckCircle2 } from 'lucide-react';

interface ReadingWidgetProps {
  currentReadingBook?: Book;
  totalBooks: number;
  readCount: number;
  pendingCount: number;
  recentBooks: Book[];
  onOpenBook: (book: Book) => void;
  onAdvanceStatus: (bookId: string) => void;
}

export const ReadingWidget: React.FC<ReadingWidgetProps> = ({
  currentReadingBook,
  totalBooks,
  readCount,
  pendingCount,
  recentBooks,
  onOpenBook,
  onAdvanceStatus,
}) => {
  if (totalBooks === 0) return null;

  return (
    <section
      role="region"
      aria-labelledby="reading-widget-heading"
      className="mb-8 p-4 sm:p-5 bg-[#EDE9E0]/70 dark:bg-[#121C35]/90 rounded-2xl border border-[#E2DDD1] dark:border-[#223459] shadow-2xs transition-colors"
    >
      <div className="flex items-center justify-between mb-3 text-xs sm:text-sm text-[#5A544C] dark:text-[#9CB2D1]">
        <div className="flex items-center gap-2 font-medium">
          <Bookmark className="w-4 h-4 text-[#C06338] dark:text-[#E07A48]" aria-hidden="true" />
          <h2
            id="reading-widget-heading"
            className="text-[#24201C] dark:text-[#F1F5F9] uppercase tracking-wider text-xs sm:text-sm font-bold font-sans"
          >
            Painel Rápido de Leitura
          </h2>
        </div>
        <span className="text-xs sm:text-sm tabular-nums font-sans">
          <strong className="text-[#24201C] dark:text-[#F1F5F9]">{totalBooks}</strong> no total ·{' '}
          <strong className="text-[#24201C] dark:text-[#F1F5F9]">{readCount}</strong> lidos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Bloco 1: Livro em Andamento Atual */}
        <div className="md:col-span-7 bg-white dark:bg-[#182544] p-4 rounded-xl border border-[#E2DDD1] dark:border-[#253963] shadow-2xs">
          {currentReadingBook ? (
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onOpenBook(currentReadingBook)}
                aria-label={`Abrir detalhes do livro em leitura: ${currentReadingBook.title}`}
                className="w-16 sm:w-20 shrink-0 cursor-pointer shadow-xs rounded-sm overflow-hidden text-left focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
              >
                <BookCover
                  coverUrl={currentReadingBook.coverUrl}
                  title={currentReadingBook.title}
                  author={currentReadingBook.author}
                  aspectRatio="3:4"
                  showShadow={false}
                />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#1E4E7A] dark:text-[#7DD3FC] font-semibold mb-1 font-sans">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Lendo no momento</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#24201C] dark:text-[#F1F5F9] truncate leading-snug">
                  <button
                    type="button"
                    onClick={() => onOpenBook(currentReadingBook)}
                    className="text-left truncate hover:text-[#C06338] dark:hover:text-[#38BDF8] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] rounded-xs"
                    aria-label={`Ver detalhes e anotações de: ${currentReadingBook.title}`}
                  >
                    {currentReadingBook.title}
                  </button>
                </h3>
                <p className="font-sans text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] truncate mt-0.5">
                  {currentReadingBook.author || 'Autor não especificado'}
                </p>

                <div className="flex flex-wrap items-center gap-2.5 mt-2.5 font-sans">
                  <button
                    type="button"
                    onClick={() => onAdvanceStatus(currentReadingBook.id)}
                    aria-label={`Concluir leitura do livro: ${currentReadingBook.title}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1B613A] dark:text-[#6EE7B7] bg-[#EEF7F1] dark:bg-[#132A26] hover:bg-[#E0F2E7] dark:hover:bg-[#1A3833] border border-[#C3E4CD] dark:border-[#215647] px-3 py-1.5 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#1B613A]"
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>Concluir leitura</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenBook(currentReadingBook)}
                    aria-label={`Ver anotações pessoais de: ${currentReadingBook.title}`}
                    className="text-xs sm:text-sm font-medium text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:underline cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C06338] rounded-xs px-1.5 py-1"
                  >
                    Ver anotações
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-3 px-3 text-center sm:text-left flex items-center gap-3.5 text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1]">
              <BookOpen className="w-6 h-6 text-[#7E776E] dark:text-[#6F86A8] shrink-0" aria-hidden="true" />
              <div>
                <span className="font-semibold text-[#24201C] dark:text-[#F1F5F9] block">
                  Nenhum livro em andamento no momento
                </span>
                <span className="text-xs sm:text-sm text-[#7E776E] dark:text-[#9CB2D1] mt-0.5 block">
                  {pendingCount > 0
                    ? `Você tem ${pendingCount} livro(s) aguardando leitura na fila.`
                    : 'Que tal iniciar uma nova leitura hoje?'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bloco 2: Livros Adicionados Recentemente */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#5A544C] dark:text-[#9CB2D1] mb-2 px-0.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider font-sans">
              Recentes na estante
            </span>
          </div>

          <div
            className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none"
            role="group"
            aria-label="Livros adicionados recentemente"
          >
            {recentBooks.slice(0, 3).map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => onOpenBook(book)}
                aria-label={`Ver livro recente: ${book.title}, status: ${STATUS_CONFIG[book.status].label}`}
                className="w-14 sm:w-16 shrink-0 cursor-pointer hover:opacity-85 transition-opacity rounded-xs focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
              >
                <BookCover
                  coverUrl={book.coverUrl}
                  title={book.title}
                  author={book.author}
                  aspectRatio="3:4"
                  showShadow={false}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
