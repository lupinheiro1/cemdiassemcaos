# Página de agradecimento — 100 Dias Sem Caos (pós-compra)

Status: planejado, execução pendente de aprovação do preview (ver passo 6).

## Contexto

A Luiza quer uma página de agradecimento pra quem comprar o "100 Dias Sem
Caos" pelo Hotmart, seguindo um prompt que ela mesma escreveu (bom, claro,
já traz o texto final pronto). O ponto central do prompt — "este é um
projeto independente" — significa que **não dá pra só editar o `Index.tsx`
do Cemdiassemcaos atual**: isso apagaria a página de vendas pra quem ainda
não comprou. Precisa ser um deploy fisicamente separado, que reaproveita a
mesma identidade visual (cores, tipografia, logo, footer) do projeto atual.

Prompt original da Luiza (referência):

> Transforme esta cópia do projeto em uma página de obrigado simples e
> objetiva. Este é um projeto independente. Não preciso manter a página de
> vendas nesta cópia. Remova o conteúdo atual da página, mas preserve
> integralmente a identidade visual existente. Reutilize as mesmas cores,
> tipografia, logo, footer, espaçamentos e estilos. Não crie novas páginas
> ou rotas. Não adicione menu, botões, pop-ups, formulários ou novas
> seções. Mantenha apenas a logo da Maternologia no topo, sem menu de
> navegação. Mantenha exatamente o mesmo footer existente.

Decidido com o Marcelo:
- Cópia criada do zero em `D:\dev`, mesmo fluxo manual (git + build + SCP
  pro cPanel) já usado pro Cemdiassemcaos e Maternologia nesta sessão.
- URL final: `https://maternologia.com.br/100-dias-sem-caos/obrigado` — é
  o que a Luiza vai configurar no Hotmart como redirecionamento
  pós-compra.
- Não criar repositório novo no GitHub por enquanto (fica local, sem
  remote) até decidirmos se vale sincronizar.

**Nota importante:** o repo `Cemdiassemcaos` mudou bastante desde a sessão
anterior — outra ferramenta (GitHub Copilot GPT-5.3-Codex, usada pelo
próprio Marcelo) fez commits novos de otimização de performance
(`d050e6c`, `2eef1a0`, `163948c`, `589deb9`), incluindo um
`public/.htaccess` novo com política de cache e mudanças em
`HeroSection.tsx`/`App.tsx`/`vite.config.ts`. Já lidas e incorporadas
neste plano — a cópia parte do HEAD atual do repo, não de um estado
antigo em memória.

## O que existe hoje (Cemdiassemcaos, ponto de partida da cópia)

- `src/pages/Index.tsx` compõe 13 seções (`Hero`, `Highlight`,
  `HowItWorks`, `Stats`, `CTABanner`, `Testimonials`, `Transformation`,
  `Offer`, `Objections`, `Comparison`, `Author`, `FAQ`, `FinalCTA`).
- **Não existe** `Header`/`Footer` como componentes separados:
  - O logo do topo vive dentro de `HeroSection.tsx` (linhas 36-42, `<img
    src={logoMaternologia}>`).
  - O footer escuro ("Dark Footer") vive dentro de `FinalCTASection.tsx`
    (linhas 37-59) — é isso que a Luiza quer manter "exatamente igual".
- `NavLink.tsx` existe mas não é usado em lugar nenhum — já não há menu de
  navegação hoje, então esse requisito já vem de graça.
- Fontes (Inter + Playfair Display) já auto-hospedadas via `@fontsource`
  (import em `src/main.tsx`) — a cópia herda isso automaticamente.
- `public/.htaccess` tem política de cache agnóstica de path — copia sem
  alteração.
- Único asset de imagem necessário pra página nova: `logo-maternologia.svg`.
  `luiza-pinheiro.webp` e os 5 `depoimento-*.webp` só são usados por
  `AuthorSection`/`TestimonialsSection`, que não entram na cópia — não
  precisam ser copiados.

## Passos

### 1. Criar a cópia
```
xcopy /E /I D:\dev\Cemdiassemcaos D:\dev\Cemdiassemcaos-obrigado
```
(excluindo `node_modules`, `dist`, `.git` — reinstalar dependências do
zero com `npm install` na pasta nova).

### 2. Ajustar path base pro subpath novo
- `vite.config.ts`: `base: '/100-dias-sem-caos/obrigado/'`
- `src/App.tsx`: `basename="/100-dias-sem-caos/obrigado"` no `BrowserRouter`

### 3. Reescrever `src/pages/Index.tsx`
Substituir as 13 seções por uma página única e simples, tudo inline (sem
criar componentes novos — a página é pequena o bastante pra não precisar de
abstração extra):
- **Topo:** só o logo (`logoMaternologia`), reaproveitando exatamente o
  tratamento visual de `HeroSection.tsx:36-42` (mesmas classes, sem
  badge/headline/benefícios/CTA).
- **Centro:** as duas mensagens da Luiza, com bastante espaço em branco
  (`max-w-2xl mx-auto`, `space-y-6/8`, `py-16 md:py-24`), usando os mesmos
  tokens tipográficos do resto do site (`font-serif` pro destaque
  principal, `font-sans`/`text-muted-foreground` pro corpo da carta,
  quebras de parágrafo preservadas, assinatura da Luiza destacada no
  final).
- **Rodapé:** copiar **verbatim** o bloco "Dark Footer" de
  `FinalCTASection.tsx:37-59` (mesmas classes `bg-warm-brown`, `text-cream`,
  copyright, aviso legal, link de privacidade).

### 4. Remover o que não é usado na cópia
Apagar os arquivos de seção que não entram mais (`HighlightSection`,
`HowItWorksSection`, `StatsSection`, `CTABannerSection`,
`TestimonialsSection`, `TransformationSection`, `OfferSection`,
`ObjectionsSection`, `ComparisonSection`, `AuthorSection`, `FAQSection`,
`HeroSection`, `FinalCTASection` — o conteúdo delas foi inlinado no passo
3) e os assets órfãos (`luiza-pinheiro.webp`, os 5 `depoimento-*.webp`).

### 5. `index.html`
- Atualizar `<title>`, `og:title`, `og:description`, meta `description`
  pra refletir a página de confirmação (não mais a copy de vendas).
- **Adicionar `<meta name="robots" content="noindex, nofollow">`** — não
  pedido pelo prompt, mas é boa prática padrão pra página de obrigado
  pós-compra: evita que ela seja indexada/apareça em buscas do Google.
- Manter o snippet do GTM como está (continuidade de tracking de conversão
  — nada no prompt pede pra remover).

### 6. Mostrar antes de publicar (gate obrigatório)
Depois do passo 3 (Index.tsx novo), rodar `npm run dev` na cópia e mostrar
o resultado (screenshot ou descrever o preview) pro Marcelo revisar o
texto/layout. **Só depois de aprovação explícita** seguir para commit e
deploy — nada de commitar ou subir pro cPanel automaticamente como nas
tarefas anteriores desta sessão.

### 7. Build + deploy (só após aprovação do passo 6)
```bash
npm install
npm run build
ssh ... "mkdir -p public_html/100-dias-sem-caos/obrigado/assets"
scp dist/{index.html,favicon.ico,...} .../100-dias-sem-caos/obrigado/
scp dist/assets/* .../100-dias-sem-caos/obrigado/assets/
```
Mesmo padrão de deploy (limpar assets antigos antes, confirmar destino com
`ls` antes de qualquer `scp`/`rm`) usado nos deploys anteriores desta
sessão.

### 8. Verificação
- `curl` na URL publicada confirmando 200 e as strings do texto novo no
  bundle JS (mesmo método usado nos fixes anteriores).
- Conferir visualmente no navegador (mobile e desktop) que o layout fica
  bem diagramado nos dois.
- Avisar que a URL final
  (`https://maternologia.com.br/100-dias-sem-caos/obrigado`) é o que a
  Luiza precisa colocar no Hotmart como redirecionamento pós-compra — sem
  isso configurado lá, a página existir não tem efeito prático.

## Em aberto (não bloqueia o deploy, mas vale decidir depois)
- Não vou criar um repositório novo no GitHub pra essa cópia agora — fica
  como pasta local com git iniciado, sem remote. Se quiser sincronizar no
  GitHub da Luiza depois, é só pedir.

## Execução

### Passos 1-5 (cópia + conteúdo)
- Copiado `Cemdiassemcaos` → `Cemdiassemcaos-obrigado` via `robocopy /E /XD
  node_modules dist .git` (o `cp -r` do git-bash travou copiando
  `node_modules` gigante antes de excluir — trocado por robocopy, muito
  mais rápido no Windows).
- `vite.config.ts`: `base: '/100-dias-sem-caos/obrigado/'`. `App.tsx`:
  `basename="/100-dias-sem-caos/obrigado"`.
- `Index.tsx` reescrito conforme o plano: logo + carta da Luiza + footer
  verbatim, tudo inline.
- Removidos os 13 arquivos de seção não usados, os assets órfãos
  (testemunhos + foto da Luiza) e a pasta `docs/` (histórico da landing de
  vendas, não fazia sentido nesta cópia independente).
- `index.html`: título/meta de confirmação + `<meta name="robots"
  content="noindex, nofollow">`. GTM mantido como estava (com o
  defer-on-interaction que o Copilot já tinha implementado no projeto
  original — herdado automaticamente pela cópia).
- `package.json`: `name` renomeado pra `cemdiassemcaos-obrigado` (evitar
  confusão entre os dois projetos).

### Passo 6 (gate de revisão) — como foi feito na prática
- `npm install` + `npm run dev` local (porta 8080→8081→8082 conforme
  outras portas ficavam ocupadas).
- Screenshots via Playwright (`chromium.launch`, viewports 1280px e
  390px) — sem `chromium-cli` disponível no ambiente, script Node ad-hoc
  feito na hora, sem erros de console.
- Marcelo pediu acesso de fora da rede pra mostrar pra Luiza. Testado
  primeiro o IP "Network" que o Vite mostra
  (`http://54.232.189.113:PORTA/...`) — **não funcionou** de fora: esse
  endereço é só NAT de saída de algum VPN/rede corporativa na máquina, o
  Vite lista qualquer IP de interface de rede sem checar se aceita
  conexão de entrada. Confirmado que o mesmo IP aparece em outros
  projetos (ex: meditaracao-app) — não é nada específico deste projeto.
- Solução: túnel `cloudflared tunnel --url` (instalado via `scoop install
  cloudflared`, sem precisar de conta). Precisou setar `server.allowedHosts:
  true` temporariamente no `vite.config.ts` (Vite bloqueia por padrão
  Host headers desconhecidos, tipo o domínio do túnel) — **revertido
  antes do commit**.
- Luiza revisou pelo link temporário do túnel. Pediu um ajuste: tirar o
  travessão (`—`) do meio de uma frase da carta e separar em duas frases.
  Corrigido em `Index.tsx` (parágrafo "A informação já está nas suas
  mãos...").
- Marcelo pediu pra rodar Lighthouse antes de publicar (mesma prática já
  usada pela outra ferramenta/Codex no projeto original). Resultado
  (mobile, contra `vite preview` da build de produção):

| Categoria | Nota |
|---|---|
| Performance | 93 |
| Accessibility | 100 |
| Best Practices | 96 |
| SEO | 63 |

FCP/LCP 2.6s, TBT 80ms, CLS 0.037, TTI 3.9s. SEO baixo é **esperado e
intencional** — a única auditoria que falha é `is-crawlable` (bloqueada
por causa do `noindex, nofollow` proposital). Resultado muito melhor que
a landing de vendas (Performance 27) por ser uma página bem mais simples.

### Passos 7-8 (commit + deploy + verificação) — concluído
- Limpeza de lixo copiado sem querer pelo robocopy (`.lighthouse-*.json`
  do Codex, pasta `.lovable/`) antes do commit — não fazia sentido nessa
  cópia independente.
- Commit local (`dcef9c1`, sem remote no GitHub por enquanto).
- Build de produção + deploy via SCP pra
  `public_html/100-dias-sem-caos/obrigado/` (pasta nova, criada do zero —
  não sobrescreveu nada da landing de vendas).
- Verificado ao vivo: `https://maternologia.com.br/100-dias-sem-caos/obrigado/`
  responde 200, título "Obrigada! | 100 Dias Sem Caos", `noindex` presente,
  texto corrigido (sem o travessão) já no bundle publicado. Landing de
  vendas original (`/100-dias-sem-caos/`) confirmada intacta, também 200.

**Pendente (fora do meu alcance):** a Luiza precisa configurar
`https://maternologia.com.br/100-dias-sem-caos/obrigado/` no Hotmart como
URL de redirecionamento pós-compra do produto — sem isso, a página existe
mas ninguém chega nela automaticamente.
