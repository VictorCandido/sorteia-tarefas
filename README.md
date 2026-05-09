# Sorteia Tarefa 🎰

Sorteie suas tarefas e deixe o destino decidir o que fazer.

## Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + Framer Motion
- **Backend**: Next.js API Routes
- **Banco**: PostgreSQL (Vercel Postgres / Neon)
- **ORM**: Prisma
- **Deploy**: Vercel

## Setup local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env` na raiz com as variáveis do Vercel Postgres:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

> **Dica**: Você pode criar um banco gratuito em [neon.tech](https://neon.tech) para dev local.

### 3. Criar as tabelas

```bash
npx prisma db push
```

### 4. Rodar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Deploy na Vercel

1. Suba o repositório no GitHub
2. Importe o projeto na Vercel
3. Em **Storage**, crie um Postgres database e conecte ao projeto
4. A Vercel seta as env vars automaticamente
5. Deploy!

O `postinstall` script gera o Prisma Client automaticamente no build.

## Estrutura

```
src/
├── app/
│   ├── api/tasks/          # API Routes (CRUD + sorteio)
│   ├── history/page.tsx    # Tela de tarefas sorteadas
│   ├── page.tsx            # Tela principal
│   ├── layout.tsx          # Layout raiz
│   └── globals.css         # Estilos globais
├── components/             # Componentes React
├── hooks/useTasks.ts       # Hook de gerenciamento de estado
└── lib/
    ├── prisma.ts           # Singleton Prisma Client
    └── types.ts            # Tipos compartilhados
```
