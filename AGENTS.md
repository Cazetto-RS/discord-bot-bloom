# AGENTS.md — Instruções para agentes de IA do projeto Bloom

Este arquivo orienta ferramentas de IA que analisam, geram, revisam ou modificam código no monorepositório **Discord Bot Bloom**. Deve ser lido antes de mudanças relevantes.

## 1. Objetivo e contexto

O Bloom será um bot para Discord com dashboard web, inicialmente utilizado em testes e futuramente oferecido a múltiplos servidores.

**Escopo funcional planejado:** gestão de staff; moderação; tempo em call; tickets; autorole; proteção antispam/antiflood/antiraid; redes sociais internas (publicações e interações dentro do Discord); VIP.

**Não presuma que os módulos já estão implementados.** Consulte os arquivos existentes antes de propor alterações. Diferencie funcionalidades prontas, protótipos e planos.

## 2. Stack e estrutura adotadas

- **Linguagem principal:** TypeScript.
- **Frontend planejado:** Next.js + React + Tailwind CSS em `front-end/`.
- **Bot:** Node.js + discord.js em `back-end/bot/`.
- **Backend HTTP planejado:** Supabase Edge Functions em `back-end/supabase/functions/`.
- **Banco planejado:** Supabase PostgreSQL; migrações em `back-end/supabase/migrations/`.
- **Autenticação planejada:** Supabase Auth com OAuth2 Discord.
- **Workspace:** pnpm; `package.json` na raiz e por aplicação.
- **Documentação:** `README.md` e `docs/`.

**Não introduza** outra linguagem, framework, ORM, gerenciador de pacotes, serviço de nuvem ou biblioteca grande sem justificar e solicitar aprovação. Evite adicionar uma API Node.js permanente se uma Edge Function resolver adequadamente o caso; o bot Gateway permanece um processo separado.

## 3. Prioridade de trabalho

1. Ler o pedido e os arquivos relevantes.
2. Explicar a alteração e seus impactos quando não forem triviais.
3. Fazer a menor alteração coesa que resolva a tarefa.
4. Preservar nomes de pastas e convenções existentes.
5. Executar as verificações disponíveis; se não puder executar, declarar isso.
6. Atualizar documentação e testes afetados.
7. Resumir arquivos alterados, resultados e pendências sem declarar sucesso não verificado.

Não reestruture o repositório por preferência estética. Não implemente funcionalidades além do escopo pedido.

## 4. Regras de arquitetura

- Organizar o bot por domínios em `back-end/bot/src/modules/`.
- Separar handlers de comandos/eventos das regras de negócio.
- Manter integrações externas isoladas em adaptadores ou serviços.
- Compartilhar tipos e validações quando houver necessidade concreta, evitando duplicação.
- Não espalhar acesso ao banco nem chamadas à API do Discord por componentes de interface.
- Projetar operações com falha, retentativa e prevenção de execução duplicada quando necessário.
- Dados persistentes devem identificar a qual servidor Discord (`guild_id`) pertencem.
- Não usar armazenamento somente em memória para registros que precisam sobreviver a reinicializações.
- Registrar decisões estruturais importantes em `docs/architecture/`.

**Importante:** o dashboard não pode depender de acesso direto ao computador do desenvolvedor. Solicitações feitas pelo site devem usar uma API autorizada e, quando necessário, um mecanismo durável de comunicação com o bot.

## 5. Segurança — regras obrigatórias

- Nunca exibir, solicitar em texto aberto ou versionar tokens, senhas, URLs com segredos, chaves `service_role`/`secret` ou credenciais do Discord.
- Segredos ficam apenas no ambiente servidor/local apropriado. Nunca incluir tokens do bot ou chaves administrativas no bundle do frontend, em `NEXT_PUBLIC_*` ou em logs.
- Tratar todo conteúdo do Discord, formulários e integrações como entrada não confiável.
- Autenticar **e autorizar** toda operação administrativa no backend, verificando o servidor e as permissões atuais do solicitante.
- Aplicar princípio do menor privilégio para permissões do bot e escopos OAuth2.
- Usar RLS quando o frontend acessar dados via cliente Supabase; não confiar apenas em filtros fornecidos pelo navegador.
- Verificar isolamento de dados multi-tenant e impedir que um `guild_id` arbitrário dê acesso a outro servidor.
- Não coletar conteúdo de mensagens ou dados pessoais além do necessário; definir políticas de retenção.
- Não registrar conteúdo sensível de tickets, mensagens privadas ou tokens em logs.
- Aplicar validação, limitação de requisições e auditoria em ações críticas.
- Não executar migrações destrutivas ou apagar dados sem autorização explícita e plano de recuperação.

## 6. Regras específicas do Discord

- Preferir comandos de barra (*slash commands*) e componentes oficiais de interação.
- Respeitar permissões e hierarquia de cargos; não assumir que o bot pode moderar qualquer membro.
- Respeitar rate limits e tratar erros da API.
- Solicitar apenas intents necessárias; recursos privilegiados dependem das políticas vigentes do Discord.
- Tempo em call significa **tempo conectado**, salvo especificação e solução técnica aprovadas para outra métrica.
- Não afirmar que o bot consegue recuperar eventos de voz que ocorreram enquanto estava offline.
- Não pressupor que bots externos forneçam integração para contagem de bumps/UPs.
- Recursos semelhantes a Instagram/X são **redes sociais internas** e não integrações oficiais nem cópias de marcas.

## 7. Banco de dados e Supabase

- Toda mudança de esquema deve ter migração versionada e revisável.
- Não alterar dados de produção durante testes de desenvolvimento.
- Para cada tabela com dados específicos de servidores, definir claramente acesso, índices, vínculos e política de retenção.
- Evitar privilégios administrativos nas Edge Functions quando não forem necessários.
- Manter tratamento explícito de estados: `pendente`, `em_execução`, `concluído`, `falhou` quando houver operações assíncronas.
- Ações de efeito externo (banimentos, cargos, abertura de canais) devem tolerar reenvios e falhas parciais.

## 8. Qualidade e padrões de código

- Usar `strict` no TypeScript e evitar `any`; justificar exceções.
- Validar dados externos em tempo de execução (por exemplo, com Zod, se adotado no projeto).
- Preferir funções pequenas e nomes expressivos em inglês para código; comentários e documentação podem ser em português.
- Não adicionar comentários que apenas repitam o código. Explicar decisões ou comportamentos não óbvios.
- Tratar erros de forma explícita; não silenciar exceções indiscriminadamente.
- Utilizar logs estruturados quando o aplicativo crescer, sem incluir segredos.
- Não adicionar dependências apenas por conveniência se uma solução simples já existir.
- Manter comandos de execução e scripts consistentes com o `package.json` real.

## 9. Testes e critérios de conclusão

Para cada alteração, verificar quando aplicável:

- Tipagem: `pnpm typecheck` (após scripts configurados).
- Testes automatizados: executar o comando existente; **não inventar resultados**.
- Fluxos críticos: autorização, erros, concorrência, duplicação e recuperação.
- Alterações visuais: estados de carregamento, erro, responsividade e acessibilidade.
- Discord: testar em servidor de desenvolvimento antes de usar no servidor real.

Uma funcionalidade **não está pronta** apenas porque compilou. Registrar quais cenários foram testados e quais ainda dependem de integração.

## 10. Git e documentação

- Usar commits pequenos e descritivos, preferencialmente com Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- Não alterar `pnpm-lock.yaml` manualmente; atualizar com pnpm.
- Não enviar `node_modules/`, `dist/`, `.env` ou arquivos com credenciais.
- Manter `.env.example` sem valores verdadeiros.
- Atualizar `README.md` ao mudar comandos, estrutura ou pré-requisitos.
- Documentar regras de negócio em `docs/modules/` e decisões técnicas em `docs/architecture/`.
- Preservar arquivos do usuário não relacionados à tarefa.

## 11. Forma de responder ao desenvolvedor

Ao orientar ou entregar uma alteração:

1. Diga **qual problema** ela resolve.
2. Informe **quais arquivos** serão criados ou modificados.
3. Forneça comandos reproduzíveis no Windows/PowerShell quando forem necessários.
4. Explique brevemente **o papel de cada parte importante do código**.
5. Identifique riscos, limitações e testes ainda não realizados.
6. Prefira passos curtos para permitir revisão e aprendizado.

**Princípio do Bloom:** segurança, clareza, código sustentável e evolução incremental — especialmente porque o projeto será desenvolvido com forte apoio de IA e poderá se tornar um produto comercial.
