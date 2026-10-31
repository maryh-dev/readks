import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  coverUrl?: string;
  title: string;
  author?: string;
  className?: string;
  aspectRatio?: '3:4' | '2:3' | 'auto';
  showShadow?: boolean;
}

const COVER_THEMES = [
  {
    bg: 'bg-[#121C35] text-[#F1F5F9]',
    spine: 'border-l-[#0A1020]',
    accent: 'text-[#F59E0B]',
    border: 'border-[#223459]',
  },
  {
    bg: 'bg-[#7C361E] text-[#FDFBF7]',
    spine: 'border-l-[#562211]',
    accent: 'text-[#FDE68A]',
    border: 'border-[#9E4628]',
  },
  {
    bg: 'bg-[#1A382E] text-[#F0FDF4]',
    spine: 'border-l-[#10241E]',
    accent: 'text-[#86EFAC]',
    border: 'border-[#285747]',
  },
  {
    bg: 'bg-[#29231D] text-[#FAF7F2]',
    spine: 'border-l-[#1A1612]',
    accent: 'text-[#FCD34D]',
    border: 'border-[#3D352D]',
  },
  {
    bg: 'bg-[#2D2438] text-[#FAF5FF]',
    spine: 'border-l-[#1D1724]',
    accent: 'text-[#D8B4FE]',
    border: 'border-[#433654]',
  },
];

export const BookCover: React.FC<BookCoverProps> = ({
  coverUrl,
  title,
  author,
  className = '',
  aspectRatio = '3:4',
  showShadow = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const themeIndex = Math.abs(
    title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % COVER_THEMES.length;
  const theme = COVER_THEMES[themeIndex];

  const aspectClass =
    aspectRatio === '3:4'
      ? 'aspect-[3/4]'
      : aspectRatio === '2:3'
      ? 'aspect-[2/3]'
      : 'aspect-[3/4]';

  const shouldRenderImage = coverUrl && !hasError;
  const accessibleAltText = `Capa do livro ${title}${author ? `, de autoria de ${author}` : ''}`;

  return (
    <div
      className={`relative overflow-hidden rounded-md ${aspectClass} ${
        showShadow ? 'shadow-md shadow-[#0E172A]/10 dark:shadow-black/40' : ''
      } transition-transform duration-200 ${className}`}
    >
      {/* Efeito realista de lombada de livro no lado esquerdo */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute left-3 top-0 bottom-0 w-px bg-white/10 z-10 pointer-events-none"
        aria-hidden="true"
      />

      {shouldRenderImage ? (
        <>
          <img
            src={coverUrl}
            alt={accessibleAltText}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isLoaded && (
            <div
              className={`absolute inset-0 ${theme.bg} animate-pulse flex items-center justify-center`}
              aria-hidden="true"
            >
              <BookOpen className="w-8 h-8 opacity-30 text-[#CBD5E1]" />
            </div>
          )}
        </>
      ) : (
        /* Capa editorial tipográfica padrão baseada em Lora */
        <div
          role="img"
          aria-label={`Capa padrão estilizada para ${title}${author ? `, por ${author}` : ''}`}
          className={`w-full h-full p-4 flex flex-col justify-between ${theme.bg} ${theme.border} border relative select-none`}
        >
          {/* Textura sutil de fundo */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/[0.2] pointer-events-none"
            aria-hidden="true"
          />

          {/* Topo da capa com monograma Readks */}
          <div
            className="relative z-1 flex items-center justify-between text-[11px] uppercase tracking-widest opacity-80"
            aria-hidden="true"
          >
            <span className="font-serif font-semibold">Readks</span>
            <BookOpen className="w-3.5 h-3.5 opacity-80" />
          </div>

          {/* Centro: Título com tipografia Lora */}
          <div className="relative z-1 my-auto text-center py-2 px-1" aria-hidden="true">
            <h4 className="font-serif text-base sm:text-lg font-bold leading-snug line-clamp-3 mb-1.5 text-balance">
              {title}
            </h4>
            <div className={`w-8 h-0.5 mx-auto my-2.5 ${theme.accent} bg-current opacity-70`} />
            {author ? (
              <p className="font-sans text-xs uppercase tracking-wider opacity-90 font-medium line-clamp-1">
                {author}
              </p>
            ) : (
              <p className="font-sans text-[11px] italic opacity-50">Autor não informado</p>
            )}
          </div>

          {/* Rodapé da capa */}
          <div className="relative z-1 text-center" aria-hidden="true">
            <span className="font-sans text-[10px] uppercase tracking-widest opacity-60">
              Biblioteca Pessoal
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
