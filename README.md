# Bloom — Plataforma de gerenciamento para Discord

> **Status:** em desenvolvimento inicial. O produto ainda não está pronto para uso em servidores reais.

O **Bloom** é um projeto de bot para Discord integrado a um painel administrativo web. A proposta é permitir que administradores configurem ferramentas de moderação, gestão de equipes, atendimento, segurança e participação da comunidade em um único lugar.

O desenvolvimento começa com um **bot executado localmente**, um **dashboard web** e recursos de backend fornecidos pelo **Supabase**. A intenção futura é oferecer a plataforma a diferentes servidores, com configurações e dados isolados.

## 1. Funcionalidades planejadas

Os oito módulos abaixo representam o **escopo planejado**, não funcionalidades já implementadas:

| Módulo | Objetivo |
| --- | --- |
| Gestão de staff | Perfis, registro de ponto, atividades, pontuação, advertências, ausências, promoções, rankings e relatórios. |
| Moderação | Banimentos, expulsões, timeouts, advertências, histórico de punições, motivos e identificação do responsável. |
| Tempo em call | Contabilizar tempo conectado a canais de voz, rankings, estatísticas e exclusão de canais configuráveis. Tempo conectado não equivale a tempo efetivamente falando. |
| Tickets | Painéis de atendimento, categorias, abertura, atribuição, encerramento, histórico e transcrições. |
| Autorole | Cargos atribuídos na entrada e outras regras de atribuição definidas pelo administrador. |
| Proteção | Antispam, antiflood e medidas contra ataques/raids, com critérios configuráveis e mecanismos para evitar falsos positivos. |
| Redes sociais internas | Publicações de fotos e textos dentro do Discord, com reações, comentários e ferramentas de moderação. Não são integrações oficiais com Instagram ou X. |
| VIP | Planos, benefícios, cargos/canais, atribuição, renovação, expiração e histórico. Pagamentos automáticos não estão definidos no escopo inicial. |

A cobertura exata de cada módulo será definida em `docs/modules/` antes de sua implementação.

## 2. Tecnologias e ambientes

| Camada | Tecnologia prevista | Ambiente inicial |
| --- | --- | --- |
| Dashboard | Next.js, React, TypeScript, Tailwind CSS | Desenvolvimento local; implantação de testes na Vercel |
| Bot | Node.js, TypeScript, discord.js | Computador do desenvolvedor |
| APIs HTTP | Supabase Edge Functions | Supabase |
| Banco | PostgreSQL | Supabase |
| Autenticação | Supabase Auth + OAuth2 do Discord | Supabase |
| Arquivos | Supabase Storage | Supabase, conforme necessidade |
| Gerenciamento de pacotes | pnpm workspaces | Monorepositório |
| Versionamento | Git + GitHub | Repositório privado inicialmente |

**Nota:** o plano Hobby da Vercel é voltado para uso pessoal/não comercial. Antes de disponibilizar o Bloom comercialmente, revisaremos os termos e os custos de todos os provedores.

## 3. Organização do repositório

```text
discord-bot-bloom/
├── front-end/                 # Futuro painel Next.js
├── back-end/
│   ├── bot/                   # Aplicação Node.js com discord.js
│   │   └── src/
│   │       ├── config/        # Configuração e leitura de ambiente
│   │       ├── events/        # Eventos recebidos do Discord
│   │       ├── modules/       # Funcionalidades organizadas por domínio
│   │       └── index.ts       # Entrada da aplicação
│   └── supabase/
│       ├── functions/         # Edge Functions (quando criadas)
│       └── migrations/        # Alterações versionadas do banco
├── docs/
│   ├── architecture/          # Arquitetura e decisões técnicas
│   ├── guides/                # Guias de instalação, teste e deploy
│   └── modules/               # Especificação de cada módulo
├── .env.example               # Exemplo de configuração, sem segredos
├── .gitignore                 # Arquivos não versionados
├── AGENTS.md                  # Regras para agentes de IA
├── package.json               # Scripts gerais do monorepo
├── pnpm-workspace.yaml        # Pacotes do workspace
└── README.md                  # Este arquivo
```

Pastas vazias podem conter `.gitkeep` até receberem arquivos reais.

## 4. Pré-requisitos

- Git;
- Node.js **LTS**, compatível com as dependências utilizadas;
- pnpm;
- um editor, como VS Code;
- acesso ao Discord Developer Portal **apenas quando iniciarmos a integração com o Discord**.

Para conferir as ferramentas instaladas:

```bash
node --version
pnpm --version
git --version
```

## 5. Executar o projeto localmente

Na raiz do repositório:

```bash
pnpm install
```

Para iniciar a aplicação do bot, depois de sua configuração:

```bash
pnpm dev:bot
```

Para verificar os tipos das aplicações que já possuem scripts configurados:

```bash
pnpm typecheck
```

> **Atenção:** na fase inicial, `dev:bot` pode executar apenas uma mensagem de inicialização. A conexão real com o Discord e o comando `/ping` serão implementados em uma etapa posterior. O frontend ainda será inicializado; o comando `pnpm dev:web` só funcionará após sua criação.

### Variáveis de ambiente

Mantenha segredos exclusivamente em arquivos `.env` locais e/ou nos gerenciadores de segredos dos provedores. O arquivo `.env.example` deve conter **somente nomes e valores fictícios**.

Tokens do bot, chaves administrativas do Supabase e outros segredos **nunca** devem aparecer em commits, no frontend, em logs públicos ou em capturas de tela.

## 6. Como o bot local funciona

O bot estabelece uma **conexão de saída** com o Discord Gateway. Portanto, no modo Gateway, não é necessário publicar uma API na máquina nem abrir portas no roteador para receber eventos do Discord.

O bot utiliza o Supabase para persistir dados e consultar configurações. Já o dashboard poderá acionar Edge Functions e registrar solicitações de execução. A forma exata de sincronização será definida na documentação de arquitetura.

Quando o computador estiver desligado, o bot ficará offline: comandos e automações dependentes do Gateway deixarão de funcionar. O sistema não pode presumir que conseguirá recuperar integralmente eventos ocorridos durante esse período.

## 7. Regras gerais de desenvolvimento

- Separar código por domínio e reutilizar validações quando possível.
- Usar TypeScript com verificação rigorosa de tipos.
- Validar entradas e permissões **no servidor**, não apenas na interface.
- Isolar dados de servidores Discord diferentes (multi-tenant).
- Nunca tratar uma operação como concluída antes de receber confirmação de execução.
- Evitar ações duplicadas em tickets, punições, expirações VIP e trabalhos agendados.
- Adicionar testes para regras críticas antes de liberar funcionalidades.
- Manter documentação e exemplos atualizados com mudanças no código.
- Respeitar políticas e limites da API do Discord e dos serviços utilizados.

As orientações completas para agentes de IA estão em [`AGENTS.md`](./AGENTS.md).

## 8. Etapas planejadas

1. **Fundação:** workspace, Git, documentação e execução local do bot.
2. **Discord:** aplicação de teste, conexão Gateway e comando `/ping`.
3. **Supabase:** modelo inicial de dados, autenticação e regras de acesso.
4. **Dashboard:** login, seleção e autorização de servidores.
5. **Módulos:** implementação incremental, testes e demonstrações.
6. **Piloto:** validação no servidor da cliente, com migração gradual.
7. **Comercialização:** infraestrutura apropriada, cobrança e suporte, somente depois de validar o produto.

Não há prazo fechado nem garantia de disponibilidade 24 horas nesta fase.

## 9. Contribuições e segurança

O projeto está sendo desenvolvido inicialmente em um repositório privado. Antes de cada commit, confira `git status` e revise se há segredos ou dados pessoais.

Se uma credencial for exposta, **revogue/rotacione-a imediatamente**. Remover o arquivo em um commit posterior não elimina o segredo do histórico Git.

## 10. Licenciamento

**Licença ainda não definida.** Até a definição formal de uma licença e das responsabilidades pelo produto, não há concessão pública de direitos de uso, modificação ou redistribuição.
