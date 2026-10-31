import React from 'react';
import { BookOpen, Plus, SearchX, Upload } from 'lucide-react';
import { FilterStatus } from '../types/book';

interface EmptyStateProps {
  isSearchOrFiltered: boolean;
  filter: FilterStatus;
  searchQuery: string;
  onClearFilters: () => void;
  onAddNewBook: () => void;
  onImportBackup?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isSearchOrFiltered,
  filter,
  searchQuery,
  onClearFilters,
  onAddNewBook,
  onImportBackup,
}) => {
  if (isSearchOrFiltered) {
    return (
      <div className="py-16 px-4 text-center max-w-lg mx-auto font-sans" role="status">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#EDE9E0] dark:bg-[#182544] flex items-center justify-center text-[#7E776E] dark:text-[#9CB2D1] mb-5 border border-[#E2DDD1] dark:border-[#223459]">
          <SearchX className="w-7 h-7" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#24201C] dark:text-[#F1F5F9] mb-2">
          Nenhum livro encontrado
        </h2>
        <p className="text-base sm:text-lg text-[#5A544C] dark:text-[#9CB2D1] mb-6 leading-relaxed">
          {searchQuery ? (
            <>
              Não localizamos livros com o termo{' '}
              <strong className="text-[#24201C] dark:text-[#F1F5F9]">"{searchQuery}"</strong>
              {filter !== 'todos' ? ' nesta categoria' : ''}.
            </>
          ) : (
            'Você não tem nenhum livro cadastrado com este status de leitura no momento.'
          )}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2.5 text-sm sm:text-base font-medium text-[#24201C] dark:text-[#F1F5F9] bg-[#EDE9E0] dark:bg-[#182544] hover:bg-[#E2DDD1] dark:hover:bg-[#203158] border border-[#E2DDD1] dark:border-[#263C66] rounded-xl transition-colors cursor-pointer"
          >
            Ver todos os livros
          </button>
          <button
            type="button"
            onClick={onAddNewBook}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm sm:text-base font-semibold text-[#F7F5F0] dark:text-[#0B1326] bg-[#1E293B] hover:bg-[#0F172A] dark:bg-[#F1F5F9] dark:hover:bg-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Adicionar novo</span>
          </button>
        </div>
      </div>
    );
  }

  // Estante completamente limpa e sem dados de mockup
  return (
    <div className="py-16 sm:py-20 px-6 sm:px-10 text-center max-w-xl mx-auto bg-white dark:bg-[#121C35] rounded-3xl border border-[#E2DDD1] dark:border-[#223459] shadow-2xs my-6 font-sans transition-colors">
      <div className="w-18 h-18 mx-auto rounded-2xl bg-[#EDE9E0] dark:bg-[#182544] flex items-center justify-center text-[#C06338] dark:text-[#E07A48] mb-6 border border-[#E2DDD1] dark:border-[#223459]">
        <BookOpen className="w-9 h-9" aria-hidden="true" />
      </div>
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24201C] dark:text-[#F1F5F9] mb-3">
        Sua estante está pronta
      </h2>
      <p className="text-base sm:text-lg text-[#5A544C] dark:text-[#CBD5E1] mb-8 max-w-md mx-auto leading-relaxed">
        O Readks foi criado para acompanhar suas leituras no seu próprio ritmo, sem métricas forçadas ou redes sociais. Comece adicionando o livro que você está lendo ou planeja ler.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <button
          type="button"
          onClick={onAddNewBook}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1E293B] text-[#F7F5F0] dark:bg-[#F1F5F9] dark:text-[#0B1326] hover:bg-[#0F172A] dark:hover:bg-white rounded-xl text-sm sm:text-base font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Cadastrar primeiro livro</span>
        </button>

        {onImportBackup && (
          <button
            type="button"
            onClick={onImportBackup}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-[#24201C] dark:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-xl text-sm sm:text-base font-medium transition-colors border border-[#E2DDD1] dark:border-[#263C66] cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#7E776E] dark:text-[#9CB2D1]" aria-hidden="true" />
            <span>Restaurar de backup</span>
          </button>
        )}
      </div>
    </div>
  );
};
