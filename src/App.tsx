/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Book,
  BookFormData,
  BookStatus,
  FilterStatus,
  UserSettings,
  STATUS_CONFIG,
} from './types/book';
import {
  getBooks,
  createBook,
  updateBook,
  updateBookStatus,
  advanceBookStatus,
  deleteBook,
  addBookNote,
  updateBookNote,
  deleteBookNote,
  clearLibrary,
  exportLibraryJSON,
  importLibraryJSON,
} from './services/bookStorage';
import {
  getSettings,
  saveSettings,
  resetSettings,
  applySettingsToDOM,
} from './services/settingsStorage';

import { Header } from './components/Header';
import { StatusFilter } from './components/StatusFilter';
import { BookCard } from './components/BookCard';
import { BookModal } from './components/BookModal';
import { BookFormModal } from './components/BookFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SettingsModal } from './components/SettingsModal';
import { ReadingWidget } from './components/ReadingWidget';
import { EmptyState } from './components/EmptyState';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Toast, ToastMessage } from './components/Toast';
import { ReadksLogo } from './components/ReadksLogo';
import { Plus, LayoutGrid, List } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Configurações do Usuário
  const [settings, setSettings] = useState<UserSettings>(() => getSettings());

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast & Anúncios de acessibilidade para leitor de tela
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  const announce = useCallback((message: string) => {
    setLiveAnnouncement(message);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setToast({
      id: Math.random().toString(),
      message,
      type,
    });
    setLiveAnnouncement(message);
  }, []);

  // Inicializa e aplica configurações de tema e acessibilidade
  useEffect(() => {
    applySettingsToDOM(settings);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (settings.theme === 'auto') {
        applySettingsToDOM(settings);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [settings]);

  // Carrega os livros do IndexedDB
  const reloadBooks = useCallback(async () => {
    try {
      const loadedBooks = await getBooks();
      setBooks(loadedBooks);
    } catch (e) {
      console.error('Erro ao carregar livros:', e);
      showToast('Falha ao carregar a biblioteca local.', 'info');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    reloadBooks();
  }, [reloadBooks]);

  // Contadores por status
  const counts = useMemo(() => {
    const stats = {
      todos: books.length,
      nao_iniciado: 0,
      lendo: 0,
      lido: 0,
    };

    books.forEach((b) => {
      if (b.status in stats) {
        stats[b.status as BookStatus]++;
      }
    });

    return stats;
  }, [books]);

  // Livro atualmente em leitura para o Widget
  const currentReadingBook = useMemo(() => {
    return books.find((b) => b.status === 'lendo');
  }, [books]);

  // Livros ordenados e filtrados
  const filteredAndSortedBooks = useMemo(() => {
    const result = books.filter((book) => {
      if (currentFilter !== 'todos' && book.status !== currentFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author?.toLowerCase().includes(query) ?? false;
        return matchesTitle || matchesAuthor;
      }
      return true;
    });

    return result.sort((a, b) => {
      switch (settings.sortBy) {
        case 'recent':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'title':
          return a.title.localeCompare(b.title, 'pt-BR');
        case 'author':
          return (a.author || '').localeCompare(b.author || '', 'pt-BR');
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }, [books, currentFilter, searchQuery, settings.sortBy]);

  // Ações CRUD Livros
  const handleOpenNewBook = () => {
    setEditingBook(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditBook = (book: Book) => {
    setEditingBook(book);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData: BookFormData) => {
    try {
      if (editingBook) {
        const updated = await updateBook(editingBook.id, formData);
        if (updated) {
          await reloadBooks();
          if (selectedBookForDetails?.id === updated.id) {
            setSelectedBookForDetails(updated);
          }
          showToast(`"${updated.title}" atualizado com sucesso!`);
        }
      } else {
        const created = await createBook(formData);
        await reloadBooks();
        showToast(`"${created.title}" foi adicionado à sua estante!`);
      }
    } catch (e) {
      console.error(e);
      showToast('Ocorreu um erro ao salvar o livro.', 'info');
    }
    setIsFormModalOpen(false);
    setEditingBook(null);
  };

  const handleDeleteRequest = (book: Book) => {
    setBookToDelete(book);
  };

  const handleConfirmDelete = async (bookId: string) => {
    const book = books.find((b) => b.id === bookId);
    const success = await deleteBook(bookId);
    if (success) {
      await reloadBooks();
      if (selectedBookForDetails?.id === bookId) {
        setSelectedBookForDetails(null);
      }
      showToast(
        book ? `"${book.title}" foi removido da estante.` : 'Livro removido.',
        'info'
      );
    }
    setBookToDelete(null);
  };

  const handleAdvanceStatus = async (bookId: string) => {
    const updated = await advanceBookStatus(bookId);
    if (updated) {
      await reloadBooks();
      if (selectedBookForDetails?.id === bookId) {
        setSelectedBookForDetails(updated);
      }
      const label = STATUS_CONFIG[updated.status].label;
      showToast(`Status atualizado para "${label}"`);
    }
  };

  const handleSetSpecificStatus = async (bookId: string, status: BookStatus) => {
    const updated = await updateBookStatus(bookId, status);
    if (updated) {
      await reloadBooks();
      if (selectedBookForDetails?.id === bookId) {
        setSelectedBookForDetails(updated);
      }
      const label = STATUS_CONFIG[status].label;
      showToast(`Status definido como "${label}"`);
    }
  };

  // Anotações Pessoais
  const handleAddNote = async (bookId: string, content: string) => {
    const result = await addBookNote(bookId, content);
    if (result) {
      await reloadBooks();
      setSelectedBookForDetails(result.book);
      showToast('Anotação adicionada à obra!');
    }
  };

  const handleUpdateNote = async (bookId: string, noteId: string, content: string) => {
    const updated = await updateBookNote(bookId, noteId, content);
    if (updated) {
      await reloadBooks();
      setSelectedBookForDetails(updated);
      showToast('Anotação atualizada!');
    }
  };

  const handleDeleteNote = async (bookId: string, noteId: string) => {
    const updated = await deleteBookNote(bookId, noteId);
    if (updated) {
      await reloadBooks();
      setSelectedBookForDetails(updated);
      showToast('Anotação removida.', 'info');
    }
  };

  // Configurações, Backup e Gerenciamento
  const handleUpdateSettings = (updates: Partial<UserSettings>) => {
    const updated = saveSettings(updates);
    setSettings(updated);
  };

  const handleExportLibrary = async () => {
    try {
      const jsonStr = await exportLibraryJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `readks-backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Cópia de segurança exportada com sucesso!');
    } catch (e) {
      console.error(e);
      showToast('Falha ao exportar biblioteca.', 'info');
    }
  };

  const handleImportLibrary = async (file: File) => {
    try {
      const text = await file.text();
      const res = await importLibraryJSON(text);
      if (res.success) {
        await reloadBooks();
        showToast(`Biblioteca restaurada: ${res.count} livro(s) importados!`);
        setIsSettingsOpen(false);
      } else {
        showToast(res.error || 'Erro ao importar arquivo.', 'info');
      }
    } catch (e) {
      console.error(e);
      showToast('Arquivo inválido ou corrompido.', 'info');
    }
  };

  const handleClearLibrary = async () => {
    await clearLibrary();
    await reloadBooks();
    setSelectedBookForDetails(null);
    showToast('Biblioteca limpa com sucesso.', 'info');
    setIsSettingsOpen(false);
  };

  const handleResetSettings = () => {
    const res = resetSettings();
    setSettings(res);
    showToast('Preferências redefinidas para o padrão.');
  };

  return (
    <div className="min-h-screen bg-[#F6F4EE] dark:bg-[#0B1326] text-[#24201C] dark:text-[#F1F5F9] flex flex-col transition-colors selection:bg-[#EAE4D8] dark:selection:bg-[#1E2E4F] font-sans">
      {/* Link de salto acessível para o conteúdo principal */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#1E293B] focus:text-white dark:focus:bg-[#F1F5F9] dark:focus:text-[#0B1326] focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-[#C06338] dark:focus:ring-[#38BDF8] font-sans text-sm font-semibold"
      >
        Pular para o conteúdo principal
      </a>

      {/* Região viva para leitores de tela */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>

      {/* Barra de Navegação Superior */}
      <Header
        totalBooks={counts.todos}
        readBooks={counts.lido}
        readingBooks={counts.lendo}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewBookModal={handleOpenNewBook}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main
        id="main-content"
        role="main"
        tabIndex={-1}
        className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 outline-hidden"
      >
        {/* Painel Rápido / Widget Integrado de Leitura */}
        {books.length > 0 && !searchQuery && (
          <ReadingWidget
            currentReadingBook={currentReadingBook}
            totalBooks={counts.todos}
            readCount={counts.lido}
            pendingCount={counts.nao_iniciado}
            recentBooks={books}
            onOpenBook={setSelectedBookForDetails}
            onAdvanceStatus={handleAdvanceStatus}
          />
        )}

        {/* Seção de Cabeçalho da Estante */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24201C] dark:text-[#F1F5F9] tracking-tight">
              Minha Estante
            </h1>
            <p className="font-sans text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] mt-1.5 max-w-xl leading-relaxed">
              Organize seus livros sem complicação. Acompanhe leituras em andamento, livros na fila e obras já concluídas.
            </p>
          </div>

          {/* Alternador de Modo de Visualização (Grade / Lista) & Adicionar */}
          <div className="flex items-center gap-3">
            {books.length > 0 && (
              <div
                role="group"
                aria-label="Modo de visualização da estante"
                className="inline-flex rounded-xl p-1 bg-[#EDE9E0] dark:bg-[#121C35] border border-[#E2DDD1] dark:border-[#223459] text-[#5A544C] dark:text-[#9CB2D1]"
              >
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateSettings({ viewMode: 'grid' });
                    announce('Visualização em grade ativada');
                  }}
                  title="Visualização em Grade"
                  aria-label="Visualização em Grade"
                  aria-pressed={settings.viewMode === 'grid'}
                  className={`p-2 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                    settings.viewMode === 'grid'
                      ? 'bg-white dark:bg-[#182544] text-[#24201C] dark:text-[#F1F5F9] shadow-2xs font-semibold border border-[#E2DDD1]/80 dark:border-[#2F477A]'
                      : 'hover:text-[#24201C] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateSettings({ viewMode: 'list' });
                    announce('Visualização em lista ativada');
                  }}
                  title="Visualização em Lista"
                  aria-label="Visualização em Lista"
                  aria-pressed={settings.viewMode === 'list'}
                  className={`p-2 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                    settings.viewMode === 'list'
                      ? 'bg-white dark:bg-[#182544] text-[#24201C] dark:text-[#F1F5F9] shadow-2xs font-semibold border border-[#E2DDD1]/80 dark:border-[#2F477A]'
                      : 'hover:text-[#24201C] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  <List className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenNewBook}
              aria-label="Cadastrar novo livro na estante"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-[#F7F5F0] dark:bg-[#F1F5F9] dark:text-[#0B1326] dark:hover:bg-white rounded-xl text-sm sm:text-base font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Novo livro</span>
            </button>
          </div>
        </div>

        {/* Barra de Filtros Segmentados */}
        {books.length > 0 && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD1] dark:border-[#223459] pb-4">
            <StatusFilter
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
              counts={counts}
            />

            {/* Indicador de resultados da busca */}
            {searchQuery && (
              <div className="text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1]">
                Mostrando <strong className="text-[#24201C] dark:text-[#F1F5F9] font-bold">{filteredAndSortedBooks.length}</strong> de {books.length} livros
              </div>
            )}
          </div>
        )}

        {/* Estado de Carregamento */}
        {isLoading ? (
          <div className="py-20 text-center text-sm sm:text-base text-[#7E776E] dark:text-[#6F86A8] animate-pulse">
            Carregando estante...
          </div>
        ) : filteredAndSortedBooks.length > 0 ? (
          /* Renderização dos Livros (Grade ou Lista) */
          settings.viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredAndSortedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  viewMode="list"
                  onOpenDetails={setSelectedBookForDetails}
                  onEdit={handleOpenEditBook}
                  onDeleteRequest={handleDeleteRequest}
                  onAdvanceStatus={handleAdvanceStatus}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSortedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  viewMode="grid"
                  onOpenDetails={setSelectedBookForDetails}
                  onEdit={handleOpenEditBook}
                  onDeleteRequest={handleDeleteRequest}
                  onAdvanceStatus={handleAdvanceStatus}
                />
              ))}
            </div>
          )
        ) : (
          /* Estado Vazio ou Sem Resultados */
          <EmptyState
            isSearchOrFiltered={books.length > 0 && (currentFilter !== 'todos' || !!searchQuery)}
            filter={currentFilter}
            searchQuery={searchQuery}
            onClearFilters={() => {
              setCurrentFilter('todos');
              setSearchQuery('');
            }}
            onAddNewBook={handleOpenNewBook}
            onImportBackup={() => setIsSettingsOpen(true)}
          />
        )}
      </main>

      {/* Rodapé Minimalista com Logo Oficial */}
      <footer
        role="contentinfo"
        className="mt-auto border-t border-[#E2DDD1] dark:border-[#223459] bg-[#EDE9E0]/50 dark:bg-[#080E1C]/60 py-6 text-center text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1]"
      >
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ReadksLogo size="sm" />
            <span className="text-[#CCC5B7] dark:text-[#2D4166]">·</span>
            <span>Estante digital minimalista e independente</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#24201C] dark:hover:text-[#F1F5F9] hover:underline cursor-pointer"
            >
              Preferências & Backup
            </button>
            <span className="text-[#CCC5B7] dark:text-[#2D4166]">·</span>
            <span className="text-[#7E776E] dark:text-[#6F86A8]">Armazenamento 100% local</span>
          </div>
        </div>
      </footer>

      {/* Modais da Aplicação */}
      <BookFormModal
        isOpen={isFormModalOpen}
        editingBook={editingBook}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <BookModal
        book={selectedBookForDetails}
        isOpen={!!selectedBookForDetails}
        onClose={() => setSelectedBookForDetails(null)}
        onEdit={(book) => {
          setSelectedBookForDetails(null);
          handleOpenEditBook(book);
        }}
        onDeleteRequest={(book) => {
          setSelectedBookForDetails(null);
          handleDeleteRequest(book);
        }}
        onStatusChange={handleSetSpecificStatus}
        onAdvanceStatus={handleAdvanceStatus}
        onAddNote={handleAddNote}
        onUpdateNote={handleUpdateNote}
        onDeleteNote={handleDeleteNote}
      />

      <DeleteConfirmModal
        book={bookToDelete}
        isOpen={!!bookToDelete}
        onClose={() => setBookToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onExportLibrary={handleExportLibrary}
        onImportLibrary={handleImportLibrary}
        onClearLibrary={handleClearLibrary}
        onResetSettings={handleResetSettings}
        totalBooks={books.length}
      />

      {/* Indicador de Conexão Offline */}
      <OfflineIndicator />

      {/* Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
