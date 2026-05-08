## Nova paleta: Índigo & Damasco

Refresh visual saindo do "pastel maternal" para uma identidade mais sóbria, contemporânea e terapêutica — coerente com saúde mental materna e apoio prático ao puerpério.

### Conceito
- **Índigo profundo** = âncora de confiança, introspecção, descanso (noite calma, sono).
- **Damasco quente** = acolhimento humano, pele, afeto — aquece o índigo sem infantilizar.
- **Marfim quente** = base respirável, menos rosada que o atual.
- **Grafite suave** = textos com contraste alto e legibilidade AA/AAA.

### Paleta (HSL, aplicada em `src/index.css`)
- `--background`: marfim quente (~`40 30% 97%`) — substitui o off-white rosado.
- `--foreground`: grafite quase preto-azulado (~`230 25% 15%`) para contraste forte.
- `--primary`: índigo profundo (~`232 45% 32%`) — nova cor estruturante (era terracota/rosa).
- `--primary-foreground`: marfim.
- `--accent` / nova `--apricot`: damasco (~`22 75% 68%`) — usado em destaques, ícones, sublinhados, CTA.
- `--secondary` / `--muted`: índigo bem dessaturado e claro (~`230 20% 92%`).
- Substituir tokens antigos `--rose-light`, `--peach-light`, `--lavender-light`, `--sage`, `--peach`, `--lavender` por variações dentro da nova paleta:
  - `--apricot-light`: damasco aguado (~`22 60% 92%`) para fundos de seção quentes.
  - `--indigo-light`: índigo aguado (~`230 35% 93%`) para fundos de seção frios.
  - `--sand`: areia neutra (~`35 25% 90%`) para boxes "muted".
- `--warm-brown` / `--cream`: recalibrados para tons areia/marfim coerentes.
- Bordas e sombras mais definidas (sombra com tinta índigo em vez de cinza puro).

### CTA e tipografia
- `cta-button.tsx`: gradiente damasco → damasco escuro, sombra com tinta índigo, hover levemente mais escuro. Mantém a mesma API/tamanhos.
- Títulos continuam em **Playfair Display**, corpo em **Inter**. Aumentar peso de subtítulos e escurecer `--muted-foreground` para sair do cinza claro.
- `HeroSection.tsx`: SVG de sublinhado passa a usar damasco em vez de rosa/pêssego.

### Verificação por seção (sem mudar estrutura/conteúdo)
Revisar visualmente para garantir contraste e harmonia: Hero, Highlight, Pain, Transformation, Method, Comparison, Offer, Testimonials, FAQ, FinalCTA. Onde houver fundos pastel hardcoded restantes, trocar pelos novos tokens.

### Arquivos no escopo
- `src/index.css` (todos os tokens HSL + sombras)
- `tailwind.config.ts` (renomear/adicionar tokens: `apricot`, `indigo`, `sand`)
- `src/components/ui/cta-button.tsx` (gradiente + sombra)
- `src/components/sections/HeroSection.tsx` (cor do SVG)
- Ajustes pontuais em seções que usem classes de cor antigas (`bg-rose-light`, `bg-peach-light`, etc.) — substituir pelas novas equivalentes.

### Fora do escopo
- Sem novas fontes, sem mudanças de conteúdo, sem mexer em links Hotmart, sem reestruturar componentes, sem trocar layout.
