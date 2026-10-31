import React from 'react';
import { Plus, BookMarked, Search, X, Settings } from 'lucide-react';
import { ReadksLogo } from './ReadksLogo';

interface HeaderProps {
  totalBooks: number;
  readBooks: number;
  readingBooks: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewBookModal: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalBooks,
  readBooks,
  readingBooks,
  searchQuery,
  onSearchChange,
  onOpenNewBookModal,
  onOpenSettings,
}) => {
  return (
    <header
      role="banner"
      className="sticky top-0 z-30 bg-[#F6F4EE]/90 dark:bg-[#0B1326]/90 backdrop-blur-md border-b border-[#E2DDD1] dark:border-[#223459] transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5">
          {/* Marca / Logo Oficial Readks */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a
                href="#main-content"
                aria-label="Readks — Página inicial da estante de leitura"
                className="flex items-center gap-2 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
              >
                <ReadksLogo size="md" />
              </a>
              <span className="text-sm text-[#7E776E] dark:text-[#6F86A8] hidden md:inline font-sans font-normal leading-none" aria-hidden="true">
                Sua estante de leituras
              </span>
            </div>

            {/* Ações em Mobile: Botão Novo Livro + Engrenagem */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={onOpenSettings}
                aria-label="Abrir menu de configurações e preferências"
                className="p-2.5 text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#16223F] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onOpenNewBookModal}
                aria-label="Cadastrar novo livro na estante"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E293B] text-[#F7F5F0] dark:bg-[#F1F5F9] dark:text-[#0B1326] hover:bg-[#0F172A] dark:hover:bg-white active:scale-[0.98] text-sm font-semibold rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Novo</span>
              </button>
            </div>
          </div>

          {/* Barra de Ações: Busca, Métricas e Botão de Configurações */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Campo de Busca Rápida com Label Acessível */}
            <div className="relative flex-1 sm:w-64">
              <label htmlFor="header-search-input" className="sr-only">
                Buscar livros por título ou autor
              </label>
              <Search
                className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E776E] dark:text-[#6F86A8] pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="header-search-input"
                type="search"
                placeholder="Buscar por título ou autor..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-[#121C35] text-[#24201C] dark:text-[#F1F5F9] placeholder-[#7E776E] dark:placeholder-[#6F86A8] text-sm sm:text-base rounded-xl border border-[#E2DDD1] dark:border-[#223459] focus:outline-none focus:ring-2 focus:ring-[#C06338]/30 dark:focus:ring-[#38BDF8]/30 focus:border-[#C06338] dark:focus:border-[#38BDF8] transition-colors shadow-2xs focus-visible:ring-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Limpar campo de busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E776E] hover:text-[#24201C] dark:text-[#6F86A8] dark:hover:text-[#F1F5F9] p-1 cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Contador resumido em Desktop com Anúncio Semântico */}
            <div
              className="hidden lg:flex items-center gap-2.5 text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] px-3.5 py-2.5 bg-[#EDE9E0]/80 dark:bg-[#16223F]/80 rounded-xl border border-[#E2DDD1] dark:border-[#223459] whitespace-nowrap"
              role="status"
              aria-label={`Biblioteca com ${totalBooks} livros no total, sendo ${readBooks} concluídos e ${readingBooks} em andamento`}
            >
              <BookMarked className="w-4 h-4 text-[#7E776E] dark:text-[#6F86A8]" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-[#24201C] dark:text-[#F1F5F9] tabular-nums">
                  {totalBooks}
                </strong>{' '}
                {totalBooks === 1 ? 'livro' : 'livros'}
              </span>
              {totalBooks > 0 && (
                <>
                  <span className="text-[#CCC5B7] dark:text-[#2D4166]" aria-hidden="true">·</span>
                  <span className="text-[#5A544C] dark:text-[#9CB2D1]">
                    <strong className="font-semibold text-[#24201C] dark:text-[#F1F5F9] tabular-nums">
                      {readBooks}
                    </strong>{' '}
                    lidos
                  </span>
                  {readingBooks > 0 && (
                    <>
                      <span className="text-[#CCC5B7] dark:text-[#2D4166]" aria-hidden="true">·</span>
                      <span className="text-[#5A544C] dark:text-[#9CB2D1]">
                        <strong className="font-semibold text-[#24201C] dark:text-[#F1F5F9] tabular-nums">
                          {readingBooks}
                        </strong>{' '}
                        lendo
                      </span>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Botão Configurações Desktop */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Abrir menu de configurações e preferências"
              title="Configurações e preferências"
              className="hidden sm:inline-flex items-center justify-center p-2.5 rounded-xl text-[#5A544C] dark:text-[#9CB2D1] hover:text-[#24201C] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#16223F] border border-[#E2DDD1] dark:border-[#223459] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Botão Novo Livro Desktop */}
            <button
              type="button"
              onClick={onOpenNewBookModal}
              aria-label="Cadastrar novo livro na estante"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-[#F7F5F0] dark:bg-[#F1F5F9] dark:text-[#0B1326] dark:hover:bg-white active:scale-[0.98] text-sm sm:text-base font-semibold rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Adicionar livro</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
