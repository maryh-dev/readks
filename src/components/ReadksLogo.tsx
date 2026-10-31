import React from 'react';

interface ReadksLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  isDark?: boolean;
}

export const ReadksLogo: React.FC<ReadksLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const symbolSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
      role="img"
      aria-label="Readks — organização de leitura"
    >
      {/* Símbolo do Livro Aberto com Páginas Estilizadas */}
      <div
        className={`relative shrink-0 ${symbolSizes[size]} flex items-center justify-center`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Fundo do emblema com cantos arredondados suaves */}
          <rect
            width="48"
            height="48"
            rx="12"
            className="fill-[#1E293B] dark:fill-[#1E2E4F] transition-colors"
          />

          {/* Livro Aberto: Página Esquerda */}
          <path
            d="M24 33.5C18.5 31.8 12.8 32 8.5 33.2V16.8C12.8 15.6 18.5 15.4 24 17.1V33.5Z"
            className="fill-[#F7F5F0] dark:fill-[#F1F5F9] transition-colors"
          />

          {/* Livro Aberto: Página Direita */}
          <path
            d="M24 33.5C29.5 31.8 35.2 32 39.5 33.2V16.8C35.2 15.6 29.5 15.4 24 17.1V33.5Z"
            className="fill-[#EDE8DE] dark:fill-[#CBD5E1] transition-colors"
          />

          {/* Linha da Lombada Central */}
          <line
            x1="24"
            y1="17"
            x2="24"
            y2="34"
            stroke="#1E293B"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="dark:stroke-[#101A2E]"
          />

          {/* Marcador de Página / Fita Bookmark em Terracotta Acolhedor */}
          <path
            d="M22.5 16.5H25.5V23.5L24 22L22.5 23.5V16.5Z"
            className="fill-[#C06338] dark:fill-[#E07A48] transition-colors"
          />
        </svg>
      </div>

      {/* Wordmark Readks com tipografia Lora refinada */}
      {showWordmark && (
        <span
          className={`font-serif font-bold tracking-tight text-[#24201C] dark:text-[#F1F5F9] transition-colors leading-none ${textSizes[size]}`}
          aria-hidden="true"
        >
          Readks
        </span>
      )}
    </div>
  );
};
