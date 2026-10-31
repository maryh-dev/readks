import React, { useState, useEffect, useRef } from 'react';
import { Book, BookFormData, BookStatus, STATUS_CONFIG } from '../types/book';
import { BookCover } from './BookCover';
import { useFocusTrap } from '../hooks/useFocusTrap';
import {
  X,
  Upload,
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface BookFormModalProps {
  isOpen: boolean;
  editingBook?: Book | null;
  onClose: () => void;
  onSubmit: (formData: BookFormData) => void;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  editingBook,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<BookStatus>('nao_iniciado');

  const [coverSource, setCoverSource] = useState<'file' | 'url'>('file');
  const [fileError, setFileError] = useState<string | null>(null);

  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Hook de controle estrito de foco (Focus Trap e devolução ao elemento anterior)
  const modalContainerRef = useFocusTrap({
    isOpen,
    onClose,
    initialFocusRef: titleInputRef,
  });

  useEffect(() => {
    if (editingBook) {
      setTitle(editingBook.title || '');
      setAuthor(editingBook.author || '');
      setDescription(editingBook.description || '');
      setCoverUrl(editingBook.coverUrl || '');
      setStatus(editingBook.status || 'nao_iniciado');
      if (editingBook.coverUrl?.startsWith('data:')) {
        setCoverSource('file');
      } else if (editingBook.coverUrl) {
        setCoverSource('url');
      } else {
        setCoverSource('file');
      }
    } else {
      setTitle('');
      setAuthor('');
      setDescription('');
      setCoverUrl('');
      setStatus('nao_iniciado');
      setCoverSource('file');
    }
    setTouched(false);
    setError(null);
    setFileError(null);
  }, [editingBook, isOpen]);

  if (!isOpen) return null;

  const handleFileSelected = (file: File) => {
    setFileError(null);

    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
      setFileError('Formato inválido. Por favor, utilize imagens JPG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('Arquivo muito grande. O tamanho máximo permitido é de 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setCoverUrl(optimizedDataUrl);
        } else {
          setCoverUrl(dataUrl);
        }
      };
      img.onerror = () => {
        setCoverUrl(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!title.trim()) {
      setError('O título do livro é obrigatório.');
      titleInputRef.current?.focus();
      return;
    }

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      coverUrl: coverUrl.trim(),
      status,
    });
  };

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
        aria-labelledby="book-form-title"
        tabIndex={-1}
        className="relative w-full max-w-xl bg-white dark:bg-[#121C35] rounded-2xl shadow-2xl border border-[#E2DDD1] dark:border-[#223459] overflow-hidden z-10 max-h-[92vh] flex flex-col text-[#24201C] dark:text-[#F1F5F9] focus:outline-none"
      >
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b border-[#E2DDD1] dark:border-[#223459] flex items-center justify-between bg-[#F6F4EE]/80 dark:bg-[#0B1326]/70">
          <div>
            <h2 id="book-form-title" className="font-serif text-xl sm:text-2xl font-bold text-[#24201C] dark:text-[#F1F5F9]">
              {editingBook ? 'Editar livro' : 'Novo livro para a estante'}
            </h2>
            <p className="text-sm sm:text-base text-[#5A544C] dark:text-[#9CB2D1] mt-0.5 font-sans">
              {editingBook
                ? 'Atualize os dados e o progresso da leitura.'
                : 'Preencha as informações para organizar sua leitura no Readks.'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar formulário de livro"
            className="p-2 text-[#7E776E] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Formulário com labels associados explicitamente */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm sm:text-base" noValidate>
          {/* Campo Título (Obrigatório) */}
          <div>
            <label htmlFor="form-book-title" className="block text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9] mb-1.5">
              Título do livro <span className="text-[#C06338]" aria-hidden="true">*</span>
              <span className="sr-only"> (obrigatório)</span>
            </label>
            <input
              ref={titleInputRef}
              id="form-book-title"
              type="text"
              required
              aria-required="true"
              aria-invalid={!!error || (touched && !title.trim())}
              aria-describedby={error || (touched && !title.trim()) ? 'form-book-title-error' : undefined}
              placeholder="Ex.: Memórias Póstumas de Brás Cubas"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error && e.target.value.trim()) setError(null);
              }}
              onBlur={() => setTouched(true)}
              className={`w-full px-4 py-3 text-base rounded-xl border bg-white dark:bg-[#0B1326] text-[#24201C] dark:text-[#F1F5F9] placeholder-[#7E776E] dark:placeholder-[#6F86A8] focus:outline-none transition-colors ${
                error || (touched && !title.trim())
                  ? 'border-rose-400 focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-950'
                  : 'border-[#E2DDD1] dark:border-[#263C66] focus:ring-2 focus:ring-[#C06338]/20 dark:focus:ring-[#38BDF8]/20 focus:border-[#C06338] dark:focus:border-[#38BDF8]'
              }`}
            />
            {(error || (touched && !title.trim())) && (
              <p id="form-book-title-error" role="alert" className="mt-1.5 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>Por favor, insira o título do livro. Este campo é obrigatório.</span>
              </p>
            )}
          </div>

          {/* Campo Autor */}
          <div>
            <label htmlFor="form-book-author" className="block text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9] mb-1.5">
              Nome do autor <span className="text-[#7E776E] dark:text-[#6F86A8] font-normal">(opcional)</span>
            </label>
            <input
              id="form-book-author"
              type="text"
              placeholder="Ex.: Machado de Assis"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-3 text-base rounded-xl border border-[#E2DDD1] dark:border-[#263C66] bg-white dark:bg-[#0B1326] text-[#24201C] dark:text-[#F1F5F9] placeholder-[#7E776E] dark:placeholder-[#6F86A8] focus:outline-none focus:ring-2 focus:ring-[#C06338]/20 dark:focus:ring-[#38BDF8]/20 focus:border-[#C06338] dark:focus:border-[#38BDF8] transition-colors"
            />
          </div>

          {/* Campo Status de Leitura com Radiogroup Acessível */}
          <fieldset>
            <legend className="block text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9] mb-2">
              Status de leitura
            </legend>
            <div role="radiogroup" aria-label="Selecione o status de leitura do livro" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(['nao_iniciado', 'lendo', 'lido'] as BookStatus[]).map((statusOption) => {
                const isSelected = status === statusOption;
                const config = STATUS_CONFIG[statusOption];
                return (
                  <button
                    key={statusOption}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setStatus(statusOption)}
                    className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                      isSelected
                        ? 'border-[#1E293B] dark:border-[#38BDF8] bg-[#F6F4EE] dark:bg-[#182544] shadow-2xs ring-1 ring-[#1E293B] dark:ring-[#38BDF8]'
                        : 'border-[#E2DDD1] dark:border-[#223459] bg-white dark:bg-[#0B1326] hover:bg-[#F6F4EE]/60 dark:hover:bg-[#182544]/60 text-[#5A544C] dark:text-[#9CB2D1]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} aria-hidden="true" />
                        <span className="text-sm font-semibold text-[#24201C] dark:text-[#F1F5F9]">
                          {config.label}
                        </span>
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-[#24201C] dark:text-[#38BDF8]" aria-hidden="true" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm text-[#7E776E] dark:text-[#9CB2D1] leading-relaxed">
                      {config.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Imagem de Capa (Arquivo / Galeria ou URL) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="block text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9]">
                Capa do livro <span className="text-[#7E776E] dark:text-[#6F86A8] font-normal">(opcional)</span>
              </span>

              {/* Alternador de Origem da Imagem */}
              <div role="tablist" aria-label="Origem da imagem de capa" className="inline-flex rounded-xl p-1 bg-[#EDE9E0] dark:bg-[#182544] text-xs sm:text-sm">
                <button
                  type="button"
                  role="tab"
                  aria-selected={coverSource === 'file'}
                  onClick={() => setCoverSource('file')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                    coverSource === 'file'
                      ? 'bg-white dark:bg-[#223459] text-[#24201C] dark:text-[#F1F5F9] shadow-2xs font-semibold'
                      : 'text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  Arquivo / Galeria
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={coverSource === 'url'}
                  onClick={() => setCoverSource('url')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8] ${
                    coverSource === 'url'
                      ? 'bg-white dark:bg-[#223459] text-[#24201C] dark:text-[#F1F5F9] shadow-2xs font-semibold'
                      : 'text-[#5A544C] hover:text-[#24201C] dark:text-[#9CB2D1] dark:hover:text-[#F1F5F9]'
                  }`}
                >
                  Link da Web (URL)
                </button>
              </div>
            </div>

            {/* Opção 1: Upload de Arquivo / Foto do Celular */}
            {coverSource === 'file' ? (
              <div>
                <input
                  id="form-book-file-upload"
                  type="file"
                  ref={fileInputRef}
                  aria-label="Selecionar imagem da capa nos arquivos do dispositivo"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelected(file);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#E2DDD1] dark:border-[#263C66] hover:border-[#C06338] dark:hover:border-[#38BDF8] rounded-2xl p-5 text-center cursor-pointer transition-colors bg-[#F6F4EE]/50 dark:bg-[#0B1326]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
                >
                  <Upload className="w-6 h-6 mx-auto text-[#7E776E] dark:text-[#6F86A8] mb-2" aria-hidden="true" />
                  <p className="text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9]">
                    Toque para selecionar dos arquivos ou galeria
                  </p>
                  <p className="text-xs sm:text-sm text-[#7E776E] dark:text-[#6F86A8] mt-1">
                    JPG, PNG ou WebP até 5 MB
                  </p>
                </button>
              </div>
            ) : (
              /* Opção 2: URL de Imagem */
              <div className="relative">
                <label htmlFor="form-book-cover-url" className="sr-only">
                  URL da imagem da capa
                </label>
                <LinkIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7E776E] dark:text-[#6F86A8] pointer-events-none" aria-hidden="true" />
                <input
                  id="form-book-cover-url"
                  type="url"
                  placeholder="https://exemplo.com/capa.jpg"
                  value={coverUrl.startsWith('data:') ? '' : coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-base rounded-xl border border-[#E2DDD1] dark:border-[#263C66] bg-white dark:bg-[#0B1326] text-[#24201C] dark:text-[#F1F5F9] placeholder-[#7E776E] dark:placeholder-[#6F86A8] focus:outline-none focus:ring-2 focus:ring-[#C06338]/20 dark:focus:ring-[#38BDF8]/20 focus:border-[#C06338] dark:focus:border-[#38BDF8] transition-colors"
                />
              </div>
            )}

            {fileError && (
              <p role="alert" className="text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                <span>{fileError}</span>
              </p>
            )}

            {/* Pré-visualização da Capa com Ações */}
            <div className="p-4 bg-[#F6F4EE] dark:bg-[#182544] rounded-2xl border border-[#E2DDD1] dark:border-[#253963] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-16 shrink-0 shadow-xs rounded-sm overflow-hidden" aria-hidden="true">
                  <BookCover
                    coverUrl={coverUrl}
                    title={title || 'Título do Livro'}
                    author={author || 'Nome do Autor'}
                    aspectRatio="3:4"
                    showShadow={false}
                  />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-[#24201C] dark:text-[#F1F5F9] block">
                    {coverUrl ? 'Capa selecionada' : 'Capa padrão ativa'}
                  </span>
                  <span className="text-xs sm:text-sm text-[#7E776E] dark:text-[#9CB2D1] leading-relaxed">
                    {coverUrl
                      ? coverUrl.startsWith('data:')
                        ? 'Imagem armazenada localmente no dispositivo'
                        : 'Imagem por URL web'
                      : 'Sem imagem. Uma capa tipográfica clássica será exibida.'}
                  </span>
                </div>
              </div>

              {coverUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setCoverUrl('');
                    setFileError(null);
                  }}
                  aria-label="Remover imagem de capa selecionada"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 font-medium"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Remover capa</span>
                </button>
              )}
            </div>
          </div>

          {/* Campo Descrição ou Sinopse */}
          <div>
            <label htmlFor="form-book-description" className="block text-sm sm:text-base font-semibold text-[#24201C] dark:text-[#F1F5F9] mb-1.5">
              Descrição ou sinopse <span className="text-[#7E776E] dark:text-[#6F86A8] font-normal">(opcional)</span>
            </label>
            <textarea
              id="form-book-description"
              rows={3}
              placeholder="Adicione um breve resumo da obra, primeiras impressões ou citações..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 text-base rounded-xl border border-[#E2DDD1] dark:border-[#263C66] bg-white dark:bg-[#0B1326] text-[#24201C] dark:text-[#F1F5F9] placeholder-[#7E776E] dark:placeholder-[#6F86A8] focus:outline-none focus:ring-2 focus:ring-[#C06338]/20 dark:focus:ring-[#38BDF8]/20 focus:border-[#C06338] dark:focus:border-[#38BDF8] transition-colors resize-y min-h-[90px] leading-relaxed"
            />
          </div>

          {/* Rodapé de Ações */}
          <div className="pt-4 border-t border-[#E2DDD1] dark:border-[#223459] flex items-center justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-[#5A544C] dark:text-[#9CB2D1] hover:text-[#24201C] dark:hover:text-[#F1F5F9] hover:bg-[#EDE9E0] dark:hover:bg-[#182544] rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1E293B] hover:bg-[#0F172A] text-white dark:bg-[#F1F5F9] dark:text-[#0B1326] dark:hover:bg-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C06338] dark:focus-visible:ring-[#38BDF8]"
            >
              {editingBook ? 'Salvar alterações' : 'Adicionar à estante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
