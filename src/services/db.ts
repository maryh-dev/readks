import { Book, BookNote } from '../types/book';

const DB_NAME = 'readks_db';
const DB_VERSION = 1;
const STORE_BOOKS = 'books';

/**
 * Abre a conexão com o IndexedDB do Readks
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB não é suportado neste navegador.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_BOOKS)) {
        const store = db.createObjectStore(STORE_BOOKS, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Retorna todos os livros cadastrados
 */
export async function getAllBooksFromDB(): Promise<Book[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_BOOKS, 'readonly');
      const store = tx.objectStore(STORE_BOOKS);
      const request = store.getAll();

      request.onsuccess = () => {
        const books = (request.result as Book[]) || [];
        // Ordena por data de criação decrescente por padrão
        books.sort((a, b) => b.createdAt - a.createdAt);
        resolve(books);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Erro ao buscar livros no IndexedDB:', error);
    return [];
  }
}

/**
 * Salva ou atualiza um livro no IndexedDB
 */
export async function saveBookToDB(book: Book): Promise<Book> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const request = store.put(book);

    request.onsuccess = () => {
      resolve(book);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Remove um livro do IndexedDB
 */
export async function deleteBookFromDB(id: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Limpa todos os livros da biblioteca
 */
export async function clearAllBooksFromDB(): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);
    const request = store.clear();

    request.onsuccess = () => {
      resolve(true);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Importa múltiplos livros (substituindo ou adicionando)
 */
export async function bulkImportBooksToDB(books: Book[], replaceAll = true): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_BOOKS, 'readwrite');
    const store = tx.objectStore(STORE_BOOKS);

    if (replaceAll) {
      store.clear();
    }

    for (const book of books) {
      store.put(book);
    }

    tx.oncomplete = () => {
      resolve(true);
    };

    tx.onerror = () => {
      reject(tx.error);
    };
  });
}

/**
 * Migração inicial única: se houver livros reais criados no localStorage antigo,
 * migra para o IndexedDB sem carregar os 4 exemplos de mock prévios (demo-1 a demo-4)
 */
export async function migrateFromLocalStorageIfNeeded(): Promise<void> {
  try {
    const raw = localStorage.getItem('readks_books_v1');
    if (!raw) return;

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Filtra para remover qualquer mockup prévio (ids iniciando em "demo-")
      const userBooks = parsed.filter(
        (b: Book) => b && typeof b.id === 'string' && !b.id.startsWith('demo-')
      );

      if (userBooks.length > 0) {
        const existing = await getAllBooksFromDB();
        if (existing.length === 0) {
          await bulkImportBooksToDB(userBooks, false);
        }
      }
    }
    // Remove o storage antigo para evitar dados órfãos
    localStorage.removeItem('readks_books_v1');
  } catch (e) {
    console.warn('Migração de dados prévios dispensada:', e);
  }
}
