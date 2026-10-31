import React from 'react';
import { FilterStatus, BookStatus } from '../types/book';

interface StatusFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  counts: {
    todos: number;
    nao_iniciado: number;
    lendo: number;
    lido: number;
  };
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const tabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'todos', label: 'Todos os livros', count: counts.todos },
    { id: 'nao_iniciado' as BookStatus, label: 'Não iniciados', count: counts.nao_iniciado },
    { id: 'lendo' as BookStatus, label: 'Em andamento', count: counts.lendo },
    { id: 'lido' as BookStatus, label: 'Lidos', count: counts.lido },
  ];

  return (
    <nav aria-label="Filtrar livros por status de leitura" className="w-full overflow-x-auto pb-1 scrollbar-none">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className="inline-flex items-center gap-1.5 p-1 bg-[#EDE9E0] dark:bg-[#121C35] rounded-xl border border-[#E2DDD1] dark:border-[#223459] min-w-max transition-colors"
      >
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`status-tab-${tab.id}`}
              aria-selected={isActive}
              aria-label={`${tab.label}, total de ${tab.count} ${tab.count === 1 ? 'livro' : 'livros'}`}
              onClick={() => onFilterChange(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm sm:text-base font-sans font-medium transition-all cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                isActive
                  ? 'bg-white dark:bg-[#182544] text-[#24201C] dark:text-[#F1F5F9] shadow-2xs font-semibold border border-[#E2DDD1]/80 dark:border-[#2E4472]'
                  : 'text-[#5A544C] dark:text-[#9CB2D1] hover:text-[#24201C] dark:hover:text-[#F1F5F9] hover:bg-white/50 dark:hover:bg-[#182544]/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs sm:text-sm tabular-nums font-mono px-2 py-0.5 rounded-md ${
                  isActive
                    ? 'bg-[#F6F4EE] dark:bg-[#1E2E4F] text-[#24201C] dark:text-[#F1F5F9]'
                    : 'text-[#7E776E] dark:text-[#6F86A8]'
                }`}
                aria-hidden="true"
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
