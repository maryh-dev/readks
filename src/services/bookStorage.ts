import {
  Book,
  BookFormData,
  BookStatus,
  BookNote,
  LibraryBackup,
} from '../types/book';
import {
  getAllBooksFromDB,
  saveBookToDB,
  deleteBookFromDB,
  clearAllBooksFromDB,
  bulkImportBooksToDB,
  migrateFromLocalStorageIfNeeded,
} from './db';
import { getSettings } from './settingsStorage';

/**
 * Inicialização e carregamento de todos os livros
 */
export async function getBooks(): Promise<Book[]> {
  await migrateFromLocalStorageIfNeeded();
  return getAllBooksFromDB();
}

/**
 * Busca um livro pelo seu ID
 */
export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await getAllBooksFromDB();
  return books.find((b) => b.id === id);
}

/**
 * Cadastra um novo livro na estante
 */
export async function createBook(data: BookFormData): Promise<Book> {
  const now = Date.now();
  const newBook: Book = {
    id: 'book-' + now + '-' + Math.random().toString(36).substring(2, 8),
    title: data.title.trim(),
    author: data.author?.trim() || undefined,
    description: data.description?.trim() || undefined,
    coverUrl: data.coverUrl?.trim() || undefined,
    status: data.status,
    notes: [],
    createdAt: now,
    updatedAt: now,
  };

  await saveBookToDB(newBook);
  return newBook;
}

/**
 * Atualiza os dados de um livro
 */
export async function updateBook(
  id: string,
  data: Partial<BookFormData>
): Promise<Book | null> {
  const current = await getBookById(id);
  if (!current) return null;

  const updatedBook: Book = {
    ...current,
    title: data.title !== undefined ? data.title.trim() : current.title,
    author: data.author !== undefined ? data.author.trim() || undefined : current.author,
    description:
      data.description !== undefined ? data.description.trim() || undefined : current.description,
    coverUrl: data.coverUrl !== undefined ? data.coverUrl.trim() || undefined : current.coverUrl,
    status: data.status !== undefined ? data.status : current.status,
    updatedAt: Date.now(),
  };

  await saveBookToDB(updatedBook);
  return updatedBook;
}

/**
 * Altera rapidamente o status de um livro
 */
export async function updateBookStatus(
  id: string,
  newStatus: BookStatus
): Promise<Book | null> {
  const current = await getBookById(id);
  if (!current) return null;

  const updatedBook: Book = {
    ...current,
    status: newStatus,
    updatedAt: Date.now(),
  };

  await saveBookToDB(updatedBook);
  return updatedBook;
}

/**
 * Avança o status de leitura para o próximo:
 * Não iniciado -> Em andamento -> Lido
 */
export async function advanceBookStatus(id: string): Promise<Book | null> {
  const current = await getBookById(id);
  if (!current) return null;

  let next: BookStatus;
  if (current.status === 'nao_iniciado') {
    next = 'lendo';
  } else if (current.status === 'lendo') {
    next = 'lido';
  } else {
    next = 'nao_iniciado';
  }

  return updateBookStatus(id, next);
}

/**
 * Remove um livro da biblioteca
 */
export async function deleteBook(id: string): Promise<boolean> {
  return deleteBookFromDB(id);
}

/**
 * Adiciona uma anotação pessoal a um livro
 */
export async function addBookNote(
  bookId: string,
  content: string
): Promise<{ book: Book; note: BookNote } | null> {
  const current = await getBookById(bookId);
  if (!current || !content.trim()) return null;

  const now = Date.now();
  const newNote: BookNote = {
    id: 'note-' + now + '-' + Math.random().toString(36).substring(2, 6),
    bookId,
    content: content.trim(),
    createdAt: now,
    updatedAt: now,
  };

  const updatedNotes = [newNote, ...(current.notes || [])];
  const updatedBook: Book = {
    ...current,
    notes: updatedNotes,
    updatedAt: now,
  };

  await saveBookToDB(updatedBook);
  return { book: updatedBook, note: newNote };
}

/**
 * Atualiza uma anotação existente
 */
export async function updateBookNote(
  bookId: string,
  noteId: string,
  content: string
): Promise<Book | null> {
  const current = await getBookById(bookId);
  if (!current || !content.trim()) return null;

  const notes = current.notes || [];
  const index = notes.findIndex((n) => n.id === noteId);
  if (index === -1) return null;

  const updatedNotes = [...notes];
  updatedNotes[index] = {
    ...updatedNotes[index],
    content: content.trim(),
    updatedAt: Date.now(),
  };

  const updatedBook: Book = {
    ...current,
    notes: updatedNotes,
    updatedAt: Date.now(),
  };

  await saveBookToDB(updatedBook);
  return updatedBook;
}

/**
 * Remove uma anotação pessoal
 */
export async function deleteBookNote(
  bookId: string,
  noteId: string
): Promise<Book | null> {
  const current = await getBookById(bookId);
  if (!current) return null;

  const notes = (current.notes || []).filter((n) => n.id !== noteId);
  const updatedBook: Book = {
    ...current,
    notes,
    updatedAt: Date.now(),
  };

  await saveBookToDB(updatedBook);
  return updatedBook;
}

/**
 * Limpa todos os livros, imagens e anotações da biblioteca
 */
export async function clearLibrary(): Promise<boolean> {
  return clearAllBooksFromDB();
}

/**
 * Exporta a biblioteca completa em formato JSON estruturado
 */
export async function exportLibraryJSON(): Promise<string> {
  const books = await getAllBooksFromDB();
  const settings = getSettings();

  const backup: LibraryBackup = {
    app: 'Readks',
    version: 1,
    exportedAt: new Date().toISOString(),
    books,
    settings,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Importa um backup JSON para o IndexedDB
 */
export async function importLibraryJSON(
  jsonString: string
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString);

    let booksToImport: Book[] = [];
    if (Array.isArray(parsed)) {
      booksToImport = parsed;
    } else if (parsed && Array.isArray(parsed.books)) {
      booksToImport = parsed.books;
    } else {
      return {
        success: false,
        count: 0,
        error: 'Arquivo inválido: formato de biblioteca Readks não reconhecido.',
      };
    }

    // Validação mínima dos livros
    const validBooks: Book[] = booksToImport.filter(
      (b) => b && typeof b.title === 'string' && typeof b.status === 'string'
    );

    if (validBooks.length === 0) {
      return {
        success: false,
        count: 0,
        error: 'Nenhum livro válido encontrado no arquivo fornecido.',
      };
    }

    await bulkImportBooksToDB(validBooks, true);
    return { success: true, count: validBooks.length };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erro ao processar JSON';
    return {
      success: false,
      count: 0,
      error: `Falha ao ler arquivo: ${errorMsg}`,
    };
  }
}
