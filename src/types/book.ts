export type BookStatus = 'nao_iniciado' | 'lendo' | 'lido';

export interface BookNote {
  id: string;
  bookId: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface Book {
  id: string;
  title: string;
  author?: string;
  description?: string;
  coverUrl?: string; // Suporta URL externa ou DataURL (base64) de arquivo local
  status: BookStatus;
  notes?: BookNote[]; // Anotações pessoais vinculadas ao livro
  createdAt: number;
  updatedAt: number;
}

export type FilterStatus = 'todos' | BookStatus;

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  status: BookStatus;
}

export type ThemeMode = 'auto' | 'light' | 'dark';
export type FontSizeOption = 'sm' | 'md' | 'lg' | 'xl';
export type ViewMode = 'grid' | 'list';
export type SortOption = 'recent' | 'oldest' | 'title' | 'author';

export interface UserSettings {
  theme: ThemeMode;
  fontSize: FontSizeOption;
  reduceMotion: boolean;
  highContrast: boolean;
  viewMode: ViewMode;
  sortBy: SortOption;
}

export interface LibraryBackup {
  app: 'Readks';
  version: number;
  exportedAt: string;
  books: Book[];
  settings?: UserSettings;
}

export const STATUS_CONFIG: Record<
  BookStatus,
  {
    label: string;
    description: string;
    nextStatus: BookStatus;
    nextActionLabel: string;
    badgeBg: string;
    badgeText: string;
    dotColor: string;
  }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    description: 'Na fila para leitura',
    nextStatus: 'lendo',
    nextActionLabel: 'Começar a ler',
    badgeBg: 'bg-[#FBF5E8] dark:bg-[#1B2338] text-[#8C5209] dark:text-[#FCD34D] border-[#EADAB8] dark:border-[#374468]',
    badgeText: 'text-[#8C5209] dark:text-[#FCD34D]',
    dotColor: 'bg-[#D97706] dark:bg-[#FBBF24]',
  },
  lendo: {
    label: 'Em andamento',
    description: 'Leitura ativa no momento',
    nextStatus: 'lido',
    nextActionLabel: 'Concluir leitura',
    badgeBg: 'bg-[#EEF4FB] dark:bg-[#152744] text-[#1E4E7A] dark:text-[#7DD3FC] border-[#C9DDF2] dark:border-[#274676]',
    badgeText: 'text-[#1E4E7A] dark:text-[#7DD3FC]',
    dotColor: 'bg-[#0284C7] dark:bg-[#38BDF8]',
  },
  lido: {
    label: 'Lido',
    description: 'Livro concluído',
    nextStatus: 'nao_iniciado',
    nextActionLabel: 'Reler livro',
    badgeBg: 'bg-[#EEF7F1] dark:bg-[#132A26] text-[#1B613A] dark:text-[#6EE7B7] border-[#C3E4CD] dark:border-[#215647]',
    badgeText: 'text-[#1B613A] dark:text-[#6EE7B7]',
    dotColor: 'bg-[#059669] dark:bg-[#34D399]',
  },
};
