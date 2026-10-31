# Readks — Estante Digital Minimalista

> **Organizador pessoal de leituras focado em simplicidade, privacidade e conforto visual.**  
> Gerencie os livros que deseja ler, está lendo ou já concluiu, registre anotações e tenha controle total sobre seus dados locais com suporte offline (PWA).

---

## Sumário

1. [Apresentação do Projeto](#1-apresentação-do-projeto)
2. [Funcionalidades](#2-funcionalidades)
3. [Tecnologias Utilizadas](#3-tecnologias-utilizadas)
4. [Arquitetura e Estrutura do Projeto](#4-arquitetura-e-estrutura-do-projeto)
5. [Funcionamento da Aplicação](#5-funcionamento-da-aplicação)
6. [Armazenamento e Gerenciamento de Dados](#6-armazenamento-e-gerenciamento-de-dados)
7. [Identidade Visual e Acessibilidade](#7-identidade-visual-e-acessibilidade)
8. [PWA e Funcionamento Offline](#8-pwa-e-funcionamento-offline)
9. [Instalação e Execução](#9-instalação-e-execução)
10. [Publicação no GitHub Pages](#10-publicação-no-github-pages)
11. [Limitações Conhecidas](#11-limitações-conhecidas)
12. [Manutenção e Evolução](#12-manutenção-e-evolução)

---

## 1. Apresentação do Projeto

### O que é o Readks?
O **Readks** é uma aplicação web progressiva (PWA) projetada como uma estante de leitura digital minimalista. O projeto nasceu da necessidade de leitores que desejam catalogar e acompanhar o progresso de seus livros sem o ruído, as métricas punitivas, as notificações invasivas e as redes sociais presentes nas plataformas de leitura convencionais.

### Problemas que Resolve
- **Excesso de complexidade:** Ferramentas convencionais exigem configurações exaustivas, metas numéricas rígidas e algoritmos de engajamento social. O Readks adota a abordagem oposta: foco exclusivo na experiência íntima de leitura.
- **Privacidade e soberania dos dados:** Todos os dados da biblioteca, capas carregadas localmente e anotações pertencem ao usuário e ficam armazenados diretamente no navegador (IndexedDB), sem contas obrigatórias ou rastreamento remoto.
- **Legibilidade inadequada:** Plataformas densas utilizam tipografia diminuta e paletas cansativas. O Readks adota uma base mínima de 16px, entrelinha confortável (1.4–1.6), temas equilibrados (marfim aquecido para o claro e azul-marinho profundo para o escuro) e suporte a personalização tipográfica global.
- **Uso em mobilidade e sem conexão:** Suporta instalação como aplicativo de tela cheia no desktop e celular, permitindo registrar leituras e anotações mesmo sem internet.

### Objetivos do Readks
1. **Simplicidade acolhedora:** Facilitar o fluxo de registro e consulta de obras em poucos cliques.
2. **Acessibilidade universal:** Garantir conformidade com as diretrizes WCAG 2.1 (AA), navegação consistente por teclado, leitores de tela e controle fino de movimento e contraste.
3. **Independência tecnológica:** Capacidade de exportar e importar a biblioteca inteira em formato aberto JSON a qualquer momento.

---

## 2. Funcionalidades

| Funcionalidade | Descrição | Como Utilizar |
| :--- | :--- | :--- |
| **Cadastro de Livros** | Registra uma nova obra com título (obrigatório), autor, sinopse/descrição, status inicial e capa. | Clicar no botão **"Novo livro"** (topo ou estante vazia), preencher os campos e salvar. |
| **Capas Híbridas (URL ou Arquivo Local)** | Aceita tanto links de imagens externas (`http://`/`https://`) quanto upload de imagens locais (JPG, PNG, WebP) convertidas em `base64`. Se nenhuma capa for informada, gera uma capa editorial tipográfica automática com monograma e paleta harmonizada. | No modal de cadastro/edição, colar a URL ou usar o botão **"Enviar do computador/celular"**. |
| **Estante em Grade e Lista** | Alternância instantânea de visualização entre grade de cartões visuais com capa e modo lista detalhada com metadados estendidos. | Clicar nos ícones de **Grade** (`LayoutGrid`) ou **Lista** (`List`) no topo da estante. |
| **Filtros de Status de Leitura** | Filtragem por abas segmentadas com contadores dinâmicos: *Todos os livros*, *Não iniciados*, *Em andamento* e *Lidos*. | Clicar em qualquer uma das abas de filtro na barra superior da estante. |
| **Avanço Rápido de Status** | Transição cíclica em 1 clique: `Não iniciado` ➔ `Em andamento` ➔ `Lido` ➔ `Não iniciado`. | Clicar no botão de status rápido no cartão do livro, no widget ou no modal de detalhes. |
| **Painel Rápido de Leitura (Widget)** | Destaque do livro atualmente em leitura com capa ampliada, atalho de conclusão e acesso aos 3 últimos livros cadastrados. | Exibido automaticamente no topo da página sempre que houver obras cadastradas. |
| **Anotações Pessoais de Leitura** | Bloco de anotações ilimitado vinculado a cada livro, com registro de data/hora de criação e edição. | Abrir os detalhes do livro, clicar na aba **"Anotações"**, redigir o texto e salvar. |
| **Busca Instantânea** | Filtragem em tempo real por correspondência no título ou no nome do autor. | Digitar no campo de busca presente no cabeçalho. Um botão para limpar o campo surge ao digitar. |
| **Ordenação Flexível** | Ordenação dos livros por: mais recentes, mais antigos, título alfabético (A-Z) ou autor (A-Z). | Acessar **Configurações (ícone de engrenagem) > Preferências de Leitura > Ordenação padrão**. |
| **Edição e Exclusão Segura** | Atualização completa de metadados e exclusão com diálogo modal de confirmação para prevenir perdas acidentais. | No cartão ou modal de detalhes, clicar em **Editar** ou **Excluir** (exige confirmação explícita). |
| **Backup e Restauração (JSON)** | Exporta todo o banco de dados (livros, imagens locais e anotações) em um arquivo `.json` estruturado, ou restaura uma biblioteca previamente salva. | Abrir **Configurações > Backup & Dados**, e clicar em **"Exportar biblioteca (JSON)"** ou selecionar um arquivo para restaurar. |
| **Aparência e Temas** | Modos Claro (marfim aquecido `#F6F4EE`), Escuro (azul-marinho profundo `#0B1326`) ou Automático (sincronizado com o sistema operacional). | Abrir **Configurações > Aparência** e selecionar o modo desejado. |
| **Ajustes de Acessibilidade** | Seleção de 4 tamanhos de fonte globais (15px, 16px, 18.5px, 21px), redução forçada de animações e modo de alto contraste. | Abrir **Configurações > Acessibilidade** e configurar as opções. |
| **Instalação PWA e Modo Offline** | Instalação nativa em computadores e celulares, com banner de aviso de conectividade offline. | Clicar em **Instalar aplicativo** nas Configurações ou pelo prompt do navegador. |

---

## 3. Tecnologias Utilizadas

### Linguagens e Plataforma
- **TypeScript 7.0**: Tipagem estática estrita em toda a base de código, garantindo manutenibilidade e prevenção de erros em tempo de compilação.
- **HTML5 Semântico**: Estruturação baseada em landmarks (`<header role="banner">`, `<main role="main">`, `<footer role="contentinfo">`, `<nav>`, `<dialog role="dialog">`).

### Framework e Bibliotecas Frontend
- **React 19 (`react` e `react-dom`)**: Construção declarativa da interface em componentes funcionais e hooks customizados.
- **Tailwind CSS v4 (`@tailwindcss/vite` e `tailwindcss 4.3.3`)**: Sistema de estilos atômicos moderno utilizando a diretiva `@theme` e variantes nativas para dark mode (`@custom-variant dark`).
- **Lucide React (`lucide-react`)**: Conjunto de ícones vetoriais leves e consistentes com atributos acessíveis (`aria-hidden="true"`).
- **Motion (`motion`)**: Utilitários de animação suave para transições fluidas de interface.

### Build Tools e PWA
- **Vite 8 (`vite`)**: Ambiente de desenvolvimento ultrarrápido com Hot Module Replacement e empacotamento otimizado para produção.
- **Vite Plugin PWA (`vite-plugin-pwa`)**: Configuração automática de Service Worker (Workbox), manifesto PWA (`manifest.webmanifest`) e estratégias de cache para fontes e ativos estáticos.

### Armazenamento Local
- **IndexedDB (via API nativa do navegador)**: Armazenamento persistente para a coleção de livros, capas e anotações (`readks_db`), eliminando as restrições severas de tamanho do localStorage.
- **Web Storage API (`localStorage`)**: Persistência síncrona leve para as preferências e configurações de acessibilidade do usuário (`readks_user_settings_v1`).

---

## 4. Arquitetura e Estrutura do Projeto

A aplicação adota uma arquitetura modular por responsabilidade (Separation of Concerns):

```
readks/
├── public/                     # Ativos estáticos e ícones PWA
│   ├── apple-touch-icon.png    # Ícone para iOS Safari (180x180)
│   ├── icon.svg                # Ícone vetorial da marca
│   ├── pwa-192x192.png         # Ícone PWA padrão (192x192)
│   ├── pwa-512x512.png         # Ícone PWA alta resolução (512x512)
│   └── pwa-maskable-512x512.png# Ícone PWA maskable para Android
├── src/
│   ├── assets/                 # Ativos internos
│   ├── components/             # Componentes visuais da interface
│   │   ├── BookCard.tsx        # Cartão de livro (modos grade e lista)
│   │   ├── BookCover.tsx       # Renderizador de capas (imagem ou editorial dinâmico)
│   │   ├── BookFormModal.tsx   # Modal de criação e edição de livros com upload de capa
│   │   ├── BookModal.tsx       # Modal de detalhes do livro e painel de anotações
│   │   ├── DeleteConfirmModal.tsx # Diálogo de confirmação de exclusão segura
│   │   ├── EmptyState.tsx      # Estados vazios (sem livros ou sem resultados de busca)
│   │   ├── Header.tsx          # Cabeçalho com busca, estatísticas e atalhos
│   │   ├── OfflineIndicator.tsx# Alerta discreto de status desconectado
│   │   ├── ReadingWidget.tsx   # Painel rápido de leitura ativa no topo
│   │   ├── ReadksLogo.tsx      # Monograma e logotipo oficial em SVG
│   │   ├── SettingsModal.tsx   # Modal com abas de preferências e backup
│   │   ├── StatusFilter.tsx    # Navegação por abas com contadores por status
│   │   └── Toast.tsx           # Notificações contextuais acessíveis (aria-live)
│   ├── hooks/                  # Hooks React reutilizáveis
│   │   ├── useFocusTrap.ts     # Gerenciamento acessível de foco em modais
│   │   ├── useOnlineStatus.ts  # Monitoramento de status de conectividade do navegador
│   │   └── usePWAInstall.ts    # Captura e acionamento do prompt de instalação PWA
│   ├── services/               # Camada de regras de negócio e persistência
│   │   ├── bookStorage.ts      # Casos de uso de livros, anotações, exportação e importação
│   │   ├── db.ts               # Camada de baixo nível de acesso ao IndexedDB
│   │   └── settingsStorage.ts  # Gerenciamento de configurações e aplicação de classes no DOM
│   ├── types/
│   │   └── book.ts             # Interfaces TypeScript e definições de status
│   ├── App.tsx                 # Componente raiz que orquestra o estado global
│   ├── index.css               # Estilos globais Tailwind 4, temas, fontes e acessibilidade
│   └── main.tsx                # Ponto de entrada React com hidratação do DOM
├── index.html                  # Template HTML5 com tags de meta e pré-carregamento de fontes
├── metadata.json               # Metadados de identificação do projeto
├── package.json                # Dependências e scripts do Node.js
├── tsconfig.json               # Configurações do compilador TypeScript
└── vite.config.ts              # Configuração do Vite, Tailwind e PWA
```

### Responsabilidades dos Componentes Principais

| Componente | Papel Arquitetural |
| :--- | :--- |
| `App.tsx` | Orquestrador de estado global: carrega livros do IndexedDB, aplica configurações no DOM, gerencia estados de busca, filtros, modais e anúncios para leitores de tela (`aria-live`). |
| `db.ts` | Inicializa a base `readks_db` (v1) no IndexedDB com a store `books` e índices para consultas rápidas. Implementa transações de leitura e escrita tipadas. |
| `bookStorage.ts` | Encapsula as operações CRUD, avanço de ciclo de leitura, inserção/edição/exclusão de anotações e serialização do backup JSON. |
| `settingsStorage.ts` | Salva o perfil do usuário em `localStorage` e aplica diretamente atributos (`data-font-size`) e classes (`dark`, `reduce-motion`, `high-contrast`) no elemento `<html>`. |
| `BookCover.tsx` | Tenta renderizar a imagem informada; se ausente ou corrompida, gera uma capa editorial proporcional com textura, tipografia Lora e paleta derivada do título. |
| `useFocusTrap.ts` | Garante conformidade de acessibilidade para teclado: prende a navegação por `Tab` dentro de diálogos abertos, fecha em `Escape` e devolve o foco ao elemento originador ao fechar. |

---

## 5. Funcionamento da Aplicação

### 1. Ciclo de Vida do Cadastro e Edição de Livros
```
[Usuário clica em 'Novo Livro']
       │
       ▼
[BookFormModal abre com foco no título]
       │
       ├─► Título (obrigatório, validado contra espaços em branco)
       ├─► Autor (opcional)
       ├─► Descrição / Sinopse (opcional)
       ├─► Capa: URL externa OU upload de arquivo local convertido em base64
       └─► Status inicial de leitura
       │
       ▼
[Salvar: generate ID 'book-{timestamp}-{hash}']
       │
       ▼
[Gravação no IndexedDB via saveBookToDB()]
       │
       ▼
[Atualização do estado React + Toast + Anúncio de Leitor de Tela]
```

### 2. Ciclo de Leitura e Status
Os livros transitam em um ciclo progressivo pré-definido:
$$\text{Não iniciado} \longrightarrow \text{Em andamento} \longrightarrow \text{Lido} \longrightarrow \text{Não iniciado (reler)}$$

- **Não iniciado (`nao_iniciado`):** Livro aguardando leitura na fila. Badge em tom âmbar/dourado.
- **Em andamento (`lendo`):** Livro em leitura ativa. Badge em tom azul suave. Se houver um livro com este status, ele é promovido ao **Painel Rápido de Leitura** no topo da estante.
- **Lido (`lido`):** Obra concluída. Badge em tom verde esmeralda.

O avanço pode ser realizado com um único clique no botão de status contido no cartão do livro (`BookCard`), no painel superior (`ReadingWidget`) ou no modal de detalhes (`BookModal`).

### 3. Anotações Pessoais
Cada livro possui uma coleção individual de anotações (`notes: BookNote[]`).
- Ao abrir os detalhes do livro, o usuário pode alternar para a aba **"Anotações"**.
- As anotações aceitam textos extensos e contam com carimbos de data/hora (`createdAt` e `updatedAt`).
- Cada anotação pode ser editada individualmente no local ou excluída.
- Ao excluir um livro da biblioteca, todas as suas anotações vinculadas são eliminadas em cascata.

### 4. Fluxo de Exclusão Segura
Para evitar perdas involuntárias, o Readks **não possui exclusão em um clique**:
1. O usuário aciona a exclusão no cartão ou no modal de detalhes.
2. É renderizado o diálogo modal de alerta `DeleteConfirmModal` (`role="alertdialog"`).
3. O foco inicial do teclado é estrategicamente posicionado no botão **"Cancelar"** por precaução.
4. O usuário deve confirmar expressamente clicando em **"Sim, excluir definitivamente"** ou pressionar `Escape` para cancelar.

---

## 6. Armazenamento e Gerenciamento de Dados

O Readks segue o princípio **Offline-First / Local-First**: todos os dados são mantidos localmente no cliente.

### Estrutura do IndexedDB (`db.ts`)
- **Nome da base:** `readks_db`
- **Versão:** `1`
- **Object Store:** `books` (chave primária `keyPath: "id"`)
- **Índices:**
  - `status`: Permite consultas otimizadas por status de leitura.
  - `createdAt`: Permite ordenação cronológica.

#### Modelo de Dados do Livro (`Book`):
```typescript
interface Book {
  id: string;               // Ex: "book-1730000000000-a1b2c3"
  title: string;            // Título do livro (obrigatório)
  author?: string;          // Nome do autor (opcional)
  description?: string;     // Sinopse ou resumo
  coverUrl?: string;        // URL remota ou data:image/png;base64,...
  status: BookStatus;       // 'nao_iniciado' | 'lendo' | 'lido'
  notes?: BookNote[];       // Lista de anotações pessoais
  createdAt: number;        // Timestamp Epoch (ms)
  updatedAt: number;        // Timestamp Epoch (ms)
}

interface BookNote {
  id: string;               // Ex: "note-1730000000000-x9y8"
  bookId: string;           // Referência ao livro pai
  content: string;          // Texto da anotação
  createdAt: number;        // Timestamp de criação
  updatedAt: number;        // Timestamp da última edição
}
```

### Armazenamento de Configurações (`settingsStorage.ts`)
As preferências da interface são mantidas no `localStorage` sob a chave `readks_user_settings_v1`:

```typescript
interface UserSettings {
  theme: 'auto' | 'light' | 'dark'; // Padrão: 'auto'
  fontSize: 'sm' | 'md' | 'lg' | 'xl'; // Padrão: 'md' (16px base)
  reduceMotion: boolean;             // Padrão: false
  highContrast: boolean;             // Padrão: false
  viewMode: 'grid' | 'list';         // Padrão: 'grid'
  sortBy: 'recent' | 'oldest' | 'title' | 'author'; // Padrão: 'recent'
}
```

### Migração de Legado Automática
Caso o usuário possua dados remanescentes de versões preliminares salvas no antigo `localStorage.readks_books_v1`, a rotina `migrateFromLocalStorageIfNeeded()` detecta os livros legítimos do usuário, importa-os para o IndexedDB e limpa a chave antiga para evitar redundância.

### Exportação e Importação de Backup (JSON)
O Readks permite a geração de backups portáveis:

```json
{
  "app": "Readks",
  "version": 1,
  "exportedAt": "2026-10-31T12:00:00.000Z",
  "books": [ ... ],
  "settings": { ... }
}
```
- **Exportação:** Serializa todos os registros do IndexedDB e configurações em formato legível e efetua o download automático de um arquivo `.json` datado.
- **Restauração:** O arquivo enviado pelo usuário passa por validação de integridade. Livros válidos são salvos no IndexedDB via transação `bulkImportBooksToDB()`.

---

## 7. Identidade Visual e Acessibilidade

### Tipografia
- **Títulos e Destaques:** **Lora** (`font-serif`), fonte serifada clássica que remete à experiência editorial de livros físicos.
- **Textos de Interface e Leitura:** **DM Sans** (`font-sans`), fonte geométrica sem serifa com excelente legibilidade em telas de diferentes densidades.
- **Altura de Linha (Line-height):** Definida em `1.55` para textos de leitura prolongada (sinopses, descrições e anotações), prevenindo fadiga visual.

### Paleta de Cores Cuidadosamente Equilibrada
Evita o branco puro (`#FFFFFF`) e o preto puro (`#000000`), optando por matizes orgânicos:

| Elemento | Modo Claro (Warm Ivory) | Modo Escuro (Deep Navy) |
| :--- | :--- | :--- |
| **Canvas / Fundo Geral** | `#F6F4EE` (marfim aquecido) | `#0B1326` (azul-marinho profundo) |
| **Superfície / Cartões** | `#FFFFFF` | `#121C35` (marinho intermediário) |
| **Superfície Elevada** | `#FFFFFF` | `#182544` |
| **Bordas** | `#E2DDD1` (bege suave) | `#223459` (azul petróleo suave) |
| **Texto Primário** | `#24201C` (carvão aquecido) | `#F1F5F9` (branco gelo suave) |
| **Texto Secundário** | `#5A544C` | `#9CB2D1` |
| **Destaque Primário** | `#1E293B` (azul ardósia) | `#38BDF8` (azul celeste) |
| **Destaque Acolhedor** | `#C06338` (terracota) | `#E07A48` (terracota vivo) |

### Escala de Fontes de Acessibilidade
Configurável pelo usuário no atributo `data-font-size` da tag `<html>`:
- **Pequeno (`sm`):** `15px`
- **Padrão (`md`):** `16px` (tamanho base padrão da aplicação)
- **Grande (`lg`):** `18.5px`
- **Extra Grande (`xl`):** `21px`

### Recursos de Acessibilidade (WCAG 2.1 AA)
1. **Foco Visível Acessível (`:focus-visible`):** Destaque de 2px com anel de foco em cor contrastante (`#C06338` no claro, `#38BDF8` no escuro) com `outline-offset: 2px` para navegação eficiente via teclado.
2. **Armadilha de Foco (`useFocusTrap`):** Confinamento do foco de teclado dentro de modais abertos, suporte a fechar via tecla `Escape` e restauração do foco para o elemento disparador.
3. **Leitores de Tela:**
   - Região viva com `role="status"` e `aria-live="polite"` que verbaliza ações dinâmicas (ex.: *"Visualização em grade ativada"*, *"Status alterado para Lido"*).
   - Link de salto acessível (*Skip to content*) no topo da página: `"Pular para o conteúdo principal"`.
   - Botões com ícones possuem `aria-label` descritivos ou texto visível correspondente.
   - Capas de livro contam com texto alternativo dinâmico descritivo: `"Capa do livro [Título], de autoria de [Autor]"`.
4. **Modo Movimento Reduzido (`html.reduce-motion`):** Desativa transições e animações com duração de `0.001ms` para usuários sensíveis a movimento vestibular.
5. **Modo Alto Contraste (`html.high-contrast`):** Reforça todas as bordas e contornos da interface para facilitar a distinção visual.

---

## 8. PWA e Funcionamento Offline

O Readks é configurado como uma **Progressive Web App** completa através do `vite-plugin-pwa`:

### Manifesto PWA (`manifest.webmanifest`)
- **Nome:** Readks - Estante de Leituras
- **Short Name:** Readks
- **Modo de Exibição:** `standalone` (interface de janela nativa, sem barra de navegação do navegador)
- **Cores do Sistema:** `theme_color: "#0B1326"`, `background_color: "#F6F4EE"`
- **Ícones Inclusos:** 192x192, 512x512 e versão maskable para compatibilidade total com dispositivos Android.

### Service Worker e Estratégia de Cache (Workbox)
1. **Pre-caching de Ativos Estáticos:** Arquivos HTML, scripts compilados (`.js`), folhas de estilo (`.css`), SVG e ícones são pré-cacheados durante o build.
2. **Runtime Caching para Fontes Google:**
   - **Folhas de estilo (`fonts.googleapis.com`):** Estratégia `CacheFirst` com expiração de 1 ano.
   - **Arquivos de fontes (`fonts.gstatic.com`):** Estratégia `CacheFirst` com expiração de 1 ano.
3. **Atualização Automática:** Configurado com `registerType: 'autoUpdate'`, garantindo que novos builds sejam carregados sem interrupções manuais.

### Comportamento em Modo Offline
- A aplicação detecta a perda de conectividade através do hook `useOnlineStatus`.
- Um aviso discreto (`OfflineIndicator`) é exibido no canto inferior da tela informando que os dados continuam salvos localmente.
- O usuário pode cadastrar, editar, excluir, filtrar e anotar normalmente enquanto desconectado.
- **Observação técnica importante sobre imagens:**
  - Capas carregadas via upload de arquivo local (armazenadas em `base64`) funcionam **100% offline**.
  - Capas inseridas via URL externa (`http://...`) dependem do cache prévio do navegador; se a imagem externa ainda não foi carregada pelo dispositivo, o Readks exibe automaticamente a capa tipográfica editorial em seu lugar.

---

## 9. Instalação e Execução

### Pré-requisitos
- **Node.js:** Versão 18.x, 20.x ou superior recomendada.
- **Gerenciador de Pacotes:** `npm` (versão 9+), `yarn`, `pnpm` ou `bun`.

### Passo a Passo

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/seu-usuario/readks.git
   cd readks
   ```

2. **Instalar as Dependências:**
   ```bash
   npm install
   ```

3. **Executar em Ambiente de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:3000`.

4. **Verificar Tipagem e Lint:**
   ```bash
   npm run lint
   ```

5. **Gerar Build de Produção:**
   ```bash
   npm run build
   ```
   Os artefatos estáticos otimizados serão gerados no diretório `dist/`.

6. **Testar o Build Localmente (Preview):**
   ```bash
   npm run preview
   ```

---

## 10. Publicação no GitHub Pages

O Readks já foi arquitetado para compatibilidade nativa com o **GitHub Pages**:
- A configuração `base: './'` em `vite.config.ts` garante que os caminhos para scripts, CSS e manifestos sejam relativos, permitindo que o app rode em subdiretórios como `https://seu-usuario.github.io/readks/`.

### Opção Recomendada: GitHub Actions (Automatizado)

1. Crie o arquivo `.github/workflows/deploy.yml` com o seguinte conteúdo:

```yaml
name: Deploy Readks to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repositório
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar dependências
        run: npm ci

      - name: Compilar projeto (Vite build)
        run: npm run build

      - name: Configurar artefato do Pages
        uses: actions/configure-pages@v4

      - name: Fazer upload do artefato do Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Publicar no GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. No repositório no GitHub:
   - Acesse **Settings** > **Pages**.
   - Em **Build and deployment** > **Source**, selecione **GitHub Actions**.
   - Realize um push na branch `main`: a esteira efetuará o build e publicará a aplicação automaticamente.

---

## 11. Limitações Conhecidas

Por aderir estritamente à privacidade e à simplicidade local-first, o Readks possui algumas restrições arquiteturais documentadas:

1. **Armazenamento 100% Local (Sem Nuvem):**
   - Os dados residem exclusivamente no navegador onde foram inseridos.
   - **Não há sincronização automática entre dispositivos:** Livros adicionados no computador não aparecerão automaticamente no celular.
   - *Solução disponível:* O usuário pode exportar o arquivo JSON de backup nas Configurações e restaurá-lo no outro dispositivo.

2. **Políticas de Retenção e Limpeza do Navegador:**
   - Em navegadores de dispositivos móveis (como Safari no iOS ou navegadores em modo anônimo), o sistema operacional pode descartar dados de IndexedDB se o dispositivo atingir limite de armazenamento ou se o site ficar inativo por períodos prolongados. Recomenda-se exportar backups periódicos.

3. **Imagens Externas via URL:**
   - Imagens de capa apontadas para servidores externos de terceiros podem quebrar caso o link original seja excluído ou se o servidor de origem bloquear requisições por política de *hotlinking* (CORS). Para evitar isso, recomenda-se fazer upload direto da imagem local.

4. **Ausência Intencional de Recursos Sociais:**
   - O Readks não possui formulários de login, perfil público, feed de amigos ou integração com redes sociais.

---

## 12. Manutenção e Evolução

### Boas Práticas para Novos Desenvolvedores
- **Novos Campos em Livros:** Ao estender a interface `Book` em `src/types/book.ts`, lembre-se de atualizar `BookFormData`, as funções de sanitização em `src/services/bookStorage.ts` e a validação do importador JSON.
- **Estilos e Cores:** Utilize as variáveis semânticas do Tailwind definidas em `src/index.css` (`--app-canvas`, `--app-surface`, etc.) para garantir que qualquer novo componente responda harmoniosamente aos modos claro, escuro e alto contraste.
- **Acessibilidade:** Ao introduzir modais ou menus suspensos, utilize sempre o hook `useFocusTrap` e inclua identificadores `aria-label` em botões de ação sem texto visível.
- **Tamanho Mínimo de Fonte:** Manter a diretriz de **16px mínimo** (`text-base`) para o corpo da interface para assegurar leitura confortável.

### Roteiro de Evoluções Futuras Sugeridas
- [ ] Implementação de tags/gêneros literários personalizáveis.
- [ ] Campo de número de páginas com barra de progresso percentual (opcional e não invasivo).
- [ ] Histórico de datas de início e término da leitura de cada obra.
- [ ] Sincronização ponta a ponta criptografada via WebDAV ou repositório pessoal (mantendo a privacidade).

---

## Licença

Este projeto é disponibilizado sob a licença **Apache 2.0**. Consulte o arquivo de licença para mais detalhes.
