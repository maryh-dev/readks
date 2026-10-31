# Readks

Uma biblioteca digital pessoal para organizar livros, acompanhar leituras e registrar anotações.

O **Readks** é uma aplicação web desenvolvida para tornar a organização de leituras mais simples, oferecendo uma experiência minimalista, acessível e personalizada.

## Funcionalidades

- Cadastro, edição e exclusão de livros.
- Organização por status: não iniciado, em andamento e lido.
- Visualização em grade ou lista.
- Busca e filtros por título, autor e status.
- Adição de capas por URL ou arquivo local.
- Anotações pessoais vinculadas aos livros.
- Alternância entre tema claro e escuro.
- Personalização de fontes e recursos de acessibilidade.
- Exportação e importação de biblioteca.
- Instalação como PWA e suporte ao funcionamento offline.

## Tecnologias

- React 19
- TypeScript
- Tailwind CSS 4
- Vite 8
- IndexedDB
- LocalStorage
- Vite Plugin PWA
- Lucide React

## Instalação e execução

É necessário ter Node.js e npm instalados.

```bash
# Clonar o repositório
git clone https://github.com/maryh-dev/readks.git

# Acessar a pasta
cd readks

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Privacidade e armazenamento

O Readks utiliza armazenamento local no navegador. Não exige conta, não possui sincronização automática entre dispositivos e não envia a biblioteca para um servidor.

É possível exportar e importar os dados por meio de arquivos JSON para criar backups ou transferir a biblioteca.

**Importante:** mantenha backups periódicos, pois a limpeza dos dados do navegador pode ocasionar perda das informações armazenadas.

## PWA e funcionamento offline

O Readks pode ser instalado em dispositivos compatíveis e utilizado como aplicativo independente. Após o carregamento inicial e o armazenamento dos recursos necessários, suas funcionalidades locais podem continuar disponíveis sem conexão com a internet.

## Documentação

Consulte a pasta `docs/` para encontrar informações técnicas sobre a arquitetura, estrutura do projeto, armazenamento, acessibilidade e publicação.

## Licença

Este projeto está disponibilizado sob a licença Apache 2.0.
