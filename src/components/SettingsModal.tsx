import React, { useState, useRef } from 'react';
import {
  UserSettings,
  ThemeMode,
  FontSizeOption,
  ViewMode,
  SortOption,
} from '../types/book';
import {
  X,
  Palette,
  Eye,
  BookOpen,
  Database,
  Shield,
  Trash2,
  Info,
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Smartphone,
  Wifi,
} from 'lucide-react';
import { ReadksLogo } from './ReadksLogo';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useFocusTrap } from '../hooks/useFocusTrap';

type SettingsTab =
  | 'aparencia'
  | 'acessibilidade'
  | 'leitura'
  | 'dados'
  | 'privacidade'
  | 'gerenciamento'
  | 'sobre';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onExportLibrary: () => void;
  onImportLibrary: (file: File) => void;
  onClearLibrary: () => void;
  onResetSettings: () => void;
  totalBooks: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportLibrary,
  onImportLibrary,
  onClearLibrary,
  onResetSettings,
  totalBooks,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('aparencia');
  const [clearStep, setClearStep] = useState<0 | 1 | 2>(0);
  const [importConfirmFile, setImportConfirmFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  // Hook de controle de foco e devolução de foco
  const modalContainerRef = useFocusTrap({
    isOpen,
    onClose,
  });

  if (!isOpen) return null;

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportConfirmFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmImport = () => {
    if (importConfirmFile) {
      onImportLibrary(importConfirmFile);
      setImportConfirmFile(null);
    }
  };

  const menuItems: { id: SettingsTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'aparencia', label: 'Aparência', icon: Palette },
    { id: 'acessibilidade', label: 'Acessibilidade', icon: Eye },
    { id: 'leitura', label: 'Preferências de Leitura', icon: BookOpen },
    { id: 'dados', label: 'Dados & Backup', icon: Database },
    { id: 'privacidade', label: 'Privacidade', icon: Shield },
    { id: 'gerenciamento', label: 'Gerenciamento', icon: Trash2 },
    { id: 'sobre', label: 'Aplicativo', icon: Info },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0B1326]/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
      role="presentation"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div
        ref={modalContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        tabIndex={-1}
        className="relative w-full max-w-3xl bg-white dark:bg-[#121C35] rounded-2xl shadow-2xl border border-[#E2DDD1] dark:border-[#223459] overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row text-[#24201C] dark:text-[#F1F5F9] focus:outline-none"
      >
        {/* Barra Lateral de Categorias */}
        <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r border-[#E2DDD1] dark:border-[#223459] bg-[#F6F4EE]/70 dark:bg-[#0B1326]/60 p-3 sm:p-4 shrink-0 flex md:flex-col justify-between overflow-x-auto md:overflow-visible">
          <div>
            <div className="hidden md:flex items-center gap-2 px-2 py-1 mb-4 text-xs font-bold text-[#7E776E] dark:text-[#6F86A8] uppercase tracking-wider">
              <span>Configurações</span>
            </div>
            <nav
              role="tablist"
              aria-label="Categorias de configurações"
              aria-orientation="vertical"
              className="flex md:flex-col gap-1 w-full min-w-max md:min-w-0"
            >
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    role="tab"
                    id={`settings-tab-${item.id}`}
                    aria-selected={isActive}
                    aria-controls={`settings-panel-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setClearStep(0);
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm sm:text-base font-medium transition-colors cursor-pointer text-left whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                      isActive
                        ? 'bg-[#1E293B] text-[#F7F5F0] dark:bg-[#F1F5F9] dark:text-[#0B1326] shadow-2xs font-semibold'
                        : 'text-[#5A544C] dark:text-[#9CB2D1] hover:text-[#24201C] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544]'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:block pt-4 border-t border-[#E2DDD1]/60 dark:border-[#223459] text-xs text-[#7E776E] dark:text-[#6F86A8] px-2 font-sans">
            Readks v1.3.0 · Acessibilidade
          </div>
        </aside>

        {/* Painel Central de Conteúdo */}
        <section className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topo do painel */}
          <div className="px-6 py-4 border-b border-[#E2DDD1] dark:border-[#223459] flex items-center justify-between">
            <h2 id="settings-dialog-title" className="font-serif text-xl sm:text-2xl font-bold text-[#24201C] dark:text-[#F1F5F9]">
              {menuItems.find((m) => m.id === activeTab)?.label}
            </h2>
            <button
              onClick={onClose}
              aria-label="Fechar painel de configurações"
              className="p-2 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Área com Scroll do Conteúdo */}
          <div
            id={`settings-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`settings-tab-${activeTab}`}
            className="p-6 overflow-y-auto space-y-6 flex-1 text-sm sm:text-base leading-relaxed"
          >
            {/* 1. ABA APARÊNCIA */}
            {activeTab === 'aparencia' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#24201C] dark:text-[#F1F5F9] mb-1">
                    Tema da Aplicação
                  </h3>
                  <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mb-3 leading-relaxed">
                    Modo claro com tons de marfim e areia para uma leitura aconchegante, e modo escuro em azul-marinho profundo para proteger sua visão.
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Escolha o tema de exibição"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                  >
                    {[
                      { id: 'light' as ThemeMode, label: 'Modo Claro', detail: 'Tons de marfim', icon: Sun },
                      { id: 'dark' as ThemeMode, label: 'Modo Escuro', detail: 'Azul-marinho', icon: Moon },
                      { id: 'auto' as ThemeMode, label: 'Automático', detail: 'Segue o sistema', icon: Laptop },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = settings.theme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => onUpdateSettings({ theme: opt.id })}
                          className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                            isSelected
                              ? 'border-[#1E293B] bg-[#EDE9E0] dark:border-[#38BDF8] dark:bg-[#1A2A4C] shadow-2xs font-semibold text-[#24201C] dark:text-[#F1F5F9]'
                              : 'border-[#E2DDD1] dark:border-[#223459] bg-transparent hover:bg-[#F6F4EE] dark:hover:bg-[#16223F] text-[#5A544C] dark:text-[#9CB2D1]'
                          }`}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                          <span className="text-sm font-medium">{opt.label}</span>
                          <span className="text-xs text-[#7E776E] dark:text-[#9CB2D1]">{opt.detail}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ABA ACESSIBILIDADE */}
            {activeTab === 'acessibilidade' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#24201C] dark:text-[#F1F5F9] mb-1">
                    Tamanho do Texto
                  </h3>
                  <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mb-3 leading-relaxed">
                    Ajuste o tamanho base das fontes em toda a aplicação. A preferência é aplicada globalmente e salva automaticamente.
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Escolha o tamanho do texto"
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                  >
                    {[
                      { id: 'sm' as FontSizeOption, label: 'Pequeno', sample: 'Aa', detail: '15px' },
                      { id: 'md' as FontSizeOption, label: 'Padrão', sample: 'Aa', detail: '16px' },
                      { id: 'lg' as FontSizeOption, label: 'Grande', sample: 'Aa', detail: '18.5px' },
                      { id: 'xl' as FontSizeOption, label: 'Extra grande', sample: 'Aa', detail: '21px' },
                    ].map((opt) => {
                      const isSelected = settings.fontSize === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => onUpdateSettings({ fontSize: opt.id })}
                          className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                            isSelected
                              ? 'border-[#1E293B] bg-[#EDE9E0] dark:border-[#38BDF8] dark:bg-[#1A2A4C] font-semibold text-[#24201C] dark:text-[#F1F5F9] ring-1 ring-[#1E293B] dark:ring-[#38BDF8]'
                              : 'border-[#E2DDD1] dark:border-[#223459] bg-transparent hover:bg-[#F6F4EE] dark:hover:bg-[#16223F] text-[#5A544C] dark:text-[#9CB2D1]'
                          }`}
                        >
                          <span
                            className={`font-serif ${
                              opt.id === 'sm'
                                ? 'text-lg'
                                : opt.id === 'md'
                                ? 'text-xl'
                                : opt.id === 'lg'
                                ? 'text-2xl font-bold'
                                : 'text-3xl font-extrabold'
                            }`}
                            aria-hidden="true"
                          >
                            {opt.sample}
                          </span>
                          <span className="text-sm font-medium">{opt.label}</span>
                          <span className="text-xs text-[#7E776E] dark:text-[#9CB2D1]">{opt.detail}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2DDD1] dark:border-[#223459] space-y-4">
                  {/* Reduzir Animações */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <label htmlFor="settings-reduce-motion-checkbox" className="font-medium text-[#24201C] dark:text-[#F1F5F9] block cursor-pointer">
                        Reduzir Animações
                      </label>
                      <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mt-0.5">
                        Minimiza transições e efeitos de movimento na interface.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="settings-reduce-motion-checkbox"
                        type="checkbox"
                        aria-label="Ativar redução de animações"
                        checked={settings.reduceMotion}
                        onChange={(e) =>
                          onUpdateSettings({ reduceMotion: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#D6CFC2] dark:bg-[#25385E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E293B] dark:peer-checked:bg-[#38BDF8] dark:peer-checked:after:bg-[#0B1326] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C06338]"></div>
                    </label>
                  </div>

                  {/* Alto Contraste */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <label htmlFor="settings-high-contrast-checkbox" className="font-semibold text-sm sm:text-base text-[#24201C] dark:text-[#F1F5F9] block cursor-pointer">
                        Modo Alto Contraste
                      </label>
                      <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mt-0.5">
                        Aumenta a separação de bordas e contraste entre planos para maior clareza visual.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="settings-high-contrast-checkbox"
                        type="checkbox"
                        aria-label="Ativar modo de alto contraste"
                        checked={settings.highContrast}
                        onChange={(e) =>
                          onUpdateSettings({ highContrast: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#D6CFC2] dark:bg-[#25385E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E293B] dark:peer-checked:bg-[#38BDF8] dark:peer-checked:after:bg-[#0B1326] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C06338]"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ABA PREFERÊNCIAS DE LEITURA */}
            {activeTab === 'leitura' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#24201C] dark:text-[#F1F5F9] mb-1">
                    Visualização da Estante
                  </h3>
                  <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mb-3 leading-relaxed">
                    Escolha a disposição visual dos seus livros na tela inicial.
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Escolha a disposição da estante"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {[
                      { id: 'grid' as ViewMode, label: 'Grade com Capas em Destaque', detail: 'Ideal para visualizar capas e cartões' },
                      { id: 'list' as ViewMode, label: 'Lista Editorial Compacta', detail: 'Visão corrida linha por linha' },
                    ].map((opt) => {
                      const isSelected = settings.viewMode === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => onUpdateSettings({ viewMode: opt.id })}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                            isSelected
                              ? 'border-[#1E293B] bg-[#EDE9E0] dark:border-[#38BDF8] dark:bg-[#1A2A4C] font-semibold text-[#24201C] dark:text-[#F1F5F9] ring-1 ring-[#1E293B] dark:ring-[#38BDF8]'
                              : 'border-[#E2DDD1] dark:border-[#223459] hover:bg-[#F6F4EE] dark:hover:bg-[#16223F] text-[#5A544C] dark:text-[#9CB2D1]'
                          }`}
                        >
                          <span className="block text-sm sm:text-base font-semibold">{opt.label}</span>
                          <span className="block text-xs sm:text-sm text-[#7E776E] dark:text-[#9CB2D1] mt-0.5">{opt.detail}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2DDD1] dark:border-[#223459]">
                  <h3 className="font-semibold text-base sm:text-lg text-[#24201C] dark:text-[#F1F5F9] mb-1">
                    Ordenação dos Livros
                  </h3>
                  <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mb-3 leading-relaxed">
                    Defina o critério de ordenação padrão da sua biblioteca.
                  </p>
                  <div
                    role="radiogroup"
                    aria-label="Critério de ordenação de livros"
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                  >
                    {[
                      { id: 'recent' as SortOption, label: 'Adicionados recentemente' },
                      { id: 'oldest' as SortOption, label: 'Mais antigos primeiro' },
                      { id: 'title' as SortOption, label: 'Título (A a Z)' },
                      { id: 'author' as SortOption, label: 'Autor (A a Z)' },
                    ].map((opt) => {
                      const isSelected = settings.sortBy === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => onUpdateSettings({ sortBy: opt.id })}
                          className={`px-4 py-3 rounded-xl border text-left text-sm sm:text-base transition-all cursor-pointer flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                            isSelected
                              ? 'border-[#1E293B] bg-[#EDE9E0] dark:border-[#38BDF8] dark:bg-[#1A2A4C] font-semibold text-[#24201C] dark:text-[#F1F5F9] ring-1 ring-[#1E293B] dark:ring-[#38BDF8]'
                              : 'border-[#E2DDD1] dark:border-[#223459] hover:bg-[#F6F4EE] dark:hover:bg-[#16223F] text-[#5A544C] dark:text-[#9CB2D1]'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#C06338] dark:text-[#38BDF8]" aria-hidden="true" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. ABA DADOS & BACKUP */}
            {activeTab === 'dados' && (
              <div className="space-y-6">
                <div className="p-4 bg-[#F6F4EE] dark:bg-[#182544] rounded-xl border border-[#E2DDD1] dark:border-[#253963]">
                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-[#C06338] dark:text-[#38BDF8] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg text-[#24201C] dark:text-[#F1F5F9]">
                        Armazenamento Local Seguro
                      </h4>
                      <p className="text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] mt-1 leading-relaxed">
                        Sua biblioteca com <strong className="text-[#24201C] dark:text-[#F1F5F9]">{totalBooks} livros</strong>, imagens e anotações fica gravada no banco de dados interno (IndexedDB) deste dispositivo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ações de Exportação e Importação */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#E2DDD1] dark:border-[#223459]">
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-[#24201C] dark:text-[#F1F5F9]">
                        Exportar Biblioteca (Cópia de Segurança)
                      </h4>
                      <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mt-0.5">
                        Baixe um arquivo JSON com todos os livros, imagens salvas e anotações pessoais.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onExportLibrary}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-white dark:bg-[#F1F5F9] dark:text-[#0B1326] dark:hover:bg-white rounded-xl text-sm font-medium transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                    >
                      <Download className="w-4 h-4" aria-hidden="true" />
                      <span>Exportar backup</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-[#E2DDD1] dark:border-[#223459]">
                    <div>
                      <h4 className="font-semibold text-sm sm:text-base text-[#24201C] dark:text-[#F1F5F9]">
                        Importar Cópia de Segurança
                      </h4>
                      <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mt-0.5">
                        Restaure sua biblioteca a partir de um backup prévio do Readks.
                      </p>
                    </div>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".json,application/json"
                        aria-label="Carregar arquivo JSON de backup da biblioteca"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#EDE9E0] hover:bg-[#E2DDD1] text-[#24201C] dark:bg-[#182544] dark:text-[#F1F5F9] dark:hover:bg-[#203158] rounded-xl text-sm font-medium border border-[#E2DDD1] dark:border-[#263C66] transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                      >
                        <Upload className="w-4 h-4" aria-hidden="true" />
                        <span>Importar arquivo</span>
                      </button>
                    </div>
                  </div>
                  {/* Confirmação de Importação */}
                  {importConfirmFile && (
                    <div role="alert" className="p-4 bg-amber-50 dark:bg-[#241E15] border border-amber-200 dark:border-amber-700/60 rounded-xl space-y-3 animate-in fade-in">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="text-sm">
                          <strong className="block text-amber-900 dark:text-amber-200 mb-0.5 font-semibold">
                            Substituir biblioteca existente?
                          </strong>
                          <span className="text-amber-800 dark:text-amber-300 leading-relaxed">
                            Ao importar o arquivo <strong>"{importConfirmFile.name}"</strong>, os livros atuais serão substituídos pelo conteúdo do backup.
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setImportConfirmFile(null)}
                          className="px-3.5 py-2 text-sm text-[#5A544C] dark:text-[#9CB2D1] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmImport}
                          className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                          Confirmar restauração
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. ABA PRIVACIDADE */}
            {activeTab === 'privacidade' && (
              <div className="space-y-4 text-[#5A544C] dark:text-[#CBD5E1] leading-relaxed text-sm sm:text-base">
                <div className="p-4 bg-[#F6F4EE] dark:bg-[#182544] rounded-xl border border-[#E2DDD1] dark:border-[#253963]">
                  <div className="flex items-center gap-2 font-semibold text-base sm:text-lg text-[#24201C] dark:text-[#F1F5F9] mb-2 font-serif">
                    <Shield className="w-5 h-5 text-[#1B613A] dark:text-[#34D399]" aria-hidden="true" />
                    <span>Compromisso de Privacidade e Soberania dos Seus Dados</span>
                  </div>
                  <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] font-sans">
                    O Readks foi construído sob o princípio de total autonomia do leitor:
                  </p>
                </div>

                <ul className="space-y-3 list-disc pl-5 text-sm sm:text-base text-[#5A544C] dark:text-[#CBD5E1] leading-relaxed">
                  <li>
                    <strong className="text-[#24201C] dark:text-[#F1F5F9]">Armazenamento 100% Local:</strong> Seus livros, fotos de capa, anotações de leitura e preferências residem exclusivamente no navegador e memória do seu dispositivo.
                  </li>
                  <li>
                    <strong className="text-[#24201C] dark:text-[#F1F5F9]">Sem Servidores Externos:</strong> Não enviamos suas informações para nenhum banco de dados ou serviço externo na nuvem.
                  </li>
                  <li>
                    <strong className="text-[#24201C] dark:text-[#F1F5F9]">Sem Rastreamento ou Métricas Ocultas:</strong> Não existem ferramentas de telemetria, rastreamento de navegação ou perfis de usuário.
                  </li>
                  <li>
                    <strong className="text-[#24201C] dark:text-[#F1F5F9]">Atenção à Limpeza de Dados:</strong> Como os dados estão salvos localmente, ao limpar os dados do navegador (cookies e armazenamento de sites) ou desinstalar o navegador, as informações locais podem ser perdidas caso não haja uma cópia salva.
                  </li>
                  <li>
                    <strong className="text-[#24201C] dark:text-[#F1F5F9]">Recomendação:</strong> Utilize a opção de <em>Exportar Backup</em> regularmente na aba de Dados para manter cópias seguras da sua biblioteca.
                  </li>
                </ul>
              </div>
            )}

            {/* 6. ABA GERENCIAMENTO DE DADOS */}
            {activeTab === 'gerenciamento' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-[#24201C] dark:text-[#F1F5F9] mb-1">
                    Limpeza e Redefinição
                  </h3>
                  <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1]">
                    Gerencie a exclusão em massa de registros e configurações.
                  </p>
                </div>

                {/* Opção 1: Limpar toda a biblioteca */}
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="font-semibold text-rose-900 dark:text-rose-200 text-sm sm:text-base">
                        Limpar Toda a Biblioteca
                      </h4>
                      <p className="text-sm text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
                        Remove todos os livros, capas e anotações cadastradas. Suas preferências de tema e acessibilidade serão mantidas.
                      </p>
                    </div>
                  </div>

                  {clearStep === 0 && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setClearStep(1)}
                        className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        Limpar biblioteca
                      </button>
                    </div>
                  )}

                  {/* Confirmação 1 */}
                  {clearStep === 1 && (
                    <div role="alertdialog" aria-labelledby="clear-step-1-title" className="p-4 bg-white dark:bg-[#182544] rounded-xl border border-rose-200 dark:border-rose-800 space-y-3">
                      <p id="clear-step-1-title" className="text-sm sm:text-base text-[#24201C] dark:text-[#F1F5F9] font-medium leading-relaxed">
                        Deseja realmente apagar todos os {totalBooks} livros cadastrados?
                      </p>
                      <div className="flex justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setClearStep(0)}
                          className="px-3.5 py-2 text-sm text-[#5A544C] dark:text-[#9CB2D1] hover:bg-[#EDE9E0] dark:hover:bg-[#121C35] rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => setClearStep(2)}
                          className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white hover:bg-rose-700 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                        >
                          Continuar para confirmação final
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Confirmação 2 (Dupla confirmação explícita de segurança) */}
                  {clearStep === 2 && (
                    <div role="alertdialog" aria-labelledby="clear-step-2-title" className="p-4 bg-white dark:bg-[#182544] rounded-xl border-2 border-rose-600 dark:border-rose-500 space-y-3 animate-in fade-in">
                      <div id="clear-step-2-title" className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm sm:text-base">
                        <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
                        <span>Aviso Final: Ação Permanente e Irreversível!</span>
                      </div>
                      <p className="text-sm text-[#24201C] dark:text-[#CBD5E1] leading-relaxed">
                        Após esta confirmação, todos os livros, imagens salvas e anotações serão apagados imediatamente. Não será possível recuperá-los sem um arquivo de backup previamente exportado.
                      </p>
                      <div className="flex justify-end gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setClearStep(0)}
                          className="px-3.5 py-2 text-sm text-[#5A544C] dark:text-[#9CB2D1] hover:bg-[#EDE9E0] dark:hover:bg-[#121C35] rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338]"
                        >
                          Manter meus livros
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClearLibrary();
                            setClearStep(0);
                          }}
                          className="px-4 py-2 text-sm font-bold bg-rose-700 text-white hover:bg-rose-800 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                        >
                          Sim, apagar tudo permanentemente
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Opção 2: Redefinir Preferências */}
                <div className="p-4 rounded-xl border border-[#E2DDD1] dark:border-[#223459] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-[#24201C] dark:text-[#F1F5F9]">
                      Restaurar Padrões de Interface
                    </h4>
                    <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mt-0.5">
                      Restaura as configurações de aparência, fonte e acessibilidade para o padrão original, mantendo seus livros intactos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onResetSettings}
                    className="px-4 py-2 text-sm font-medium text-[#24201C] dark:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] border border-[#E2DDD1] dark:border-[#263C66] rounded-xl cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                  >
                    Restaurar padrões
                  </button>
                </div>
              </div>
            )}

            {/* 7. ABA APLICATIVO COM LOGO READKS */}
            {activeTab === 'sobre' && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-5 bg-[#F6F4EE] dark:bg-[#182544] rounded-xl border border-[#E2DDD1] dark:border-[#253963]">
                  <ReadksLogo size="lg" showWordmark={false} />
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#24201C] dark:text-[#F1F5F9]">
                      Readks
                    </h3>
                    <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] font-sans mt-0.5">
                      Estante digital minimalista para leituras · Versão 1.3.0 (PWA)
                    </p>
                  </div>
                </div>

                {/* Status PWA e Conexão */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-[#E2DDD1] dark:border-[#223459] flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-[#1B613A] dark:text-[#34D399]" aria-hidden="true" />
                    <div>
                      <span className="block text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9]">
                        Disponibilidade Offline
                      </span>
                      <span className="text-xs sm:text-sm text-[#5A544C] dark:text-[#9CB2D1]">
                        {isOnline
                          ? 'Online · Recursos em cache'
                          : 'Modo Offline Ativo · Totalmente funcional'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[#E2DDD1] dark:border-[#223459] flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#1E4E7A] dark:text-[#38BDF8]" aria-hidden="true" />
                    <div>
                      <span className="block text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9]">
                        Aplicativo Instalável (PWA)
                      </span>
                      <span className="text-xs sm:text-sm text-[#5A544C] dark:text-[#9CB2D1]">
                        {isInstalled
                          ? 'Instalado como app no dispositivo'
                          : 'Pronto para instalação'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de Instalação */}
                {!isInstalled && (
                  <div className="p-4 bg-[#EDE9E0]/70 dark:bg-[#182544]/60 rounded-xl border border-[#E2DDD1] dark:border-[#223459] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-[#24201C] dark:text-[#F1F5F9] text-sm sm:text-base">
                        Instalar o Readks no seu dispositivo
                      </h4>
                      <p className="text-sm text-[#5A544C] dark:text-[#9CB2D1] mt-0.5 leading-relaxed">
                        Abra o Readks diretamente da tela inicial ou área de trabalho, com visual de aplicativo nativo sem barras do navegador.
                      </p>
                    </div>

                    {isInstallable ? (
                      <button
                        type="button"
                        onClick={install}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-white dark:bg-[#F1F5F9] dark:text-[#0B1326] dark:hover:bg-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                      >
                        <Download className="w-4 h-4" aria-hidden="true" />
                        <span>Instalar agora</span>
                      </button>
                    ) : isIOS ? (
                      <button
                        type="button"
                        onClick={() => setShowIOSPrompt(true)}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#EDE9E0] dark:bg-[#182544] hover:bg-[#E2DDD1] dark:hover:bg-[#203158] text-[#24201C] dark:text-[#F1F5F9] text-sm font-medium rounded-xl transition-colors cursor-pointer shrink-0 border border-[#E2DDD1] dark:border-[#263C66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                      >
                        <Smartphone className="w-4 h-4" aria-hidden="true" />
                        <span>Instalar no iOS</span>
                      </button>
                    ) : (
                      <span className="text-sm text-[#7E776E] dark:text-[#6F86A8] italic">
                        Instalação disponível pelo menu do navegador (ícone de instalar na barra de URL).
                      </span>
                    )}
                  </div>
                )}

                {/* Guia iOS Safari */}
                {showIOSPrompt && (
                  <div role="region" aria-label="Instruções de instalação para iOS Safari" className="p-4 bg-[#F6F4EE] dark:bg-[#182544] border border-[#E2DDD1] dark:border-[#253963] rounded-xl space-y-2.5 animate-in fade-in">
                    <h4 className="font-semibold text-sm sm:text-base text-[#24201C] dark:text-[#F1F5F9]">
                      Como instalar no iPhone ou iPad:
                    </h4>
                    <ol className="list-decimal pl-5 text-sm text-[#5A544C] dark:text-[#CBD5E1] space-y-1.5 leading-relaxed">
                      <li>Toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta para cima) na barra inferior do Safari.</li>
                      <li>Role a lista de ações e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
                      <li>Confirme tocando em <strong>Adicionar</strong> no canto superior direito.</li>
                    </ol>
                    <button
                      type="button"
                      onClick={() => setShowIOSPrompt(false)}
                      className="mt-2 text-sm text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338]"
                    >
                      Entendido
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
